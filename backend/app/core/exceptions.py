class AppError(Exception):
    """Базовая ошибка бизнес-логики. Текст message показывается пользователю."""

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class NotFoundError(AppError):
    """Запись не найдена (HTTP 404)."""


class ConflictError(AppError):
    """Действие конфликтует с текущим состоянием данных (HTTP 409)."""


class BusinessRuleError(AppError):
    """Данные верны по формату, но нарушают правило приложения (HTTP 422)."""
