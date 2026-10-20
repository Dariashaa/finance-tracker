import datetime

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import BusinessRuleError, ConflictError, NotFoundError
from app.models import Category, CategoryType, Transaction
from app.schemas import TransactionCreate, TransactionUpdate


def _month_bounds(month: str) -> tuple[datetime.date, datetime.date]:
    """'2025-03' -> (2025-03-01, 2025-04-01): первое число месяца и первое число следующего."""
    year, number = (int(part) for part in month.split("-"))
    start = datetime.date(year, number, 1)
    end = datetime.date(year + 1, 1, 1) if number == 12 else datetime.date(year, number + 1, 1)
    return start, end


def list_transactions(
    db: Session,
    month: str | None = None,
    type: CategoryType | None = None,
    category_id: int | None = None,
) -> list[Transaction]:
    stmt = select(Transaction).order_by(Transaction.date.desc(), Transaction.id.desc())
    if month is not None:
        start, end = _month_bounds(month)
        stmt = stmt.where(Transaction.date >= start, Transaction.date < end)
    if type is not None:
        stmt = stmt.where(Transaction.category.has(Category.type == type))
    if category_id is not None:
        stmt = stmt.where(Transaction.category_id == category_id)
    return list(db.scalars(stmt).unique())


def get_transaction(db: Session, transaction_id: int) -> Transaction:
    transaction = db.get(Transaction, transaction_id)
    if transaction is None:
        raise NotFoundError(f"Операция с id={transaction_id} не найдена")
    return transaction


def _check_category_exists(db: Session, category_id: int) -> None:
    if db.get(Category, category_id) is None:
        raise BusinessRuleError(f"Категория с id={category_id} не найдена")


def _commit(db: Session) -> None:
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise ConflictError("Данные нарушают ограничения базы") from exc


def create_transaction(db: Session, data: TransactionCreate) -> Transaction:
    _check_category_exists(db, data.category_id)
    transaction = Transaction(**data.model_dump())
    db.add(transaction)
    _commit(db)
    db.refresh(transaction)
    return transaction


def update_transaction(db: Session, transaction_id: int, data: TransactionUpdate) -> Transaction:
    transaction = get_transaction(db, transaction_id)
    _check_category_exists(db, data.category_id)
    # Тип операции берётся из категории, поэтому нельзя перенести расход в категорию доходов
    new_category = db.get(Category, data.category_id)
    if new_category is not None and new_category.type != transaction.category.type:
        raise BusinessRuleError("Нельзя перенести операцию в категорию другого типа")
    for field, value in data.model_dump().items():
        setattr(transaction, field, value)
    _commit(db)
    db.refresh(transaction)
    return transaction


def delete_transaction(db: Session, transaction_id: int) -> None:
    transaction = get_transaction(db, transaction_id)
    db.delete(transaction)
    _commit(db)
