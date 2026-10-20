from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, model_validator

from app.models.category import CategoryType
from app.schemas.common import Money

CategoryName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]
HexColor = Annotated[str, Field(pattern=r"^#[0-9A-Fa-f]{6}$", examples=["#3F51B5"])]


class CategoryBase(BaseModel):
    name: CategoryName
    type: CategoryType
    color: HexColor
    limit: Money | None = None


class CategoryCreate(CategoryBase):
    """Тело запроса на создание и изменение категории."""

    @model_validator(mode="after")
    def limit_only_for_expense(self) -> "CategoryCreate":
        if self.type == CategoryType.income and self.limit is not None:
            raise ValueError("Лимит можно задать только для категории расходов")
        return self


class CategoryUpdate(CategoryCreate):
    """Изменение заменяет категорию целиком, поэтому поля те же, что при создании."""


class CategoryRead(CategoryBase):
    """Ответ API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
