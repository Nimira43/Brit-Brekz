import apiClient from '../utils/apiClient'

class KanbanBoardApi {
  constructor() {

  }

  createNewTask(newTask) {
    return apiClient.post('/tasks', newTask)
  }
}

export default new KanbanBoardApi()