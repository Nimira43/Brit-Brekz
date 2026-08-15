import tasksRepository from '../repository/tasks-repository.js'

export const createTask = async (req, res) => {
  const currentUser = req.user

  if (!currentUser) {
    return res.status(401).json('Unauthorised - Task Service Layer.')
  }

  if (!req.body.status) {
    req.body.status = 'TO_DO'
  }

  try {
    const newSavedTask = await tasksRepository.createTask({
      ...req.body,
      userId: currentUser._id,
    })

    return res.status(201).json(newSavedTask)
  } catch (error) {
    console.log(error)
    return res.status(500).json('Something went wrong.')
  }
}

export const getAllTasks = async (req, res) => {
  const currentUser = req.user

  if (!currentUser) {
    return res.status(401).json('Unauthorised - Task Service Layer.')
  }

  try {
    const tasks = await tasksRepository.getAllTasks({
      userId: currentUser._id
    })
    return res.status(200).json({ data: tasks })
  } catch (error) {
    console.log(error)
    return res.status(500).json('Something went wrong.')
  }
}

export const deleteTask = async (req, res) => {
  const currentUser = req.user

  if (!currentUser) {
    return res.status(401).json('Unauthorised - Task Service Layer.')
  }

  try {
    await tasksRepository.deleteTask(req.params.id, currentUser._id)

    return res.status(200).json('Task deleted.')
  } catch (error) {
    console.log(error)
    return res.status(500).json('Something went wrong.')
  }
}

export const updateTask = async (req, res) => {
  const currentUser = req.user

  if (!currentUser) {
    return res.status(401).json('Unauthorised - Task Service Layer.')
  }

  const { taskSummary, acceptanceCriteria, status } = req.body

  try {
    const updatedTask = await tasksRepository.updateTask(
      req.params.id,
      currentUser._id,
      { taskSummary, acceptanceCriteria, status }
    )

    if (!updatedTask) {
      return res.status(404).json('Task not found.')
    }

    return res.status(200).json(updatedTask)
  } catch (error) {
    console.log(error)
    return res.status(500).json('Something went wrong.')
  }
}