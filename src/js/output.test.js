
describe('Output Module', () => {
    let output;
    let stub_store;

    beforeEach(() => {
        document.documentElement.innerHTML = require('#tests/html');
        stub_store = ({ dispatch: () => {}, subscribe: () => {} });
        output = require('./output')(document, stub_store);
    });

    it('should set its todoList prop as #todo-list', () => {
        const expected = document.getElementById('todo-list');
        expect(output.todoList).toEqual(expected);
    });

    it('update #todo-list when a item provided', () => {
        const todoItem = {
            id: '#1AZ',
            date: '2021-03-01',
            name: 'this is for test'
        };
        const li = `<li id="#1AZ" class="todo-item"><time>${ todoItem.date }</time><p>${ todoItem.name }</p><button>delete</button></li>`;
        output.updateDisplay([todoItem]);
        expect(document.querySelector('ul').innerHTML).toEqual(li);
    });

    it('update #todo-list when items provided', () => {
        const todoItems = [
            {
                id: '#123',
                date: '2021-03-01',
                name: 'this is for test2'
            }, {
                id: '#456',
                date: '2021-04-01',
                name: 'this is for test22'
            }
        ];
        const lists = [
            `<li id="#123" class="todo-item"><time>${ todoItems[0].date }</time><p>${ todoItems[0].name }</p><button>delete</button></li>`,
            `<li id="#456" class="todo-item"><time>${ todoItems[1].date }</time><p>${ todoItems[1].name }</p><button>delete</button></li>`,
        ].join('');
        output.updateDisplay(todoItems);
        expect(document.querySelector('ul').innerHTML).toEqual(lists);
    });

    it('should add click listener to delete button to invoke mediator.createTodoItem', () => {
        const todoItems = [{
            id: '#789',
            date: '2021-03-01',
            name: 'this is for test3'
        }];
        output.updateDisplay(todoItems);
        const spyFn = jest.spyOn(stub_store, 'dispatch');
        document.querySelector('li button').dispatchEvent(new Event('click'));
        expect(spyFn).toHaveBeenCalledTimes(1);
    });

    it('should add click listener to delete button to invoke mediator.createTodoItem with itemId', () => {
        const todoItems = [{
            id: '#ABC',
            date: '2021-04-01',
            name: 'this is for test4'
        }];
        output.updateDisplay(todoItems);
        const spyFn = jest.spyOn(stub_store, 'dispatch');
        document.querySelector('li button').dispatchEvent(new Event('click'));
        expect(spyFn.mock.calls[0][0].document).toEqual('#ABC');
    });
});
