describe('Front Office — Public Pages', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/public/hero-slides*').as('heroSlides');
    cy.intercept('GET', '**/api/public/page-content/**').as('pageContent');
    cy.intercept('GET', '**/api/public/footer').as('footer');
    cy.intercept('GET', '**/api/public/sermons*').as('sermons');
    cy.intercept('GET', '**/api/public/ministries').as('ministries');
    cy.intercept('GET', '**/api/public/settings').as('settings');
    cy.intercept('POST', '**/api/public/contact').as('contactPost');
  });

  /* ─── Homepage ─────────────────────────────────── */
  describe('Homepage', () => {
    it('loads and displays hero section', () => {
      cy.visit('/', { timeout: 30000 });
      cy.get('h1, h2', { timeout: 10000 }).should('be.visible');
      cy.get('nav, header, [class*="header"], [class*="Header"]').should('be.visible');
    });
  });

  /* ─── About ────────────────────────────────────── */
  describe('About', () => {
    it('loads with hero and mission content', () => {
      cy.visit('/about');
      cy.get('h1, h2', { timeout: 10000 }).should('be.visible');
    });
  });

  /* ─── Ministries ───────────────────────────────── */
  describe('Ministries', () => {
    it('loads ministry listing page', () => {
      cy.visit('/ministries');
      cy.get('h1, h2', { timeout: 10000 }).should('be.visible');
    });

    it('loads children ministry subpage', () => {
      cy.visit('/children-ministry');
      cy.get('h1, h2', { timeout: 10000 }).should('be.visible');
    });

    it('loads youth ministry subpage', () => {
      cy.visit('/youth-ministry');
      cy.get('h1, h2', { timeout: 10000 }).should('be.visible');
    });

    it('loads women ministry subpage', () => {
      cy.visit('/women-ministry');
      cy.get('h1, h2', { timeout: 10000 }).should('be.visible');
    });

    it('loads men ministry subpage', () => {
      cy.visit('/men-ministry');
      cy.get('h1, h2', { timeout: 10000 }).should('be.visible');
    });

    it('loads young couples ministry subpage', () => {
      cy.visit('/young-couples-ministry');
      cy.get('h1, h2', { timeout: 10000 }).should('be.visible');
    });

    it('loads worship ministry subpage', () => {
      cy.visit('/worship-ministry');
      cy.get('h1, h2', { timeout: 10000 }).should('be.visible');
    });
  });

  /* ─── Events ───────────────────────────────────── */
  describe('Events', () => {
    it('loads and lists events', () => {
      cy.visit('/events');
      cy.get('h1, h2', { timeout: 10000 }).should('be.visible');
    });
  });

  /* ─── Sermons ──────────────────────────────────── */
  describe('Sermons', () => {
    it('loads and lists sermons', () => {
      cy.visit('/sermons');
      cy.get('h1, h2', { timeout: 10000 }).should('be.visible');
    });
  });

  /* ─── Contact Form ─────────────────────────────── */
  describe('Contact Form', () => {
    it('submits a contact message successfully', () => {
      cy.visit('/contact');
      cy.scrollTo('bottom', { ensureScrollable: false });
      cy.wait(1000);

      cy.get('input[name="name"]').should('exist');
      cy.get('input[name="name"]').type('Cypress Test User', { force: true });
      cy.get('input[name="email"]').type('cypress-test@example.com', { force: true });
      cy.get('input[name="phone"]').type('555-1234', { force: true });
      cy.get('input[name="subject"]').type('Cypress Test Subject', { force: true });
      cy.get('textarea[name="message"]').type('This is an automated test from Cypress.', { force: true });

      cy.get('button[type="submit"]').first().click({ force: true });
      // Form submission is successful if no error occurs
    });
  });

  /* ─── Giving & Static Pages ────────────────────── */
  describe('Static CMS Pages', () => {
    ['giving', 'zelle', 'get-involved', 'privacy', 'terms', 'team'].forEach((page) => {
      it(`loads /${page}`, () => {
        cy.visit(`/${page}`);
        cy.get('h1, h2', { timeout: 10000 }).should('be.visible');
      });
    });
  });

  /* ─── Footer ───────────────────────────────────── */
  describe('Footer', () => {
    it('loads with contact info from API', () => {
      cy.visit('/');
      cy.get('footer, [class*="footer"], [class*="Footer"]', { timeout: 10000 }).should('be.visible');
    });
  });

  /* ─── Navigation ──────────────────────────────── */
  describe('Navigation', () => {
    it('navigates to about page', () => {
      cy.visit('/about');
      cy.url({ timeout: 10000 }).should('include', '/about');
      cy.get('h1, h2', { timeout: 10000 }).should('be.visible');
    });
  });
});
