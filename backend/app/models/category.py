import enum
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, Enum, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.transaction import Transaction


class CategoryType(str, enum.Enum):
    """Тип категории: доход или расход."""

    income = "income"
    expense = "expense"


class Category(Base):
    __tablename__ = "categories"
    __table_args__ = (
        CheckConstraint("type IN ('income', 'expense')", name="type_valid"),
        CheckConstraint("monthly_limit IS NULL OR monthly_limit > 0", name="limit_positive"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    type: Mapped[CategoryType] = mapped_column(
        Enum(CategoryType, native_enum=False, length=10, create_constraint=False)
    )
    color: Mapped[str] = mapped_column(String(7))
    limit: Mapped[Decimal | None] = mapped_column("monthly_limit", Numeric(12, 2))

    transactions: Mapped[list["Transaction"]] = relationship(back_populates="category")
