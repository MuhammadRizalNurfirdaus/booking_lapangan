<?= $this->extend('layout/user_template'); ?>
<?= $this->section('content'); ?>

<div class="container my-5">
    <div class="row justify-content-center">
        <div class="col-lg-10">
            <!-- Tombol Kembali -->
            <a href="<?= site_url('/galeri') ?>" class="btn btn-outline-light mb-4"><i class="fas fa-arrow-left"></i> Kembali ke Galeri</a>

            <div class="card bg-dark text-white">
                <div class="card-body p-lg-5">
                    <!-- Judul -->
                    <h1 class="font-weight-bold mb-3"><?= esc($item['judul']); ?></h1>
                    <p class="text-muted">Diupload pada: <?= date('d F Y', strtotime($item['created_at'])); ?></p>
                    <hr style="border-color: #455a64;">

                    <!-- Gambar -->
                    <div class="my-4 text-center">
                        <img src="<?= base_url('uploads/galeri/' . $item['nama_file']); ?>" class="img-fluid rounded shadow" alt="<?= esc($item['judul']); ?>">
                    </div>

                    <!-- Deskripsi -->
                    <div class="deskripsi-content mt-4">
                        <p style="white-space: pre-wrap; font-size: 1.1rem; line-height: 1.8;">
                            <!-- nl2br akan mengubah baris baru (enter) menjadi tag <br> -->
                            <?= nl2br(esc($item['deskripsi'])); ?>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?= $this->endSection(); ?>