import { register, userLogin, create_task, get_all_task, update_task, delete_task } from '../services/userservice.js';
import { success, errors } from '../controllers/responseController.js';
import joi from 'joi';

   export async function customer_register (req, res) {
        try {
            console.log("REQ++",req);
            console.log("REQ>BODY++",req.body);
            const registerSchema = joi.object({
                email: joi.string().email().required(),
                password: joi.string().min(4).required()
            })
            const {error} = registerSchema.validate(req.body);
            if(error) {
                return res.status(400).json({ message: error.details[0].message})
            }
            const data = await register(req.body);
            success(res, 'SIGNUP_SUCCESS', 'en', data);
        } catch (error) {
            console.log("Error:",error);
            errors(res, error.message, 'en');
        }
    }

   export async function login (req, res) {
        try {
            console.log("REQ++",req);
            console.log("REQ>BODY++",req.body);
            const loginSchema = joi.object({
                email: joi.string().email().required(),
                password: joi.string().min(4).required()
            })
            const {error} = loginSchema.validate(req.body);
            if(error) {
                return res.status(400).json({ message: error.details[0].message})
            }
            const data = await userLogin(req.body);
            success(res, 'LOGIN_SUCCESS', 'en', data);
        } catch (error) {
            console.log("Error:",error);
            errors(res, error.message, 'en');
        }
    }

    export async function createTask(req, res) {
        try {
            const taskSchema = joi.object({
                title: joi.string().required(),
                description: joi.string().required(),
                status: joi.string().required()
            })
            const {error} = taskSchema.validate(req.body);
            if(error) {
                return res.status(400).json({ message: error.details[0].message})
            }
            
            const user_id = req.user.userId;
            const data = await create_task(req.body, user_id);
            success(res, 'TASK_CREATED', 'en', data);
        } catch (error) {
            console.log("Error:",error);
            errors(res, error.message, 'en');
        }
    }
    
    export async function getAllTask(req, res) {
        try {
            const user_id = req.user.userId;
            const data = await get_all_task(user_id);
            success(res, 'GET_ALL_TASK', 'en', data);
        } catch (error) {
            console.log("Error:",error);
            errors(res, error.message, 'en');
        }
    }
    
    export async function updateTask(req, res) {
        try {
            const taskSchema = joi.object({
                task_id: joi.number().required(),
                title: joi.string().optional(),
                description: joi.string().optional(),
                status: joi.string().optional()
            })
            const {error} = taskSchema.validate(req.body);
            if(error) {
                return res.status(400).json({ message: error.details[0].message})
            }
            
            const user_id = req.user.userId;
            const data = await update_task(req.body, user_id);
            success(res, 'UPDATE_TASK', 'en', data);
        } catch (error) {
            console.log("Error:",error);
            errors(res, error.message, 'en');
        }
    }
    export async function deleteTask(req, res) {
        try {
            const taskSchema = joi.object({
                task_id: joi.number().required(),
            });

            const {error} = taskSchema.validate(req.body);
            if(error) {
                return res.status(400).json({ message: error.details[0].message})
            }
            const user_id = req.user.userId;
            const data = await delete_task(req.body, user_id);
            success(res, 'DELETE_TASK', 'en', data);
        } catch (error) {
            console.log("Error:",error);
            errors(res, error.message, 'en');
        }
    }
    