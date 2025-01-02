import express from "express"
import { authenti } from "../controllers/auth.js";
import bcrypt from"bcrypt"
import jwt from "jsonwebtoken";
import middle from "../middle.js";
import { message } from "../controllers/message.js";
import { io } from "../index.js"

const router=express.Router();

const secretKey="Tarnvir";


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
        const token = jwt.sign(payload, secretKey);
        res.status(200).send({token,userId:user._id});

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
        io.emit('newMessage', newMessage);
        res.status(200).send({message:"success",userid:userr.userId});
        
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while processing your request.");
    }
});

router.get("/allmessage",async(req,res)=>{
    try {     
        const a= await message.find();
        res.send(a);
        
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while processing your request.");
    }
})

router.get("/findName/:id",async(req,res)=>{   
    try {   
        const { id } = req.params; 
        if (!id) {
            return res.status(400).send({message:"Link parameter is required."});
        } 
        const a= await authenti.findById(id);
        res.send(a);
        
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while processing your request.");
    }
})

export default router