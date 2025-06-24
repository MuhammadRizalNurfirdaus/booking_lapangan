<?= $this->extend('layout/user_template'); ?>
<?= $this->section('content'); ?>

<style>
    .gallery-card {
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        border: none;
        text-decoration: none;
        /* Menghilangkan garis bawah pada link */
        color: white;
    }

    .gallery-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        color: white;
    }

    .gallery-img-container {
        height: 250px;
        overflow: hidden;
        background-color: #343a40;
    }

    .gallery-img-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .text-truncate {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .map-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1030;
    }

    .map-container iframe {
        width: 350px;
        height: 250px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        border: 2px solid #34495e;
    }

    @media (max-width: 768px) {
        .map-container {
            display: none;
        }
    }
</style>

<div class="container my-5">
    <h2 class="text-center mb-4 font-weight-bold"><?= esc($title ?? 'Galeri Foto Lapangan'); ?></h2>
    <hr style="border-color: #455a64;">
    <div class="row mt-5">
        <?php if (empty($fotos)): ?>
            <p class="text-center col-12 text-muted">Belum ada foto di galeri.</p>
            <?php else: foreach ($fotos as $foto): ?>
                <div class="col-md-4 mb-4">
                    <!-- [FIXED] Kartu sekarang adalah sebuah link, bukan lagi pemicu modal -->
                    <a href="<?= site_url('galeri/detail/' . $foto['id']); ?>" class="card bg-dark gallery-card">
                        <div class="gallery-img-container">
                            <img src="<?= base_url('uploads/galeri/' . $foto['nama_file']); ?>" alt="<?= esc($foto['judul']); ?>">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title text-truncate"><?= esc($foto['judul']); ?></h5>
                        </div>
                    </a>
                </div>
        <?php endforeach;
        endif; ?>
    </div>
</div>

<!-- Peta Lokasi (tetap sama) -->
<div class="map-container">
    <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3960.984021275996!2d108.5011933!3d-6.9687585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwNTgnMDcuNSJTIDEwOMKwMzAnMDQuMyJF!5e0!3m2!1sen!2sid!4v1687654321098!5m2!1sen!2sid" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div>

<!-- Hapus semua kode Modal dan JavaScript dari file ini karena sudah tidak diperlukan -->

<?= $this->endSection(); ?>