import KanbanBoardApi from '../../services/KanbanBoardApi.js'
import Swal from 'sweetalert2'
import { COLUMN_STATUS } from '../../utils/constants.js'

class Dashboard {
  constructor() {
    this.todoList = document.querySelector('#todoList')
    this.inProgressList = document.querySelector('#inProgressList')
    this.doneList = document.querySelector('#doneList')
    this.listColumns = document.querySelectorAll('.drag-item-list')
    this.createForm = document.querySelector('#newTaskForm')
    this.taskList = []
    this.getAllTasksFromApi()
  }

  addCreateFormSubmitEventListener() {
    this.createForm.addEventListener(
      'submit',
      this.onSubmitCreateForm.bind(this)
    ) 
  }

  async onSubmitCreateForm(event) {
    console.log('onSubmitCreateForm called on the create task modal submit event.')
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
      this.createForm.status.value = 'TO_DO'}
    
    const task = {
      taskSummary: this.createForm.taskSummary.value,
      acceptanceCriteria: this.createForm.acceptanceCriteria.value,
      status: this.createForm.status.value
    }

    try {
      await KanbanBoardApi.createNewTask(task)
      await this.getAllTasksFromApi()
      this.clearFieldsAfterSubmit()
    } catch (error) {
      console.log(error)
    }
  }

  clearFieldsAfterSubmit() {
    (this.createForm.taskSummary.value = ''),
    (this.createForm.acceptanceCriteria.value = ''),
    (this.createForm.status.value = '')
  }

  async getAllTasksFromApi() {
    try {
      const res = await KanbanBoardApi.getAllTasks()
      this.taskList = res.data.data
    } catch (error) {
      console.log(error)
    }
    this.render()
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
            <button class='btn main-btn'>
              Delete
            </button>
          </div>
        </div>
      </li>   
    `
    return taskHTML
  }

  createTaskList = () => {
    let columns = [
      {
        status: COLUMN_STATUS.TO_DO_STATUS,
        tag: this.todoList
      },
      {
        status: COLUMN_STATUS.IN_PROGRESS_STATUS,
        tag: this.inProgressList
      },
      {
        status: COLUMN_STATUS.DONE_STATUS,
        tag: this.doneList
      },
    ]

    columns.forEach(item => {
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

  render() {
    this.createTaskList()
    this.addCreateFormSubmitEventListener()
  }
}

export default Dashboard