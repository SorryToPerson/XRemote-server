const WebSocket = require('ws');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 当有新的 WebSocket 连接时触发
wss.on('connection', (ws) => {
  console.log('Client connected');

  // 当收到消息时触发
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);

    // 发送消息给连接的客户端
    ws.send(`Server received: ${message}`);
  });

  // 当连接关闭时触发
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// 启动 HTTP 服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
