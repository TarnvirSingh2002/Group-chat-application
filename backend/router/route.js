import express from "express"
import { authenti } from "../controllers/auth.js";
import bcrypt from"bcrypt"
import jwt from "jsonwebtoken";
import middle from "../middle.js";
import { message } from "../controllers/message.js";

const router=express.Router();

const secretKey="Tarnvir";

// under
import { Server } from 'socket.io';
import{createServer} from "http";
const app = express();
const server = createServer(app);
const io = new Server(server);


router.post('/sith', async (req, res) => {
    try {
        const { name, email, password} = req.body;
        if (!password || !email || !name){
            return res.status(400).send("Fill the full form!");
        }
        const use= await authenti.findOne({email});
        if(use){
            res.status(409).send("please log in");
        }
        const passkey=await bcrypt.hash(password,5);
        await authenti.create({name, email, passcode:passkey});
        res.status(200).send("Successfully registered");

    } catch (error) {
        console.log(error)
        res.status(500).send("An error occurred while processing your request.");
    }
});


router.post('/log', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Fill the full form!");
        }

        const user = await authenti.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.passcode);
        if (!isMatch) {
            return res.status(409).send("Password does not match!");
        }

        const payload={userId:user._id};
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        res.status(200).send({token});

    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while processing your request.");
    }
});

router.post('/message',middle,async(req,res)=>{
    try {
        const {mess} = req.body;
        const {userr}=req;
        if(!mess){
            return res.status(400).send("send something");
        }
        const newMessage=await message.create({link:userr.userId,mess});
        io.emit('newMessage', newMessage);//here i doubt
        res.status(200).send("success");
        
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while processing your request.");
    }
});

router.get("/allmessage",async(req,res)=>{
    try {
        const a=await message.find();

        io.on('connection', async (socket) => { // Listen for a connection event
            console.log('a user connected');
            
            // Send all messages to the new client when they connect
            const messages = await message.find();
            socket.emit('allMessages', messages); // Emit all messages to the client using 'allMessages' event
        
            // Handle disconnection
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });

        res.send(a);
        
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while processing your request.");
    }
})

export default router


