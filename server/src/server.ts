import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";

// HTTP 서버 생성 (WebSocket 연결을 위해 HTTP 서버가 필요)
const server = createServer();
const wss = new WebSocketServer({ server });

// 클라이언트 연결 시 실행될 이벤트 리스너 설정
wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");

  // 클라이언트에서 메시지 수신 시 실행되는 이벤트
  ws.on("message", (message: string) => {
    const parsedMessage = JSON.parse(message); // 메시지를 파싱하여 clientId와 text 추출

    // 모든 클라이언트에게 브로드캐스트
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(parsedMessage)); // JSON 형식으로 전송
      }
    });
  });

  // 클라이언트 연결 종료 시 실행되는 이벤트
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// HTTP 서버를 8080 포트에서 실행
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
