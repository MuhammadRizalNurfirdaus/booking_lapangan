<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class TambahKolomBuktiPembayaran extends Migration
{
    public function up()
    {
        $fields = [
            'bank_tujuan' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => true,
                'after' => 'status_pembayaran', // Posisi kolom
            ],
            'bukti_pembayaran' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
                'after' => 'bank_tujuan',
            ],
            'catatan_pembayaran' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'bukti_pembayaran',
            ],
            'waktu_pembayaran' => [
                'type' => 'DATETIME',
                'null' => true,
                'after' => 'catatan_pembayaran',
            ],
        ];

        $this->forge->addColumn('pemesanan', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('pemesanan', ['bank_tujuan', 'bukti_pembayaran', 'catatan_pembayaran', 'waktu_pembayaran']);
    }
}
