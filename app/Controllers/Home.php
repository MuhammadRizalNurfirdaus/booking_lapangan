<?php

namespace App\Controllers;

use App\Models\GaleriModel;
use App\Models\KontakModel;

class Home extends BaseController
{
    /**
     * Menampilkan halaman utama (Beranda).
     */
    public function index()
    {
        $data = [
            'title' => 'Selamat Datang di Booking Lapangan'
        ];
        return view('home_view', $data);
    }

    /**
     * Menampilkan halaman daftar galeri.
     */
    public function galeri()
    {
        $galeriModel = new GaleriModel();
        $data = [
            'title' => 'Galeri Foto Lapangan',
            'fotos' => $galeriModel->orderBy('created_at', 'DESC')->findAll(),
        ];
        return view('galeri_view', $data);
    }

    /**
     * [FIXED] Menambahkan fungsi yang hilang untuk halaman detail galeri.
     */
    public function detailGaleri($id)
    {
        $galeriModel = new GaleriModel();
        $item = $galeriModel->find($id);

        // Jika data dengan ID tersebut tidak ditemukan, tampilkan halaman 404
        if (!$item) {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }

        $data = [
            'title' => esc($item['judul']), // Judul halaman akan menjadi judul galeri
            'item'  => $item,
        ];

        // Memuat view baru yang akan kita buat
        return view('galeri_detail_view', $data);
    }


    /**
     * Menampilkan halaman kontak.
     */
    public function kontak()
    {
        $data = [
            'title' => 'Hubungi Kami',
            'user' => null
        ];
        if (session()->get('isLoggedIn')) {
            $data['user'] = (new \App\Models\UserModel())->find(session()->get('user_id'));
        }
        return view('kontak_view', $data);
    }

    /**
     * Memproses pengiriman pesan dari form kontak.
     */
    public function kirimPesan()
    {
        $validation = $this->validate([
            'nama_pengirim' => 'required|min_length[3]',
            'email'         => 'required|valid_email',
            'pesan'         => 'required|min_length[10]'
        ]);

        if (!$validation) {
            return redirect()->to('/kontak')->withInput()->with('errors', $this->validator->getErrors());
        }

        $kontakModel = new KontakModel();
        $kontakModel->save([
            'nama_pengirim' => $this->request->getPost('nama_pengirim'),
            'email'         => $this->request->getPost('email'),
            'pesan'         => $this->request->getPost('pesan'),
        ]);

        return redirect()->to('/kontak')->with('success', 'Pesan Anda telah berhasil dikirim. Terima kasih!');
    }
}
