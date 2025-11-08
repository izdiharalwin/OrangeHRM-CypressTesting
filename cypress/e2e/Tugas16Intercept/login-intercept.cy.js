// File: cypress/e2e/login-intercept.cy.js (ULTIMATE FINAL FIX)

describe('Intercept pada halaman login', () => {

    const LOGIN_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
    const validateAPI = '/web/index.php/auth/validate';
    const usernameInput = 'input[name="username"]';
    const passwordInput = 'input[name="password"]';
    const loginButton = '.orangehrm-login-button';
    const errorMessage = '.oxd-alert-content-text';
    const successLoginURL = '/dashboard';

    beforeEach(() => {
        cy.visit(LOGIN_URL);
    });

    // ----------------------------------------------------------------------
    // TC-01: Validasi Status Code 302 (Login Berhasil)
    // ----------------------------------------------------------------------
    it('TC-01 Intercept: Login Berhasil dan Memvalidasi Status Code 302 (Redirect)', () => {
        cy.intercept('POST', validateAPI).as('loginApi');

        cy.get(usernameInput).type('Admin');
        cy.get(passwordInput).type('admin123');
        cy.get(loginButton).click();

        // Validasi 1: Memastikan Status Code 302 (Redirect)
        cy.wait('@loginApi').then((interception) => {
            expect(interception.response.statusCode).to.equal(302);
        });
        cy.url().should('include', successLoginURL);
    });

    // ----------------------------------------------------------------------
    // TC-02: Validasi Response Header ('location')
    // ----------------------------------------------------------------------
    it('TC-02 Intercept: Login Berhasil dan Memvalidasi Header "Location" (Redirect Target)', () => {
        cy.intercept('POST', validateAPI).as('loginApi');

        cy.get(usernameInput).type('Admin');
        cy.get(passwordInput).type('admin123');
        cy.get(loginButton).click();

        // Validasi 2: Memeriksa Header Response 'location'
        cy.wait('@loginApi').then((interception) => {
            expect(interception.response.headers).to.have.property('location');
            expect(interception.response.headers['location']).to.include(successLoginURL);
        });
        cy.url().should('include', successLoginURL);
    });

    // ----------------------------------------------------------------------
    // TC-03: Validasi Status Code 302 + Pesan Error UI (Login Gagal)
    // ----------------------------------------------------------------------
    it('TC-03 Intercept: Login Gagal (Invalid) dan Memvalidasi Status Code 302 + Pesan Error UI', () => {
        cy.intercept('POST', validateAPI).as('loginApi');

        cy.get(usernameInput).type('AdminSalah');
        cy.get(passwordInput).type('admin123Salah');
        cy.get(loginButton).click();

        // Validasi 3: Memastikan Status Code 302 (Karena redirect kembali ke halaman login)
        cy.wait('@loginApi').then((interception) => {
            expect(interception.response.statusCode).to.equal(302);
        });

        // Assertion UI: Validasi pesan error muncul
        cy.get(errorMessage).should('be.visible').and('have.text', 'Invalid credentials');
        // Memastikan tetap di halaman login
        cy.url().should('not.include', successLoginURL);
    });

    // ----------------------------------------------------------------------
    // TC-04: Validasi Request Header
    // ----------------------------------------------------------------------
    it('TC-04 Intercept: Login Berhasil dan Memvalidasi Header Request', () => {
        cy.intercept('POST', validateAPI).as('loginApi');

        cy.get(usernameInput).type('Admin');
        cy.get(passwordInput).type('admin123');
        cy.get(loginButton).click();

        // Validasi 4: Memeriksa Header Request (Content-Type) yang dikirim
        cy.wait('@loginApi').then((interception) => {
            expect(interception.request.headers).to.have.property('content-type');
            // Harus x-www-form-urlencoded untuk form submit
            expect(interception.request.headers['content-type']).to.include('application/x-www-form-urlencoded');
        });
        cy.url().should('include', successLoginURL);
    });

    // ----------------------------------------------------------------------
    // TC-05: Mocking (Stubbing) - Memaksa Status 500
    // ----------------------------------------------------------------------
    it('TC-05 Intercept: Mocking Server Error 500', () => {
        // Validasi 5: Intercept: MEMAKSA API merespons 500
        cy.intercept('POST', validateAPI, {
            statusCode: 500,
            body: { error: 'Internal Server Error' },
        }).as('serverError');

        cy.get(usernameInput).type('Admin');
        cy.get(passwordInput).type('admin123');
        cy.get(loginButton).click();

        cy.wait('@serverError').then((interception) => {
            expect(interception.response.statusCode).to.equal(500);
        });
        cy.url().should('not.include', successLoginURL);
    });

    // ----------------------------------------------------------------------
    // TC-06: Validasi Properti Objek Intercept
    // ----------------------------------------------------------------------
    it('TC-06 Intercept: Login Berhasil dan Memvalidasi Properti Objek Intercept', () => {
        cy.intercept('POST', validateAPI).as('loginApi');

        cy.get(usernameInput).type('Admin');
        cy.get(passwordInput).type('admin123');
        cy.get(loginButton).click();

        // Validasi 6: Memastikan objek interception memiliki properti tertentu (misalnya method POST)
        cy.wait('@loginApi').then((interception) => {
            expect(interception).to.have.property('request').that.is.an('object');
            expect(interception.request.method).to.equal('POST');
        });
        cy.url().should('include', successLoginURL);
    });

    // ----------------------------------------------------------------------
    // TC-07: Validasi Jumlah Panggilan
    // ----------------------------------------------------------------------
    it('TC-07 Intercept: Login Berhasil dan Memvalidasi API hanya dipanggil Sekali', () => {
        cy.intercept('POST', validateAPI).as('loginApi');

        cy.get(usernameInput).type('Admin');
        cy.get(passwordInput).type('admin123');
        cy.get(loginButton).click();

        // Validasi 7: Pastikan API hanya dipanggil 1 kali
        cy.wait('@loginApi').then((interception) => {
            expect(interception.response.statusCode).to.equal(302);
        });
        // Pastikan hanya ada 1 record panggilan untuk alias @loginApi
        cy.get('@loginApi.all').should('have.length', 1);
    });
});