<?php

namespace App\Models;

use CodeIgniter\Model;

class KontakModel extends Model
{
    protected $table            = 'pesan_kontak';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';

    // [FIXED] Hanya izinkan kolom yang diisi oleh pengguna.
    // Kolom 'created_at' sekarang diurus oleh database.
    protected $allowedFields    = ['nama_pengirim', 'email', 'pesan'];

    // [FIXED] Dinonaktifkan untuk mencegah CodeIgniter ikut campur
    // dalam pengisian timestamp, serahkan sepenuhnya ke database.
    protected $useTimestamps = false;
}
