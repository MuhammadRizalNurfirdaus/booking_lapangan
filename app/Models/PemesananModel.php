<?php

namespace App\Models;

use CodeIgniter\Model;

class PemesananModel extends Model
{
    protected $table            = 'pemesanan';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';

    // [FIXED] Memastikan SEMUA kolom yang bisa diubah ada di sini
    protected $allowedFields    = [
        'kode_pemesanan',
        'id_user',
        'id_jadwal_master',
        'nama_pemesan',
        'email_pemesan',
        'nomor_hp_pemesan',
        'tanggal_booking',
        'total_harga',
        'status_pemesanan',     // Pastikan ini ada
        'status_pembayaran',    // Pastikan ini ada
        'bank_tujuan',
        'bukti_pembayaran',
        'catatan_pembayaran',
        'waktu_pembayaran',
    ];

    protected $useTimestamps = true;
}
