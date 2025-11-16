import { useEffect, useMemo, useReducer, useState } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { api } from '../api/client';
import { createSocket } from '../socket';
import { applyEvent } from '../state/events';
import List from './List';

const qc = new QueryClient();

export default function BoardApp() {
  return (
    <QueryClientProvider client={qc}>
      <BoardPage />
    </QueryClientProvider>
  );
}

function BoardPage() {
  
  const [boardId] = useState( "6918c3ed46075d43fe81a9ce");

  const [socketStatus, setSocketStatus] = useState("disconnected");
  const [localState, dispatchLocal] = useReducer(
    (s, e) => applyEvent(s, e),
    { board: null, lists: [], cards: [] }
  );

  // FETCH board + lists + cards
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["boardFull", boardId],
    queryFn: async () => {
      const res = await api.get(`/api/boards/${boardId}/full`);
      return res.data.data; // {board, lists, cards}
    },
  });

  // SOCKET.IO
  useEffect(() => {
    const socket = createSocket();

    socket.on("connect", () => {
      setSocketStatus("connected");
      socket.emit("join_board", { boardId });
    });

    socket.on("disconnect", () => setSocketStatus("disconnected"));

    socket.on("trello_event", (event) => {
      dispatchLocal(event); // apply to reducer
    });

    return () => socket.close();
  }, [boardId]);

  // merged lists + cards
  const lists = useMemo(() => data?.lists ?? [], [data]);
  const cards = useMemo(() => {
    if (localState.cards.length > 0) return localState.cards;
    return data?.cards ?? [];
  }, [data, localState.cards]);

  // LOADING STATES
  if (isLoading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (isError) return <div>Error. <button onClick={() => refetch()}>Retry</button></div>;

  // MAIN UI RETURN — INSIDE THE FUNCTION ✔️
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>{data.board.name}</h2>
        <span
          style={{
            fontSize: 12,
            padding: "2px 6px",
            borderRadius: 6,
            background: socketStatus === "connected" ? "#d1fae5" : "#fee2e2",
          }}
        >
          {socketStatus}
        </span>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        {lists.map((list) => (
          <List
            key={list.id}
            list={list}
            cards={cards.filter((c) => c.idList === list.id && !c.closed)}
            boardId={boardId}
  onRefresh={() => refetch()}
          />
        ))}
      </div>
    </div>
  );
}
