<?= $this->extend('admin/layout/main'); ?>
<?= $this->section('content'); ?>
<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= site_url('admin/dashboard') ?>">Dashboard</a></li>
        <li class="breadcrumb-item active" aria-current="page">Manajemen Pembayaran</li>
    </ol>
</nav>

<?php if (session()->getFlashdata('success')) : ?>
    <div class="alert alert-success"><?= session()->getFlashdata('success'); ?></div>
<?php endif; ?>
<?php if (session()->getFlashdata('error')) : ?>
    <div class="alert alert-danger"><?= session()->getFlashdata('error'); ?></div>
<?php endif; ?>

<div class="card">
    <div class="card-header">
        <h4>Daftar Transaksi Pembayaran</h4>
    </div>
    <div class="card-body">
        <form action="" method="get" class="mb-3">
            <div class="input-group">
                <input type="text" class="form-control" name="keyword" placeholder="Cari Kode Pesanan atau Nama Pemesan..." value="<?= esc($keyword ?? '') ?>">
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
                        <th>Kode Pesanan</th>
                        <th>Nama Pemesan</th>
                        <th>Tgl. Booking</th>
                        <th>Status Bayar</th>
                        <th>Status Pesanan</th> <!-- [BARU] Kolom baru ditambahkan -->
                        <th class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($pemesanan)): ?>
                        <tr>
                            <td colspan="7" class="text-center">Tidak ada data pemesanan.</td>
                        </tr>
                        <?php else: foreach ($pemesanan as $item): ?>
                            <tr>
                                <td><?= $item['id']; ?></td>
                                <td><?= esc($item['kode_pemesanan']); ?></td>
                                <td><?= esc($item['nama_lengkap'] ?? 'Guest'); ?></td>
                                <td><?= date('d M Y', strtotime($item['tanggal_booking'])); ?></td>
                                <td>
                                    <!-- Badge Status Pembayaran -->
                                    <?php
                                    $paymentStatusClass = 'warning'; // default pending
                                    if ($item['status_pembayaran'] == 'paid') $paymentStatusClass = 'success';
                                    if ($item['status_pembayaran'] == 'failed') $paymentStatusClass = 'danger';
                                    ?>
                                    <span class="badge badge-<?= $paymentStatusClass; ?> p-2"><?= ucfirst($item['status_pembayaran']); ?></span>
                                </td>
                                <td>
                                    <!-- [BARU] Badge untuk Status Pemesanan -->
                                    <?php
                                    $orderStatusClass = 'warning'; // default pending
                                    switch ($item['status_pemesanan']) {
                                        case 'confirmed':
                                            $orderStatusClass = 'success';
                                            break;
                                        case 'completed':
                                            $orderStatusClass = 'primary';
                                            break;
                                        case 'cancelled':
                                            $orderStatusClass = 'danger';
                                            break;
                                    }
                                    ?>
                                    <span class="badge badge-<?= $orderStatusClass; ?> p-2"><?= ucfirst($item['status_pemesanan']); ?></span>
                                </td>
                                <td class="text-center">
                                    <div class="btn-group">
                                        <a href="<?= site_url('admin/pembayaran/detail/' . $item['id']); ?>" class="btn btn-info btn-sm">Detail</a>
                                        <a href="<?= site_url('admin/pembayaran/hapus/' . $item['id']); ?>" class="btn btn-danger btn-sm" onclick="return confirm('Apakah Anda yakin ingin menghapus data ini secara permanen?')">Hapus</a>
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
<?= $this->endSection(); ?>