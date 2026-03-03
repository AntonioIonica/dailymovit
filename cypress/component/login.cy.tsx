import Home from "@/app/page";

describe("<Home />", () => {
  it("should render and display the login content", () => {
    cy.mount(<Home />);

    cy.get("a").contains("Start tracking for free");

    cy.get(`a[href*="/auth/login"]`).should("be.visible");
  });
});
