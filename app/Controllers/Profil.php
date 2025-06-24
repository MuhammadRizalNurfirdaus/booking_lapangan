<?php

namespace App\Controllers;

use App\Models\UserModel;

class Profil extends BaseController
{
    /**
     * Menampilkan halaman utama profil pengguna.
     */
    public function index()
    {
        $userModel = new UserModel();
        $data = [
            'title' => 'Profil Saya',
            'user'  => $userModel->find(session()->get('user_id')),
            'validation' => \Config\Services::validation() // Mengirim validation ke view
        ];
        return view('profil/index', $data);
    }

    /**
     * Memproses pembaruan data profil (nama, email, foto).
     */
    public function update()
    {
        $userModel = new UserModel();
        $userId = session()->get('user_id');
        $userLama = $userModel->find($userId);

        // Aturan validasi
        $rules = [
            'nama_lengkap' => 'required|min_length[3]',
            'email' => "required|valid_email|is_unique[users.email,id,{$userId}]",
            'foto_profil' => [
                'rules' => 'max_size[foto_profil,2048]|is_image[foto_profil]|mime_in[foto_profil,image/jpg,image/jpeg,image/png]',
                'errors' => [
                    'max_size' => 'Ukuran gambar terlalu besar (Maks 2MB).',
                    'is_image' => 'File yang Anda pilih bukan gambar.',
                    'mime_in' => 'Format file harus JPG, JPEG, atau PNG.',
                ]
            ]
        ];

        if (!$this->validate($rules)) {
            return redirect()->to('/profil')->withInput()->with('errors', $this->validator->getErrors());
        }

        // Proses upload foto baru jika ada
        $fileFoto = $this->request->getFile('foto_profil');
        $namaFoto = $userLama['foto_profil']; // Gunakan foto lama sebagai default

        if ($fileFoto->isValid() && !$fileFoto->hasMoved()) {
            // Buat direktori jika belum ada
            if (!is_dir('uploads/profil')) {
                mkdir('uploads/profil', 0777, true);
            }
            // Hapus foto lama jika bukan default.png
            if ($namaFoto != 'default.png' && file_exists('uploads/profil/' . $namaFoto)) {
                unlink('uploads/profil/' . $namaFoto);
            }
            // Generate nama random dan pindahkan file
            $namaFoto = $fileFoto->getRandomName();
            $fileFoto->move('uploads/profil', $namaFoto);
        }

        // Simpan data ke database
        $userModel->save([
            'id' => $userId,
            'nama_lengkap' => $this->request->getPost('nama_lengkap'),
            'email' => $this->request->getPost('email'),
            'foto_profil' => $namaFoto
        ]);

        // Update session dengan nama baru
        session()->set('nama_lengkap', $this->request->getPost('nama_lengkap'));

        session()->setFlashdata('success', 'Profil berhasil diperbarui.');
        return redirect()->to('/profil');
    }

    /**
     * Memproses pembaruan password.
     */
    public function updatePassword()
    {
        $userModel = new UserModel();
        $userId = session()->get('user_id');
        $user = $userModel->find($userId);

        // Aturan validasi
        $rules = [
            'password_lama' => 'required',
            'password_baru' => 'required|min_length[8]',
            'konfirmasi_password' => 'required|matches[password_baru]',
        ];

        if (!$this->validate($rules)) {
            return redirect()->to('/profil')->withInput()->with('error_password', 'Validasi gagal, periksa kembali input Anda.');
        }

        // Cek kesesuaian password lama
        if (!password_verify($this->request->getPost('password_lama'), $user['password'])) {
            return redirect()->to('/profil')->with('error_password', 'Password lama tidak sesuai.');
        }

        // Simpan password baru (Model akan otomatis meng-hashnya)
        $userModel->save([
            'id' => $userId,
            'password' => $this->request->getPost('password_baru')
        ]);

        session()->setFlashdata('success_password', 'Password berhasil diubah.');
        return redirect()->to('/profil');
    }
}
