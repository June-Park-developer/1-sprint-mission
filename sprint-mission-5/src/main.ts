import http from 'http';
import { setupWebSocket } from './websocket/setupWebSocket';
import { NODE_ENV, PORT } from './lib/constants';
import app from './app';

const server = http.createServer(app);
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`NODE_ENV is ${NODE_ENV}`);
});
