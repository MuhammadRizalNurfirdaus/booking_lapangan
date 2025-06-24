<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title><?= esc($title ?? 'Booking Lapangan'); ?></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <style>
        body {
            background-color: #1a2533;
            color: #f8f9fa;
        }

        .navbar {
            background-color: #2c3e50;
        }

        .navbar-dark .navbar-nav .nav-link {
            color: rgba(255, 255, 255, .75);
            font-weight: 500;
        }

        .navbar-dark .navbar-nav .nav-link:hover,
        .navbar-dark .navbar-nav .nav-link.active {
            color: #fff;
        }

        .dropdown-menu {
            background-color: #2c3e50;
            border-color: #455a64;
        }

        .dropdown-item {
            color: #f8f9fa;
        }

        .dropdown-item:hover {
            background-color: #34495e;
        }

        .navbar.sticky-top {
            z-index: 1030;
        }

        .dropdown-menu {
            position: absolute;
        }
    </style>
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top">
        <div class="container">
            <a class="navbar-brand font-weight-bold" href="<?= site_url('/') ?>">
                <img src="<?= base_url('images/logo.jpg') ?>" alt="Logo" style="height: 30px; margin-right: 10px;">
                Booking Lapangan
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item"><a class="nav-link" href="<?= site_url('/') ?>">Beranda</a></li>
                    <?php if (session()->get('isLoggedIn')): ?>
                        <li class="nav-item"><a class="nav-link" href="<?= site_url('/galeri') ?>">Galeri</a></li>
                        <li class="nav-item"><a class="nav-link" href="<?= site_url('/booking') ?>">Booking</a></li>
                        <li class="nav-item"><a class="nav-link" href="<?= site_url('/kontak') ?>">Kontak</a></li>
                    <?php endif; ?>
                </ul>
                <ul class="navbar-nav ml-auto align-items-center">
                    <?php if (session()->get('isLoggedIn')): ?>
                        <!-- [FIXED] Tampilan Navbar Jika Sudah Login -->
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <?php
                                // [FIXED] Logika untuk gambar default
                                $fotoProfil = session()->get('foto_profil');
                                $pathFoto = 'uploads/profil/' . $fotoProfil;
                                // Jika file tidak ada atau nama filenya 'default.png', gunakan gambar placeholder
                                if (empty($fotoProfil) || !file_exists(FCPATH . $pathFoto)) {
                                    // Anda bisa siapkan gambar default di public/images/default-avatar.png
                                    $pathFoto = 'images/default-avatar.png';
                                }
                                ?>
                                <img src="<?= base_url($pathFoto) ?>" class="rounded-circle mr-2" alt="Foto Profil" style="height: 25px; width: 25px; object-fit: cover;">
                                <span><?= esc(session()->get('nama_lengkap')); ?></span>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                                <a class="dropdown-item" href="<?= site_url('/riwayat') ?>">Riwayat Booking</a>
                                <a class="dropdown-item" href="<?= site_url('/profil') ?>">Profil Saya</a>
                                <?php if (session()->get('role') == 'admin'): ?>
                                    <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="<?= site_url('admin/dashboard') ?>"><i class="fas fa-cogs"></i> Panel Admin</a>
                                <?php endif; ?>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="<?= site_url('logout') ?>"><i class="fas fa-sign-out-alt"></i> Logout</a>
                            </div>
                        </li>
                    <?php else: ?>
                        <!-- TAMPILAN JIKA BELUM LOGIN (TAMU) -->
                        <li class="nav-item">
                            <a class="nav-link" href="<?= site_url('/login') ?>">Login</a>
                        </li>
                        <li class="nav-item ml-lg-2">
                            <a class="btn btn-success" href="<?= site_url('/register') ?>">Registrasi</a>
                        </li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>
    </nav>

    <main>
        <?= $this->renderSection('content') ?>
    </main>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
    <?= $this->renderSection('scripts') ?>
</body>

</html>