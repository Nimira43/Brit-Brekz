import apiClient from '../utils/apiClient'

class KanbanBoardApi {
  constructor() {

  }

  createNewTest(newTask) {
    return apiClient.push('/tasks', newTask)
  }
}

export default new KanbanBoardApi()