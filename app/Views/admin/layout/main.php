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