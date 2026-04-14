describe("Navigation to login", () => {
  it("Should be able to see the login page", () => {
    cy.visit("http://localhost:3000/");

    cy.get('a[href*="/auth/login"]').click({ multiple: true });

    cy.url().should("include", "/auth/login");

    cy.get("h2").contains("Login with:");
  });

  it("Should be able to login with dummy credentials")
});
