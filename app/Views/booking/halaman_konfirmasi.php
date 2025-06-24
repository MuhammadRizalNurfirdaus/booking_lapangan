<?= $this->extend('layout/user_template'); ?>
<?= $this->section('content'); ?>

<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title><?= esc($title); ?></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <style>
        body {
            background-color: #1a2533;
            color: #f8f9fa;
        }

        .card {
            background-color: #2c3e50;
            border: 1px solid #455a64;
        }

        .card-header {
            background-color: #34495e;
            border-bottom: 1px solid #455a64;
        }

        .list-group-item {
            background-color: transparent;
            border-color: #455a64;
        }

        .alert-success-custom {
            background-color: #1e4620;
            color: #a3e0a5;
            border-color: #2a642d;
        }

        .alert-info-custom {
            background-color: #0c3b59;
            color: #9ed8ff;
            border-color: #11527c;
        }

        .alert-danger-custom {
            background-color: #5c2121;
            color: #f8d7da;
            border-color: #843534;
        }

        .form-control {
            background-color: #455a64;
            color: white;
            border-color: #546e7a;
        }

        .form-control:focus {
            background-color: #546e7a;
            color: white;
            border-color: #78909c;
            box-shadow: none;
        }

        .form-control::placeholder {
            color: #b0bec5;
        }

        select.form-control option {
            background: #455a64;
            color: white;
        }
    </style>
</head>

