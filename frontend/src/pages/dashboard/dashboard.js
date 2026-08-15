import KanbanBoardApi from '../../services/KanbanBoardApi.js'
import Swal from 'sweetalert2'
import { COLUMN_STATUS } from '../../utils/constants.js'

class Dashboard {
  constructor() {
    this.todoList = document.querySelector('#todoList')
    this.inProgressList = document.querySelector('#inProgressList')
    this.doneList = document.querySelector('#doneList')
    this.kanbanBoard = document.querySelector('#kanban-board')
    this.createForm = document.querySelector('#newTaskForm')
    this.updateForm = document.querySelector('#updateForm')
    this.taskList = []

    this.dropZones = [
      { status: COLUMN_STATUS.TO_DO_STATUS, tag: this.todoList },
      { status: COLUMN_STATUS.IN_PROGRESS_STATUS, tag: this.inProgressList },
      { status: COLUMN_STATUS.DONE_STATUS, tag: this.doneList },
    ]

    this.addCreateFormSubmitEventListener()
    this.addUpdateFormSubmitEventListener()
    this.addBoardEventListeners()

    this.getAllTasksFromApi()
  }

  addCreateFormSubmitEventListener() {
    this.createForm.addEventListener(
      'submit',
      this.onSubmitCreateForm.bind(this)
    )
  }

  addUpdateFormSubmitEventListener() {
    this.updateForm.addEventListener(
      'submit',
      this.onSubmitUpdateForm.bind(this)
    )
  }

  addBoardEventListeners() {
    this.kanbanBoard.addEventListener('click', this.onBoardClick.bind(this))
    this.kanbanBoard.addEventListener('dragstart', this.onDragStart.bind(this))

    this.dropZones.forEach((zone) => {
      zone.tag.addEventListener('dragover', this.onDragOver.bind(this))
      zone.tag.addEventListener('dragleave', this.onDragLeave.bind(this))
      zone.tag.addEventListener('drop', (event) => this.onDrop(event, zone.status))
    })
  }

  async onSubmitCreateForm(event) {
    event.preventDefault()
    event.stopImmediatePropagation()

    if (!this.createForm.taskSummary.value) {
      Swal.fire({
        icon: 'error',
        title: 'Alert!',
        text: 'Task Summary is a required field.',
        customClass: { confirmButton: 'main-btn' }
      })
      return
    }

    if (this.createForm.status.value === '') {
      this.createForm.status.value = 'TO_DO'
    }

    const task = {
      taskSummary: this.createForm.taskSummary.value,
      acceptanceCriteria: this.createForm.acceptanceCriteria.value,
      status: this.createForm.status.value
    }

    try {
      await KanbanBoardApi.createNewTask(task)
      await this.getAllTasksFromApi()
      this.clearCreateFormAfterSubmit()
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unable to create task.',
        customClass: { confirmButton: 'main-btn' }
      })
    }
  }

  clearCreateFormAfterSubmit() {
    this.createForm.taskSummary.value = ''
    this.createForm.acceptanceCriteria.value = ''
    this.createForm.status.value = ''
  }

  populateUpdateForm(taskId) {
    const task = this.taskList.find((item) => item._id === taskId)
    if (!task) return

    this.updateForm._id.value = task._id
    this.updateForm.taskSummary.value = task.taskSummary
    this.updateForm.acceptanceCriteria.value = task.acceptanceCriteria || ''
    this.updateForm.status.value = task.status
  }

  async onSubmitUpdateForm(event) {
    event.preventDefault()
    event.stopImmediatePropagation()

    const taskId = this.updateForm._id.value

    if (!this.updateForm.taskSummary.value) {
      Swal.fire({
        icon: 'error',
        title: 'Alert!',
        text: 'Task Summary is a required field.',
        customClass: { confirmButton: 'main-btn' }
      })
      return
    }

    const updates = {
      taskSummary: this.updateForm.taskSummary.value,
      acceptanceCriteria: this.updateForm.acceptanceCriteria.value,
      status: this.updateForm.status.value
    }

    try {
      await KanbanBoardApi.updateTask(taskId, updates)
      await this.getAllTasksFromApi()
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unable to update task.',
        customClass: { confirmButton: 'main-btn' }
      })
    }
  }

  async onDeleteTask(taskId) {
    if (!taskId) return

    const confirmResult = await Swal.fire({
      icon: 'warning',
      title: 'Delete this task?',
      text: 'This cannot be undone.',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      customClass: { confirmButton: 'main-btn' }
    })

    if (!confirmResult.isConfirmed) return

    try {
      await KanbanBoardApi.deleteTask(taskId)
      await this.getAllTasksFromApi()
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unable to delete task.',
        customClass: { confirmButton: 'main-btn' }
      })
    }
  }

  onBoardClick(event) {
    const deleteButton = event.target.closest('.delete-button')
    if (deleteButton) {
      event.preventDefault()
      const cardBody = deleteButton.closest('.card-body')
      this.onDeleteTask(cardBody?.dataset.id)
      return
    }

    const viewButton = event.target.closest('.view-button')
    if (viewButton) {
      event.preventDefault()
      const cardBody = viewButton.closest('.card-body')
      this.populateUpdateForm(cardBody?.dataset.id)
    }
  }

  onDragStart(event) {
    const item = event.target.closest('.draggableItem')
    if (!item) return

    const cardBody = item.querySelector('.card-body')
    const taskId = cardBody?.dataset.id

    if (taskId) {
      event.dataTransfer.setData('text/plain', taskId)
      event.dataTransfer.effectAllowed = 'move'
    }
  }

  onDragOver(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    event.currentTarget.classList.add('drag-over-active')
  }

  onDragLeave(event) {
    event.currentTarget.classList.remove('drag-over-active')
  }

  async onDrop(event, newStatus) {
    event.preventDefault()
    event.currentTarget.classList.remove('drag-over-active')

    const taskId = event.dataTransfer.getData('text/plain')
    if (!taskId) return

    const task = this.taskList.find((item) => item._id === taskId)
    if (!task || task.status === newStatus) return

    try {
      await KanbanBoardApi.updateTask(taskId, { status: newStatus })
      await this.getAllTasksFromApi()
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unable to move task.',
        customClass: { confirmButton: 'main-btn' }
      })
    }
  }

  async getAllTasksFromApi() {
    try {
      const res = await KanbanBoardApi.getAllTasks()
      this.taskList = res.data.data
    } catch (error) {
      console.log(error)
    }
    this.createTaskList()
  }

  createTaskCard = (task) => {
    const taskHTML = `
      <li
        draggable='true'
        class='draggableItem'
      >
        <div class='card project-task'>
          <h5 class='card-header'>
            Task ID: ${task._id}
          </h5>
          <div
            class='card-body'
            data-id='${task._id}'
          >
            <h5 class='card-title'>
              ${task.taskSummary}
            </h5>
            <a 
              href='' 
              type='button'
              class='btn main-btn view-button'
              data-bs-toggle='modal'
              data-bs-target='#viewUpdateTaskModal'
            >
              View / Update
            </a>
            <button class='btn main-btn delete-button'>
              Delete
            </button>
          </div>
        </div>
      </li>   
    `
    return taskHTML
  }

  createTaskList = () => {
    this.dropZones.forEach(item => {
      let sortedListItemByHierarchy = this.taskList
        .filter((el) => el.status === item.status)

      if (item?.tag) {
        item.tag.innerHTML = sortedListItemByHierarchy
          .map((task) => {
            const taskHTML = this.createTaskCard(task)
            return taskHTML
          })
          .join('')
      }
    })
  }
}

export default Dashboard