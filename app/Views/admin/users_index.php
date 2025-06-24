<?= $this->extend('admin/layout/main'); ?>
<?= $this->section('content'); ?>
<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= site_url('admin/dashboard') ?>">Dashboard</a></li>
        <li class="breadcrumb-item active" aria-current="page">Manajemen Pengguna</li>
    </ol>
</nav>

<?php if (session()->getFlashdata('success')) : ?>
    <div class="alert alert-success"><?= session()->getFlashdata('success'); ?></div>
<?php endif; ?>
<?php if (session()->getFlashdata('error')) : ?>
    <div class="alert alert-danger"><?= session()->getFlashdata('error'); ?></div>
<?php endif; ?>
<?php if (session()->getFlashdata('errors')) : ?>
    <div class="alert alert-danger">
        <ul><?php foreach (session('errors') as $error) : ?><li><?= esc($error) ?></li><?php endforeach ?></ul>
    </div>
<?php endif; ?>

<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h4>Daftar Pengguna Terdaftar</h4>
        <button class="btn btn-success btn-add"><i class="fas fa-plus"></i> Tambah Pengguna</button>
    </div>
    <div class="card-body">
        <form action="" method="get" class="mb-4">
            <div class="input-group">
                <input type="text" class="form-control" name="keyword" placeholder="Cari nama atau email pengguna..." value="<?= esc($keyword ?? '') ?>">
                <div class="input-group-append">
                    <button class="btn btn-primary" type="submit"><i class="fas fa-search"></i> Cari</button>
                </div>
            </div>
        </form>
        <div class="table-responsive">
            <table class="table table-dark table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama Lengkap</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Terdaftar</th>
                        <th class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($users)): ?>
                        <tr>
                            <td colspan="6" class="text-center">Tidak ada pengguna.</td>
                        </tr>
                        <?php else: foreach ($users as $user): ?>
                            <tr>
                                <td><?= $user['id']; ?></td>
                                <td><?= esc($user['nama_lengkap']); ?></td>
                                <td><?= esc($user['email']); ?></td>
                                <td><span class="badge badge-<?= ($user['role'] == 'admin') ? 'success' : 'secondary'; ?> p-2"><?= ucfirst($user['role']); ?></span></td>
                                <td><?= date('d M Y, H:i', strtotime($user['created_at'])); ?></td>
                                <td class="text-center">
                                    <div class="btn-group">
                                        <button class="btn btn-warning btn-sm btn-edit"
                                            data-id="<?= $user['id']; ?>"
                                            data-nama="<?= esc($user['nama_lengkap']); ?>"
                                            data-email="<?= esc($user['email']); ?>"
                                            data-role="<?= $user['role']; ?>">
                                            <i class="fas fa-edit"></i> Edit
                                        </button>
                                        <?php if ($user['id'] != session()->get('user_id')): // Jangan tampilkan tombol hapus untuk diri sendiri 
                                        ?>
                                            <a href="<?= site_url('admin/users/hapus/' . $user['id']); ?>" class="btn btn-danger btn-sm" onclick="return confirm('Yakin ingin menghapus pengguna ini?')">
                                                <i class="fas fa-trash"></i> Hapus
                                            </a>
                                        <?php endif; ?>
                                    </div>
                                </td>
                            </tr>
                    <?php endforeach;
                    endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal Tambah/Edit Pengguna -->
<div class="modal fade text-dark" id="userModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalTitle">Form Pengguna</h5><button type="button" class="close" data-dismiss="modal">×</button>
            </div>
            <form action="<?= site_url('admin/users/simpan'); ?>" method="post">
                <?= csrf_field(); ?>
                <input type="hidden" name="id" id="id_user">
                <div class="modal-body">
                    <div class="form-group"><label>Nama Lengkap</label><input type="text" name="nama_lengkap" id="nama_lengkap" class="form-control" required></div>
                    <div class="form-group"><label>Email</label><input type="email" name="email" id="email" class="form-control" required></div>
                    <div class="form-group"><label>Password</label><input type="password" name="password" id="password" class="form-control"><small id="passwordHelp" class="form-text text-muted">Kosongkan jika tidak ingin mengubah password.</small></div>
                    <div class="form-group"><label>Role</label><select name="role" id="role" class="form-control" required>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select></div>
                </div>
                <div class="modal-footer"><button type="submit" class="btn btn-primary">Simpan</button></div>
            </form>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const btnAdd = document.querySelector('.btn-add');
        const btnEditList = document.querySelectorAll('.btn-edit');
        const modal = $('#userModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = modal.find('form');
        const idInput = document.getElementById('id_user');
        const namaInput = document.getElementById('nama_lengkap');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const roleInput = document.getElementById('role');
        const passwordHelp = document.getElementById('passwordHelp');

        btnAdd.addEventListener('click', function() {
            form[0].reset();
            idInput.value = '';
            modalTitle.textContent = 'Tambah Pengguna Baru';
            passwordInput.setAttribute('required', 'required');
            passwordHelp.style.display = 'none';
            modal.modal('show');
        });

        btnEditList.forEach(btn => {
            btn.addEventListener('click', function() {
                const data = this.dataset;
                idInput.value = data.id;
                namaInput.value = data.nama;
                emailInput.value = data.email;
                roleInput.value = data.role;
                modalTitle.textContent = 'Edit Pengguna';
                passwordInput.removeAttribute('required');
                passwordHelp.style.display = 'block';
                modal.modal('show');
            });
        });
    });
</script>
<?= $this->endSection(); ?>