import apiClient from '../utils/apiClient.js'

class KanbanBoardApi {
  constructor() {

  }

  createNewTask(newTask) {
    return apiClient.post('/tasks', newTask)
  }

  getAllTasks() {
    return apiClient.get('/tasks')
  }

  updateTask(id, updates) {
    return apiClient.put(`/tasks/${id}`, updates)
  }

  deleteTask(id) {
    return apiClient.delete(`/tasks/${id}`)
  }
}

export default new KanbanBoardApi()