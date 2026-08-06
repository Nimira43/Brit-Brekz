import apiClient from '../utils/apiClient'

class KanbanBoardApi {
  constructor() {

  }

  createNewTask(newTask) {
    return apiClient.post('/tasks', newTask)
  }

  getAllTasks() {
    return apiClient.get('/tasks')
  }
}

export default new KanbanBoardApi()