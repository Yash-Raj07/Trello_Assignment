import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";

// ✅ Import all components
import BoardApp from "./components/Board";
import CreateBoard from "./components/CreateBoard";
import List from "./components/List";
import CardItem from "./components/CardItem";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav
      style={{
        padding: 12,
        background: "#f3f4f6",
        display: "flex",
        gap: 8,
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          border: "none",
          background: "#2563eb",
          color: "white",
        }}
      >
        Board View
      </button>

      <button
        onClick={() => navigate("/create")}
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          border: "none",
          background: "#2563eb",
          color: "white",
        }}
      >
        Create Board
      </button>

      {/* Optional direct routes to debug components */}
      <button
        onClick={() => navigate("/list-demo")}
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          border: "none",
          background: "#2563eb",
          color: "white",
        }}
      >
        List Demo
      </button>

      <button
        onClick={() => navigate("/card-demo")}
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          border: "none",
          background: "#2563eb",
          color: "white",
        }}
      >
        Card Demo
      </button>
    </nav>
  );
}

export default function App() {
  const [defaultBoardId] = useState("6918c3ed46075d43fe81a9ce");

  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: 16 }}>
        <Routes>
          {/* Default route: Board view */}
          <Route path="/" element={<BoardApp defaultBoardId={defaultBoardId} />} />

          {/* Create new board page */}
          <Route path="/create" element={<CreateBoard />} />

          {/* Optional demo routes to render components independently */}
          <Route
            path="/list-demo"
            element={
              <List
                list={{ id: "demoList", name: "Sample List" }}
                cards={[
                  { id: "1", name: "Demo Card 1" },
                  { id: "2", name: "Demo Card 2" },
                ]}
                boardId="demoBoard"
                onRefresh={() => console.log("Refreshed")}
              />
            }
          />

          <Route
            path="/card-demo"
            element={
              <div style={{ width: 300 }}>
                <CardItem
                  card={{ id: "demoCard", name: "Editable Card" }}
                  onRefresh={() => console.log("Card refreshed")}
                />
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
