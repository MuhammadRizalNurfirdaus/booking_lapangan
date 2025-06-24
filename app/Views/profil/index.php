<?= $this->extend('layout/user_template'); ?>
<?= $this->section('content'); ?>
<div class="container my-5">
    <h3 class="mb-4">Profil Saya</h3>

    <!-- Tampilkan Pesan Sukses/Error -->
    <?php if (session()->getFlashdata('success')) : ?><div class="alert alert-success"><?= session()->getFlashdata('success'); ?></div><?php endif; ?>
    <?php if (session()->getFlashdata('success_password')) : ?><div class="alert alert-success"><?= session()->getFlashdata('success_password'); ?></div><?php endif; ?>
    <?php if (session()->getFlashdata('error_password')) : ?><div class="alert alert-danger"><?= session()->getFlashdata('error_password'); ?></div><?php endif; ?>
    <?php if (session()->getFlashdata('errors')) : ?><div class="alert alert-danger">
            <ul><?php foreach (session('errors') as $error) : ?><li><?= esc($error) ?></li><?php endforeach ?></ul>
        </div><?php endif; ?>

    <div class="row">
        <div class="col-lg-4">
            <div class="card bg-dark text-white text-center">
                <div class="card-body">
                    <img class="img-fluid rounded-circle mb-3" src="<?= base_url('uploads/profil/' . $user['foto_profil']); ?>" alt="<?= $user['nama_lengkap']; ?>" style="width: 150px; height: 150px; object-fit: cover;">
                    <h5 class="card-title"><?= $user['nama_lengkap']; ?></h5>
                    <p class="card-text text-muted"><?= $user['email']; ?></p>
                </div>
            </div>
        </div>
        <div class="col-lg-8">
            <div class="card bg-dark text-white mb-4">
                <div class="card-header">Edit Informasi Profil</div>
                <div class="card-body">
                    <form action="<?= site_url('/profil/update'); ?>" method="post" enctype="multipart/form-data">
                        <?= csrf_field(); ?>
                        <div class="form-group"><label>Nama Lengkap</label><input type="text" class="form-control" name="nama_lengkap" value="<?= old('nama_lengkap', $user['nama_lengkap']); ?>"></div>
                        <div class="form-group"><label>Email</label><input type="email" class="form-control" name="email" value="<?= old('email', $user['email']); ?>"></div>
                        <div class="form-group"><label>Ganti Foto Profil (Opsional)</label><input type="file" class="form-control-file" name="foto_profil"><small class="form-text text-muted">Format: JPG, PNG. Maks: 2MB.</small></div>
                        <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
                    </form>
                </div>
            </div>
            <div class="card bg-dark text-white">
                <div class="card-header">Ubah Password</div>
                <div class="card-body">
                    <form action="<?= site_url('/profil/update-password'); ?>" method="post">
                        <?= csrf_field(); ?>
                        <div class="form-group"><label>Password Lama</label><input type="password" name="password_lama" class="form-control" required></div>
                        <div class="form-group"><label>Password Baru</label><input type="password" name="password_baru" class="form-control" required></div>
                        <div class="form-group"><label>Konfirmasi Password Baru</label><input type="password" name="konfirmasi_password" class="form-control" required></div>
                        <button type="submit" class="btn btn-warning">Ubah Password</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
<?= $this->endSection(); ?>