<body>
    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="card shadow">
                    <div class="card-header">
                        <h3 class="mb-0"><i class="fas fa-file-invoice-dollar"></i> Detail Pemesanan</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <!-- KOLOM KIRI: RINCIAN PEMESANAN -->
                            <div class="col-md-7 mb-4 mb-md-0">
                                <h4>Ringkasan Pesanan</h4>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item d-flex justify-content-between"><span>Tanggal Pemesanan:</span><strong><?= date('d F Y, H:i', strtotime(esc($pesanan['created_at']))); ?></strong></li>
                                    <li class="list-group-item d-flex justify-content-between"><span>Tanggal Booking:</span><strong><?= date('d F Y', strtotime(esc($pesanan['tanggal_booking']))); ?></strong></li>
                                    <li class="list-group-item d-flex justify-content-between"><span>Kode Pemesanan:</span><strong><span class="badge badge-primary p-2"><?= esc($pesanan['kode_pemesanan']); ?></span></strong></li>
                                </ul>
                                <hr style="border-color: #455a64;">
                                <h5 class="mt-3">Item Pesanan</h5>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item d-flex justify-content-between">
                                        <div><strong>Booking Lapangan</strong><br><small>Jadwal: <?= date('H:i', strtotime(esc($pesanan['jam_mulai']))) . ' - ' . date('H:i', strtotime(esc($pesanan['jam_selesai']))); ?></small></div><span>Rp <?= number_format(esc($pesanan['total_harga']), 0, ',', '.'); ?></span>
                                    </li>
                                </ul>
                                <hr style="border-color: #455a64;">
                                <div class="d-flex justify-content-between h4 mt-3"><span>Total Pembayaran:</span><strong class="text-success">Rp <?= number_format(esc($pesanan['total_harga']), 0, ',', '.'); ?></strong></div>
                            </div>

                            <!-- KOLOM KANAN: STATUS & PEMBAYARAN -->
                            <div class="col-md-5">
                                <h4>Status & Pembayaran</h4>
                                <div class="d-flex justify-content-between mb-3 align-items-center"><span>Status Pesanan:</span><span class="badge badge-<?= ($pesanan['status_pemesanan'] == 'confirmed') ? 'success' : 'warning' ?> p-2"><?= ucfirst(esc($pesanan['status_pemesanan'])); ?></span></div>
                                <div class="d-flex justify-content-between mb-3 align-items-center"><span>Status Pembayaran:</span><span class="badge badge-<?= $pesanan['status_pembayaran'] == 'paid' ? 'success' : 'warning' ?> p-2"><?= ucfirst(esc($pesanan['status_pembayaran'])); ?></span></div>
                                <hr style="border-color: #455a64;">

                                <!-- [FIXED] Logika untuk menampilkan form atau pesan -->
                                <?php if ($pesanan['status_pembayaran'] == 'pending'): ?>
                                    <div class="alert alert-info-custom mt-3">
                                        <h5 class="alert-heading">Instruksi Pembayaran</h5>
                                        <p>Silakan transfer sejumlah <strong>Rp <?= number_format(esc($pesanan['total_harga']), 0, ',', '.'); ?></strong> ke salah satu rekening berikut:</p>
                                        <ul class="list-unstyled">
                                            <li><strong>Bank BCA:</strong> 1234567890 (a.n. Booking Lapangan)</li>
                                            <li><strong>Bank BNI:</strong> 0987654321 (a.n. Booking Lapangan)</li>
                                        </ul>
                                    </div>
                                    <form action="<?= site_url('/booking/simpan-pembayaran'); ?>" method="post" enctype="multipart/form-data" class="mt-4">
                                        <?= csrf_field(); ?><input type="hidden" name="kode_pemesanan" value="<?= esc($pesanan['kode_pemesanan']); ?>">
                                        <div class="form-group"><label for="bank_tujuan">Bank Tujuan Transfer Anda <span class="text-danger">*</span></label><select class="form-control" id="bank_tujuan" name="bank_tujuan" required>
                                                <option value="">-- Pilih Bank --</option>
                                                <option value="BCA">Bank BCA</option>
                                                <option value="BNI">Bank BNI</option>
                                                <option value="Lainnya">Bank Lainnya</option>
                                            </select></div>
                                        <div class="form-group"><label for="bukti_pembayaran">Unggah Bukti Transfer <span class="text-danger">*</span></label><input type="file" class="form-control-file" id="bukti_pembayaran" name="bukti_pembayaran" required><small class="form-text text-muted">Format: JPG, PNG. Maks: 2MB.</small></div>
                                        <div class="form-group"><label for="catatan_pembayaran">Catatan Tambahan (Opsional)</label><textarea class="form-control" name="catatan_pembayaran" id="catatan_pembayaran" rows="2" placeholder="Contoh: transfer dari rekening a.n. Budi S."></textarea></div><button type="submit" class="btn btn-success btn-block mt-4">KIRIM KONFIRMASI PEMBAYARAN</button>
                                    </form>
                                <?php elseif ($pesanan['status_pembayaran'] == 'paid' && $pesanan['status_pemesanan'] == 'pending'): ?>
                                    <div class="alert alert-info-custom mt-4">
                                        <h4 class="alert-heading">Pembayaran Diterima!</h4>
                                        <p class="mb-0">Terima kasih, pembayaran Anda telah kami terima. Mohon tunggu pesanan Anda dikonfirmasi oleh admin.</p>
                                    </div>
                                <?php elseif ($pesanan['status_pemesanan'] == 'confirmed'): ?>
                                    <div class="alert alert-success-custom mt-4">
                                        <h4 class="alert-heading">Pesanan Dikonfirmasi!</h4>
                                        <p class="mb-0">Pemesanan Anda sudah siap. Silakan cetak struk sebagai bukti saat datang ke lokasi.</p>
                                    </div>
                                <?php elseif ($pesanan['status_pemesanan'] == 'completed'): ?>
                                    <div class="alert alert-primary mt-4">
                                        <h4 class="alert-heading">Pesanan Selesai</h4>
                                        <p class="mb-0">Terima kasih telah bermain di tempat kami.</p>
                                    </div>
                                <?php elseif ($pesanan['status_pemesanan'] == 'cancelled' || $pesanan['status_pembayaran'] == 'failed'): ?>
                                    <div class="alert alert-danger-custom mt-4">
                                        <h4 class="alert-heading">Pesanan Dibatalkan</h4>
                                        <p class="mb-0">Pesanan ini telah dibatalkan. Silakan hubungi kami jika terjadi kesalahan.</p>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                        <hr style="border-color: #455a64;">
                        <div class="d-flex justify-content-end align-items-center mt-3">
                            <?php if ($pesanan['status_pembayaran'] == 'paid' && in_array($pesanan['status_pemesanan'], ['confirmed', 'completed'])): ?>
                                <a href="<?= site_url('struk/cetak/' . $pesanan['kode_pemesanan']); ?>" class="btn btn-success mr-2" target="_blank"><i class="fas fa-print"></i> Cetak Struk</a>
                            <?php endif; ?>
                            <a href="<?= site_url('/riwayat'); ?>" class="btn btn-primary">Lihat Riwayat Pemesanan</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
<?= $this->endSection(); ?>