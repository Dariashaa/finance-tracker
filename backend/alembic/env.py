from logging.config import fileConfig

from alembic import context
from sqlalchemy import create_engine

import app.models  # noqa: F401  (регистрирует все модели в Base.metadata)
from app.core.config import settings
from app.db.base import Base

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Alembic сравнивает эту метаданные с базой, когда создаёт миграции автоматически
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Режим без подключения: Alembic только печатает SQL."""
    url = settings.sqlalchemy_database_url
    if not isinstance(url, str):
        url = url.render_as_string(hide_password=False)
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Обычный режим: подключается к базе и применяет миграции."""
    engine = create_engine(settings.sqlalchemy_database_url)
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
