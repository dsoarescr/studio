// Add custom commands here
Cypress.Commands.add('login', (email: string, password: string) => {
  // Custom login command
  cy.visit('/login');
  cy.get('[data-cy=email]').type(email);
  cy.get('[data-cy=password]').type(password);
  cy.get('[data-cy=login-button]').click();
});

Cypress.Commands.add('logout', () => {
  // Custom logout command
  cy.get('[data-cy=user-menu]').click();
  cy.get('[data-cy=logout-button]').click();
});
