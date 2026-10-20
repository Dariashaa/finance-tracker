from tests.conftest import make_category, make_transaction


def test_create_category(client):
    response = client.post(
        "/api/categories",
        json={"name": "  Еда ", "type": "expense", "color": "#3F51B5", "limit": 30000},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["id"] > 0
    assert data["name"] == "Еда"  
    assert data["limit"] == 30000


def test_create_category_without_limit(client):
    data = make_category(client, limit=None)
    assert data["limit"] is None


def test_duplicate_name_is_conflict(client):
    make_category(client, name="Еда")
    response = client.post(
        "/api/categories", json={"name": "еда", "type": "expense", "color": "#000000"}
    )
    assert response.status_code == 409
    assert "уже существует" in response.json()["detail"]


def test_invalid_data_returns_errors_by_field(client):
    response = client.post(
        "/api/categories", json={"name": "", "type": "expense", "color": "red", "limit": -5}
    )
    assert response.status_code == 422
    body = response.json()
    fields = {error["field"] for error in body["errors"]}
    assert fields == {"name", "color", "limit"}


def test_unknown_type_is_rejected(client):
    response = client.post(
        "/api/categories", json={"name": "Х", "type": "other", "color": "#000000"}
    )
    assert response.status_code == 422
    assert response.json()["errors"][0]["field"] == "type"


def test_income_category_cannot_have_limit(client):
    response = client.post(
        "/api/categories",
        json={"name": "Зарплата", "type": "income", "color": "#4CAF50", "limit": 1000},
    )
    assert response.status_code == 422


def test_list_and_filter_by_type(client):
    make_category(client, name="Еда", type="expense")
    make_category(client, name="Зарплата", type="income", color="#4CAF50")

    assert len(client.get("/api/categories").json()) == 2
    expenses = client.get("/api/categories", params={"type": "expense"}).json()
    assert [c["name"] for c in expenses] == ["Еда"]


def test_get_category_and_not_found(client):
    category = make_category(client)
    assert client.get(f"/api/categories/{category['id']}").json()["name"] == "Еда"

    response = client.get("/api/categories/999")
    assert response.status_code == 404
    assert "не найдена" in response.json()["detail"]


def test_update_category(client):
    category = make_category(client, limit=1000)
    response = client.put(
        f"/api/categories/{category['id']}",
        json={"name": "Продукты", "type": "expense", "color": "#FF9800", "limit": 2500.5},
    )
    assert response.status_code == 200
    data = response.json()
    assert (data["name"], data["color"], data["limit"]) == ("Продукты", "#FF9800", 2500.5)


def test_update_category_can_remove_limit(client):
    category = make_category(client, limit=1000)
    response = client.put(
        f"/api/categories/{category['id']}",
        json={"name": "Еда", "type": "expense", "color": "#3F51B5", "limit": None},
    )
    assert response.json()["limit"] is None


def test_update_unknown_category_is_404(client):
    response = client.put(
        "/api/categories/999", json={"name": "Х", "type": "expense", "color": "#000000"}
    )
    assert response.status_code == 404


def test_update_to_taken_name_is_conflict(client):
    make_category(client, name="Еда")
    other = make_category(client, name="Транспорт", color="#2196F3")
    response = client.put(
        f"/api/categories/{other['id']}",
        json={"name": "Еда", "type": "expense", "color": "#2196F3"},
    )
    assert response.status_code == 409


def test_keep_own_name_on_update(client):
    category = make_category(client, name="Еда")
    response = client.put(
        f"/api/categories/{category['id']}",
        json={"name": "Еда", "type": "expense", "color": "#FF9800"},
    )
    assert response.status_code == 200


def test_cannot_change_type_when_category_has_transactions(client):
    category = make_category(client)
    make_transaction(client, category["id"])
    response = client.put(
        f"/api/categories/{category['id']}",
        json={"name": "Еда", "type": "income", "color": "#3F51B5"},
    )
    assert response.status_code == 409


def test_can_change_type_of_empty_category(client):
    category = make_category(client)
    response = client.put(
        f"/api/categories/{category['id']}",
        json={"name": "Еда", "type": "income", "color": "#3F51B5"},
    )
    assert response.status_code == 200
    assert response.json()["type"] == "income"


def test_delete_empty_category(client):
    category = make_category(client)
    assert client.delete(f"/api/categories/{category['id']}").status_code == 204
    assert client.get(f"/api/categories/{category['id']}").status_code == 404


def test_cannot_delete_category_with_transactions(client):
    category = make_category(client)
    make_transaction(client, category["id"])
    response = client.delete(f"/api/categories/{category['id']}")
    assert response.status_code == 409
    assert "в ней есть операции" in response.json()["detail"]
    assert client.get(f"/api/categories/{category['id']}").status_code == 200


def test_delete_unknown_category_is_404(client):
    assert client.delete("/api/categories/999").status_code == 404
