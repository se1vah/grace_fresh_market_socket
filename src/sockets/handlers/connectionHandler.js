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

    if (typeof callback === 'function') {
      callback({
        success: true,
        message: 'New order notification broadcasted',
      });
    }
  });

  socket.on('shop-delete-user', (data, callback) => {
    io.emit(`user-deleted-${data?.userId}`, true);


    if (typeof callback === 'function') {
      callback({
        success: true,
        message: 'User deleted notification broadcasted',
      });
    }
  });

  socket.on('maintenance-notification', (data, callback) => {
    console.log("1111", { data })
    io.emit('user-maintenance-notification', data);

    if (typeof callback === 'function') {
      callback({
        success: true,
        message: 'Maintenance notification broadcasted',
      });
    }
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
