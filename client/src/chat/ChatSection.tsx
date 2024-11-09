import { useEffect, useState } from "react";

const ChatSection = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    // WebSocket 서버 연결
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    // 서버로부터 메시지 수신
    ws.onmessage = (event) => {
      console.log("event", event);
      console.log("event.data", event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    // 연결 종료 시 콘솔 로그 출력
    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      // 컴포넌트 언마운트 시 WebSocket 연결 종료
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && input) {
      // WebSocket을 통해 메시지 전송
      socket.send(input);
      setInput(""); // 입력 필드 초기화
    }
  };

  return (
    <div style={{ padding: "20px", width: "500px", margin: "0 auto" }}>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "300px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter message"
        style={{ width: "100%", padding: "10px", marginTop: "10px" }}
      />
      <button
        onClick={sendMessage}
        style={{ width: "100%", padding: "10px", marginTop: "5px" }}
      >
        Send
      </button>
    </div>
  );
};

export default ChatSection;
