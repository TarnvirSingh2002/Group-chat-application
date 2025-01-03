import express from "express";
import { db } from "./db.js";
import cors from "cors";
import router from "./router/route.js";
import cloudinary from "cloudinary"
import env from "dotenv";
env.config();

import { Server } from 'socket.io';
import { createServer } from "http";
import fileUpload from "express-fileupload";
const app = express();
const server = createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors());

app.use(express.json());

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));


cloudinary.v2.config({
    cloud_name:process.env.CLOUD_NAME ,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

app.use('/api/use', router);

db();
server.listen(5000, () => {
    console.log("successfully registed at port 5000!");
})
