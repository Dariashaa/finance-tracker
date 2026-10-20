from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import URL


class Settings(BaseSettings):
    """Настройки приложения. Значения читаются из переменных окружения и файла .env."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Параметры подключения к PostgreSQL
    postgres_user: str = "finance"
    postgres_password: str  # обязательный: значения по умолчанию нет, чтобы пароль не попал в код
    postgres_db: str = "finance"
    postgres_host: str = "localhost"
    postgres_port: int = 5432

    # Полный адрес подключения (необязательно, если он задан, параметры выше не используются)
    database_url: str | None = None

    # Адреса frontend через запятую
    cors_origins: str = "http://localhost:5173"

    @property
    def sqlalchemy_database_url(self) -> str | URL:
        if self.database_url:
            return self.database_url
        # URL.create сам экранирует специальные символы в пароле
        return URL.create(
            "postgresql+psycopg",
            username=self.postgres_user,
            password=self.postgres_password,
            host=self.postgres_host,
            port=self.postgres_port,
            database=self.postgres_db,
        )

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]


settings = get_settings()
