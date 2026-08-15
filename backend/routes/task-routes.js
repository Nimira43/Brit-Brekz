import express from 'express'
import * as TaskController from '../controllers/task-controller.js'
import authCheck from '../middleware/auth-middleware.js'
import * as TaskValidation from '../validations/task-validation.js'

const router = express.Router()

router.get('/', authCheck, TaskController.getAllTasks)

router.post(
  '/',
  authCheck,
  TaskValidation.createTask,
  TaskController.createTask
)

router.put(
  '/:id',
  authCheck,
  TaskValidation.updateTask,
  TaskController.updateTask
)

router.delete('/:id', authCheck, TaskController.deleteTask)

export default router