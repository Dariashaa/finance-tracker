"""Заполняет базу демонстрационными данными. Запуск: python -m app.seed

"""

import datetime
from decimal import Decimal

from sqlalchemy import select

from app.db.session import SessionLocal
from app.models import Category, CategoryType, Transaction

E, I = CategoryType.expense, CategoryType.income

# (название, тип, цвет, лимит)
CATEGORIES = [
    ("Еда", E, "#3F51B5", 30000),
    ("Транспорт", E, "#2196F3", 3000),
    ("Развлечения", E, "#F44336", 5000),
    ("Подарки", E, "#795548", None),
    ("Зарплата", I, "#4CAF50", None),
    ("Подработка", I, "#9C27B0", None),
]

# (категория, сумма, дата, комментарий)
TRANSACTIONS = [
    ("Еда", 12000, "2025-03-03", "Продукты на неделю"),
    ("Еда", 9800, "2025-03-12", None),
    ("Еда", 5200, "2025-03-24", None),
    ("Транспорт", 1200, "2025-03-05", None),
    ("Транспорт", 700, "2025-03-18", None),
    ("Развлечения", 4200, "2025-03-09", "Кино и ужин"),
    ("Развлечения", 3000, "2025-03-23", None),
    ("Подарки", 1000, "2025-03-07", "Подарок маме"),
    ("Зарплата", 40000, "2025-03-10", None),
    ("Подработка", 15000, "2025-03-15", "Фриланс"),
    ("Еда", 11000, "2025-02-06", None),
    ("Транспорт", 2400, "2025-02-14", None),
    ("Зарплата", 40000, "2025-02-10", None),
]


def seed() -> None:
    with SessionLocal() as db:
        if db.scalar(select(Category.id).limit(1)) is not None:
            print("В базе уже есть данные, пропускаю.")
            return

        by_name: dict[str, Category] = {}
        for name, type_, color, limit in CATEGORIES:
            category = Category(
                name=name, type=type_, color=color, limit=Decimal(limit) if limit else None
            )
            db.add(category)
            by_name[name] = category

        db.flush()  # получаем id категорий

        for category_name, amount, date, comment in TRANSACTIONS:
            db.add(
                Transaction(
                    category_id=by_name[category_name].id,
                    amount=Decimal(amount),
                    date=datetime.date.fromisoformat(date),
                    comment=comment,
                )
            )

        db.commit()
        print(f"Добавлено категорий: {len(CATEGORIES)}, операций: {len(TRANSACTIONS)}.")


if __name__ == "__main__":
    seed()
