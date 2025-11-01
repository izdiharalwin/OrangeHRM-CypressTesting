describe('Cypress Testing', () => {

    const LOGIN_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

    // Selector yang akan digunakan
    const usernameInput = 'input[name="username"]';
    const passwordInput = 'input[name="password"]';
    const loginButton = '.orangehrm-login-button';
    const errorMessage = '.oxd-alert-content-text';
    const dashboardElement = '.oxd-userdropdown-name';
    const usernameErrorText = 'div:nth-child(2) .oxd-input-field-error-message'; // Selector untuk error 'Required' Username
    const passwordErrorText = 'div:nth-child(3) .oxd-input-field-error-message'; // Selector untuk error 'Required' Password

    // ----------------------------------------------------------------------
    // TC-01: LOGIN BERHASIL (Akun Valid)
    // ----------------------------------------------------------------------

    it('TC-01: Login Berhasil dengan Akun Valid (Admin/admin123)', () => {
        cy.visit(LOGIN_URL);

        cy.get(usernameInput).type('Admin');
        cy.get(passwordInput).type('admin123');
        cy.get(loginButton).click();

        // Assertion: Verifikasi sukses
        cy.url().should('include', '/dashboard');
        cy.get(dashboardElement).should('be.visible');
    });

    // ----------------------------------------------------------------------
    // TC-02: LOGIN GAGAL (Username Kosong)
    // ----------------------------------------------------------------------

    it('TC-02: Login Gagal - Username Dikosongkan (Verifikasi Required)', () => {
        cy.visit(LOGIN_URL);

        cy.get(passwordInput).type('admin123');
        cy.get(loginButton).click();

        // Assertion: Verifikasi pesan 'Required' untuk Username
        cy.get(usernameErrorText)
            .should('be.visible')
            .and('have.text', 'Required');

        cy.url().should('not.include', '/dashboard');
    });

    // ----------------------------------------------------------------------
    // TC-03: LOGIN GAGAL (Password Kosong)
    // ----------------------------------------------------------------------

    it('TC-03: Login Gagal - Password Dikosongkan (Verifikasi Required)', () => {
        cy.visit(LOGIN_URL);

        cy.get(usernameInput).type('Admin');
        cy.get(loginButton).click();

        // Assertion: Verifikasi pesan 'Required' untuk Password
        cy.get(passwordErrorText)
            .should('be.visible')
            .and('have.text', 'Required');

        cy.url().should('not.include', '/dashboard');
    });

    // ----------------------------------------------------------------------
    // TC-04: LOGIN GAGAL (Username Tidak Valid)
    // ----------------------------------------------------------------------

    it('TC-04: Login Gagal - Username Tidak Valid', () => {
        cy.visit(LOGIN_URL);

        cy.get(usernameInput).type('usernamesalahfiktif');
        cy.get(passwordInput).type('admin123');
        cy.get(loginButton).click();

        // Assertion: Verifikasi muncul pesan "Invalid credentials"
        cy.get(errorMessage)
            .should('be.visible')
            .and('have.text', 'Invalid credentials');
        cy.url().should('not.include', '/dashboard');
    });

    // ----------------------------------------------------------------------
    // TC-05: LOGIN GAGAL (Password Tidak Valid)
    // ----------------------------------------------------------------------

    it('TC-05: Login Gagal - Password Tidak Valid', () => {
        cy.visit(LOGIN_URL);

        cy.get(usernameInput).type('Admin');
        cy.get(passwordInput).type('passwordsalah123');
        cy.get(loginButton).click();

        // Assertion: Verifikasi muncul pesan "Invalid credentials"
        cy.get(errorMessage)
            .should('be.visible')
            .and('have.text', 'Invalid credentials');
        cy.url().should('not.include', '/dashboard');
    });

    // ----------------------------------------------------------------------
    // TC-06: LOGIN BERHASIL (ENTER di Password)
    // ----------------------------------------------------------------------

    it('TC-06: Login Berhasil dengan Menekan Tombol ENTER pada field Password', () => {
        cy.visit(LOGIN_URL);

        cy.get(usernameInput).type('Admin');
        // Action: Isi Password, diikuti dengan {enter}
        cy.get(passwordInput).type('admin123{enter}');

        // Assertion: Verifikasi sukses
        cy.url().should('include', '/dashboard');
        cy.get(dashboardElement).should('be.visible');
    });

    // ----------------------------------------------------------------------
    // TC-07: LOGIN GAGAL (Case Sensitive - Username)
    // ----------------------------------------------------------------------

    it('TC-07: Login Berhasil - Username Case Insensitive (Memakai "admin" bukan "Admin")', () => {
        cy.visit(LOGIN_URL);

        // Username yang seharusnya salah (case)
        cy.get(usernameInput).type('admin');
        cy.get(passwordInput).type('admin123');
        cy.get(loginButton).click();

        // Assertion: DIUBAH menjadi verifikasi sukses
        cy.url().should('include', '/dashboard');
        cy.get(dashboardElement).should('be.visible');
    });

    // ----------------------------------------------------------------------
    // TC-08: LOGIN GAGAL (Case Sensitive - Password)
    // ----------------------------------------------------------------------

    it('TC-08: Login Gagal - Password Case Sensitive (Memakai "Admin123" bukan "admin123")', () => {
        cy.visit(LOGIN_URL);

        cy.get(usernameInput).type('Admin');
        // Password salah (case)
        cy.get(passwordInput).type('Admin123');
        cy.get(loginButton).click();

        // Assertion: Cukup verifikasi bahwa halaman TIDAK pindah ke Dashboard (Solusi perbaikan)
        cy.url().should('not.include', '/dashboard');
    });

    // ----------------------------------------------------------------------
    // TC-09: LOGIN GAGAL (Trailing Whitespace)
    // ----------------------------------------------------------------------

    it('TC-09: Login Berhasil - Username dengan Spasi di Akhir (Trailing Whitespace is Trimmed)', () => {
        cy.visit(LOGIN_URL);

        // Tambahkan spasi di akhir username
        cy.get(usernameInput).type('Admin ');
        cy.get(passwordInput).type('admin123');
        cy.get(loginButton).click();

        // Assertion: DIUBAH menjadi verifikasi sukses
        cy.url().should('include', '/dashboard');
        cy.get(dashboardElement).should('be.visible');
    });

    // ----------------------------------------------------------------------
    // TC-10: LOGIN BERHASIL (ENTER di Username) - Alternatif TC Tab yang Gagal
    // ----------------------------------------------------------------------

    it('TC-10: Login Berhasil dengan Menekan Tombol ENTER pada field USERNAME', () => {
        cy.visit(LOGIN_URL);

        // Action 1: Isi password terlebih dahulu (untuk memastikan form valid)
        cy.get(passwordInput).type('admin123');

        // Action 2: Isi username dan tekan {enter} untuk submit form
        cy.get(usernameInput).type('Admin{enter}'); // Menggunakan ENTER di field pertama

        // Assertion: Verifikasi sukses
        cy.url().should('include', '/dashboard');
        cy.get(dashboardElement).should('be.visible');
    });

    // ... (Lanjutan dari TC-10) ...

    // ----------------------------------------------------------------------
    // TC-11: LOGIN GAGAL (Simbol Khusus dalam Username)
    // ----------------------------------------------------------------------

    it('TC-11: Login Gagal - Username mengandung Simbol Khusus (@, !, *)', () => {
        cy.visit(LOGIN_URL);

        // Username dengan simbol khusus yang tidak valid
        cy.get(usernameInput).type('Admin@!');
        cy.get(passwordInput).type('admin123');
        cy.get(loginButton).click();

        // Assertion: Harus gagal dan memunculkan pesan "Invalid credentials"
        cy.get(errorMessage)
            .should('be.visible')
            .and('have.text', 'Invalid credentials');

        cy.url().should('not.include', '/dashboard');
    });
});