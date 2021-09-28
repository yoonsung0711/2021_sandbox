const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../html/index.html'), 'utf8');

describe('Input Module', () => {
    let input;
    let stub_store;

    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        stub_store = ({
            dispatch: () => {}
        });
        input = require('./input')(document, stub_store);
        spyOn(console, 'error');
    })

    it('should set its todoForm prop as #todo-form ', () => {
        const expected = document.getElementById('todo-form');
        expect(input.todoForm).toEqual(expected);
    })

    it('should set its addButton prop as #add-button', () => {
        const expected = document.getElementById('add-button');
        expect(input.addButton).toEqual(expected);
    })

    it('should set default value of #todo-date as provided', () => {
        input.setDefaultDate('2021-01-01');
        const expected = '2021-01-01';
        expect(document.getElementById('todo-date').value).toEqual(expected);
    })

    it('should set default value of #todo-date as today when no default value provided', () => {
        input.setDefaultDate();
        const expected = new Date().toISOString().split('T')[0] || '2021-01-24';
        expect(document.getElementById('todo-date').value).toEqual(expected);
    })

    it('should provide data fetched from todoForm', () => {
        const expected = {
            date: '2021-02-01',
            name: 'tobe..fetched'
        };
        input.setDefaultDate(expected.date);
        document.getElementById('todo-title').value = expected.name;
        expect(input.getTodoFormData()).toEqual(expected);
    })

    it('should throw console.error when invalidate todoForm submitted', () => {
        document.getElementById('todo-title').value = '';
        input.addButton.dispatchEvent(new Event('click'));
        expect(console.error.calls.count()).toBe(1);
    })

    it('should add click listener to #add-button to invoke mediator.createTodoItem', () => {
        document.getElementById('todo-title').value = 'any';
        const spyFn = jest.spyOn(stub_store, 'dispatch');
        input.addButton.dispatchEvent(new Event('click'));
        expect(spyFn).toBeCalledTimes(1);
    })

    it('should add click listener to #add-button to invoke mediator.createTodoItem with todoItem', () => {
        document.getElementById('todo-title').value = 'any';
        const spyFn = jest.spyOn(stub_store, 'dispatch');
        input.addButton.dispatchEvent(new Event('click'));
        const expected = {
            date: new Date().toISOString().split('T')[0],
            name: 'any'
        };
        expect(spyFn.mock.calls[0][0].document).toContainValues([expected.date, expected.name]);
    })

    it('should clear text of #todo-title after #add-button clicked', () => {
        document.getElementById('todo-title').value = 'any';
        input.addButton.dispatchEvent(new Event('click'));
        const expected = '';
        expect(document.getElementById('todo-title').value).toEqual(expected);
    })
})
