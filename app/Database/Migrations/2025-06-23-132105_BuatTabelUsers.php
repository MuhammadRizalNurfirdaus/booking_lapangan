<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class BuatTabelUsers extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'nama_lengkap' => ['type' => 'VARCHAR', 'constraint' => '255'],
            'email' => ['type' => 'VARCHAR', 'constraint' => '255', 'unique' => true],
            'password' => ['type' => 'VARCHAR', 'constraint' => '255'],
            'role' => ['type' => 'ENUM', 'constraint' => ['admin', 'user'], 'default' => 'user'],
            'foto_profil' => ['type' => 'VARCHAR', 'constraint' => '255', 'default' => 'default.png'],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('users');
    }

    public function down()
    {
        $this->forge->dropTable('users');
    }
}
