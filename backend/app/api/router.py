from fastapi import APIRouter

from app.api.routes import categories, transactions

api_router = APIRouter(prefix="/api")
api_router.include_router(categories.router)
api_router.include_router(transactions.router)
