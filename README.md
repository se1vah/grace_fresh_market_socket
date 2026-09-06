# Grass Fresh Market - Socket Server

Real-time WebSocket server built with **Node.js**, **Express**, and **Socket.IO**.

## Features

- ⚡ **Real-Time Bidirectional Communication**: Powered by Socket.IO with WebSocket and HTTP polling fallback.
- 🏢 **Rooms & Namespaces**: Support for market zones, store IDs, order tracking, and private user rooms.
- 🌐 **CORS & Environment Ready**: Configurable origins and ports via `.env`.
- 🩺 **Health Check Endpoint**: `/health` HTTP endpoint for monitoring and uptime probes.
- 🧪 **Interactive Web Client**: Built-in test client accessible at `http://localhost:4000/`.
- 🛡️ **Graceful Shutdown**: Handles `SIGTERM` and `SIGINT` to safely disconnect clients before exit.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` if not already created:
```bash
cp .env.example .env
```

Default settings:
```ini
PORT=4000
NODE_ENV=development
CORS_ORIGIN=*
```

### 3. Run the Server

#### Development (Hot-Reload with Nodemon)
```bash
npm run dev
```

#### Production
```bash
npm start
```

### 4. Run Automated Tests
```bash
npm test
```
*(Make sure the server is running on port 4000 before running tests, or test script runs against `http://localhost:4000`)*

---

## Web Test Interface

Open your browser to:
```
http://localhost:4000/
```
You can:
- Inspect connection status and your Socket ID.
- Check latency round-trip time (`Ping Latency Check`).
- Join and leave rooms (e.g. `order_54321` or `market_zone_1`).
- Broadcast messages to rooms or globally.
- View live color-coded event stream.

---

## Socket Event API Reference

### Client to Server Events

| Event Name | Payload | Callback Acknowledgement | Description |
| :--- | :--- | :--- | :--- |
| `ping_check` | `{ clientTime: Date.now() }` | `(ack) => void` | Measures latency round-trip. |
| `join_room` | `roomName: string` | `({ success, room }) => void` | Subscribes client socket to a room. |
| `leave_room` | `roomName: string` | `({ success, room }) => void` | Unsubscribes client socket from a room. |
| `market_broadcast` | `{ room?: string, message: string, data?: any }` | None | Emits updates to all sockets in `room` (or global if omitted). |

### Server to Client Events

| Event Name | Payload | Description |
| :--- | :--- | :--- |
| `room_notice` | `{ event, socketId, room, timestamp }` | Broadcasted to room members when a client joins/leaves. |
| `market_update` | `{ sender, message, data, timestamp }` | Dispatched to room or global listeners on market/order updates. |
| `pong_response` | `{ receivedAt, echo }` | Sent if `ping_check` was called without a callback function. |

---

## Client Integration Example (Frontend / Mobile)

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("Connected to socket server:", socket.id);

  // Join order room
  socket.emit("join_room", "order_12345", (response) => {
    console.log("Joined order room:", response);
  });
});

socket.on("market_update", (update) => {
  console.log("Real-time update received:", update);
});
```
# grace_fresh_market_socket
