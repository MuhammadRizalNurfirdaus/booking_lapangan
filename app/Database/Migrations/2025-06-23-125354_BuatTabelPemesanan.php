<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class BuatTabelPemesanan extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'kode_pemesanan' => ['type' => 'VARCHAR', 'constraint' => '50', 'unique' => true],
            'id_user' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true], // Akan kita gunakan saat ada login
            'id_jadwal_master' => ['type' => 'INT', 'constraint' => 5, 'unsigned' => true],
            'tanggal_booking' => ['type' => 'DATE'],
            'total_harga' => ['type' => 'DECIMAL', 'constraint' => '10,2'],
            'status_pemesanan' => ['type' => 'ENUM', 'constraint' => ['pending', 'confirmed', 'cancelled', 'completed'], 'default' => 'pending'],
            'status_pembayaran' => ['type' => 'ENUM', 'constraint' => ['pending', 'paid', 'failed'], 'default' => 'pending'],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('id_jadwal_master', 'jadwal_master', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('pemesanan');
    }

    public function down()
    {
        $this->forge->dropTable('pemesanan');
    }
}
