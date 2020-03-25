/// <reference types="cypress" />

context('Network Requests', () => {
  beforeEach(() => {
    cy.server()
      .visit('https://example.cypress.io/commands/network-requests')
  })

  it('cy.request() - make an XHR request', () => {
    // https://on.cypress.io/request
    cy.request('https://jsonplaceholder.cypress.io/comments')
      .should((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.length(500)
        expect(response).to.have.property('headers')
        expect(response).to.have.property('duration')
      })
  })

  it('cy.request() - verify response using BDD syntax', () => {
    cy.request('https://jsonplaceholder.cypress.io/comments')
      .then((response) => {
      // https://on.cypress.io/assertions
        expect(response).property('status').to.equal(200)
        expect(response).property('body').to.have.length(500)
        expect(response).to.include.keys('headers', 'duration')
      })
  })

  it('cy.route() - route responses to matching requests', () => {
    // https://on.cypress.io/route

    const message = 'whoa, this comment does not exist'

    // Listen to GET to comments/1
    cy.route('GET', 'comments/*').as('getComment')

    // we have code that gets a comment when
    // the button is clicked in scripts.js
    cy.get('.network-btn').click()

    // https://on.cypress.io/wait
    cy.wait('@getComment').its('status').should('eq', 200)

    // Listen to POST to comments
    cy.route('POST', '/comments').as('postComment')

    // we have code that posts a comment when
    // the button is clicked in scripts.js
    cy.get('.network-post').click()
    cy.wait('@postComment').should((xhr) => {
      expect(xhr.requestBody).to.include('email')
      expect(xhr.requestHeaders).to.have.property('Content-Type')
      expect(xhr.responseBody).to.have.property('name', 'Using POST in cy.route()')
    })

    // Stub a response to PUT comments/ ****
    cy.route({
      method: 'PUT',
      url: 'comments/*',
      status: 404,
      response: { error: message },
      delay: 500
    }).as('putComment')

    // we have code that puts a comment when
    // the button is clicked in scripts.js
    cy.get('.network-put').click()

    cy.wait('@putComment')

    // our 404 statusCode logic in scripts.js executed
    cy.get('.network-put-comment').should('contain', message)
  })
})
