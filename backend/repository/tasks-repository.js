import Task from '../models/task-model.js'

class TaskRepository {
  async createTask(data) {
    const task = new Task({
      taskSummary: data.taskSummary,
      acceptanceCriteria: data.acceptanceCriteria,
      status: data.status,
      // hierarchy: currentTaskListLength + 1,
      userId: data.userId,
    })

    return await task.save()
  }

  async getAllTasks(query) {
    return await Task.find(query)
  }

  async deleteTask(id, userId) {
    return await Task.findOneAndDelete({ _id: id, userId })
  }
}

export default new TaskRepository()