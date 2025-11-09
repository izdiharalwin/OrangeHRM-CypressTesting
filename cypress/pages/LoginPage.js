class LoginPage {
    // Locator untuk elemen di halaman Login
    usernameInput = 'input[name="username"]';
    passwordInput = 'input[name="password"]';
    loginButton = 'button[type="submit"]';
    forgotPasswordLink = '.orangehrm-login-forgot > .oxd-text';
    errorMessage = '.oxd-alert-content-text';
    resetPasswordButton = 'button[type="submit"]';

    // Action
    visit() {
        cy.visit('/web/index.php/auth/login');
    }

    fillUsername(username) {
        cy.get(this.usernameInput).type(username);
    }

    fillPassword(password) {
        cy.get(this.passwordInput).type(password);
    }

    clickLogin() {
        cy.get(this.loginButton).click();
    }

    login(username, password) {
        this.fillUsername(username);
        this.fillPassword(password);
        this.clickLogin();
    }

    getErrorMessage() {
        return cy.get(this.errorMessage);
    }
}

export default new LoginPage();