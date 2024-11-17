import { useState, useEffect } from "react";
import "./App.css";
interface Cursor {
  id: string;
  x: number;
  y: number;
}

const SIZE = 34;
const ID = Math.random().toString();
function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [cursors, setCursors] = useState<Array<Cursor>>([]);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (!socket) {
      return;
    }
    const handleMouseMove = (event: MouseEvent) => {
      setX(event.x);
      setY(event.y);
      if (socket != null) {
        const currentCursor: Cursor = {
          x: event.x,
          y: event.y,
          id: ID,
        };
        socket.send(JSON.stringify(currentCursor));
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [socket]);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);
    ws.addEventListener("message", async (event) => {
      const cursor = JSON.parse(await event.data.text());
      setCursors((prevCursors) => {
        const updatedCursors = prevCursors.slice(cursor);
        let exist = false;

        for (const c of updatedCursors) {
          if (c.id == cursor.id) {
            c.x = cursor.x;
            c.y = cursor.y;
            exist = true;
          }
        }
        if (!exist) {
          updatedCursors.push(cursor);
        }
        return updatedCursors;
      });
    });
    return () => {
      ws.close();
    };
  }, []);

  return (
    <>
      {x},{y}
      <div
        style={{
          position: "absolute",
          left: x - SIZE / 2,
          top: y - SIZE / 2,
          width: SIZE,
          height: SIZE,
          backgroundColor: "black",
        }}
      ></div>
      {cursors.map((cursor) => (
        <div
          style={{
            position: "absolute",
            left: cursor.x - SIZE / 2,
            top: cursor.y - SIZE / 2,
            width: SIZE,
            height: SIZE,
            backgroundColor: "red",
          }}
        ></div>
      ))}
    </>
  );
}

export default App;
