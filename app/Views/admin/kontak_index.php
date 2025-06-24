<?= $this->extend('admin/layout/main'); ?>
<?= $this->section('content'); ?>
<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= site_url('admin/dashboard') ?>">Dashboard</a></li>
        <li class="breadcrumb-item active" aria-current="page">Kelola Pesan Kontak</li>
    </ol>
</nav>
<div class="card">
    <div class="card-header">
        <h4>Pesan Kontak Masuk</h4>
    </div>
    <div class="card-body">
        <form action="" method="get" class="mb-4">
            <div class="input-group"><input type="text" class="form-control" name="keyword" placeholder="Cari nama, email, atau isi pesan..." value="<?= esc($keyword ?? '') ?>">
                <div class="input-group-append"><button class="btn btn-primary" type="submit">Cari</button></div>
            </div>
        </form>
        <div class="table-responsive">
            <table class="table table-dark table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama Pengirim</th>
                        <th>Email</th>
                        <th>Pesan</th>
                        <th>Tanggal</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($pesan)): ?><tr>
                            <td colspan="6" class="text-center">Tidak ada pesan masuk.</td>
                        </tr>
                        <?php else: foreach ($pesan as $item): ?>
                            <tr>
                                <td><?= $item['id']; ?></td>
                                <td><?= esc($item['nama_pengirim']); ?></td>
                                <td><a href="mailto:<?= esc($item['email']); ?>"><?= esc($item['email']); ?></a></td>
                                <td style="white-space: pre-wrap;"><?= esc($item['pesan']); ?></td>
                                <td><?= date('d M Y, H:i', strtotime($item['created_at'])); ?></td>
                                <td><a href="<?= site_url('admin/pesan-kontak/hapus/' . $item['id']); ?>" class="btn btn-danger btn-sm" onclick="return confirm('Yakin?')">Hapus</a></td>
                            </tr>
                    <?php endforeach;
                    endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
<?= $this->endSection(); ?>