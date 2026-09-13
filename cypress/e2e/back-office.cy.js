describe('Back Office — Admin Panel', () => {
  before(() => {
    cy.loginAsAdmin();
  });
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  /* ─── Login ────────────────────────────────────── */
  describe('Login', () => {
    it('loads the login page', () => {
      cy.visit('/admin/login');
      cy.get('input[name="email"], input[id="email"]').should('be.visible');
      cy.get('input[type="password"], input[name="password"]').should('be.visible');
    });

    it('logs in and redirects', () => {
      cy.visit('/admin/login');
      cy.get('input[name="email"], input[id="email"]').type(Cypress.env('adminEmail'));
      cy.get('input[type="password"], input[name="password"]').type(Cypress.env('adminPassword'));
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 10000 }).should('include', '/admin');
    });
  });

  /* ─── Dashboard ────────────────────────────────── */
  describe('Dashboard', () => {
    it('displays dashboard stats', () => {
      cy.visit('/admin');
      cy.contains(/dashboard/i).should('exist');
    });
  });

  /* ─── Page Content ─────────────────────────────── */
  describe('Page Content', () => {
    it('shows page list', () => {
      cy.visit('/admin/pages');
      cy.contains('Content Editor').should('be.visible');
    });

    it('opens homepage editor', () => {
      cy.visit('/admin/pages/homepage');
      cy.contains('Homepage').should('be.visible');
    });
  });

  /* ─── Admin pages load via API ─────────────────── */
  describe('Admin pages load', () => {
    it('loads Hero Slides',    () => { cy.visit('/admin/hero-slides');          cy.contains('Hero Slides',   { timeout: 8000 }).should('exist'); });
    it('loads News',           () => { cy.visit('/admin/news');                 cy.contains('News',          { timeout: 8000 }).should('exist'); });
    it('loads Events',         () => { cy.visit('/admin/events');               cy.contains('Events',        { timeout: 8000 }).should('exist'); });
    it('loads Sermons',        () => { cy.visit('/admin/sermons');              cy.contains('Sermons',       { timeout: 8000 }).should('exist'); });
    it('loads Pastors',        () => { cy.visit('/admin/pastors');              cy.contains('Pastors',       { timeout: 8000 }).should('exist'); });
    it('loads Testimonials',   () => { cy.visit('/admin/testimonials');         cy.contains('Testimonials',  { timeout: 8000 }).should('exist'); });
    it('loads Gallery',        () => { cy.visit('/admin/gallery');              cy.contains('Gallery',       { timeout: 8000 }).should('exist'); });
    it('loads Ministries',     () => { cy.visit('/admin/ministries-manager');   cy.contains('Ministries',    { timeout: 8000 }).should('exist'); });
    it('loads Contact Msgs',   () => { cy.visit('/admin/contact-messages');     cy.contains('Contact',       { timeout: 8000 }).should('exist'); });
    it('loads Media Library',  () => { cy.visit('/admin/media');                cy.contains('Media',         { timeout: 8000 }).should('exist'); });
    it('loads Settings',       () => { cy.visit('/admin/settings');             cy.contains('Settings',      { timeout: 8000 }).should('exist'); });
  });
});
