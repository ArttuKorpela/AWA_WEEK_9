import express, { Express, Request, Response } from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import userRoutes from './routes/userRouter';
import todoRoutes from './routes/todoRoutes';
import path from 'path';


dotenv.config();
const secret_key = process.env.SECRET!;
if (!secret_key) {
    console.error("Fatal Error: SECRET is not set in .env file.");
    process.exit(1); 
}

const passport_options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET
}

passport.use(new JwtStrategy(passport_options, (jwt_payload, done) => {
    return done(null,{data: jwt_payload});
}))

interface UserPayload {
    data: {
      id: string;
      email: string;
      iat: number;
      exp: number;
    };
};

const mongoDB: string = "mongodb://127.0.0.1:27017/testdb";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('open', () => {
    console.log('Connected to MongoDB');
});

const app: Express = express();
const port: number = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



app.get('/api/private', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user = req.user as UserPayload;
    if (user) {
        res.json( {success: true, email: user.data.email});
    } else {
        res.json({succuess: false});
    }
});

app.get("/register.html", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/views', 'register.html'));

});

app.get("/login.html", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/views', 'login.html'));

});

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname,"../public/views", 'index.html'));

});
app.use('/api/user', userRoutes);
app.use('/api/todos', todoRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})
