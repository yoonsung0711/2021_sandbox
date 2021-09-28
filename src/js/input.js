/* eslint-disable no-param-reassign */
const { MOD_TODO_CREATE, MOD_INPUT_LOADED } = require('./store/vo');
const { LOG, uid } = require('./util');
const { EventLogOf, ValidatorLogOf } = require('../js/store/middleware/log/log.util');

module.exports = (document, store) => new (class {
  todoForm;
  addButton;
  document;

  constructor() {
    this.document = document;
    this.todoForm = document.getElementById('todo-form');
    this.addButton = document.getElementById('add-button');
    this.setDefaultDate();
    this.listenToAddButton();
    store.dispatch(MOD_INPUT_LOADED);
  }

  // eslint-disable-next-line class-methods-use-this
  setDefaultDate(YYYY_MM_DD) {
    this.document.getElementById('todo-date').value = YYYY_MM_DD || new Date().toISOString().split('T')[0];
  }

  listenToAddButton() {
    this.addButton.addEventListener('click', (e) => {
      LOG("――――――――――――――――――――――――――――");
      LOG(EventLogOf({ sender:'U/I', subject:'CREATE', message:'BTN_CLICKED'}));
      e.preventDefault();
      const formInput = this.getTodoFormData(e);
      if (this.validateTodoFormInput(formInput)) {
          console.error('input all entries!');
      } else {
          // mediator.createTodoItem(formInput);
          MOD_TODO_CREATE.document = { ...formInput, id: uid() };
          store.dispatch(MOD_TODO_CREATE);
          this.todoForm.reset();
          this.setDefaultDate();
      }
    }, true);

    this.todoForm.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        LOG('――――――――――――――――――――――――――――');
        LOG(EventLogOf({ sender:'U/I', subject: 'CREATE', message: 'ENTER_KEYDOWN'}));
        const formInput = this.getTodoFormData(e);
        if (this.validateTodoFormInput(formInput)) {
            console.error('input all entries!');
        } else {
            MOD_TODO_CREATE.document = { ...formInput, id: uid() };
            store.dispatch(MOD_TODO_CREATE);
            this.todoForm.reset();
            this.setDefaultDate();
        }
      }
    }, true);
  }

  getTodoFormData() {
    const formData = new FormData(this.todoForm);
    return Array.from(formData.entries()).reduce((acc, [key, val]) => {
      const prop = { [`${key}`]: val };
      return { ...acc, ...prop };
    }, {});
  }

  validateTodoFormInput(formInput) {
    const isInValidate = formInput.date === '' || formInput.name === '';
    LOG(`${isInValidate 
      ? ValidatorLogOf({ sender: 'VLD', subject:'(WARN)', message: 'INVALIDATE FORM' }) 
      : ValidatorLogOf({ sender: 'VLD', subject: 'FORM', message: 'VALIDATED'})}`);
    return isInValidate;
  }
})();
