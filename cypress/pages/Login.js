// File: cypress/pages/Login.js

class LoginPage {

    // LOCATORS (Data)
    usernameInput() {
        return cy.get('input[name="username"]');
    }

    passwordInput() {
        return cy.get('input[name="password"]');
    }

    loginButton() {
        return cy.get('.orangehrm-login-button');
    }

    errorMessage() {
        return cy.get('.oxd-alert-content-text'); // Untuk 'Invalid credentials'
    }

    dashboardElement() {
        return cy.get('.oxd-userdropdown-name');
    }

    // Locators BARU yang lebih stabil untuk pesan error 'Required'
    usernameRequiredMessage() {
        // Cari container input username, lalu cari pesan error di dalamnya
        return cy.get(':nth-child(2) > .oxd-input-group').find('.oxd-input-field-error-message');
    }

    passwordRequiredMessage() {
        return cy.get(':nth-child(3) > .oxd-input-group').find('.oxd-input-field-error-message');
    }

    // ACTIONS (Method)

    visit() {
        cy.visit('/web/index.php/auth/login');
    }

    clickLogin(shouldForce = false) {
        if (shouldForce) {
            // Menggunakan {force: true} untuk mengatasi isu validasi required pada TC-02 & TC-03
            this.loginButton().click({ force: true });
        } else {
            this.loginButton().click();
        }
    }

    login(username, password, useEnter = false) {
        this.usernameInput().type(username);

        if (useEnter) {
            this.passwordInput().type(password + '{enter}');
        } else {
            this.passwordInput().type(password);
            this.clickLogin();
        }
    }
}

export default LoginPage;