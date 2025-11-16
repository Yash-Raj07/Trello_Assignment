import { useState } from "react";
import CardItem from "./CardItem";
import { api } from "../api/client";

export default function List({ list, cards, boardId, onRefresh }) {
  const [newCardName, setNewCardName] = useState("");

  async function createCard() {
    if (!newCardName.trim()) return;

    await api.post("/api/tasks", {
      boardId,
      listId: list.id,
      name: newCardName,
      desc: ""
    });

    setNewCardName("");
    onRefresh(); // force reload of board
  }

  return (
    <div
      style={{
        width: 300,
        background: "#f3f4f6",
        borderRadius: 8,
        padding: 8,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{list.name}</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {cards.map((c) => (
          <CardItem key={c.id} card={c} />
        ))}

        {/* Create Card */}
        <div
          style={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <input
            style={{ padding: 6, borderRadius: 4 }}
            placeholder="New card..."
            value={newCardName}
            onChange={(e) => setNewCardName(e.target.value)}
          />
          <button
            style={{
              padding: 6,
              background: "#2563eb",
              color: "white",
              borderRadius: 4,
              border: "none",
            }}
            onClick={createCard}
          >
            Add Card
          </button>
        </div>
      </div>
    </div>
  );
}
