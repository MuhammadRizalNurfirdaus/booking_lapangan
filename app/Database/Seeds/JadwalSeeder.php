<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class JadwalSeeder extends Seeder
{
    public function run()
    {
        // Data slot waktu 90 menit dengan harga Rp 100.000
        $data = [
            ['jam_mulai' => '08:00:00', 'jam_selesai' => '09:30:00', 'harga' => 100000],
            ['jam_mulai' => '09:30:00', 'jam_selesai' => '11:00:00', 'harga' => 100000],
            ['jam_mulai' => '11:00:00', 'jam_selesai' => '12:30:00', 'harga' => 100000],
            ['jam_mulai' => '12:30:00', 'jam_selesai' => '14:00:00', 'harga' => 100000],
            ['jam_mulai' => '14:00:00', 'jam_selesai' => '15:30:00', 'harga' => 100000],
            ['jam_mulai' => '15:30:00', 'jam_selesai' => '17:00:00', 'harga' => 100000],
            ['jam_mulai' => '19:00:00', 'jam_selesai' => '20:30:00', 'harga' => 100000],
            ['jam_mulai' => '20:30:00', 'jam_selesai' => '22:00:00', 'harga' => 100000],
        ];

        // Menggunakan Query Builder untuk memasukkan semua data sekaligus
        $this->db->table('jadwal_master')->insertBatch($data);
    }
}
