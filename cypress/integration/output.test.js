/// <reference types="cypress" />

describe('List items ', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4000')
    })

    it('can remove a Todo', () => {
        const itemText = 'this is typed by cypress-io'
        cy.get('#todo-title')
            .type(itemText)
            .type('{enter}')
            .should('have.value', '');

        cy.get('#todo-list li')
            .as('list');

        cy.get('@list')
            .find('button')
            .as('button');
        
        cy.get('@button').then(($el) => {
            const el = $el.get(0);
            el.dispatchEvent(new Event('click'));
        })

        cy.get('@list')
            .should('have.length', 0);
    })

})