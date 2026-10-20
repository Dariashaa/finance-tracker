import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.category import CategoryType
from app.schemas.common import Money


class TransactionBase(BaseModel):
    amount: Money
    date: datetime.date
    comment: str | None = Field(default=None, max_length=255)
    category_id: int = Field(gt=0)

    @field_validator("comment")
    @classmethod
    def empty_comment_to_none(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        return value or None


class TransactionCreate(TransactionBase):
    """Тело запроса на создание операции. Тип (доход или расход) берётся из категории."""


class TransactionUpdate(TransactionBase):
    """Изменение заменяет операцию целиком."""


class TransactionRead(TransactionBase):
    """Ответ API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    type: CategoryType
