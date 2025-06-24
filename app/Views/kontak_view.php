<?= $this->extend('layout/user_template'); ?>
<?= $this->section('content'); ?>
<div class="container my-5">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card bg-dark p-4 shadow">
                <div class="card-body">
                    <h2 class="text-center">Hubungi Kami</h2>
                    <p class="text-center text-muted mb-4">Ada pertanyaan atau saran? Kirimkan kepada kami.</p>

                    <?php if (session()->getFlashdata('success')): ?>
                        <div class="alert alert-success"><?= session()->getFlashdata('success') ?></div>
                    <?php endif; ?>

                    <?php if (session()->getFlashdata('errors')): ?>
                        <div class="alert alert-danger">
                            <ul><?php foreach (session('errors') as $error) : ?><li><?= esc($error) ?></li><?php endforeach ?></ul>
                        </div>
                    <?php endif; ?>

                    <form action="<?= site_url('kontak/kirim') ?>" method="post">
                        <?= csrf_field() ?>

                        <!-- [LOGIKA BARU] Cek apakah variabel $user ada (artinya sudah login) -->
                        <?php if ($user): ?>
                            <!-- Tampilan jika sudah login -->
                            <div class="form-group">
                                <label for="nama_pengirim">Nama Anda</label>
                                <input type="text" id="nama_pengirim" name="nama_pengirim" class="form-control" value="<?= esc($user['nama_lengkap']); ?>" readonly>
                            </div>
                            <div class="form-group">
                                <label for="email">Email Anda</label>
                                <input type="email" id="email" name="email" class="form-control" value="<?= esc($user['email']); ?>" readonly>
                            </div>
                        <?php else: ?>
                            <!-- Tampilan jika belum login (tamu) -->
                            <div class="form-group">
                                <label for="nama_pengirim">Nama Anda</label>
                                <input type="text" id="nama_pengirim" name="nama_pengirim" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email Anda</label>
                                <input type="email" id="email" name="email" class="form-control" required>
                            </div>
                        <?php endif; ?>

                        <!-- Bagian Pesan tetap sama untuk keduanya -->
                        <div class="form-group">
                            <label for="pesan">Pesan</label>
                            <textarea id="pesan" name="pesan" class="form-control" rows="5" required></textarea>
                        </div>

                        <button type="submit" class="btn btn-primary btn-block">Kirim Pesan</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
<?= $this->endSection(); ?>