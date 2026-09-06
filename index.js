const http = require('http');
const app = require('./src/app');
const config = require('./src/config/env');
const { initSocketServer } = require('./src/sockets');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initSocketServer(server);

// Attach io instance to app for route access if needed (e.g., req.app.get('io'))
app.set('io', io);

// Start listening
server.listen(config.port, () => {
    console.log('==============================================');
    console.log(`🚀 Grass Fresh Market Socket Server running!`);
    console.log(`📡 Port: ${config.port}`);
    console.log(`🌐 Environment: ${config.nodeEnv}`);
    console.log(`🧪 Test Client: http://localhost:${config.port}/`);
    console.log('==============================================');
});

// Graceful shutdown handling
function gracefulShutdown(signal) {
    console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
    io.close(() => {
        console.log('[Socket] Socket server closed.');
        server.close(() => {
            console.log('[Server] HTTP server closed.');
            process.exit(0);
        });
    });

    // Force close if stuck
    setTimeout(() => {
        console.error('[Server] Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
