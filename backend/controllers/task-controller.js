import * as TaskService from '../services/task-service.js'

export const getAllTasks = async (req, res) => {
  return TaskService.getAllTasks(req, res)
}

export const createTask = async (req, res) => {
  return TaskService.createTask(req, res)
}

export const deleteTask = async (req, res) => {
  return TaskService.deleteTask(req, res)
}

export const updateTask = async (req, res) => {
  return TaskService.updateTask(req, res)
}
