import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';

//Custom Imports
import UserLogic from './logic/user';
import WorkoutsLogic from './logic/workouts';
import Database from '../mongoUtil'; 

const router = Router();
const user = new UserLogic();
const workouts = new WorkoutsLogic();
dotenv.config();

const db: Database = Database.getInstance();

router.post('/login', (req: Request, res: Response) => {
    return user.login(req, res, db.usersCollection);
});

router.post('/getWorkouts', (req: Request, res: Response) => {
    return workouts.getWorkouts(req, res, db.workoutCollection);
});

router.post('/addWorkout', (req: Request, res: Response) => {
    return workouts.addWorkout(req, res, db.workoutCollection);
})

export default router;