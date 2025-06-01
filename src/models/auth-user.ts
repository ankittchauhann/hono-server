import mongoose from "mongoose";

const authUserSchema = new mongoose.Schema({}, { strict: false });

const AuthUsers = mongoose.model("AuthUsers", authUserSchema, "user");

export default AuthUsers;
