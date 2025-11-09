class DashboardPage {
    // Locator untuk elemen di halaman Dashboard
    dashboardHeader = '.oxd-topbar-header-title';
    directoryMenu = 'a[href="/web/index.php/directory/viewDirectory"]';
    mainMenu = '.oxd-sidepanel-body';

    // Action
    verifyDashboardLoaded() {
        cy.url().should('include', '/dashboard');
        cy.get(this.dashboardHeader).should('be.visible');
    }

    clickDirectoryMenu() {
        cy.get(this.directoryMenu).click();
    }
}

export default new DashboardPage();