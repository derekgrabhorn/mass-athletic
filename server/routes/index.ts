import { Router, Response, Request } from 'express';

// Init router and path
const router = Router();

router.options('*');

router.get('/', (req: Request, res: Response) => {

});

// Export the base-router
export default router;