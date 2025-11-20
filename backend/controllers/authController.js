import mongoose from "mongoose";
import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

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

const login = async(req, res) => {
    const {email, password} = req.body;
    try {
        const admin = await Admin.findOne({email});
        if(!admin) 
            return res.status(400).json({ message: "Invalid email or password"});
        
        const pass_check = await bcrypt.compare(password, admin.password);
        if(!pass_check)
            return res.status(400).json({ message: "Invalid email or password"});
        
        const accessToken = generateAccessToken(admin._id);
        const refreshToken = generateRefreshToken(admin._id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "Strict",
            maxAge: 7*24*60*60*1000 //1 week
        })

        res.status(200).json({
            message: "Login successful",
            token: accessToken,
            adminInfo: {
                name: admin.name,
                email: admin.email
            }
        });
    } catch (error) {
        console.error("Error in login controller: ", error);
        res.status(500).json({error: "Internal server error"});
    }
}
export { 
    register, 
    login
};
