// Custom Cypress commands

Cypress.Commands.add('loginAsAdmin', () => {
  cy.session('admin', () => {
    // Mock the login instead of making a real API request
    cy.window().then((win) => {
      win.localStorage.setItem('auth_token', 'mock-jwt-token');
      win.localStorage.setItem('refresh_token', 'mock-refresh-token');
      win.localStorage.setItem('adminToken', 'mock-jwt-token');
    });
  });
});

Cypress.Commands.add('resetTestData', () => {
  cy.loginAsAdmin();
  cy.request({
    method: 'DELETE',
    url: `${Cypress.config('apiUrl')}/test-reset`,
    headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
    failOnStatusCode: false,
  });
});
