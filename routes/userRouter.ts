import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const Users = require('../Models/Users');

const router = express.Router();
const secret_key = process.env.SECRET!;


async function hashPassword(password: string) {
    const saltRounds: number = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error(error);
    }
}

router.post("/login/", async (req: Request,res:Response) => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    try {
        const existing_user = await Users.findOne({email: email});
        if (existing_user) {
            bcrypt.compare(password, existing_user.password, (err, match) => {
                if (err) {throw err}
                if (match) {
                    
                    const jswToken = {
                        id: existing_user._id,
                        email: existing_user.email,
                    };
                    
                    jwt.sign(jswToken, String(secret_key), {
                        expiresIn: 120
                    }, (err, token) => {
                        if (err) {throw err}
                        else {
                            res.json({
                                success: true,
                                token: token
                            });
                        };
                    });

                } else {
                    res.send("No match");
                }
            }) 
        } else {
            return res.send("No user with this email");
        }
    } catch(err) {
        return res.status(403).send("Error in login");
    }
    
});

router.post("/register/",
    body("email")
        .isEmail()
        .withMessage("Invalid email address"),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[~`!@#$%^&*()-_+={}[\]|\\:;"'<>,./?]/)
        .withMessage('Password must contain at least one symbol (~`!@#$%^&*()-_+={}[]|\\;:"<>,./?)'),

    async (req: Request,res:Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const email: string = req.body.email;
        const password_plain: string = req.body.password;

        try {
            const existingUser = await Users.findOne({ email: email });
            if (existingUser) {
                return res.status(403).json({message:"Email taken"})
            }else{
                const hashed_password = await hashPassword(password_plain);
                const newUser = new Users({
                    email: email,
                    password: hashed_password
                })
                await newUser.save();
                res.status(200).json({message:'User created'});
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error processing request');
        }
}); 
    


export default router;