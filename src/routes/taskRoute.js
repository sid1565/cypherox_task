import express from 'express';
import { createTask, getAllTask, updateTask, deleteTask } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/',function (req, res) {
        res.send("Hello all, project start ")}
    )
    
router.post('/create-task',authMiddleware, createTask);
router.get('/get-all-task',authMiddleware, getAllTask);
router.post('/update-task',authMiddleware, updateTask);
router.post('/delete-task',authMiddleware, deleteTask);

export default router;