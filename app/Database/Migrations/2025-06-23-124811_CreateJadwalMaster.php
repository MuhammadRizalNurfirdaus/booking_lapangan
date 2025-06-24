<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateJadwalMaster extends Migration
{
    /**
     * Fungsi ini membuat tabel.
     */
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 5,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'jam_mulai' => [
                'type' => 'TIME',
            ],
            'jam_selesai' => [
                'type' => 'TIME',
            ],
            'harga' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'default'    => '100000.00',
            ],
        ]);
        $this->forge->addKey('id', true); // Menjadikan 'id' sebagai Primary Key
        $this->forge->createTable('jadwal_master');
    }

    /**
     * Fungsi ini menghapus tabel (jika perlu rollback).
     */
    public function down()
    {
        $this->forge->dropTable('jadwal_master');
    }
}
