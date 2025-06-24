<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title><?= esc($title ?? 'Admin Panel'); ?> - Booking Lapangan</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <style>
        body {
            display: flex;
            background-color: #1a2533;
            color: #f8f9fa;
        }

        .sidebar {
            height: 100vh;
            width: 280px;
            background-color: #2c3e50;
            padding: 15px;
            position: fixed;
            top: 0;
            left: 0;
            display: flex;
            flex-direction: column;
        }

        .sidebar-header {
            flex-shrink: 0;
            border-bottom: 1px solid #455a64;
            padding-bottom: 15px;
            margin-bottom: 15px;
        }

        .sidebar-nav {
            flex-grow: 1;
            overflow-y: auto;
            overflow-x: hidden;
            min-height: 0;
        }

        .sidebar-nav::-webkit-scrollbar {
            width: 8px;
        }

        .sidebar-nav::-webkit-scrollbar-track {
            background: #2c3e50;
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
            background-color: #455a64;
            border-radius: 4px;
        }

        .sidebar-nav::-webkit-scrollbar-thumb:hover {
            background-color: #546e7a;
        }

        .sidebar-heading {
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: .05rem;
            font-weight: bold;
        }

        .sidebar .nav-link {
            color: #bdc3c7;
            padding: 10px 15px;
            border-radius: 4px;
            margin-bottom: 5px;
        }

        .sidebar .nav-link.active,
        .sidebar .nav-link:hover {
            color: white;
            background-color: #16a085;
        }

        .sidebar .nav-link .fas {
            margin-right: 10px;
            width: 20px;
            text-align: center;
        }

        .sidebar-footer {
            flex-shrink: 0;
            padding-top: 15px;
            border-top: 1px solid #455a64;
        }

        .main-content {
            margin-left: 280px;
            flex-grow: 1;
            padding: 25px;
        }

        .navbar-admin {
            background-color: #2c3e50;
            color: white;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }

        .card {
            background-color: #2c3e50;
            border: 1px solid #455a64;
        }

        .breadcrumb {
            background-color: #34495e;
        }

        .breadcrumb-item a {
            color: #1abc9c;
        }

        .breadcrumb-item.active {
            color: #95a5a6;
        }
    </style>
</head>

<body>
    <!-- =============== SIDEBAR =============== -->
    <div class="sidebar">
        <!-- Bagian 1: Header -->
        <div class="sidebar-header">
            <a href="<?= site_url('admin/dashboard') ?>" class="d-flex align-items-center text-white" style="text-decoration: none;">
                <img src="<?= base_url('images/logo.jpg') ?>" alt="Logo" style="height: 40px; margin-right: 15px;">
                <h5 class="mb-0" style="font-weight: bold;">Booking Lapangan</h5>
            </a>
        </div>

        <!-- Bagian 2: Navigasi Menu -->
        <ul class="nav flex-column sidebar-nav">
            <li class="nav-item">
                <small class="sidebar-heading px-3 mt-2 mb-1 text-muted">UTAMA</small>
                <a class="nav-link <?= (current_url(true)->getSegment(2) == 'dashboard') ? 'active' : ''; ?>" href="<?= site_url('admin/dashboard') ?>"><i class="fas fa-tachometer-alt"></i>Dashboard</a>
            </li>
            <li class="nav-item">
                <small class="sidebar-heading px-3 mt-2 mb-1 text-muted">MANAJEMEN KONTEN</small>
                <a class="nav-link <?= (current_url(true)->getSegment(2) == 'galeri') ? 'active' : ''; ?>" href="<?= site_url('admin/galeri') ?>"><i class="fas fa-images"></i>Galeri</a>
            </li>
            <li class="nav-item">
                <small class="sidebar-heading px-3 mt-2 mb-1 text-muted">MANAJEMEN PEMESANAN</small>
                <a class="nav-link <?= (current_url(true)->getSegment(2) == 'pembayaran') ? 'active' : ''; ?>" href="<?= site_url('admin/pembayaran') ?>"><i class="fas fa-file-invoice-dollar"></i>Manajemen Pembayaran</a>
            </li>
            <li class="nav-item">
                <small class="sidebar-heading px-3 mt-2 mb-1 text-muted">MANAJEMEN FASILITAS</small>
                <a class="nav-link <?= (current_url(true)->getSegment(2) == 'jadwal') ? 'active' : ''; ?>" href="<?= site_url('admin/jadwal') ?>"><i class="fas fa-calendar-alt"></i>Manajemen Slot Waktu</a>
            </li>
            <li class="nav-item">
                <small class="sidebar-heading px-3 mt-2 mb-1 text-muted">INTERAKSI PENGGUNA</small>
                <a class="nav-link <?= (current_url(true)->getSegment(2) == 'pesan-kontak') ? 'active' : ''; ?>" href="<?= site_url('admin/pesan-kontak') ?>"><i class="fas fa-envelope"></i>Pesan Kontak</a>
                <a class="nav-link <?= (current_url(true)->getSegment(2) == 'feedback') ? 'active' : ''; ?>" href="<?= site_url('admin/feedback') ?>"><i class="fas fa-comment-dots"></i>Feedback Pengguna</a>
            </li>
            <li class="nav-item">
                <small class="sidebar-heading px-3 mt-2 mb-1 text-muted">ADMINISTRASI SITUS</small>
                <a class="nav-link <?= (current_url(true)->getSegment(2) == 'users') ? 'active' : ''; ?>" href="<?= site_url('admin/users') ?>"><i class="fas fa-users"></i>Manajemen Pengguna</a>
            </li>
        </ul>

        <!-- Bagian 3: Footer Sidebar -->
        <div class="sidebar-footer">
            <a class="nav-link" href="<?= site_url('logout') ?>"><i class="fas fa-sign-out-alt"></i>Logout</a>
        </div>
    </div>

    <!-- =============== KONTEN UTAMA =============== -->
    <div class="main-content">
        <div class="navbar-admin d-flex justify-content-between align-items-center">
            <!-- [FIXED] Menambahkan foto profil di sini -->
            <div class="d-flex align-items-center">
                <img src="<?= base_url('uploads/profil/' . session()->get('foto_profil')) ?>" class="rounded-circle mr-3" alt="Foto Admin" style="height: 35px; width: 35px; object-fit: cover;">
                <span>Halo, <strong><?= session()->get('nama_lengkap'); ?></strong>!</span>
            </div>
            <a href="<?= site_url('/') ?>" class="btn btn-outline-light btn-sm" target="_blank">Lihat Situs</a>
        </div>
        <?= $this->renderSection('content') ?>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>