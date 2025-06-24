<?= $this->extend('admin/layout/main'); ?>
<?= $this->section('content'); ?>
<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= site_url('admin/dashboard') ?>">Dashboard</a></li>
        <li class="breadcrumb-item"><a href="<?= site_url('admin/pembayaran') ?>">Manajemen Pembayaran</a></li>
        <li class="breadcrumb-item active" aria-current="page">Detail Pembayaran #<?= $pesanan['id'] ?></li>
    </ol>
</nav>
<?php if (session()->getFlashdata('success')) : ?>
    <div class="alert alert-success"><?= session()->getFlashdata('success'); ?></div>
<?php endif; ?>

<div class="row">
    <!-- KOLOM KIRI: DETAIL & BUKTI -->
    <div class="col-lg-7 mb-4">
        <div class="card mb-4">
            <div class="card-header">
                <h4>Detail Pemesanan Terkait</h4>
            </div>
            <div class="card-body">
                <!-- [FIXED] Menggunakan table agar lebih rapi -->
                <table class="table table-dark table-borderless">
                    <tr>
                        <td style="width: 30%;">Pemesan</td>
                        <td>: <?= esc($pesanan['nama_lengkap'] ?? 'Guest'); ?> (<?= esc($pesanan['email'] ?? 'N/A'); ?>)</td>
                    </tr>
                    <tr>
                        <td>Kode Pesanan</td>
                        <td>: <span class="badge badge-primary"><?= esc($pesanan['kode_pemesanan']); ?></span></td>
                    </tr>
                    <tr>
                        <td>Tgl. Booking</td>
                        <td>: <?= date('d F Y', strtotime($pesanan['tanggal_booking'])); ?></td>
                    </tr>
                    <tr>
                        <td>Jadwal</td>
                        <td>: <?= date('H:i', strtotime($pesanan['jam_mulai'])) . ' - ' . date('H:i', strtotime($pesanan['jam_selesai'])); ?></td>
                    </tr>
                    <tr class="bg-dark">
                        <td class="h5">Total Tagihan</td>
                        <td class="h5 text-success">: Rp <?= number_format($pesanan['total_harga'], 0, ',', '.'); ?></td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="card">
            <div class="card-header">
                <h4>Bukti Pembayaran</h4>
            </div>
            <div class="card-body">
                <?php if (!empty($pesanan['bukti_pembayaran'])): ?>
                    <a href="<?= base_url('uploads/bukti_pembayaran/' . $pesanan['bukti_pembayaran']); ?>" target="_blank">
                        <img src="<?= base_url('uploads/bukti_pembayaran/' . $pesanan['bukti_pembayaran']); ?>" alt="Bukti Pembayaran" class="img-fluid" style="border: 3px solid #455a64; border-radius: 5px;">
                    </a>
                <?php else: ?>
                    <div class="alert alert-warning">Pengguna belum mengunggah bukti pembayaran.</div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- KOLOM KANAN: UPDATE & AKSI -->
    <div class="col-lg-5 mb-4">
        <div class="card">
            <div class="card-header">
                <h4>Update Status</h4>
            </div>
            <div class="card-body">
                <form action="<?= site_url('admin/pembayaran/update-status'); ?>" method="post">
                    <?= csrf_field(); ?>
                    <input type="hidden" name="id_pesanan" value="<?= $pesanan['id']; ?>">
                    <div class="form-group">
                        <label>Status Pembayaran</label>
                        <select name="status_pembayaran" class="form-control bg-dark text-white">
                            <option value="pending" <?= $pesanan['status_pembayaran'] == 'pending' ? 'selected' : ''; ?>>Pending</option>
                            <option value="paid" <?= $pesanan['status_pembayaran'] == 'paid' ? 'selected' : ''; ?>>Paid</option>
                            <option value="failed" <?= $pesanan['status_pembayaran'] == 'failed' ? 'selected' : ''; ?>>Failed</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Status Pemesanan</label>
                        <select name="status_pemesanan" class="form-control bg-dark text-white">
                            <option value="pending" <?= $pesanan['status_pemesanan'] == 'pending' ? 'selected' : ''; ?>>Pending</option>
                            <option value="confirmed" <?= $pesanan['status_pemesanan'] == 'confirmed' ? 'selected' : ''; ?>>Confirmed</option>
                            <option value="cancelled" <?= $pesanan['status_pemesanan'] == 'cancelled' ? 'selected' : ''; ?>>Cancelled</option>
                            <option value="completed" <?= $pesanan['status_pemesanan'] == 'completed' ? 'selected' : ''; ?>>Completed</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Update Status</button>
                </form>
            </div>
        </div>
        <!-- [BARU] Tombol Aksi Tambahan -->
        <div class="card mt-4">
            <div class="card-header">
                <h4>Aksi Lainnya</h4>
            </div>
            <div class="card-body">
                <a href="<?= site_url('admin/pembayaran/cetak/' . $pesanan['id']); ?>" class="btn btn-info btn-block" target="_blank">Cetak Bukti Pembayaran</a>
            </div>
        </div>
    </div>
</div>
<?= $this->endSection(); ?>