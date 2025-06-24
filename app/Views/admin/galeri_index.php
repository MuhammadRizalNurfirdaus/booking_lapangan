<?= $this->extend('admin/layout/main'); ?>
<?= $this->section('content'); ?>
<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= site_url('admin/dashboard') ?>">Dashboard</a></li>
        <li class="breadcrumb-item active" aria-current="page">Manajemen Galeri</li>
    </ol>
</nav>

<!-- Menampilkan pesan feedback (sukses/error) -->
<?php if (session()->getFlashdata('success')) : ?>
    <div class="alert alert-success"><?= session()->getFlashdata('success'); ?></div>
<?php endif; ?>
<?php if (session()->getFlashdata('errors')) : ?>
    <div class="alert alert-danger">
        <strong>Gagal!</strong>
        <ul><?php foreach (session('errors') as $error) : ?><li><?= esc($error) ?></li><?php endforeach ?></ul>
    </div>
<?php endif; ?>

<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h4>Daftar Foto Galeri</h4>
        <button class="btn btn-success btn-add"><i class="fas fa-plus"></i> Tambah Foto Baru</button>
    </div>
    <div class="card-body">
        <form action="" method="get" class="mb-3">
            <div class="input-group">
                <input type="text" class="form-control" name="keyword" placeholder="Cari berdasarkan judul atau deskripsi..." value="<?= esc($keyword ?? '') ?>">
                <div class="input-group-append">
                    <button class="btn btn-primary" type="submit"><i class="fas fa-search"></i> Cari</button>
                </div>
            </div>
        </form>
        <div class="table-responsive">
            <table class="table table-dark table-striped table-hover">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Gambar</th>
                        <th>Judul</th>
                        <th>Deskripsi (Singkat)</th>
                        <th>Dibuat</th>
                        <th class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $no = 1;
                    if (empty($galeri)): ?>
                        <tr>
                            <td colspan="6" class="text-center">Tidak ada data.</td>
                        </tr>
                        <?php else: foreach ($galeri as $item): ?>
                            <tr>
                                <td><?= $no++; ?></td>
                                <td><img src="<?= base_url('uploads/galeri/' . $item['nama_file']); ?>" height="50" alt="<?= esc($item['judul']); ?>"></td>
                                <td><?= esc($item['judul']); ?></td>
                                <td><?= esc(substr($item['deskripsi'], 0, 50)) . '...'; ?></td>
                                <td><?= date('d M Y', strtotime($item['created_at'])); ?></td>
                                <td class="text-center">
                                    <div class="btn-group" role="group">
                                        <button class="btn btn-info btn-sm btn-detail" data-id="<?= $item['id']; ?>"><i class="fas fa-eye"></i> Detail</button>
                                        <button class="btn btn-warning btn-sm btn-edit" data-id="<?= $item['id']; ?>"><i class="fas fa-edit"></i> Edit</button>
                                        <a href="<?= site_url('admin/galeri/hapus/' . $item['id']); ?>" class="btn btn-danger btn-sm" onclick="return confirm('Yakin?')"><i class="fas fa-trash"></i> Hapus</a>
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

<!-- Modal untuk Tambah dan Edit Data -->
<div class="modal fade text-dark" id="galeriModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalTitle">Form Galeri</h5>
                <button type="button" class="close" data-dismiss="modal">×</button>
            </div>
            <form action="<?= site_url('admin/galeri/simpan'); ?>" method="post" enctype="multipart/form-data">
                <?= csrf_field(); ?>
                <input type="hidden" name="id" id="id_galeri">
                <div class="modal-body">
                    <div class="form-group">
                        <label for="judul">Judul/Keterangan</label>
                        <input type="text" name="judul" id="judul" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="deskripsi">Deskripsi</label>
                        <textarea name="deskripsi" id="deskripsi" class="form-control" rows="5" placeholder="Jelaskan detail tentang foto ini..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="gambar">Gambar</label>
                        <input type="file" id="gambar" name="gambar" class="form-control-file">
                        <small class="form-text text-muted" id="gambarHelp">Kosongkan jika tidak ingin mengubah gambar.</small>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Modal untuk Melihat Detail (Read-only) -->
<div class="modal fade text-dark" id="detailModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="detailModalTitle">Detail Galeri</h5>
                <button type="button" class="close" data-dismiss="modal">×</button>
            </div>
            <div class="modal-body">
                <div class="text-center mb-3">
                    <img src="" id="detailModalImage" class="img-fluid" style="max-height: 400px; border-radius: 5px;" alt="Detail Gambar">
                </div>
                <hr>
                <h4>Deskripsi:</h4>
                <p id="detailModalDeskripsi" style="white-space: pre-wrap;"></p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Tutup</button>
            </div>
        </div>
    </div>
</div>

<!-- JavaScript untuk semua fungsionalitas -->
<script>
    // Menyematkan semua data galeri ke dalam JavaScript secara aman
    const galleryData = <?= json_encode(array_column($galeri, null, 'id')); ?>;

    document.addEventListener('DOMContentLoaded', function() {
        // Menggunakan jQuery untuk menangani event

        // Event untuk tombol 'Tambah'
        $('.btn-add').on('click', function() {
            const modal = $('#galeriModal');
            modal.find('form')[0].reset();
            modal.find('#id_galeri').val('');
            modal.find('#modalTitle').text('Tambah Foto Baru');
            modal.find('#gambar').attr('required', 'required');
            modal.find('#gambarHelp').text('Gambar wajib diisi.');
            modal.modal('show');
        });

        // Event untuk tombol 'Edit'
        $('.btn-edit').on('click', function() {
            const id = $(this).data('id');
            const itemData = galleryData[id];

            if (itemData) {
                const modal = $('#galeriModal');
                modal.find('#id_galeri').val(itemData.id);
                modal.find('#judul').val(itemData.judul);
                modal.find('#deskripsi').val(itemData.deskripsi);
                modal.find('#modalTitle').text('Edit Foto Galeri');
                modal.find('#gambar').removeAttr('required');
                modal.find('#gambarHelp').text('Kosongkan jika tidak ingin mengubah gambar.');
                modal.modal('show');
            }
        });

        // Event untuk tombol 'Detail'
        $('.btn-detail').on('click', function() {
            const id = $(this).data('id');
            const itemData = galleryData[id];

            if (itemData) {
                const modal = $('#detailModal');
                modal.find('#detailModalTitle').text(itemData.judul);
                modal.find('#detailModalImage').attr('src', `<?= base_url('uploads/galeri/'); ?>${itemData.nama_file}`);
                modal.find('#detailModalDeskripsi').text(itemData.deskripsi);
                modal.modal('show');
            }
        });
    });
</script>
<?= $this->endSection(); ?>