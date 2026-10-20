from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import CategoryType
from app.schemas import CategoryCreate, CategoryRead, CategoryUpdate
from app.services import category as service

router = APIRouter(prefix="/categories", tags=["Категории"])


@router.get("", response_model=list[CategoryRead], summary="Список категорий")
def list_categories(type: CategoryType | None = None, db: Session = Depends(get_db)):
    return service.list_categories(db, type)


@router.get("/{category_id}", response_model=CategoryRead, summary="Одна категория")
def get_category(category_id: int, db: Session = Depends(get_db)):
    return service.get_category(db, category_id)


@router.post(
    "",
    response_model=CategoryRead,
    status_code=status.HTTP_201_CREATED,
    summary="Создать категорию",
)
def create_category(data: CategoryCreate, db: Session = Depends(get_db)):
    return service.create_category(db, data)


@router.put("/{category_id}", response_model=CategoryRead, summary="Изменить категорию")
def update_category(category_id: int, data: CategoryUpdate, db: Session = Depends(get_db)):
    return service.update_category(db, category_id, data)


@router.delete(
    "/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить категорию",
)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    service.delete_category(db, category_id)
