import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/items")
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function addItem() {
    if (newItem.trim() === "") return;

    fetch("http://localhost:8000/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item: newItem,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("POST response:", data);
        setItems((prevItems) => [...prevItems, data[0]]);
        setNewItem("");
      })
      .catch((error) => console.log(error));
  }
  function toggleBought(id, bought) {
    fetch(`http://localhost:8000/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bought: !bought,
      }),
    })
      .then((response) => response.json())
      .then((updatedItem) => {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === updatedItem.id ? updatedItem : item,
          ),
        );
      })
      .catch((error) => console.log(error));
  }

  function deleteItem(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?",
    );

    if (!confirmDelete) return;

    fetch(`http://localhost:8000/items/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      })
      .catch((error) => console.log(error));
  }
  const totalItems = items.length;
  const boughtItems = items.filter((item) => item.bought).length;
  const remainingItems = totalItems - boughtItems;
  const filteredItems = items.filter((item) =>
    item.item.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  return (
    <div className="container">
      <div className="header">
        <h1>🛒 Shopping List</h1>
        <p>Everything you need in one place.</p>
      </div>

      <div className="stats">
        <div className="stat-card total">
          <h2>{totalItems}</h2>
          <p>Total Items</p>
        </div>

        <div className="stat-card bought">
          <h2>{boughtItems}</h2>
          <p>Bought</p>
        </div>

        <div className="stat-card remaining">
          <h2>{remainingItems}</h2>
          <p>Remaining</p>
        </div>
      </div>

      <div className="search-section">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter an item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addItem();
            }
          }}
        />

        <button onClick={addItem}>Add Item</button>
      </div>

      {filteredItems.length === 0 ? (
        <p className="empty-message">No items in your shopping list.</p>
      ) : (
        <ul>
          {filteredItems.map((item, index) => (
            <li
              key={item.id}
              className={`task-item ${index % 2 === 0 ? "remaining-item" : "bought-item"}`}
            >
              <div className="task-content">
                <input
                  type="checkbox"
                  checked={item.bought}
                  onChange={() => toggleBought(item.id, item.bought)}
                />

                <span
                  style={{
                    textDecoration: item.bought ? "line-through" : "none",
                  }}
                >
                  {item.item}
                </span>
              </div>

              <button
                className="delete-btn"
                onClick={() => deleteItem(item.id)}
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
