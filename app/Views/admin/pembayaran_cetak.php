<!DOCTYPE html>
<html lang="id">

<head>
    <title>Bukti Pembayaran - <?= $pesanan['kode_pemesanan']; ?></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <style>
        @media print {
            .no-print {
                display: none;
            }
        }

        body {
            background-color: white;
            color: black;
        }

        .invoice-header {
            text-align: center;
            border-bottom: 2px solid black;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }

        .invoice-header img {
            max-height: 80px;
        }
    </style>
</head>

<body>
    <div class="container mt-4">
        <div class="invoice-header">
            <img src="<?= base_url('images/logo.jpg') ?>" alt="Logo">
            <h2>Booking Lapangan</h2>
            <p>Jln. Lapangan Raya No. 123, Kota Futsal</p>
        </div>
        <h3 class="text-center mb-4">BUKTI PEMBAYARAN</h3>
        <table class="table table-bordered">
            <tr>
                <th style="width:30%;">Kode Pemesanan</th>
                <td><?= esc($pesanan['kode_pemesanan']); ?></td>
            </tr>
            <tr>
                <th>Nama Pemesan</th>
                <td><?= esc($pesanan['nama_lengkap'] ?? 'Guest'); ?></td>
            </tr>
            <tr>
                <th>Tanggal Booking</th>
                <td><?= date('d F Y', strtotime($pesanan['tanggal_booking'])); ?></td>
            </tr>
            <tr>
                <th>Jadwal</th>
                <td><?= date('H:i', strtotime($pesanan['jam_mulai'])) . ' - ' . date('H:i', strtotime($pesanan['jam_selesai'])); ?></td>
            </tr>
            <tr>
                <th>Total Bayar</th>
                <td><strong>Rp <?= number_format($pesanan['total_harga'], 0, ',', '.'); ?></strong></td>
            </tr>
            <tr>
                <th>Status</th>
                <td><strong>LUNAS</strong></td>
            </tr>
        </table>
        <p class="text-center mt-4">Terima kasih telah melakukan pemesanan.</p>
        <div class="text-center mt-5 no-print">
            <button onclick="window.print()" class="btn btn-primary">Cetak</button>
            <button onclick="window.close()" class="btn btn-secondary">Tutup</button>
        </div>
    </div>
    <script>
        // Uncomment baris di bawah jika ingin langsung mencetak saat halaman terbuka
        // window.onload = function() { window.print(); }
    </script>
</body>

</html>