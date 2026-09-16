# Socket.IO Setup Guide --- React + Node.js/Express

A simple repeatable setup for adding **real-time chat with Socket.IO**
to a React frontend and Node.js/Express backend.

------------------------------------------------------------------------

## 1. Install Socket.IO

### Backend

Inside the backend project:

``` bash
npm install socket.io
```

### Frontend

Inside the React/Vite project:

``` bash
npm install socket.io-client
```

**Meaning:** - `socket.io` → Socket.IO server library. -
`socket.io-client` → connects the frontend to the Socket.IO server.

------------------------------------------------------------------------

# 2. Backend Setup

## Step 1: Create the HTTP server

Do **not** use only `app.listen()` when Socket.IO is attached to the
server.

### `app.js`

``` js
const express = require("express");
const http = require("http");
const initializeSocket = require("./utils/socket");

const app = express();

const server = http.createServer(app);

initializeSocket(server);

const port = process.env.PORT || 7777;

server.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
```

### Important

``` js
app.listen(...)
```

starts the Express server.

``` js
server.listen(...)
```

starts the HTTP server that Socket.IO is attached to.

So when using Socket.IO:

``` js
const server = require("http").createServer(app);

initializeSocket(server);

server.listen(7777);
```

------------------------------------------------------------------------

# 3. Backend CORS

Inside Socket.IO:

``` js
const io = socket(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});
```

**Important:** Use the actual URL as a string.

Correct:

``` js
origin: "http://localhost:5173"
```

Not:

``` js
origin: "[http://localhost:5173](http://localhost:5173)"
```

------------------------------------------------------------------------

# 4. Create Socket.IO Backend File

Create:

``` text
src/utils/socket.js
```

Basic setup:

``` js
const socket = require("socket.io");

const initializeSocket = (server) => {

    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

    io.on("connection", (socket) => {

        console.log("Socket connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });

    });
};

module.exports = initializeSocket;
```

------------------------------------------------------------------------

# 5. Create Frontend Socket Utility

Create:

``` text
src/utils/socket.js
```

``` js
import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
    const socket = io(BASE_URL);
    return socket;
};
```

------------------------------------------------------------------------

# 6. Frontend Base URL

Example:

### `constants.js`

``` js
export const BASE_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:7777"
        : "/api";
```

For local development:

``` text
Frontend → http://localhost:5173
Backend  → http://localhost:7777
```

The Socket.IO client connects to:

``` text
http://localhost:7777
```

------------------------------------------------------------------------

# 7. Connect From React

Inside your component:

``` js
import { useEffect } from "react";
import { createSocketConnection } from "../utils/socket";
```

Then:

``` js
useEffect(() => {

    const socket = createSocketConnection();

    socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
    });

    return () => {
        socket.disconnect();
    };

}, []);
```

### Test

Browser console should show:

``` text
Socket connected: abc123...
```

If you see this, the Socket.IO connection is working.

------------------------------------------------------------------------

# 8. Events

Socket.IO communication is based on events.

### Send an event

``` js
socket.emit("eventName", data);
```

### Receive an event

``` js
socket.on("eventName", (data) => {
    console.log(data);
});
```

Example:

``` js
socket.emit("sendMessage", {
    message: "Hello"
});
```

Backend:

``` js
socket.on("sendMessage", ({ message }) => {
    console.log(message);
});
```

------------------------------------------------------------------------

# 9. Creating a Chat Room

For a private chat between two users, create a common room ID.

``` js
const roomId = [senderId, receiverId]
    .sort()
    .join("_");
```

### Why `sort()`?

Without sorting:

``` text
User A + User B
User B + User A
```

could create two different rooms.

With sorting:

``` text
A + B → A_B
B + A → A_B
```

Both users get the same room.

------------------------------------------------------------------------

# 10. Hash the Room ID

Optional: hash the room ID before using it.

``` js
const crypto = require("crypto");

const createHash = (value) => {
    return crypto
        .createHash("md5")
        .update(value)
        .digest("hex");
};

module.exports = { createHash };
```

Use it:

``` js
const { createHash } = require("./hashCreate");

const roomId = [senderId, receiverId]
    .sort()
    .join("_");

const hashedRoomId = createHash(roomId);
```

------------------------------------------------------------------------

# 11. User Joins Chat Room

Frontend:

``` js
socket.emit("joinChat", {
    senderId: _id,
    receiverId,
    token,
    senderName: `${firstName} ${lastName}`
});
```

Backend:

