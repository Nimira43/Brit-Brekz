import KanbanBoardApi from '../../services/KanbanBoardApi.js'
import Swal from 'sweetalert2'

class Dashboard {
  constructor() {
    this.createForm = document.querySelector('#newTaskForm')
    this.render()
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

  render() {
    this.addCreateFormSubmitEventListener()
  }
}

export default Dashboard