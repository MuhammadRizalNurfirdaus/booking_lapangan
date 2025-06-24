<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class TambahIdPemesananKeFeedback extends Migration
{
    public function up()
    {
        $fields = [
            'id_pemesanan' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
                'after'      => 'id_user',
            ],
        ];
        $this->forge->addColumn('feedback', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('feedback', 'id_pemesanan');
    }
}
