import mongoose from "mongoose";

export const db = () =>{
    mongoose.connect("mongodb://localhost:27017/liberal").then(()=>{
        console.log("successfully connected");
    }).catch(()=>{
        console.log("not connected");
    })
}
