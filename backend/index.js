import express from "express";
import { db } from "./db.js";
import cors from "cors";
import router from "./router/route.js";

import { Server } from 'socket.io';
import { createServer } from "http";
const app = express();
const server = createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors());
app.use(express.json());

app.use('/api/use', router);

db();
server.listen(5000, () => {
    console.log("successfully registed at port 5000!");
})
