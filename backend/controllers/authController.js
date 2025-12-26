import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

const createAdmin = async (req, res) => {
    try {
        if (req.user.role !== 'super-admin') 
            return res.status(403).json({ error: "Access denied" });
        const { name, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing)
            return res.status(400).json({ error: "Admin already exists" });
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(String(password), salt);
        const admin = await User.create({
            name,
            email,
            password: hashedPass,
            role: "admin"
        });

        res.status(201).json({
            message: "Admin created",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });
    } catch (error) {
        console.error("Error in create admin: ", error);
        res.status(500).json({ error: "Failed to create admin" });
    }
};

const register = async(req, res) => {
    try {
        const { name, email, password, audienceType, batchYear, companyName} = req.body;
        const role = 'user';
        const existing = await User.findOne({email});
        if(existing)
            return res.status(400).json({error: "User already exists"});
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(String(password), salt);
        const user = await User.create({
            name,
            email, 
            password: hashedPass,
            role,
            audienceType,
            batchYear,
            companyName
        });
        const accessToken = generateAccessToken(user._id, user.role, user.audienceType);
        const refreshToken = generateRefreshToken(user._id, user.role, user.audienceType);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "Strict",
            maxAge: 7*24*60*60*1000 //1 week
        });

        res.status(201).json({
            message: "User registered successfully",
            token: accessToken,
            userInfo: {
                name,
                email, 
                role,
                audienceType
            }
        });
    } catch (error) {
        console.error("Error in register controller: ", error);

        if(error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({error: messages});
        }
        res.status(500).json({error: "Failed to register user"});
    }
}

const login = async(req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) 
            return res.status(400).json({ message: "Invalid email or password"});
        
        const pass_check = await bcrypt.compare(password, user.password);
        if(!pass_check)
            return res.status(400).json({ message: "Invalid email or password"});
        
        const accessToken = generateAccessToken(user._id, user.role, user.audienceType);
        const refreshToken = generateRefreshToken(user._id, user.role, user.audienceType);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "Strict",
            maxAge: 7*24*60*60*1000 //1 week
        })

        res.status(200).json({
            message: "Login successful",
            token: accessToken,
            userInfo: {
                name: user.name,
                email: user.email,
                role: user.role,
                audienceType: user.audienceType
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
        res.status(500).json({error: "Internal server error"});
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
        const user = await User.findById(decoded.id);
        if(!user)
            return res.status(401).json({error: "Unauthorized"});
        const accessToken = generateAccessToken(user._id, user.role, user.audienceType);
        res.status(200).json({
            message: "New access token generated",
            token: accessToken,
            userInfo: {
                name: user.name,
                role: user.role,
                audienceType: user.audienceType
            }
        });
    } catch (error) {
        console.error("Error in refreshAccessToken: ", error);
        res.status(500).json({error: "Internal server error"});
    }
}

const readUsers = async(req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            message: "Users fetched",
            users
        });
    } catch (error) {
        console.error("Error in read users: ", error);
        res.status(500).json({error: "Internal server error"});
    }
}
const deleteAll = async (req, res) => {
    try {
        const deleted = await User.deleteMany({});
        if(!deleted)
            return res.status(400).json({error: "Couldnt delete all"});
        return res.status(200).json({message: "deleted all users"});
    } catch (error) {
        console.error("Error in deleteAll: ", error);
        res.status(500).json({error: "Internal server error"});
    }
}

const deleteById = async(req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(400).json({error: "User not found"});
        }
        const deleted = await User.findByIdAndDelete(userId);
        if(!deleted)
            return res.status(400).json({error: "Couldnt delete all"});
        return res.status(200).json({message: `deleted user: ${user.name}` });        
    } catch (error) {
        console.error("Error in delete one: ", error);
        res.status(500).json({error: "Internal server error"});
    }
};

export { 
    register, 
    login,
    logout,
    refreshAccessToken,
    readUsers,
    deleteAll,
    deleteById,
    createAdmin
};