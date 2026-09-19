/**
 * Handles core connection lifecycle events
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
function registerConnectionHandlers(io, socket) {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Handle client ping for latency checks
  socket.on('notify-order-to-shop', (data, callback) => {
    io.emit('new-order-to-shop', { data });
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`[Socket] Client disconnected: ${socket.id} (Reason: ${reason})`);
  });

  // Handle socket-level error
  socket.on('error', (err) => {
    console.error(`[Socket] Error on client ${socket.id}:`, err);
  });
}

module.exports = registerConnectionHandlers;
