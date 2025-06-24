<?= $this->extend('admin/layout/main'); ?>
<?= $this->section('content'); ?>
<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= site_url('admin/dashboard') ?>">Dashboard</a></li>
        <li class="breadcrumb-item active" aria-current="page">Manajemen Slot Waktu</li>
    </ol>
</nav>

<?php if (session()->getFlashdata('success')) : ?>
    <div class="alert alert-success"><?= session()->getFlashdata('success'); ?></div>
<?php endif; ?>

<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h4>Daftar Slot Waktu Tersedia</h4>
        <button class="btn btn-success btn-add"><i class="fas fa-plus"></i> Tambah Slot Baru</button>
    </div>
    <div class="card-body">
        <form action="" method="get" class="mb-4">
            <div class="input-group">
                <input type="text" class="form-control" name="keyword" placeholder="Cari hari, jam mulai, atau harga..." value="<?= esc($keyword ?? '') ?>">
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
                        <th>Hari</th>
                        <th>Jam Mulai</th>
                        <th>Jam Selesai</th>
                        <th>Harga</th>
                        <th class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($jadwal)): ?>
                        <tr>
                            <td colspan="6" class="text-center">Data tidak ditemukan.</td>
                        </tr>
                        <?php else: foreach ($jadwal as $item): ?>
                            <tr>
                                <td><?= $item['id']; ?></td>
                                <td><span class="badge badge-info"><?= esc($item['hari']); ?></span></td>
                                <td><?= date('H:i', strtotime($item['jam_mulai'])); ?></td>
                                <td><?= date('H:i', strtotime($item['jam_selesai'])); ?></td>
                                <td>Rp <?= number_format($item['harga'], 0, ',', '.'); ?></td>
                                <td class="text-center">
                                    <!-- [FIXED] Kode tombol diperbaiki dan dikelompokkan -->
                                    <div class="btn-group" role="group">
                                        <button class="btn btn-warning btn-sm btn-edit"
                                            data-id="<?= $item['id']; ?>"
                                            data-hari="<?= esc($item['hari']); ?>"
                                            data-mulai="<?= $item['jam_mulai']; ?>"
                                            data-selesai="<?= $item['jam_selesai']; ?>"
                                            data-harga="<?= $item['harga']; ?>">
                                            <i class="fas fa-edit"></i> Edit
                                        </button>
                                        <a href="<?= site_url('admin/jadwal/hapus/' . $item['id']); ?>" class="btn btn-danger btn-sm" onclick="return confirm('Apakah Anda yakin ingin menghapus slot ini?')">
                                            <i class="fas fa-trash"></i> Hapus
                                        </a>
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

<!-- Modal Tambah/Edit (Tetap Sama) -->
<div class="modal fade text-dark" id="jadwalModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalTitle">Form Slot Waktu</h5>
                <button type="button" class="close" data-dismiss="modal">×</button>
            </div>
            <form action="<?= site_url('admin/jadwal/simpan'); ?>" method="post">
                <?= csrf_field(); ?>
                <input type="hidden" name="id" id="id_jadwal">
                <div class="modal-body">
                    <div class="form-group">
                        <label for="hari">Jenis Hari</label>
                        <select name="hari" id="hari" class="form-control" required>
                            <option value="Weekday">Weekday</option>
                            <option value="Weekend">Weekend</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="jam_mulai">Jam Mulai</label>
                        <input type="time" id="jam_mulai" name="jam_mulai" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="jam_selesai">Jam Selesai</label>
                        <input type="time" id="jam_selesai" name="jam_selesai" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="harga">Harga</label>
                        <input type="number" id="harga" name="harga" class="form-control" value="100000" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan Jadwal</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- JavaScript untuk mengelola modal (Tetap Sama) -->
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const btnAdd = document.querySelector('.btn-add');
        const btnEditList = document.querySelectorAll('.btn-edit');
        const modal = $('#jadwalModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = modal.find('form');
        const idInput = document.getElementById('id_jadwal');
        const hariInput = document.getElementById('hari');
        const mulaiInput = document.getElementById('jam_mulai');
        const selesaiInput = document.getElementById('jam_selesai');
        const hargaInput = document.getElementById('harga');

        btnAdd.addEventListener('click', function() {
            form[0].reset();
            idInput.value = '';
            modalTitle.textContent = 'Tambah Slot Waktu Baru';
            modal.modal('show');
        });

        btnEditList.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                const hari = this.dataset.hari;
                const mulai = this.dataset.mulai;
                const selesai = this.dataset.selesai;
                const harga = this.dataset.harga;

                idInput.value = id;
                hariInput.value = hari;
                mulaiInput.value = mulai;
                selesaiInput.value = selesai;
                hargaInput.value = harga;

                modalTitle.textContent = 'Edit Slot Waktu';
                modal.modal('show');
            });
        });
    });
</script>
<?= $this->endSection(); ?>