``` js
socket.on(
    "joinChat",
    ({ senderId, receiverId, senderName, token }) => {

        try {

            const roomId = [senderId, receiverId]
                .sort()
                .join("_");

            const hashedRoomId = createHash(roomId);

            // Verify JWT
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            if (String(decoded._id) !== String(senderId)) {
                return;
            }

            // IMPORTANT:
            // Join the SAME room used later in io.to(...)
            socket.join(hashedRoomId);

            console.log(
                `${senderName} joined room: ${hashedRoomId}`
            );

        } catch (err) {
            console.error("JOIN CHAT ERROR:", err.message);
        }
    }
);
```

### Very important

If you later do:

``` js
io.to(hashedRoomId)
```

you must join:

``` js
socket.join(hashedRoomId)
```

Do not join `roomId` and emit to `hashedRoomId`.

------------------------------------------------------------------------

# 12. Send Message

Frontend:

``` js
socket.emit("sendMessage", {
    message: newMessage,
    senderId: user._id,
    receiverId,
    senderName: `${user.firstName} ${user.lastName}`
});
```

Backend:

``` js
socket.on(
    "sendMessage",
    ({ senderId, receiverId, message, senderName }) => {

        console.log(`${senderName} sent: ${message}`);

        const roomId = [senderId, receiverId]
            .sort()
            .join("_");

        const hashedRoomId = createHash(roomId);

        io.to(hashedRoomId).emit(
            "messageReceived",
            {
                senderId,
                senderName,
                message
            }
        );
    }
);
```

------------------------------------------------------------------------

# 13. Receive Message in React

``` js
socket.on(
    "messageReceived",
    ({ senderId, senderName, message }) => {

        console.log(
            "MESSAGE RECEIVED:",
            senderName,
            message
        );

        setChats((prev) => [
            ...prev,
            {
                senderId,
                senderName,
                message
            }
        ]);
    }
);
```

Then render:

``` jsx
{chats.map((chat, index) => (
    <div
        key={index}
        className={
            chat.senderId === user._id
                ? "chat chat-end"
                : "chat chat-start"
        }
    >
        <div className="chat-header">
            {chat.senderName}
        </div>

        <div className="chat-bubble">
            {chat.message}
        </div>
    </div>
))}
```

Use `senderId` rather than comparing names.

------------------------------------------------------------------------

# 14. Complete Backend Socket File

``` js
const socket = require("socket.io");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { createHash } = require("./hashCreate");

const initializeSocket = (server) => {

    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

    io.on("connection", (socket) => {

        console.log("Socket connected:", socket.id);

        socket.on(
            "joinChat",
            ({ senderId, receiverId, senderName, token }) => {

                try {

                    const roomId = [senderId, receiverId]
                        .sort()
                        .join("_");

                    const hashedRoomId = createHash(roomId);

                    const decoded = jwt.verify(
                        token,
                        process.env.JWT_SECRET
                    );

                    if (
                        String(decoded._id) !==
                        String(senderId)
                    ) {
                        console.log("Unauthorized user");
                        return;
                    }

                    socket.join(hashedRoomId);

                    console.log(
                        `${senderName} joined room: ${hashedRoomId}`
                    );

                } catch (err) {
                    console.error(
                        "JOIN CHAT ERROR:",
                        err.message
                    );
                }
            }
        );

        socket.on(
            "sendMessage",
            ({ senderId, receiverId, message, senderName }) => {

                console.log(
                    `${senderName} sent: ${message}`
                );

                const roomId = [senderId, receiverId]
                    .sort()
                    .join("_");

                const hashedRoomId = createHash(roomId);

                console.log(
                    "Sending to room:",
                    hashedRoomId
                );

                io.to(hashedRoomId).emit(
                    "messageReceived",
                    {
                        senderId,
                        senderName,
                        message
                    }
                );
            }
        );

        socket.on("disconnect", () => {
            console.log(
                "Socket disconnected:",
                socket.id
            );
        });

    });
};

module.exports = initializeSocket;
```

------------------------------------------------------------------------

# 15. Recommended React Pattern

Create **one socket connection** for the Chat component instead of
creating a new connection every time Send is clicked.

Use `useRef`:

``` js
import { useRef } from "react";

const socketRef = useRef(null);
```

Create connection:

``` js
useEffect(() => {

    const socket = createSocketConnection();

    socketRef.current = socket;

    // join room
    // receive messages

    return () => {
        socket.disconnect();
        socketRef.current = null;
    };

}, [user, receiverId]);
```

Send using the same connection:

``` js
const handleSendMessage = () => {

    if (!newMessage.trim()) return;

    socketRef.current?.emit("sendMessage", {
        message: newMessage,
        senderId: user._id,
        receiverId,
        senderName: `${user.firstName} ${user.lastName}`
    });

    setNewMessage("");
};
```

------------------------------------------------------------------------

# 16. Environment Variables

Backend `.env`:

