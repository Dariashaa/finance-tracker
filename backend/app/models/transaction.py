import datetime
from decimal import Decimal

from sqlalchemy import CheckConstraint, Date, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.category import Category, CategoryType


class Transaction(Base):
    __tablename__ = "transactions"
    __table_args__ = (CheckConstraint("amount > 0", name="amount_positive"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    date: Mapped[datetime.date] = mapped_column(Date, index=True)
    comment: Mapped[str | None] = mapped_column(String(255))
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id", ondelete="RESTRICT"), index=True
    )

    category: Mapped[Category] = relationship(back_populates="transactions", lazy="joined")

    @property
    def type(self) -> CategoryType:
        return self.category.type
