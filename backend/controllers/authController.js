import mongoose from "mongoose";
import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";

const register = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(String(password), salt);
        const admin = await Admin.create({
            name,
            email, 
            password: hashedPass
        });
        res.status(201).json({
            message: "New admin registered successfully",
            admin
        });
    } catch (error) {
        console.error("Error in register controller: ", error);
        res.status(400).json({error: "Failed to register user"});
    }
}
export { register };