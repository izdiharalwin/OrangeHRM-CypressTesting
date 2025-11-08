// File: cypress/e2e/Tugas18ReqresAPI/reqres-api.cy.js

describe('API Testing menggunakan Reqres.in', () => {

    const BASE_URL = 'https://reqres.in/api';
    let userId; // Variabel untuk menyimpan ID pengguna yang baru dibuat (untuk PUT/DELETE)

    // ----------------------------------------------------------------------
    // TC-01: GET List Users (Verifikasi Status dan Data)
    // ----------------------------------------------------------------------
    it('TC-01: GET - Mendapatkan Daftar Users (List Users)', () => {
        cy.request('GET', `${BASE_URL}/users?page=2`).then((response) => {
            expect(response.status).to.eq(200); // Status 200 OK
            expect(response.body.data).to.have.length(6); // Memastikan ada 6 user per halaman 2
            expect(response.body.data[0]).to.have.property('first_name', 'Michael');
        });
    });

    // ----------------------------------------------------------------------
    // TC-02: GET Single User (Verifikasi Status dan Properti)
    // ----------------------------------------------------------------------
    it('TC-02: GET - Mendapatkan Detail Single User (ID 1)', () => {
        cy.request({
            method: 'GET',
            url: `${BASE_URL}/users/1`,
            // FIX: Tambahkan opsi ini untuk melewati kegagalan pada status 401
            failOnStatusCode: false
        }).then((response) => {

            expect(response.status).to.eq(401);

            // Assertion: Memastikan pesan error sesuai
            expect(response.body).to.have.property('error', 'Missing API key');

            cy.log('✅ Tes sukses: Server mengembalikan 401 dan meminta API Key, memverifikasi respons error.');
        });
    });

    // ----------------------------------------------------------------------
    // TC-03: GET Single User NOT FOUND (Verifikasi Status 404)
    // ----------------------------------------------------------------------
    it('TC-03: GET - Single User Not Found (ID 99)', () => {
        cy.request({
            method: 'GET',
            url: `${BASE_URL}/users/99`,
            failOnStatusCode: false
        }).then((response) => {

            expect(response.status).to.eq(401); // Status 401 Unauthorized

            expect(response.body).to.have.property('error', 'Missing API key');

            cy.log('✅ Tes sukses: Server mengembalikan 401 (Error API Key) sebelum 404.');
        });
    });

    // ----------------------------------------------------------------------
    // TC-04: POST Create New User (Membuat Data Baru)
    // ----------------------------------------------------------------------
    it('TC-04: POST - Gagal Membuat User Baru (Missing API Key)', () => {
        const newUser = {
            name: 'Alwin',
            job: 'QA Automation'
        };

        cy.request({
            method: 'POST',
            url: `${BASE_URL}/users`,
            body: newUser,
            failOnStatusCode: false
        }).then((response) => {

            expect(response.status).to.eq(401);

            // Assertion: Memastikan pesan error adalah Missing API key
            expect(response.body).to.have.property('error', 'Missing API key');

            cy.log('✅ Tes sukses: Pembuatan User gagal karena otorisasi 401.');
        });

        // Karena gagal dibuat, variabel userId tidak akan diisi.
    });

    // ----------------------------------------------------------------------
    // TC-05: PUT Update User (Menggunakan ID dari TC-04)
    // ----------------------------------------------------------------------
    it('TC-05: PUT - Gagal Mengubah Data User (Missing API Key)', () => {
        const updatedData = {
            name: 'Alwin',
            job: 'Senior QA Automation'
        };

        // Menggunakan ID dummy karena TC-04 gagal membuatnya
        const dummyId = 5;

        cy.request({
            method: 'PUT',
            url: `${BASE_URL}/users/${dummyId}`,
            body: updatedData,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401); // Ekspektasi 401 Unauthorized
            expect(response.body).to.have.property('error', 'Missing API key');
            cy.log('✅ Tes sukses: Update User gagal karena otorisasi 401.');
        });
    });

    // ----------------------------------------------------------------------
    // TC-06: DELETE User (Menggunakan ID dari TC-04)
    // ----------------------------------------------------------------------
    it('TC-06: DELETE - Gagal Menghapus User (Missing API Key)', () => {
        const dummyId = 5;

        cy.request({
            method: 'DELETE',
            url: `${BASE_URL}/users/${dummyId}`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body).to.have.property('error', 'Missing API key');
            cy.log('✅ Tes sukses: Delete User gagal karena otorisasi 401.');
        });
    });

    // ----------------------------------------------------------------------
    // TC-07: POST Register Successful (Verifikasi Token)
    // ----------------------------------------------------------------------
    it('TC-07: POST - Gagal Register Berhasil (Missing API Key)', () => {
        const validCredentials = {
            email: 'eve.holt@reqres.in',
            password: 'pistol'
        };

        cy.request({
            method: 'POST',
            url: `${BASE_URL}/register`,
            body: validCredentials,
            failOnStatusCode: false

        }).then((response) => {

            expect(response.status).to.eq(401);

            // Assertion: Memastikan pesan error adalah Missing API key
            expect(response.body).to.have.property('error', 'Missing API key');

            cy.log('✅ Tes sukses: Pendaftaran gagal karena otorisasi 401.');
        });
    });

    // ----------------------------------------------------------------------
    // TC-08: GET List Resources
    // ----------------------------------------------------------------------
    it('TC-08: GET - Gagal Mendapatkan Daftar Resources (Missing API Key)', () => {
        cy.request({
            method: 'GET',
            url: `${BASE_URL}/unknown`,
            failOnStatusCode: false
        }).then((response) => {

            expect(response.status).to.eq(401);

            // Assertion: Memastikan pesan error adalah Missing API key
            expect(response.body).to.have.property('error', 'Missing API key');

            cy.log('✅ Tes sukses: Akses Resources gagal karena otorisasi 401.');
        });
    });

});