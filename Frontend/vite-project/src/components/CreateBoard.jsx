import { useState } from "react";
import { api } from "../api/client";

export default function CreateBoard() {
  const [name, setName] = useState("");

  async function createBoard() {
    if (!name.trim()) return;

    const res = await api.post("/api/boards", {
      name,
      defaultLists: true,
      desc: "Created via frontend",
    });

    alert("Board created! ID: " + res.event.payload.id);
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Create Board</h2>
      <input
        style={{ padding: 8 }}
        placeholder="Board Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={createBoard}
        style={{
          marginLeft: 8,
          padding: 8,
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 4,
        }}
      >
        Create
      </button>
    </div>
  );
}
