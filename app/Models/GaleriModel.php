<?php

namespace App\Models;

use CodeIgniter\Model;

class GaleriModel extends Model
{
    protected $table = 'galeri';
    protected $primaryKey = 'id';
    protected $allowedFields = ['judul', 'deskripsi', 'nama_file'];
    protected $useTimestamps = true;
}
