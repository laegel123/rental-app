describe('User Journey', () => {
  const timestamp = Date.now();
  const userA = {
    username: `userA${timestamp}`,
    email: `userA${timestamp}@example.com`,
    password: 'Password123!',
    itemName: `Tool A ${timestamp}`
  };
  const userB = {
    username: `userB${timestamp}`,
    email: `userB${timestamp}@example.com`,
    password: 'Password123!',
  };

  it('should complete the full user journey with two users', () => {
    // --- USER A: SIGNUP -> LOGIN -> POST ITEM -> LOGOUT ---
    cy.visit('/auth');
    cy.get('main button').contains('Sign Up').click();
    cy.get('form').within(() => {
      cy.get('input[placeholder="John Doe"]').type(userA.username);
      cy.get('input[placeholder="you@example.com"]').type(userA.email);
      cy.get('input[placeholder="••••••••"]').type(userA.password);
      cy.get('input[placeholder="V6B 2W9"]').type('V6B 2W9');
      cy.get('button').contains('Create Account').click();
    });
    cy.contains('Registration successful', { timeout: 10000 }).should('be.visible');
    
    cy.get('form').within(() => {
      cy.get('input[placeholder="you@example.com"]').clear().type(userA.email);
      cy.get('input[placeholder="••••••••"]').clear().type(userA.password);
      cy.get('button').contains('Login').click();
    });
    cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/');

    cy.contains('a', 'Post Item').click();
    cy.get('form').within(() => {
      cy.get('input[placeholder="e.g. Electric Lawn Mower"]').type(userA.itemName);
      cy.get('textarea[placeholder="Tell us about your item..."]').type('Available for rent.');
      cy.get('input[type="number"]').eq(0).clear().type('20');
      cy.get('input[type="number"]').eq(1).clear().type('50');
      cy.get('button').contains('Post Item').click();
    });
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('button').contains('Logout').click();

    // --- USER B: SIGNUP -> LOGIN -> SEARCH -> REQUEST RENTAL -> LOGOUT ---
    cy.visit('/auth');
    cy.get('main button').contains('Sign Up').click();
    cy.get('form').within(() => {
      cy.get('input[placeholder="John Doe"]').type(userB.username);
      cy.get('input[placeholder="you@example.com"]').type(userB.email);
      cy.get('input[placeholder="••••••••"]').type(userB.password);
      cy.get('input[placeholder="V6B 2W9"]').type('V6B 2W9');
      cy.get('button').contains('Create Account').click();
    });
    cy.contains('Registration successful', { timeout: 10000 }).should('be.visible');

    cy.get('form').within(() => {
      cy.get('input[placeholder="you@example.com"]').clear().type(userB.email);
      cy.get('input[placeholder="••••••••"]').clear().type(userB.password);
      cy.get('button').contains('Login').click();
    });
    cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/');

    // Find User A's item
    cy.contains(userA.itemName, { timeout: 10000 }).should('be.visible');
    cy.contains(userA.itemName).parents('.bg-white').find('button').contains('Details').click();
    
    // Request Rental
    cy.url().should('include', '/item/');
    cy.intercept('POST', '/api/rentals').as('rentalRequest');
    cy.wait(1000);
    cy.contains('button', 'Request Rental').should('not.be.disabled').click({ force: true });

    // Wait for API and redirect
    cy.wait('@rentalRequest').its('response.statusCode').should('eq', 200);
    cy.url({ timeout: 20000 }).should('include', '/reservations');
    cy.contains('My Requests').should('be.visible');
    cy.contains(userA.itemName).should('be.visible');
    cy.contains('Requested').should('be.visible');

    // Logout
    cy.get('button').contains('Logout').click();
    cy.url().should('include', '/auth');
  });
});
