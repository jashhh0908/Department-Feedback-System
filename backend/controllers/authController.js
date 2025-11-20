import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

const register = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(String(password), salt);
        const user = await User.create({
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
        const user = await User.findOne({email});
        if(!user) 
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

const logout = async(req, res) => {
    try {
        res.clearCookie("refreshToken");
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.error("Error in logout: ", error);
        res.status(400).json({error: "Internal server error"});
    }
}

const refreshAccessToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken)
            return res.status(401).json({error: "Unauthorized"});

        console.log('Token:', refreshToken);
        console.log('Secret:', process.env.JWT_REFRESH_SECRET);
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const admin = await Admin.findById(decoded.id);
        if(!admin)
            return res.status(401).json({error: "Unauthorized"});
        const accessToken = generateAccessToken(admin._id);
        res.status(200).json({
            message: "New access token generated",
            token: accessToken});
    } catch (error) {
        console.error("Error in refreshAccessToken: ", error);
        res.status(400).json({error: "Internal server error"});
    }
}
export { 
    register, 
    login,
    logout,
    refreshAccessToken
};
