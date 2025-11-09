class ForgotPasswordPage {
    // Locator untuk elemen di halaman Forgot Password
    usernameInput = 'input[name="username"]';
    resetPasswordButton = 'button[type="submit"]';
    successMessage = '.orangehrm-forgot-password-button'; // Contoh locator untuk konfirmasi
    cancelButton = '.oxd-button--ghost';

    // Metode Aksi
    fillUsername(username) {
        cy.get(this.usernameInput).type(username);
    }

    clickResetPassword() {
        cy.get(this.resetPasswordButton).click();
    }

    clickCancel() {
        cy.get(this.cancelButton).click();
    }
}

export default new ForgotPasswordPage();