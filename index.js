const WebSocket = require('ws');
const { WebSocketServer } = WebSocket;
const wss = new WebSocketServer({
  port: 6666,
});

const code2ws = new Map();

wss.on('connection', function connection(ws, request) {
  const code = Math.floor(Math.random() * (999999 - 100000)) + 100000;
  console.log('code', code);
  code2ws.set(code, ws);
  ws.sendData = (event, data) => {
    console.log('123123123', event, data);
    ws.send(JSON.stringify({ event, data }));
  };

  ws.on('message', function incoming(message) {
    let parsedMessage = {};
    try {
      parsedMessage = JSON.parse(message);
    } catch (error) {
      console.log('parse message error', error);
      return;
    }
    console.log('incoming', parsedMessage);
    let { event, data } = parsedMessage;
    if (event === 'login') {
      ws.sendData('logined', { code });
    } else if (event === 'control') {
      let remote = +data.remote;
      if (code2ws.has(remote)) {
        ws.sendData('controlled', { remote });
        ws.sendRemote = code2ws.get(remote).sendData;
        ws.sendRemote('be-controlled', { remote: code });
      } else {
        ws.sendData('no-remote', { errMessage: '没有该机器' });
      }
    } else if (event === 'forward') {
      ws.sendRemote(event, data);
    }
  });
  ws.on('close', () => {
    code2ws.delete(code);
  });
  ws._closeTimeout = setTimeout(() => {
    ws.terminate();
  }, 10 * 60 * 1000);
});

wss.on('listening', () => {
  console.log('服务启动成功： 端口：6666');
});
