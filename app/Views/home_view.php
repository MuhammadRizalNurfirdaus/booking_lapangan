<?= $this->extend('layout/user_template'); ?>
<?= $this->section('content'); ?>

<!-- CSS khusus untuk halaman ini -->
<style>
    .hero-section {
        height: calc(100vh - 56px);

        /* 
        ================================================================
        [FIXED] Menggunakan path URL absolut secara langsung.
        Ini adalah metode paling andal untuk server development.
        ================================================================
        */
        background-image:
            linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
            url('/images/background.png');
        /* Perubahan utama ada di sini */

        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;

        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .hero-section h1 {
        text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
    }
</style>

<div class="hero-section">
    <div class="container text-white">
        <h1 class="display-3 font-weight-bold">Rasakan Sensasi Bermain Terbaik</h1>
        <p class="lead my-4">Booking lapangan sepak bola dengan fasilitas standar internasional, mudah dan cepat.</p>
        <div>
            <a href="<?= site_url('/booking') ?>" class="btn btn-success btn-lg mx-2">Booking Sekarang</a>
            <a href="<?= site_url('/galeri') ?>" class="btn btn-outline-light btn-lg mx-2">Lihat Galeri</a>
        </div>
    </div>
</div>
<?= $this->endSection(); ?>