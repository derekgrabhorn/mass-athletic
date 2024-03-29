import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';

//Custom Imports
import { Statistics } from './logic/stats';
import Database from '../mongoUtil'; 

const router = Router();
const stats = new Statistics();
dotenv.config();

const db: Database = Database.getInstance();

router.post('/getAll', (req: Request, res: Response) => {
    return stats.getAll(req, res, db.workoutCollection, db.muscleGroupsCollection, db.musclesCollection);
});

router.post('/getExercises', (req: Request, res: Response) => {
    return stats.getExercises(req, res, db.exercisesCollection);
});

export default router;