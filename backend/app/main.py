from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.errors import register_error_handlers
from app.api.router import api_router
from app.core.config import settings

app = FastAPI(
    title="Личный финучёт API",
    description="Операции, категории и бюджеты. Документация: /docs",
    version="0.1.0",
)

# CORS: разрешаем браузеру обращаться к API с адреса frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_error_handlers(app)
app.include_router(api_router)


@app.get("/api/health", tags=["Служебное"], summary="Проверка работы сервера")
def health():
    return {"status": "ok"}
