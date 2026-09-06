const { Server } = require('socket.io');
const config = require('../config/env');
const registerConnectionHandlers = require('./handlers/connectionHandler');

/**
 * Initializes and attaches Socket.IO to an HTTP server
 * @param {import('http').Server} httpServer
 * @returns {import('socket.io').Server}
 */
function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: config.corsOrigin === '*' ? '*' : config.corsOrigin.split(',').map((o) => o.trim()),
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  // Global socket middleware (logging / auth hooks)
  io.use((socket, next) => {
    // In future, socket.handshake.auth can be verified here
    console.log(`[Socket] Handshake from ${socket.id} - transport: ${socket.conn.transport.name}`);
    next();
  });

  // Main connection listener
  io.on('connection', (socket) => {
    registerConnectionHandlers(io, socket);
  });

  return io;
}

module.exports = { initSocketServer };
