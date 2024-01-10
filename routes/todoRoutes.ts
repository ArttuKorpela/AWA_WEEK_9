import express, { Request, Response } from 'express';
import Todos from "../Models/Todo";
import passport from 'passport';

const router = express.Router();

interface UserPayload {
    data: {
      id: string;
      email: string;
      iat: number;
      exp: number;
    };
};

router.post("/", passport.authenticate('jwt', { session: false }),
async (req: Request, res: Response) => {
    try {
        const user = req.user as UserPayload;
        const userId = user.data.id;
        const newItems: string[] = req.body.items;

        let existingUser = await Todos.findOne({ user: userId });
        if (existingUser) {
            existingUser.items.push(...newItems); 
            await existingUser.save();
        } else {
            const newUser = new Todos({ user: userId, items: newItems });
            await newUser.save();
        }
        res.status(200).send("Success");
    } catch (err) {
        res.status(500).send('Error processing your request');
    }
});

export default router;