<?= $this->extend('admin/layout/main'); ?>
<?= $this->section('content'); ?>
<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
    </ol>
</nav>

<h4>Ringkasan Pemesanan</h4>
<div class="row mt-3">
    <!-- Kartu Total Pesanan -->
    <div class="col-md-4 mb-4 d-flex align-items-stretch">
        <div class="card text-white bg-primary w-100">
            <div class="card-body d-flex flex-column justify-content-between">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-0">TOTAL PESANAN</h5>
                    </div>
                    <i class="fas fa-clipboard-list fa-3x"></i>
                </div>
                <h3 class="mt-3 mb-0 font-weight-bold"><?= $total_pesanan; ?></h3>
            </div>
        </div>
    </div>
    <!-- Kartu Pesanan Pending -->
    <div class="col-md-4 mb-4 d-flex align-items-stretch">
        <div class="card text-white bg-warning w-100">
            <div class="card-body d-flex flex-column justify-content-between">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-0">PESANAN PENDING</h5>
                    </div>
                    <i class="fas fa-clock fa-3x"></i>
                </div>
                <h3 class="mt-3 mb-0 font-weight-bold"><?= $pesanan_pending; ?></h3>
            </div>
        </div>
    </div>
    <!-- Kartu Total Pendapatan -->
    <div class="col-md-4 mb-4 d-flex align-items-stretch">
        <div class="card text-white bg-success w-100">
            <div class="card-body d-flex flex-column justify-content-between">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-0">TOTAL PENDAPATAN</h5>
                    </div>
                    <i class="fas fa-dollar-sign fa-3x"></i>
                </div>
                <h3 class="mt-3 mb-0 font-weight-bold">Rp <?= number_format($total_pendapatan, 0, ',', '.'); ?></h3>
            </div>
        </div>
    </div>
</div>

<h4 class="mt-3">Ringkasan Konten & Pengguna</h4>
<div class="row mt-3">
    <!-- Kartu Total Galeri -->
    <div class="col-md-4 mb-4 d-flex align-items-stretch">
        <div class="card text-white bg-danger w-100">
            <div class="card-body d-flex flex-column justify-content-between">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-0">TOTAL FOTO GALERI</h5>
                    </div>
                    <i class="fas fa-images fa-3x"></i>
                </div>
                <h3 class="mt-3 mb-0 font-weight-bold"><?= $total_galeri; ?></h3>
            </div>
        </div>
    </div>
    <!-- Kartu Pengguna Terdaftar -->
    <div class="col-md-4 mb-4 d-flex align-items-stretch">
        <div class="card text-white bg-info w-100">
            <div class="card-body d-flex flex-column justify-content-between">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-0">PENGGUNA TERDAFTAR</h5>
                    </div>
                    <i class="fas fa-user-friends fa-3x"></i>
                </div>
                <h3 class="mt-3 mb-0 font-weight-bold"><?= $total_user; ?></h3>
            </div>
        </div>
    </div>
</div>
<?= $this->endSection(); ?>