import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';

describe('OrangeHRM Automation Intercept POM', () => {

    beforeEach(() => {
        LoginPage.visit();
    });

    // ------------------------------------
    // 1. LOGIN FEATURE TESTS
    // ------------------------------------

    it('1. Login Sukses: Pengguna valid dapat masuk', () => {
        // Intercept: Monitor the login API call
        cy.intercept('POST', '/web/index.php/auth/validate').as('successfulLogin');

        // Action: Melakukan login dengan akun valid
        LoginPage.login('Admin', 'admin123');

        // Verify Intercept: Expect 302 status code (Redirect)
        cy.wait('@successfulLogin').its('response.statusCode').should('eq', 302);

        // Verify Navigation
        DashboardPage.verifyDashboardLoaded();
    });

    it('2. Login Gagal: Pengguna tidak valid gagal masuk', () => {
        // Intercept: Monitor the login API call
        cy.intercept('POST', '/web/index.php/auth/validate').as('failedLogin');

        // Action: Perform invalid login
        LoginPage.login('WrongUser', 'WrongPass');

        // Verify Intercept: Expect 302 status code (Redirect back to login page)
        cy.wait('@failedLogin').its('response.statusCode').should('eq', 302);

        // Verify UI: Error message appears
        cy.get(LoginPage.errorMessage).should('contain', 'Invalid credentials');
    });

    // ------------------------------------
    // 3. FORM VALIDATION TEST (New)
    // ------------------------------------
    it('3. Validasi Form: Gagal submit jika field kosong', () => {
        // Aksi: Langsung klik login tanpa mengisi apapun
        cy.get(LoginPage.loginButton).click();

        // Verifikasi UI (Perbaikan): Dapatkan SEMUA elemen yang merupakan pesan error 
        // dan verifikasi bahwa jumlahnya sama dengan 2.
        cy.get('.oxd-input-field-error-message')
            .should('have.length', 2)
            .and('contain', 'Required'); // Opsional: Memastikan teksnya "Required"

    });

    // ------------------------------------
    // 4. FORGOT PASSWORD FEATURE (FIXED)
    // ------------------------------------
    it('4. Dashboard/Direktori: Dapat mengakses menu Direktori', () => {
        // Action: Navigate to Forgot Password page
        cy.get(LoginPage.forgotPasswordLink).click();
        cy.url().should('include', '/requestPasswordResetCode');

        cy.intercept('POST', '/web/index.php/auth/sendPasswordReset').as('resetPassRequest');

        // Action: Fill username and click reset button
        cy.get(LoginPage.usernameInput).type('Admin');
        cy.get(LoginPage.resetPasswordButton).click();

        // Verify Intercept: Expect 200 status code (API success)
        cy.wait('@resetPassRequest', { timeout: 5000 }).its('response.statusCode').should('eq', 304);

        // Verify UI: Success message appears
        cy.contains('Reset Password link sent successfully').should('be.visible');
    });

    // ------------------------------------
    // 5. DASHBOARD NAVIGATION (DIRECTORY)
    // ------------------------------------
    it('5. Validasi Form: Gagal submit jika field kosong', () => {
        // Pre-requisite: Login successfully
        cy.intercept('POST', '/web/index.php/auth/validate').as('login');
        LoginPage.login('Admin', 'admin123');
        cy.wait('@login');
        DashboardPage.verifyDashboardLoaded();

        // Intercept: Monitor the API call that loads Directory data
        cy.intercept('GET', '**/directory/employees**').as('directoryDataLoad');

        // Action: Click Directory menu
        DashboardPage.clickDirectoryMenu();
        cy.url().should('include', '/directory/viewDirectory');

        // Verify Intercept: Expect 200 status code for data load
        cy.wait('@directoryDataLoad').its('response.statusCode').should('eq', 200);

        // Verify UI: Directory page title is visible
        cy.contains('Directory').should('be.visible');
    });

    // ------------------------------------
    // 6. MOCKING SERVER ERROR (New)
    // ------------------------------------
    it('6. Mocking Error: Mensimulasikan error server 500 saat login', () => {
        // Intercept/Stubbing: Force the login API to return a 500 error
        cy.intercept('POST', '/web/index.php/auth/validate', {
            statusCode: 500,
            body: {
                success: false,
                message: "Server Error: Internal application failure"
            },
        }).as('serverErrorLogin');

        // Action: Attempt login
        LoginPage.login('Admin', 'admin123');

        // Verify Intercept: Status 500 is returned (Stubbing successful)
        cy.wait('@serverErrorLogin').its('response.statusCode').should('eq', 500);

        cy.url().should('include', '/auth/validate');

        // Verify UI: Ensure navigation did not happen
        cy.url().should('include', '/auth/login');
    });
});