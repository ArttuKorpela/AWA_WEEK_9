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
        res.status(200).json({message:"success"});
    } catch (err) {
        res.status(500).json({message:"Error processing your request"});
    }
});

router.get("/all", passport.authenticate('jwt', {session: false}),
async (req: Request, res: Response) => {
    try {
        const user = req.user as UserPayload;
        const userId = user.data.id;
        let existingUser = await Todos.findOne({ user: userId });

        if (!existingUser) {res.json({success: false, items: null})}
        else {
            res.json({success: true, items: existingUser.items})
        }
    } catch (err) {
        res.status(500).send('Error processing your request')
    }
}
)

export default router;