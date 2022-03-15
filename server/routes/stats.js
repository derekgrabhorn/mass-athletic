import { Router, Response, Request } from 'express';

import { Statistics } from './logic/stats';

const router = Router();
const stats = new Statistics();

router.get('/getAll', (req, res) => {
    
})