<?= $this->extend('layout/user_template'); ?>
<?= $this->section('content'); ?>
<div class="container my-5">
    <form action="<?= site_url('booking/store') ?>" method="post">
        <?= csrf_field() ?>
        <div class="row">
            <!-- ====================================================== -->
            <!--               KOLOM KIRI: FORM INPUT                   -->
            <!-- ====================================================== -->
            <div class="col-lg-7 mb-4">
                <div class="card bg-dark text-white shadow">
                    <div class="card-header">
                        <h4>1. Isi Detail Pemesanan</h4>
                    </div>
                    <div class="card-body">
                        <?php if (session()->getFlashdata('errors')) : ?>
                            <div class="alert alert-danger">
                                <strong>Gagal!</strong>
                                <ul><?php foreach (session('errors') as $error) : ?><li><?= esc($error) ?></li><?php endforeach ?></ul>
                            </div>
                        <?php endif; ?>

                        <!-- [LOGIKA BARU] Blok Informasi Kontak hanya muncul jika BUKAN ADMIN -->
                        <?php if (session()->get('role') !== 'admin'): ?>
                            <h5>Informasi Kontak</h5>
                            <div class="form-group">
                                <label>Nama Lengkap</label>
                                <input type="text" name="nama_pemesan" class="form-control" value="<?= esc($user['nama_lengkap'] ?? old('nama_pemesan')); ?>" <?= isset($user) ? 'readonly' : 'required' ?>>
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" name="email_pemesan" class="form-control" value="<?= esc($user['email'] ?? old('email_pemesan')); ?>" <?= isset($user) ? 'readonly' : 'required' ?>>
                            </div>
                            <div class="form-group">
                                <label>Nomor HP Aktif</label>
                                <input type="tel" name="nomor_hp_pemesan" class="form-control" placeholder="Contoh: 08123456789" value="<?= old('nomor_hp_pemesan') ?>" required>
                            </div>
                            <hr style="border-color: #455a64;">
                        <?php else: ?>
                            <!-- Pesan untuk Admin -->
                            <div class="alert alert-info">
                                Anda login sebagai Admin. Data pemesan akan diisi secara otomatis sebagai "Pesanan Offline".
                            </div>
                        <?php endif; ?>

                        <h5 class="mt-4">Pilih Jadwal</h5>
                        <div class="form-group">
                            <label>Pilih Tanggal Booking</label>
                            <input type="date" id="tanggal_booking" name="tanggal_booking" class="form-control" value="<?= old('tanggal_booking') ?>" required>
                        </div>
                        <div class="form-group">
                            <label>Pilih Slot Waktu Tersedia</label>
                            <div id="slot-waktu-container" class="border p-3 rounded" style="background-color: #34495e;">
                                <p class="text-muted">Silakan pilih tanggal terlebih dahulu.</p>
                            </div>
                            <input type="hidden" id="id_jadwal" name="id_jadwal" value="<?= old('id_jadwal') ?>">
                        </div>
                    </div>
                </div>
            </div>

            <!-- ====================================================== -->
            <!--            KOLOM KANAN: RINGKASAN & SUBMIT             -->
            <!-- ====================================================== -->
            <div class="col-lg-5">
                <div class="card bg-dark text-white sticky-top" style="top: 100px;">
                    <div class="card-header">
                        <h4>2. Ringkasan Pesanan</h4>
                    </div>
                    <div class="card-body">
                        <table class="table table-dark">
                            <tr>
                                <td class="align-middle">Tanggal</td>
                                <td class="text-right font-weight-bold" id="summary_tanggal">-</td>
                            </tr>
                            <tr>
                                <td class="align-middle">Jadwal</td>
                                <td class="text-right font-weight-bold" id="summary_jadwal">-</td>
                            </tr>
                            <tr class="h4">
                                <td class="align-middle">Total</td>
                                <td class="text-right text-success font-weight-bold" id="summary_total">Rp 0</td>
                            </tr>
                        </table>
                        <button type="submit" class="btn btn-success btn-block btn-lg">Lanjutkan Pemesanan</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
<?= $this->endSection(); ?>

<!-- Section khusus untuk script di halaman ini -->
<?= $this->section('scripts'); ?>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const tanggalInput = document.getElementById('tanggal_booking');
        const slotContainer = document.getElementById('slot-waktu-container');
        const hiddenJadwalId = document.getElementById('id_jadwal');

        const summaryTanggal = document.getElementById('summary_tanggal');
        const summaryJadwal = document.getElementById('summary_jadwal');
        const summaryTotal = document.getElementById('summary_total');

        function fetchJadwal() {
            const tanggal = tanggalInput.value;
            if (!tanggal) {
                slotContainer.innerHTML = '<p class="text-muted">Silakan pilih tanggal terlebih dahulu.</p>';
                return;
            }

            slotContainer.innerHTML = '<div class="text-center"><div class="spinner-border text-light" role="status"><span class="sr-only">Loading...</span></div></div>';

            fetch(`<?= site_url('booking/get-jadwal') ?>?tanggal=${tanggal}`)
                .then(response => response.json())
                .then(data => {
                    slotContainer.innerHTML = '';
                    if (data.status === 'success' && data.jadwal.length > 0) {
                        data.jadwal.forEach(slot => {
                            const hargaFormatted = new Intl.NumberFormat('id-ID').format(slot.harga);
                            const jadwalText = `${slot.jam_mulai.substring(0, 5)} - ${slot.jam_selesai.substring(0, 5)}`;

                            const slotHtml = `
                                <div class="form-check bg-light text-dark p-2 rounded mb-2">
                                    <input class="form-check-input" type="radio" name="pilihan_jadwal_visual" id="jadwal_${slot.id}" value="${slot.id}">
                                    <label class="form-check-label d-flex justify-content-between" for="jadwal_${slot.id}" style="width: 100%; cursor: pointer;"
                                           data-jadwal-text="${jadwalText}"
                                           data-harga="${slot.harga}">
                                        <span><strong>${jadwalText}</strong> (${slot.hari})</span>
                                        <span class="font-weight-bold">Rp ${hargaFormatted}</span>
                                    </label>
                                </div>
                            `;
                            slotContainer.innerHTML += slotHtml;
                        });
                    } else {
                        slotContainer.innerHTML = '<p class="text-warning">Maaf, tidak ada slot yang tersedia pada tanggal ini.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    slotContainer.innerHTML = '<p class="text-danger">Terjadi kesalahan saat memuat jadwal.</p>';
                });
        }

        slotContainer.addEventListener('change', function(e) {
            if (e.target.matches('input[type="radio"]')) {
                const selectedLabel = document.querySelector(`label[for="${e.target.id}"]`);
                const jadwalText = selectedLabel.dataset.jadwalText;
                const hargaValue = selectedLabel.dataset.harga;

                hiddenJadwalId.value = e.target.value;
                summaryJadwal.textContent = jadwalText;
                summaryTotal.textContent = `Rp ${new Intl.NumberFormat('id-ID').format(hargaValue)}`;
            }
        });

        tanggalInput.addEventListener('change', function() {
            const tanggal = new Date(this.value);
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            summaryTanggal.textContent = tanggal.toLocaleDateString('id-ID', options);

            summaryJadwal.textContent = '-';
            summaryTotal.textContent = 'Rp 0';
            hiddenJadwalId.value = '';

            fetchJadwal();
        });

        const today = new Date().toISOString().split('T')[0];
        tanggalInput.setAttribute('min', today);
    });
</script>
<?= $this->endSection(); ?>