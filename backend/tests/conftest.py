import os


os.environ.setdefault("POSTGRES_PASSWORD", "test")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.session import get_db
from app.main import app


TEST_DATABASE_URL = os.environ.get("TEST_DATABASE_URL", "sqlite://")


@pytest.fixture
def client():
    """Клиент для запросов к API с чистой базой на каждый тест."""
    if TEST_DATABASE_URL.startswith("sqlite"):
        engine = create_engine(
            TEST_DATABASE_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool
        )

        @event.listens_for(engine, "connect")
        def enable_foreign_keys(dbapi_connection, _):
        
            dbapi_connection.execute("PRAGMA foreign_keys=ON")

    else:
        engine = create_engine(TEST_DATABASE_URL)

    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    TestSession = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

    def override_get_db():
        with TestSession() as db:
            yield db

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    Base.metadata.drop_all(engine)
    engine.dispose()


def make_category(client, name="Еда", type="expense", color="#3F51B5", limit=None):
    """Создаёт категорию через API и возвращает её JSON."""
    response = client.post(
        "/api/categories", json={"name": name, "type": type, "color": color, "limit": limit}
    )
    assert response.status_code == 201, response.text
    return response.json()


def make_transaction(client, category_id, amount=100, date="2025-03-10", comment=None):
    """Создаёт операцию через API и возвращает её JSON."""
    response = client.post(
        "/api/transactions",
        json={"amount": amount, "date": date, "category_id": category_id, "comment": comment},
    )
    assert response.status_code == 201, response.text
    return response.json()
