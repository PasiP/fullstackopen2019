describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Tim Testuser',
      username: 'admin',
      password: 'admin'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in').click()
    cy.contains('login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('admin')
      cy.get('#password').type('admin')
      cy.get('#login-button').click()

      cy.contains('admin logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('wrong')
      cy.get('#password').type('notThis')
      cy.get('#login-button').click()

      cy.contains('wrong username or password')
    })
  })

  describe.only('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'admin', password: 'admin' })
    })

    it('A blog can be created', function() {
      const title = 'test title'
      const author = 'andy author'
      cy.contains('new blog').click()
      cy.get('#title').type(title)
      cy.get('#author').type(author)
      cy.get('#url').type('testurl.com')
      cy.contains('create').click()

      cy.contains(`a new blog ${title} by ${author} added`)
    })

    describe('and several blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'awesome test blog',
          author: 'andy author',
          url: 'blogger.com/test',
          likes: 33
        })

        cy.createBlog({
          title: 'liked test blog',
          author: 'andy author',
          url: 'blogger.com/test',
          likes: 1
        })

        cy.createBlog({
          title: 'another test blog',
          author: 'andy author',
          url: 'blogger.com/test'
        })

        cy.createBlog({
          title: 'really liked test blog',
          author: 'andy author',
          url: 'blogger.com/test',
          likes: 15
        })
      })

      it('it can be liked', function () {
        cy.contains('another test blog').click()
          .contains('like').click()

        cy.contains('liked a blog: another test blog by andy author')
      })
      it('it can be removed', function () {
        cy.contains('another test blog').click()
          .contains('delete').click()

        cy.contains('deleted blog: another test blog by andy author')
      })

      it('blogs are sorted', function () {
        cy.get('.blogtitle')
          .then($items => {
            const rightOrder = ['awesome test blog andy author', 'really liked test blog andy author', 'liked test blog andy author', 'another test blog andy author']
            let items = $items.map((index, html) => Cypress.$(html).text()).get()
            items = items.map(item => item.replace(' view',''))
            expect(items).to.deep.equal(rightOrder)
          })
      })
    })
  })
})
