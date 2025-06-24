<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class TambahDeskripsiKeGaleri extends Migration
{
    public function up()
    {
        $fields = [
            'deskripsi' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'judul',
            ],
        ];
        $this->forge->addColumn('galeri', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('galeri', 'deskripsi');
    }
}
