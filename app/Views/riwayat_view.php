<?= $this->extend('layout/user_template'); ?>
<?= $this->section('content'); ?>
<div class="container my-5">
    <h3>Riwayat Pemesanan Anda</h3>
    <?php if (session()->getFlashdata('success')): ?><div class="alert alert-success"><?= session()->getFlashdata('success') ?></div><?php endif; ?>
    <table class="table table-dark table-hover">
        <thead>
            <tr>
                <th>Kode</th>
                <th>Tgl. Booking</th>
                <th>Total</th>
                <th>Status Bayar</th>
                <th>Status Pesanan</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($pemesanan as $pesan): ?>
                <tr>
                    <td><?= $pesan['kode_pemesanan'] ?></td>
                    <td><?= $pesan['tanggal_booking'] ?></td>
                    <td>Rp <?= number_format($pesan['total_harga']) ?></td>
                    <td><span class="badge badge-<?= $pesan['status_pembayaran'] == 'paid' ? 'success' : 'warning' ?>"><?= $pesan['status_pembayaran'] ?></span></td>
                    <td><span class="badge badge-<?= $pesan['status_pemesanan'] == 'confirmed' ? 'success' : 'info' ?>"><?= $pesan['status_pemesanan'] ?></span></td>
                    <td>
                        <a href="<?= site_url('booking/konfirmasi/' . $pesan['kode_pemesanan']) ?>" class="btn btn-sm btn-info">Detail</a>
                        <?php if ($pesan['status_pemesanan'] == 'completed'): ?>
                            <button class="btn btn-sm btn-warning" data-toggle="modal" data-target="#feedbackModal">Beri Feedback</button>
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
<!-- Modal Feedback -->
<div class="modal fade" id="feedbackModal">
    <div class="modal-dialog">
        <div class="modal-content bg-dark">
            <div class="modal-header">
                <h5>Beri Feedback</h5>
            </div>
            <form action="<?= site_url('user/feedback') ?>" method="post">
                <div class="modal-body"><?= csrf_field() ?><div class="form-group"><label>Rating (1-5)</label><input type="number" name="rating" class="form-control" min="1" max="5" required></div>
                    <div class="form-group"><label>Komentar</label><textarea name="komentar" class="form-control" required></textarea></div>
                </div>
                <div class="modal-footer"><button type="submit" class="btn btn-primary">Kirim</button></div>
            </form>
        </div>
    </div>
</div>
<?= $this->endSection(); ?>