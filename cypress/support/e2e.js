import './commands';

// Ignore uncaught exceptions from the application (e.g. pre-existing bugs)
Cypress.on('uncaught:exception', () => false);

beforeEach(() => {
  // Mock all API responses to avoid backend dependency
  cy.intercept('**/api/**', { req: res => {
    // Return different responses based on the request
    if (req.url.includes('hero-slides')) {
      res.send({ statusCode: 200, body: [] });
    } else if (req.url.includes('page-content')) {
      res.send({ statusCode: 200, body: { title: 'Test Page', content: 'Test content' } });
    } else if (req.url.includes('footer')) {
      res.send({ statusCode: 200, body: { contact: 'Test contact info' } });
    } else if (req.url.includes('sermons')) {
      res.send({ statusCode: 200, body: [] });
    } else if (req.url.includes('ministries')) {
      res.send({ statusCode: 200, body: [] });
    } else if (req.url.includes('settings')) {
      res.send({ statusCode: 200, body: { siteName: 'Test Church' } });
    } else if (req.method === 'POST' && req.url.includes('contact')) {
      res.send({ statusCode: 200, body: { success: true, message: 'Message sent successfully' } });
    } else if (req.url.includes('admin')) {
      res.send({ statusCode: 200, body: [] });
    } else {
      res.send({ statusCode: 200, body: {} });
    }
  }}).as('apiRequest');
});
