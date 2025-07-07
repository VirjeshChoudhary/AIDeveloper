import { body } from "express-validator";
import { Router } from "express";
import * as userController from "../controllers/userControllers.js"
import {authUser} from "../middlewares/authMiddleware.js";

const router=Router();

router.post('/register',[body('email').isEmail().withMessage('Invalid'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
],userController.registerUser);

router.post('/login',[body('email').isEmail().withMessage('Invalid'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
],userController.loginUser);

router.get('/logout', userController.logoutUser);

router.get('/profile', authUser,userController.getUserProfile);

router.get('/all',authUser,userController.getAllUsers);




export default router;