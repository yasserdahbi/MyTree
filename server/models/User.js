import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
    status: { type: String, default: "pending" },
})

const UserModel = mongoose.model("User", UserSchema)

export {UserModel as User}