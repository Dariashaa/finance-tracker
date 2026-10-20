from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, NotFoundError
from app.models import Category, CategoryType, Transaction
from app.schemas import CategoryCreate, CategoryUpdate


def list_categories(db: Session, type: CategoryType | None = None) -> list[Category]:
    stmt = select(Category).order_by(Category.id)
    if type is not None:
        stmt = stmt.where(Category.type == type)
    return list(db.scalars(stmt))


def get_category(db: Session, category_id: int) -> Category:
    category = db.get(Category, category_id)
    if category is None:
        raise NotFoundError(f"Категория с id={category_id} не найдена")
    return category


def _has_transactions(db: Session, category_id: int) -> bool:
    stmt = select(Transaction.id).where(Transaction.category_id == category_id).limit(1)
    return db.scalar(stmt) is not None


def _check_name_is_free(db: Session, name: str, exclude_id: int | None = None) -> None:

    for category_id, existing_name in db.execute(select(Category.id, Category.name)):
        if category_id != exclude_id and existing_name.casefold() == name.casefold():
            raise ConflictError(f"Категория «{name}» уже существует")


def _commit(db: Session) -> None:
    """Сохраняет изменения. Если база отклонила их, откатывает."""
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise ConflictError("Данные нарушают ограничения базы, возможно, такая запись уже есть") from exc


def create_category(db: Session, data: CategoryCreate) -> Category:
    _check_name_is_free(db, data.name)
    category = Category(**data.model_dump())
    db.add(category)
    _commit(db)
    db.refresh(category)
    return category


def update_category(db: Session, category_id: int, data: CategoryUpdate) -> Category:
    category = get_category(db, category_id)
    _check_name_is_free(db, data.name, exclude_id=category_id)
    if data.type != category.type and _has_transactions(db, category_id):
        raise ConflictError("Нельзя изменить тип категории, в которой есть операции")
    for field, value in data.model_dump().items():
        setattr(category, field, value)
    _commit(db)
    db.refresh(category)
    return category


def delete_category(db: Session, category_id: int) -> None:
    category = get_category(db, category_id)
    if _has_transactions(db, category_id):
        raise ConflictError(f"Нельзя удалить категорию «{category.name}»: в ней есть операции")
    db.delete(category)
    _commit(db)
