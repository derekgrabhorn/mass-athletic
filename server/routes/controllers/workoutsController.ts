import express from 'express';
import { WorkoutsLogic } from '../logic/workoutsLogic';

const workoutsLogic = new WorkoutsLogic();

export class workoutsController {
    addWorkout = async (req: express.Request, res: express.Response, collection) => {
        try {
            const { body } = req;

            if (!body) {
                return res.status(400).json({ status: 'error', message: 'Workout data must be included.' });
            }

            const addResult = await workoutsLogic.addWorkout(collection, body);
            addResult ? res.status(200).json({ status: 'success' }) : res.status(400).json({ status: 'error', workouts: `Error saving workout.` });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 'error', workouts: `Error saving workout.` });
        } 
    }

    getWorkoutData = async (req: express.Request, res: express.Response, collection) => {
        try {
            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json({ status: 'error', message: 'Request requires user ID.' });
            }

            const dataRetrievalResult = await workoutsLogic.getWorkouts(collection, userId);
            dataRetrievalResult ? res.status(200).json(dataRetrievalResult) : res.status(400).json({ status: 'error', workouts: `Error retrieving workout data.` });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 'error', workouts: `Error retrieving workout data: ${err}` });
        }
    }
}

export default workoutsController;