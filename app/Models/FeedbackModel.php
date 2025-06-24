<?php

namespace App\Models;

use CodeIgniter\Model;

class FeedbackModel extends Model
{
    protected $table            = 'feedback';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;

    protected $returnType       = 'array';

    // [FIXED] Menambahkan 'id_pemesanan' ke kolom yang diizinkan
    protected $allowedFields    = ['id_user', 'id_pemesanan', 'komentar', 'rating'];

    // Nonaktifkan timestamps agar diurus oleh database
    protected $useTimestamps = false;
}
