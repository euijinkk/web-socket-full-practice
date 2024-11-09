import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const clientId = uuidv4();

const ChatSection = () => {
  const [input, setInput] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null); // input 필드에 포커스할 ref 생성
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<
    { clientId: string; text: string }[]
  >([]);

  useEffect(() => {
    // WebSocket 서버 연결
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    // 서버로부터 메시지 수신
    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    };

    return () => {
      // 컴포넌트 언마운트 시 WebSocket 연결 종료
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && input) {
      const message = { text: input, clientId };
      socket.send(JSON.stringify(message));
      setInput("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    // 탭이 활성화될 때 input에 포커스
    const focusInput = () => {
      inputRef.current?.focus();
    };

    // window의 focus 이벤트에 focusInput 핸들러를 바인딩
    window.addEventListener("focus", focusInput);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("focus", focusInput);
    };
  }, []);

  return (
    <div style={{ padding: "20px", width: "500px", margin: "0 auto" }}>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "300px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg, index) => {
          const isMyMessage = msg.clientId === clientId;
          return (
            <div
              key={index}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: isMyMessage ? "flex-end" : "flex-start",
              }}
            >
              <span
                style={{
                  textAlign: isMyMessage ? "right" : "left",
                  backgroundColor: isMyMessage ? "#f9e000" : "#333333",
                  color: isMyMessage ? "#222222" : "#ffffff",
                  padding: "5px 10px",
                  margin: "5px 0",
                  borderRadius: "10px",
                  maxWidth: "50%",
                }}
              >
                {msg.text}
              </span>
            </div>
          );
        })}
      </div>
      <input
        type="text"
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyUp={handleKeyPress}
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
