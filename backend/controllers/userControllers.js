import * as userService from '../services/userService.js';
import { validationResult } from 'express-validator';
import User from '../models/user.model.js';
import redisClient from '../services/redisService.js';

export const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user=await userService.createUser({email, password});
        if (!user) {
            return res.status(400).json({ message: 'User registration failed' });
        }
        const token = user.generateAuthToken();
        delete user._doc.password; // Remove password from user object before sending response
        res.status(201).cookie('token',token).json({user, token});
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error register' });
    }
}

export const loginUser=async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        const user=await User.findOne({email}).select('+password');
        if(!user){
            return res.status(404).json({ message: "User does not exist, please register first" });
        }
        const isMatch = await user.comparePassword(password);
        if (!user || !isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = user.generateAuthToken();
        delete user._doc.password;
        res.status(200).cookie('token',token).json({user, token});  // cokie ko expiry de skat waise yeh htt jayyega token expiry hote he
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error login' });
    }
}

export const logoutUser = (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        redisClient.set(token,'logout', 'EX', 60 * 60 * 24);
        res.clearCookie('token').status(200).json({ message: 'Logged out successfully' });
        // res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error logout' });
        
    }
}

export const getUserProfile=async (req,res) => {
    return res.status(200).json({user: req.user});
}

export const getAllUsers=async(req,res)=>{
    try {
        const userId=req.user._id;
        const users=await userService.getAllUsers({userId});
        res.status(200).json({users:users});
    } catch (error) {
        console.log(error);
        res.status(400).json({error:error.message});
    }
}
