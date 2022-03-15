import { Router } from 'express';

//Routes
import UserRouter from './user';
import StatsRouter from './stats';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/user', UserRouter);
router.use('/stats', StatsRouter);

// Export the base-router
export default router;