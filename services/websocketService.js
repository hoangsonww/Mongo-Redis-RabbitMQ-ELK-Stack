const WebSocket = require('ws');

let wss;

exports.initializeWebSocket = server => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', ws => {
    console.log('New WebSocket connection established.');

    ws.isAlive = true;

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', message => {
      console.log('Message received:', message);
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed.');
    });
  });

  // Ping clients every 30 seconds
  const interval = setInterval(() => {
    wss.clients.forEach(ws => {
      if (!ws.isAlive) {
        console.log('Terminating inactive WebSocket connection.');
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  console.log('WebSocket server initialized.');
};

exports.broadcastNotification = message => {
  if (wss) {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
};
