import { useState } from "react";
import { api } from "../api/client";
import { useDraggable } from "@dnd-kit/core";

export default function CardItem({ card }) {
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(card.name);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
  });

  const style = {
    background: "white",
    borderRadius: 6,
    padding: 8,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    transform: transform
      ? `translate3d(${Math.round(transform.x)}px, ${Math.round(
          transform.y
        )}px, 0)`
      : undefined,
  };

  async function save() {
    await api.put(`/api/tasks/${card.id}`, { name: newName });
    setEditMode(false);
  }

  async function remove() {
    await api.delete(`/api/tasks/${card.id}`);
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {!editMode && (
        <div>
          <div style={{ fontSize: 14 }}>{card.name}</div>

          <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
            <button
              onClick={() => setEditMode(true)}
              style={{
                padding: "2px 6px",
                fontSize: 12,
                background: "#e2e8f0",
                border: "none",
                borderRadius: 4,
              }}
            >
              Edit
            </button>

            <button
              onClick={remove}
              style={{
                padding: "2px 6px",
                fontSize: 12,
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: 4,
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {editMode && (
        <div>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ padding: 6, borderRadius: 4, width: "100%" }}
          />
          <div style={{ marginTop: 4, display: "flex", gap: 6 }}>
            <button
              onClick={save}
              style={{
                padding: "2px 6px",
                fontSize: 12,
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: 4,
              }}
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              style={{
                padding: "2px 6px",
                fontSize: 12,
                background: "#9ca3af",
                border: "none",
                borderRadius: 4,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
