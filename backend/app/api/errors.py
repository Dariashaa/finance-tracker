from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.exceptions import BusinessRuleError, ConflictError, NotFoundError


def _translate(error: dict) -> str:
    """Переводит сообщение ошибки валидации Pydantic на понятный русский."""
    kind = error.get("type", "")
    ctx = error.get("ctx") or {}

    if kind == "missing":
        return "Обязательное поле"
    if kind in ("greater_than", "greater_than_equal"):
        limit = ctx.get("gt", ctx.get("ge"))
        return f"Значение должно быть больше {limit}" if kind == "greater_than" else f"Значение должно быть не меньше {limit}"
    if kind == "string_too_short":
        return "Значение не может быть пустым" if ctx.get("min_length") == 1 else f"Минимальная длина: {ctx.get('min_length')}"
    if kind == "string_too_long":
        return f"Максимальная длина: {ctx.get('max_length')} символов"
    if kind == "string_pattern_mismatch":
        return "Значение имеет неверный формат"
    if kind in ("date_parsing", "date_from_datetime_parsing", "date_type"):
        return "Неверная дата, нужен формат ГГГГ-ММ-ДД"
    if kind in ("decimal_parsing", "decimal_type", "int_parsing", "int_type", "float_parsing"):
        return "Должно быть числом"
    if kind in ("decimal_max_places",):
        return f"Не больше {ctx.get('decimal_places')} знаков после запятой"
    if kind in ("decimal_max_digits", "decimal_whole_digits"):
        return "Слишком большое число"
    if kind == "enum":
        return f"Допустимые значения: {ctx.get('expected')}"
    if kind == "string_type":
        return "Должно быть строкой"
    if kind == "value_error" and "error" in ctx:
        return str(ctx["error"])
    return error.get("msg", "Некорректное значение")


def register_error_handlers(app: FastAPI) -> None:
    """Единый формат ошибок: {"detail": "текст"}, для ошибок формы ещё и "errors" по полям."""

    @app.exception_handler(NotFoundError)
    async def not_found_handler(request: Request, exc: NotFoundError):
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"detail": exc.message})

    @app.exception_handler(ConflictError)
    async def conflict_handler(request: Request, exc: ConflictError):
        return JSONResponse(status_code=status.HTTP_409_CONFLICT, content={"detail": exc.message})

    @app.exception_handler(BusinessRuleError)
    async def business_rule_handler(request: Request, exc: BusinessRuleError):
        return JSONResponse(
            status_code=422, content={"detail": exc.message}
        )

    @app.exception_handler(RequestValidationError)
    async def validation_handler(request: Request, exc: RequestValidationError):
        errors = [
            {
                "field": ".".join(str(part) for part in error["loc"][1:]),
                "message": _translate(error),
            }
            for error in exc.errors()
        ]
        return JSONResponse(
            status_code=422,
            content={"detail": "Некорректные данные запроса", "errors": errors},
        )
