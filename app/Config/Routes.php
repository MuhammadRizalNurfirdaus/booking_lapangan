<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

//====================================================================
// RUTE YANG SELALU BISA DIAKSES PUBLIK (Hanya Beranda)
//====================================================================
$routes->get('/', 'Home::index');


//====================================================================
// RUTE AUTENTIKASI (LOGIN, REGISTER, LOGOUT)
//====================================================================
$routes->get('/login', 'Auth::login');
$routes->post('/login', 'Auth::attemptLogin');
$routes->get('/register', 'Auth::register');
$routes->post('/register', 'Auth::attemptRegister');
$routes->get('/logout', 'Auth::logout');


//====================================================================
// RUTE YANG WAJIB LOGIN (Area Pengguna & Halaman Terproteksi)
//====================================================================
$routes->group('', ['filter' => 'login'], function ($routes) {

    // Halaman yang sebelumnya publik, sekarang dilindungi
    $routes->get('/galeri', 'Home::galeri');
    $routes->get('/galeri/detail/(:num)', 'Home::detailGaleri/$1');
    $routes->get('/kontak', 'Home::kontak');
    $routes->post('/kontak/kirim', 'Home::kirimPesan');

    // Halaman Booking
    $routes->get('/booking', 'Booking::index');
    $routes->get('/booking/get-jadwal', 'Booking::getJadwal');
    $routes->post('/booking/store', 'Booking::store');
    $routes->get('/booking/konfirmasi/(:segment)', 'Booking::konfirmasi/$1');
    $routes->post('/booking/simpan-pembayaran', 'Booking::simpanPembayaran');

    // Halaman Area Pengguna
    $routes->get('/riwayat', 'User::riwayat');
    $routes->post('/user/feedback', 'User::kirimFeedback');
    $routes->post('/user/feedback', 'User::kirimFeedback', ['as' => 'kirim_feedback']);
    $routes->get('/profil', 'Profil::index');
    $routes->post('/profil/update', 'Profil::update');
    $routes->post('/profil/update-password', 'Profil::updatePassword');
    $routes->get('/riwayat/hapus/(:num)', 'User::hapusRiwayat/$1');
    $routes->get('/struk/cetak/(:segment)', 'User::cetakStruk/$1');
});


//====================================================================
// RUTE ADMIN PANEL (Wajib Login & Role Admin)
//====================================================================
$routes->group('admin', ['filter' => 'admin'], function ($routes) {
    $routes->get('/', 'Admin::dashboard');
    $routes->get('dashboard', 'Admin::dashboard');

    // Rute Admin - Konten
    $routes->get('galeri', 'Admin::galeri');
    $routes->post('galeri/simpan', 'Admin::simpanGaleri');
    $routes->get('galeri/detail/(:num)', 'Admin::detailGaleri/$1');
    $routes->get('galeri/hapus/(:num)', 'Admin::hapusGaleri/$1');
    $routes->get('pesan-kontak', 'Admin::pesanKontak');
    $routes->get('pesan-kontak/hapus/(:num)', 'Admin::hapusPesanKontak/$1');
    $routes->get('feedback', 'Admin::feedback');
    $routes->get('feedback/hapus/(:num)', 'Admin::hapusFeedback/$1');

    // Rute Admin - Pemesanan
    $routes->get('pembayaran', 'Admin::pembayaran');
    $routes->get('pembayaran/detail/(:num)', 'Admin::detailPembayaran/$1');
    $routes->get('pembayaran/cetak/(:num)', 'Admin::cetakPembayaran/$1');
    $routes->post('pembayaran/update-status', 'Admin::updateStatus');
    $routes->get('pembayaran/hapus/(:num)', 'Admin::hapusPembayaran/$1');

    // Rute Admin - Fasilitas
    $routes->get('jadwal', 'Admin::jadwal');
    $routes->post('jadwal/simpan', 'Admin::simpanJadwal');
    $routes->get('jadwal/hapus/(:num)', 'Admin::hapusJadwal/$1');

    // Rute Admin - Administrasi
    $routes->get('users', 'Admin::users');
    $routes->post('users/simpan', 'Admin::simpanUser');
    $routes->get('users/hapus/(:num)', 'Admin::hapusUser/$1');
});
