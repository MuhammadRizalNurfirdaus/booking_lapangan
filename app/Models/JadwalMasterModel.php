<?php

namespace App\Models;

use CodeIgniter\Model;

class JadwalMasterModel extends Model
{
    protected $table      = 'jadwal_master';
    protected $primaryKey = 'id';
    protected $returnType = 'array';

    // [UPDATED] Tambahkan 'hari' di sini
    protected $allowedFields = ['hari', 'jam_mulai', 'jam_selesai', 'harga'];
}
