/// <reference types="cypress" />

describe('Input form', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4000')
    })

    it('accepts input', () => {
        cy.visit('http://localhost:4000')
        cy.get('#todo-title')
            .type('this is from cypress-io') 
            .should('have.value', 'this is from cypress-io')
    })

    context('Form submission', () => {
        it('Add a new todo on click add-button', () => {
            const itemText = 'this is typed by cypress-io'

            cy.get('#todo-title')
                .type(itemText)
                .type('{enter}')
                .should('have.value', '')

            cy.get('#todo-list li')
                .should('have.length', 1)
                .and('contain', itemText)
        })
    })

})