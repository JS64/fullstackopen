describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.createUser({
      name: 'Martin Fowler',
      username: 'mfowler',
      password: 'test1234'
    })
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in').click()
    cy.contains('Username')
    cy.contains('Password')
  })

  describe('Login',function() {
    it('Succeeds with correct credentials', function() {
      cy.contains('Log in').click()
      cy.get('#username').type('mfowler')
      cy.get('#password').type('test1234')
      cy.get('#login-button').click()
      cy.contains('Logged in as Martin Fowler')
    })

    it('Fails with wrong credentials', function() {
      cy.contains('Log in').click()
      cy.get('#username').type('mfowler')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()
      cy.get('.error')
        .should('contain', 'Incorrect credentials.')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mfowler', password: 'test1234' })
    })

    it('A blog can be created', function() {
      cy.contains('New blog').click()
      cy.get('#title').type('Test Blog')
      cy.get('#author').type('Cypress')
      cy.get('#url').type('https://www.google.com')
      cy.get('#post-button').click()
      cy.contains('Test Blog Cypress')
    })

    describe('And a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'Test Blog', author: 'Cypress', url: 'https://www.google.com', likes: 0 })
      })

      it('The blog can be liked', function() {
        cy.get('#show-button').click()
        cy.get('#like-button').click()
        cy.contains('Likes 1')
      })

      it('The blog can be deleted by the owner', function() {
        cy.get('#show-button').click()
        cy.get('#remove-button').click()
        cy.get('.success').should('contain', 'successfully deleted')
      })

      it('The blog cannot be deleted by a non-owner', function() {
        cy.createUser({
          name: 'Non Owner',
          username: 'notowner',
          password: 'test1234'
        })
        cy.login({ username: 'notowner', password: 'test1234' })
        cy.get('#show-button').click()
        cy.get('#remove-button').should('not.exist')
      })
    })

    describe('And multiple blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({ title: '#4 Likes', author: 'Cypress', url: 'https://www.google.com', likes: 1 })
        cy.createBlog({ title: '#2 Likes', author: 'Cypress', url: 'https://www.google.com', likes: 7 })
        cy.createBlog({ title: '#1 Likes', author: 'Cypress', url: 'https://www.google.com', likes: 18 })
        cy.createBlog({ title: '#3 Likes', author: 'Cypress', url: 'https://www.google.com', likes: 3 })
      })

      it('Blogs are ordered from most liked to least liked', function() {
        cy.get('[id=show-button]').click({ multiple: true })
        cy.get('[id=likes-count]').then(($likes) => {
          const likes = Array.from($likes, like => Number(like.textContent))
          const isDesc = likes.every((v,i,a) => !i || a[i-1] >= v)
          cy.wrap(isDesc).should('equal', true)
        })
      })
    })
  })
})