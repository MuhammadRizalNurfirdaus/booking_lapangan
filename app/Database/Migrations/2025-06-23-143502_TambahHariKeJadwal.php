<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class TambahHariKeJadwal extends Migration
{
    public function up()
    {
        $fields = [
            'hari' => [
                'type'       => "ENUM('Weekday', 'Weekend')",
                'default'    => 'Weekday',
                'after'      => 'id', // Posisi kolom setelah 'id'
            ],
        ];
        $this->forge->addColumn('jadwal_master', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('jadwal_master', 'hari');
    }
}
