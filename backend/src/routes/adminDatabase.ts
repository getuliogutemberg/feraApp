import { Router } from 'express';
import adminDatabaseController from '../controllers/adminDatabaseController';

const router = Router();

router.post('/test', adminDatabaseController.testConnection);
router.post('/tables', adminDatabaseController.listTables);

export default router; 