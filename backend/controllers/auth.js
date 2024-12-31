import mongoose from "mongoose";
const { Schema } = mongoose;

const user = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    passcode: {
        type: String,
        required: true
    },
});
export const authenti = mongoose.model("authenti", user);