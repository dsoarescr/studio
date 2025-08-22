describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the main page content', () => {
    cy.get('body').should('be.visible');
    cy.get('main').should('exist');
  });

  it('should have proper meta tags', () => {
    cy.get('head title').should('contain', 'Pixel Universe');
    cy.get('meta[name="description"]').should('exist');
  });

  it('should be responsive', () => {
    // Desktop view
    cy.viewport(1280, 720);
    cy.get('body').should('be.visible');

    // Mobile view
    cy.viewport(375, 667);
    cy.get('body').should('be.visible');
  });

  it('should load without errors', () => {
    cy.window().then(win => {
      expect(win.console.error).to.not.be.called;
    });
  });
});
