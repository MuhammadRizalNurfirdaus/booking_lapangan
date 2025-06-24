<?= $this->extend('layout/user_template'); ?>
<?= $this->section('content'); ?>
<div class="container my-5">
    <h3 class="mb-4">Riwayat Pemesanan Anda</h3>

    <?php if (session()->getFlashdata('success')): ?><div class="alert alert-success" role="alert"><?= session()->getFlashdata('success') ?></div><?php endif; ?>
    <?php if (session()->getFlashdata('error')): ?><div class="alert alert-danger" role="alert"><?= session()->getFlashdata('error') ?></div><?php endif; ?>

    <div class="card bg-dark shadow">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-dark table-hover">
                    <thead>
                        <tr>
                            <th>Kode Pesanan</th>
                            <th>Tgl. Booking</th>
                            <th>Total</th>
                            <th>Status Bayar</th>
                            <th>Status Pesanan</th>
                            <th class="text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($pemesanan)): ?>
                            <tr>
                                <td colspan="6" class="text-center">Anda belum memiliki riwayat pemesanan.</td>
                            </tr>
                            <?php else: foreach ($pemesanan as $pesan): ?>
                                <tr>
                                    <td><?= esc($pesan['kode_pemesanan']); ?></td>
                                    <td><?= date('d M Y', strtotime($pesan['tanggal_booking'])); ?></td>
                                    <td>Rp <?= number_format($pesan['total_harga']); ?></td>
                                    <td>
                                        <?php $paymentStatusClass = ($pesan['status_pembayaran'] == 'paid') ? 'success' : 'warning'; ?>
                                        <span class="badge badge-pill badge-<?= $paymentStatusClass; ?> p-2"><?= ucfirst($pesan['status_pembayaran']); ?></span>
                                    </td>
                                    <td>
                                        <?php
                                        $orderStatusClass = 'warning'; // default
                                        if ($pesan['status_pemesanan'] == 'confirmed') $orderStatusClass = 'success';
                                        if ($pesan['status_pemesanan'] == 'completed') $orderStatusClass = 'primary';
                                        if ($pesan['status_pemesanan'] == 'cancelled') $orderStatusClass = 'danger';
                                        ?>
                                        <span class="badge badge-pill badge-<?= $orderStatusClass; ?> p-2"><?= ucfirst($pesan['status_pemesanan']); ?></span>
                                    </td>
                                    <td class="text-center">
                                        <div class="btn-group">
                                            <a href="<?= site_url('booking/konfirmasi/' . $pesan['kode_pemesanan']); ?>" class="btn btn-sm btn-info">Lihat Detail</a>

                                            <!-- [FIXED] Logika untuk menampilkan tombol "Beri Feedback" -->
                                            <?php if ($pesan['status_pemesanan'] == 'completed'): ?>
                                                <button class="btn btn-sm btn-warning" data-toggle="modal" data-target="#feedbackModal-<?= $pesan['id']; ?>">Beri Feedback</button>
                                            <?php endif; ?>

                                            <?php if (in_array($pesan['status_pemesanan'], ['completed', 'cancelled'])): ?>
                                                <a href="<?= site_url('riwayat/hapus/' . $pesan['id']); ?>" class="btn btn-sm btn-danger" onclick="return confirm('Yakin ingin menghapus riwayat ini?')">Hapus</a>
                                            <?php endif; ?>
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

    <!-- Modal Feedback untuk setiap pesanan -->
    <?php if (!empty($pemesanan)): foreach ($pemesanan as $pesan): ?>
            <div class="modal fade" id="feedbackModal-<?= $pesan['id']; ?>" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content bg-dark text-white">
                        <div class="modal-header border-secondary">
                            <h5 class="modal-title">Beri Feedback untuk Pesanan #<?= $pesan['kode_pemesanan']; ?></h5>
                            <button type="button" class="close text-white" data-dismiss="modal">×</button>
                        </div>
                        <form action="<?= site_url('user/feedback'); ?>" method="post">
                            <div class="modal-body">
                                <?= csrf_field(); ?>
                                <input type="hidden" name="id_pemesanan" value="<?= $pesan['id']; ?>">
                                <div class="form-group">
                                    <label for="rating-<?= $pesan['id']; ?>">Rating (1-5)</label>
                                    <select name="rating" id="rating-<?= $pesan['id']; ?>" class="form-control" required>
                                        <option value="5">⭐⭐⭐⭐⭐ (Sangat Baik)</option>
                                        <option value="4">⭐⭐⭐⭐ (Baik)</option>
                                        <option value="3">⭐⭐⭐ (Cukup)</option>
                                        <option value="2">⭐⭐ (Kurang)</option>
                                        <option value="1">⭐ (Buruk)</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="komentar-<?= $pesan['id']; ?>">Komentar</label>
                                    <textarea name="komentar" id="komentar-<?= $pesan['id']; ?>" class="form-control" rows="4" required></textarea>
                                </div>
                            </div>
                            <div class="modal-footer border-secondary">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
                                <button type="submit" class="btn btn-primary">Kirim Feedback</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    <?php endforeach;
    endif; ?>
    <?= $this->endSection(); ?>