``` env
PORT=7777
JWT_SECRET=your_secret
```

Load them:

``` js
require("dotenv").config();
```

Access:

``` js
process.env.PORT
process.env.JWT_SECRET
```

Add `.env` to `.gitignore`:

``` gitignore
.env
```

Never commit JWT secrets or database credentials to GitHub.

------------------------------------------------------------------------

# 17. Complete Flow

``` text
React
  |
  | createSocketConnection()
  ↓
Socket.IO Server
  |
  | connection
  ↓
React
  |
  | joinChat(senderId, receiverId)
  ↓
Backend
  |
  | create roomId
  | sort user IDs
  | hash roomId
  | verify JWT
  | socket.join(hashedRoomId)
  ↓
Both users are in the same room
  |
  | sendMessage
  ↓
Backend
  |
  | create same roomId
  | create same hash
  | io.to(hashedRoomId).emit()
  ↓
messageReceived
  |
  ↓
React
  |
  | setChats(...)
  ↓
Chat bubble
```

------------------------------------------------------------------------

# 18. Debugging Checklist

### Backend

Check:

``` text
database connection successful
backend server started at port 7777
Socket connected: ...
User joined room: ...
User sent: ...
Sending to room: ...
```

### Frontend

Add:

``` js
socket.on("connect", () => {
    console.log("SOCKET CONNECTED:", socket.id);
});

socket.on("connect_error", (error) => {
    console.log("SOCKET ERROR:", error);
});

socket.on("messageReceived", (data) => {
    console.log("MESSAGE RECEIVED:", data);
});
```

### If `sendMessage` works but message is not received

Check these first:

``` text
1. Are both users connected?
2. Did both users execute joinChat?
3. Did both users join the same room?
4. Is socket.join(hashedRoomId) being used?
5. Is io.to(hashedRoomId) using the same hash?
6. Is socket.on("messageReceived") registered?
7. Is the React component actually mounted?
```

------------------------------------------------------------------------

# 19. Most Common Mistakes

### Mistake 1 --- Wrong useEffect condition

Wrong:

``` js
if (!user?._id || receiverId) return;
```

Correct:

``` js
if (!user?._id || !receiverId) return;
```

------------------------------------------------------------------------

### Mistake 2 --- Joining a different room

Wrong:

``` js
socket.join(roomId);

io.to(hashedRoomId).emit(...);
```

Correct:

``` js
socket.join(hashedRoomId);

io.to(hashedRoomId).emit(...);
```

------------------------------------------------------------------------

### Mistake 3 --- Creating a new socket for every message

Avoid:

``` js
const handleSendMessage = () => {
    const socket = createSocketConnection();
    socket.emit(...);
};
```

Prefer one socket connection stored in `useRef`.

------------------------------------------------------------------------

### Mistake 4 --- Storing only the message

Wrong:

``` js
setChats((prev) => [...prev, message]);
```

Correct:

``` js
setChats((prev) => [
    ...prev,
    {
        senderId,
        senderName,
        message
    }
]);
```

------------------------------------------------------------------------

### Mistake 5 --- Rendering only the first message

Wrong:

``` jsx
chats[0]
```

Correct:

``` jsx
chats.map(...)
```

------------------------------------------------------------------------

### Mistake 6 --- Comparing sender names

Avoid:

``` js
chat.senderName === userName
```

Prefer:

``` js
chat.senderId === user._id
```

IDs are more reliable than names.

------------------------------------------------------------------------

# 20. Quick Setup Checklist for Next Project

``` text
BACKEND
[ ] npm install socket.io
[ ] create HTTP server using http.createServer(app)
[ ] initialize Socket.IO with that server
[ ] configure CORS
[ ] server.listen(PORT)
[ ] create connection handler
[ ] create joinChat event
[ ] create sendMessage event
[ ] create disconnect handler

FRONTEND
[ ] npm install socket.io-client
[ ] create socket.js
[ ] configure BASE_URL
[ ] create one socket connection
[ ] listen for connect
[ ] emit joinChat
[ ] listen for messageReceived
[ ] emit sendMessage
[ ] disconnect on cleanup

CHAT ROOM
[ ] create roomId using both user IDs
[ ] sort IDs
[ ] hash room ID if required
[ ] socket.join(hashedRoomId)
[ ] io.to(hashedRoomId).emit(...)

SECURITY
[ ] verify JWT in joinChat
[ ] compare authenticated ID with senderId
[ ] keep JWT_SECRET in .env
[ ] keep .env in .gitignore
```

------------------------------------------------------------------------

# Commands to Remember

``` bash
# Backend
npm install socket.io

# Frontend
npm install socket.io-client

# Start backend
npm start

# Start frontend
npm run dev
```
