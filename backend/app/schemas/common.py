from decimal import Decimal
from typing import Annotated

from pydantic import Field, PlainSerializer

# Денежная сумма: больше нуля, не больше 12 цифр всего и 2 знака после запятой.
# В базе это Decimal (точные вычисления), а в JSON отдаётся обычным числом,
Money = Annotated[
    Decimal,
    Field(gt=0, max_digits=12, decimal_places=2),
    PlainSerializer(float, return_type=float, when_used="json"),
]
