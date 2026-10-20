from tests.conftest import make_category, make_transaction


def test_create_transaction_takes_type_from_category(client):
    expense = make_category(client, name="Еда", type="expense")
    income = make_category(client, name="Зарплата", type="income", color="#4CAF50")

    created = make_transaction(client, expense["id"], amount=1250.5, comment="  Пятёрочка ")
    assert created["type"] == "expense"
    assert created["amount"] == 1250.5  # число, а не строка
    assert created["comment"] == "Пятёрочка"
    assert created["category_id"] == expense["id"]

    assert make_transaction(client, income["id"])["type"] == "income"


def test_empty_comment_becomes_null(client):
    category = make_category(client)
    assert make_transaction(client, category["id"], comment="   ")["comment"] is None


def test_create_with_unknown_category(client):
    response = client.post(
        "/api/transactions", json={"amount": 100, "date": "2025-03-01", "category_id": 999}
    )
    assert response.status_code == 422
    assert "Категория с id=999 не найдена" in response.json()["detail"]


def test_invalid_fields_return_errors_by_field(client):
    category = make_category(client)
    response = client.post(
        "/api/transactions",
        json={"amount": 0, "date": "31.03.2025", "category_id": category["id"]},
    )
    assert response.status_code == 422
    fields = {error["field"] for error in response.json()["errors"]}
    assert fields == {"amount", "date"}


def test_amount_with_three_decimals_is_rejected(client):
    category = make_category(client)
    response = client.post(
        "/api/transactions",
        json={"amount": 10.123, "date": "2025-03-01", "category_id": category["id"]},
    )
    assert response.status_code == 422


def test_missing_required_fields(client):
    response = client.post("/api/transactions", json={})
    assert response.status_code == 422
    fields = {error["field"] for error in response.json()["errors"]}
    assert fields == {"amount", "date", "category_id"}


def test_list_is_sorted_newest_first(client):
    category = make_category(client)
    make_transaction(client, category["id"], date="2025-03-05")
    make_transaction(client, category["id"], date="2025-03-20")
    make_transaction(client, category["id"], date="2025-03-10")
    dates = [t["date"] for t in client.get("/api/transactions").json()]
    assert dates == ["2025-03-20", "2025-03-10", "2025-03-05"]


def test_filter_by_month(client):
    category = make_category(client)
    make_transaction(client, category["id"], date="2025-02-28")
    make_transaction(client, category["id"], date="2025-03-01")
    make_transaction(client, category["id"], date="2025-03-31")
    make_transaction(client, category["id"], date="2025-04-01")

    march = client.get("/api/transactions", params={"month": "2025-03"}).json()
    assert [t["date"] for t in march] == ["2025-03-31", "2025-03-01"]


def test_filter_by_month_december(client):
    category = make_category(client)
    make_transaction(client, category["id"], date="2025-12-31")
    make_transaction(client, category["id"], date="2026-01-01")
    december = client.get("/api/transactions", params={"month": "2025-12"}).json()
    assert [t["date"] for t in december] == ["2025-12-31"]


def test_filter_by_type_and_category(client):
    food = make_category(client, name="Еда", type="expense")
    taxi = make_category(client, name="Транспорт", type="expense", color="#2196F3")
    salary = make_category(client, name="Зарплата", type="income", color="#4CAF50")
    make_transaction(client, food["id"])
    make_transaction(client, taxi["id"])
    make_transaction(client, salary["id"], amount=5000)

    expenses = client.get("/api/transactions", params={"type": "expense"}).json()
    assert len(expenses) == 2
    incomes = client.get("/api/transactions", params={"type": "income"}).json()
    assert [t["amount"] for t in incomes] == [5000]
    only_taxi = client.get("/api/transactions", params={"category_id": taxi["id"]}).json()
    assert len(only_taxi) == 1


def test_invalid_month_parameter(client):
    for bad in ("2025-13", "март", "2025-3"):
        response = client.get("/api/transactions", params={"month": bad})
        assert response.status_code == 422
        assert response.json()["errors"][0]["field"] == "month"


def test_get_transaction_and_not_found(client):
    category = make_category(client)
    created = make_transaction(client, category["id"])
    assert client.get(f"/api/transactions/{created['id']}").status_code == 200

    response = client.get("/api/transactions/999")
    assert response.status_code == 404
    assert "не найдена" in response.json()["detail"]


def test_update_transaction(client):
    food = make_category(client, name="Еда")
    taxi = make_category(client, name="Транспорт", color="#2196F3")
    created = make_transaction(client, food["id"], amount=100, date="2025-03-01")

    response = client.put(
        f"/api/transactions/{created['id']}",
        json={"amount": 250, "date": "2025-03-15", "category_id": taxi["id"], "comment": "Такси"},
    )
    assert response.status_code == 200
    data = response.json()
    assert (data["amount"], data["date"], data["category_id"], data["comment"]) == (
        250,
        "2025-03-15",
        taxi["id"],
        "Такси",
    )


def test_cannot_move_transaction_to_category_of_other_type(client):
    expense = make_category(client, name="Еда", type="expense")
    income = make_category(client, name="Зарплата", type="income", color="#4CAF50")
    created = make_transaction(client, expense["id"])
    response = client.put(
        f"/api/transactions/{created['id']}",
        json={"amount": 100, "date": "2025-03-10", "category_id": income["id"]},
    )
    assert response.status_code == 422
    assert client.get(f"/api/transactions/{created['id']}").json()["type"] == "expense"


def test_update_unknown_transaction_is_404(client):
    category = make_category(client)
    response = client.put(
        "/api/transactions/999",
        json={"amount": 1, "date": "2025-03-10", "category_id": category["id"]},
    )
    assert response.status_code == 404


def test_update_with_unknown_category(client):
    category = make_category(client)
    created = make_transaction(client, category["id"])
    response = client.put(
        f"/api/transactions/{created['id']}",
        json={"amount": 1, "date": "2025-03-10", "category_id": 999},
    )
    assert response.status_code == 422


def test_delete_transaction(client):
    category = make_category(client)
    created = make_transaction(client, category["id"])
    assert client.delete(f"/api/transactions/{created['id']}").status_code == 204
    assert client.get(f"/api/transactions/{created['id']}").status_code == 404
    assert client.delete(f"/api/categories/{category['id']}").status_code == 204


def test_delete_unknown_transaction_is_404(client):
    assert client.delete("/api/transactions/999").status_code == 404


def test_health(client):
    assert client.get("/api/health").json() == {"status": "ok"}
