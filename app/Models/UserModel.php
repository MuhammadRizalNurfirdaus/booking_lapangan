<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table            = 'users';
    protected $primaryKey       = 'id';
    protected $allowedFields    = ['nama_lengkap', 'email', 'password', 'role', 'foto_profil'];
    protected $useTimestamps    = true;

    // Hook yang berjalan otomatis sebelum data dimasukkan/diperbarui
    protected $beforeInsert = ['hashPassword'];
    protected $beforeUpdate = ['hashPassword'];

    /**
     * Fungsi untuk meng-hash password secara otomatis.
     */
    protected function hashPassword(array $data)
    {
        // Cek apakah ada data password yang dikirim
        if (!isset($data['data']['password'])) {
            return $data;
        }

        // Hash password dan kembalikan datanya
        $data['data']['password'] = password_hash($data['data']['password'], PASSWORD_DEFAULT);
        return $data;
    }
}
