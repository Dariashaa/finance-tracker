from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import CategoryType
from app.schemas import TransactionCreate, TransactionRead, TransactionUpdate
from app.services import transaction as service

router = APIRouter(prefix="/transactions", tags=["Операции"])


@router.get("", response_model=list[TransactionRead], summary="Список операций")
def list_transactions(
    month: str | None = Query(
        default=None,
        pattern=r"^\d{4}-(0[1-9]|1[0-2])$",
        description="Месяц в формате ГГГГ-ММ, например 2025-03",
    ),
    type: CategoryType | None = None,
    category_id: int | None = None,
    db: Session = Depends(get_db),
):
    return service.list_transactions(db, month=month, type=type, category_id=category_id)


@router.get("/{transaction_id}", response_model=TransactionRead, summary="Одна операция")
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    return service.get_transaction(db, transaction_id)


@router.post(
    "",
    response_model=TransactionRead,
    status_code=status.HTTP_201_CREATED,
    summary="Создать операцию",
)
def create_transaction(data: TransactionCreate, db: Session = Depends(get_db)):
    return service.create_transaction(db, data)


@router.put("/{transaction_id}", response_model=TransactionRead, summary="Изменить операцию")
def update_transaction(transaction_id: int, data: TransactionUpdate, db: Session = Depends(get_db)):
    return service.update_transaction(db, transaction_id, data)


@router.delete(
    "/{transaction_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить операцию",
)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    service.delete_transaction(db, transaction_id)
