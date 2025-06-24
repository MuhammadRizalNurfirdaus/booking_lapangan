<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class TambahHpKePemesanan extends Migration
{
    public function up()
    {
        $fields = [
            'nama_pemesan' => ['type' => 'VARCHAR', 'constraint' => '255', 'after' => 'id_user'],
            'email_pemesan' => ['type' => 'VARCHAR', 'constraint' => '255', 'after' => 'nama_pemesan'],
            'nomor_hp_pemesan' => ['type' => 'VARCHAR', 'constraint' => '20', 'after' => 'email_pemesan'],
        ];
        $this->forge->addColumn('pemesanan', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('pemesanan', ['nama_pemesan', 'email_pemesan', 'nomor_hp_pemesan']);
    }
}
