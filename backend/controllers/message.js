import mongoose from "mongoose";
const { Schema } = mongoose;

const user = new Schema({
    link:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'authenti',
    },
    mess: {
        type: String,
        required: true
    },
});
export const message = mongoose.model("message", user);