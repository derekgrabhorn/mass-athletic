import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';

//Custom Imports
import userController from './controllers/userController';
import workoutsController from './controllers/workoutsController';
import Database from '../mongoUtil'; 

const router = Router();
const user = new userController();
const workouts = new workoutsController();
dotenv.config();

const db: Database = Database.getInstance();

router.post('/login', (req: Request, res: Response) => {
    return user.login(req, res, db.usersCollection);
});

router.post('/create', (req: Request, res: Response) => {
    return user.createUser(req, res, db.usersCollection);
});

router.post('/getProfile', (req: Request, res: Response) => {
    return user.getUserData(req, res, db.usersCollection);
});

router.post('/getWorkouts', (req: Request, res: Response) => {
    return workouts.getWorkoutData(req, res, db.workoutCollection);
});

router.post('/addWorkout', (req: Request, res: Response) => {
    return workouts.addWorkout(req, res, db.workoutCollection);
});

router.post('/saveExercise', (req: Request, res: Response) => {
    console.log('in /saveExercise');
    return user.saveExercise(req, res, db.exercisesCollection);
});

export default router;