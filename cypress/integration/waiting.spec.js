context('Waiting', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/waiting')
  })

  it('cy.wait() - wait for a specific amount of time', () => {
    cy.get('.wait-input1')
      .type('Wait 1000ms after typing')
      .wait(1000)
  })

  it('cy.wait() - wait for a specific route', () => {
    cy.server()

    // Listen to GET to comments/1
    cy.route('GET', 'comments/*').as('getComment')

    // we have code that gets a comment when
    // the button is clicked in scripts.js
    cy.get('.network-btn')
      .click()

    // wait for GET comments/1
    cy.wait('@getComment')
      .its('status')
      .should('eq', 200)
  })
})
