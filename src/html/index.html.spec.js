const fs = require('fs')
const path = require('path')
const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8')

describe('HTML', function () {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    })

    afterEach(() => {
        jest.resetModules();
    })

    it('#todo-form is a HTMLForm Element', function () {
        const todoForm = document.getElementById('todo-form');
        expect(todoForm instanceof HTMLFormElement).toBeTruthy();
    })

    it('#todo-date is a HTMLInput Element with type date', function () {
        const todoDate = document.getElementById('todo-date');
        expect(todoDate instanceof HTMLInputElement).toBeTruthy();
        expect(todoDate.type).toEqual('date');
    })

    it('#todo-title is a HTMLInputElement with type text', function () {
        const todoTitle = document.getElementById('todo-title');
        expect(todoTitle instanceof HTMLInputElement).toBeTruthy();
        expect(todoTitle.type).toEqual('text');
    })

    it('#add-button is a HTMLInputElement with type button', function () {
        const addButton = document.getElementById('add-button');
        expect(addButton instanceof HTMLInputElement).toBeTruthy();
        expect(addButton.type).toEqual('button');
    })

    it('#todo-list is a HTMLUListElement', function () {
        const todoList = document.getElementById('todo-list');
        expect(todoList instanceof HTMLUListElement).toBeTruthy();
    })

})