// File: cypress/e2e/Tugas17POM/login.cy.js

import LoginPage from '../../pages/Login'; // Path ke Login.js

describe('Fitur Login - Page Object Model (POM) - 11 TC', () => {

    // WAJIB: Instansiasi Class menggunakan 'new'
    const loginPage = new LoginPage();
    const VALID_USER = 'Admin';
    const VALID_PASS = 'admin123';

    beforeEach(() => {
        loginPage.visit();
    });

    // ----------------------------------------------------------------------
    // TC-01: LOGIN BERHASIL (Akun Valid)
    // ----------------------------------------------------------------------
    it('TC-01 POM: Login Berhasil dengan Akun Valid', () => {
        loginPage.login(VALID_USER, VALID_PASS);

        // Assertion: Verifikasi sukses
        cy.url().should('include', '/dashboard');
        loginPage.dashboardElement().should('be.visible');
    });

    // ----------------------------------------------------------------------
    // TC-02: LOGIN GAGAL (Username Kosong) - FIX: Paksa Klik dan Locator Stabil
    // ----------------------------------------------------------------------
    it('TC-02 POM: Login Gagal - Username Dikosongkan (Verifikasi Required)', () => {
        loginPage.passwordInput().type(VALID_PASS);
        loginPage.clickLogin(true); // Menggunakan force: true

        // Assertion: Verifikasi pesan 'Required' untuk Username (Locator Stabil)
        loginPage.usernameRequiredMessage()
            .should('be.visible')
            .and('have.text', 'Required');

        cy.url().should('include', '/auth/login');
    });

    // ----------------------------------------------------------------------
    // TC-03: LOGIN GAGAL (Password Kosong) - FIX: Paksa Klik dan Locator Stabil
    // ----------------------------------------------------------------------
    it('TC-03 POM: Login Gagal - Password Dikosongkan (Verifikasi Required)', () => {
        loginPage.usernameInput().type(VALID_USER);
        loginPage.clickLogin(true); // Menggunakan force: true

        // Assertion: Verifikasi pesan 'Required' untuk Password (Locator Stabil)
        loginPage.passwordRequiredMessage()
            .should('be.visible')
            .and('have.text', 'Required');

        cy.url().should('include', '/auth/login');
    });

    // ----------------------------------------------------------------------
    // TC-04: LOGIN GAGAL (Username Tidak Valid)
    // ----------------------------------------------------------------------
    it('TC-04 POM: Login Gagal - Username Tidak Valid', () => {
        loginPage.login('usernamesalahfiktif', VALID_PASS);

        // Assertion: Verifikasi muncul pesan "Invalid credentials"
        loginPage.errorMessage().should('be.visible').and('have.text', 'Invalid credentials');
        cy.url().should('include', '/auth/login');
    });

    // ----------------------------------------------------------------------
    // TC-05: LOGIN GAGAL (Password Tidak Valid)
    // ----------------------------------------------------------------------
    it('TC-05 POM: Login Gagal - Password Tidak Valid', () => {
        loginPage.login(VALID_USER, 'passwordsalah123');

        // Assertion: Verifikasi muncul pesan "Invalid credentials"
        loginPage.errorMessage().should('be.visible').and('have.text', 'Invalid credentials');
        cy.url().should('include', '/auth/login');
    });

    // ----------------------------------------------------------------------
    // TC-06: LOGIN BERHASIL (ENTER di Password)
    // ----------------------------------------------------------------------
    it('TC-06 POM: Login Berhasil dengan Menekan Tombol ENTER pada field Password', () => {
        loginPage.login(VALID_USER, VALID_PASS, true); // Menggunakan useEnter = true

        // Assertion: Verifikasi sukses
        cy.url().should('include', '/dashboard');
        loginPage.dashboardElement().should('be.visible');
    });

    // ----------------------------------------------------------------------
    // TC-07: LOGIN BERHASIL (Username Case Insensitive)
    // ----------------------------------------------------------------------
    it('TC-07 POM: Login Berhasil - Username Case Insensitive ("admin")', () => {
        loginPage.login('admin', VALID_PASS);

        // Assertion: Verifikasi sukses (OrangeHRM menerima 'admin' kecil)
        cy.url().should('include', '/dashboard');
        loginPage.dashboardElement().should('be.visible');
    });

    // ----------------------------------------------------------------------
    // TC-08: LOGIN GAGAL (Password Case Sensitive)
    // ----------------------------------------------------------------------
    it('TC-08 POM: Login Gagal - Password Case Sensitive ("Admin123")', () => {
        loginPage.login(VALID_USER, 'Admin123');

        // Assertion: Verifikasi muncul pesan "Invalid credentials"
        loginPage.errorMessage().should('be.visible').and('have.text', 'Invalid credentials');
        cy.url().should('include', '/auth/login');
    });

    // ----------------------------------------------------------------------
    // TC-09: LOGIN BERHASIL (Trailing Whitespace)
    // ----------------------------------------------------------------------
    it('TC-09 POM: Login Berhasil - Username dengan Spasi di Akhir', () => {
        loginPage.login(VALID_USER + ' ', VALID_PASS); // Tambah spasi di sini

        // Assertion: Verifikasi sukses (Trailing Whitespace di-trim)
        cy.url().should('include', '/dashboard');
        loginPage.dashboardElement().should('be.visible');
    });

    // ----------------------------------------------------------------------
    // TC-10: LOGIN BERHASIL (ENTER di Username)
    // ----------------------------------------------------------------------
    it('TC-10 POM: Login Berhasil dengan Menekan Tombol ENTER pada field USERNAME', () => {
        loginPage.passwordInput().type(VALID_PASS);

        // Tekan ENTER di field username. Ini akan mensubmit form.
        loginPage.usernameInput().type(VALID_USER + '{enter}');

        // Assertion: Verifikasi sukses
        cy.url().should('include', '/dashboard');
        loginPage.dashboardElement().should('be.visible');
    });

    // ----------------------------------------------------------------------
    // TC-11: LOGIN GAGAL (Simbol Khusus dalam Username)
    // ----------------------------------------------------------------------
    it('TC-11 POM: Login Gagal - Username mengandung Simbol Khusus (@, !, *)', () => {
        loginPage.login('Admin@!', VALID_PASS);

        // Assertion: Harus gagal dan memunculkan pesan "Invalid credentials"
        loginPage.errorMessage().should('be.visible').and('have.text', 'Invalid credentials');
        cy.url().should('include', '/auth/login');
    });
});