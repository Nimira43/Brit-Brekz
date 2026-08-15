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

  async updateTask(id, userId, data) {
    return await Task.findOneAndUpdate(
      { _id: id, userId },
      { $set: data },
      { new: true }
    )
  }
}

export default new TaskRepository()