import express from 'express';
import { UserLogic } from '../logic/userLogic';
import { ExerciseLogic } from '../logic/exerciseLogic';

const userLogic = new UserLogic();
const exerciseLogic = new ExerciseLogic();

export class userController {
    login = async (req: express.Request, res: express.Response, collection) => {
        try {
            const { username, password } = req.body;
    
            if (!username || !password) {
                return res.status(400).json({ status: 'error', message: 'Username and password are required.' });
            }
    
            const loginResult = await userLogic.login(username, password, collection)
            return loginResult === false ? res.status(400).json({ status: 'error', message: 'Username/password incorrect.' }) : res.status(200).json(loginResult);

        } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 'error', message: `Error logging in: ${err}` });
        }
    }

    createUser = async (req: express.Request, res: express.Response, collection) => {
        try {
            const { username, password } = req.body;
    
            if (!username || !password) {
                return res.status(400).json({ status: 'error', message: 'Username and password are required.' });
            }
    
            const userExists = await userLogic.doesUserExist(username, collection);
            if (userExists) {
                return res.status(400).json({ status: 'error', message: 'User already exists.' });
            }
    
            const userId = await userLogic.create(username, password, collection);
            return res.status(200).json({ status: 'success', userId: userId });
    
        } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 'error', message: `Error creating user: ${err}` });
        }
    };

    getUserData = async (req: express.Request, res: express.Response, collection) => {
        try {
            const { userId } = req.body;

            const userData: any = await userLogic.getUserData(userId, collection);
            if (userData) {
                return res.status(200).json(userData);
            } else {
                return res.status(500).json({ status: 'error', message: 'Failed to retrieve user data.' });
            }
            
        } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 'error', message: `Error retrieving user data: ${err}` });
        }
    }

    saveExercise = async (req: express.Request, res: express.Response, collection) => {
        try {
            const savedExercise = await exerciseLogic.saveExercise(collection, req.body);
            if (savedExercise) {
                return res.status(200).json({ status: 'success', message: 'Exercise saved.'})
            } else {
                return res.status(500).json({ status: 'error', message: 'Error saving exercise.'})
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 'error', message: `Error saving exercise: ${err}` });
        }
    }
}

export default userController;
