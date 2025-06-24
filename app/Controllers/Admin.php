<?php

namespace App\Controllers;

use App\Models\PemesananModel;
use App\Models\JadwalMasterModel;
use App\Models\UserModel;
use App\Models\GaleriModel;
use App\Models\FeedbackModel;
use App\Models\KontakModel;

class Admin extends BaseController
{
    /**
     * Halaman utama admin, menampilkan ringkasan data.
     */
    public function dashboard()
    {
        // Memuat semua model yang diperlukan
        $pemesananModel = new \App\Models\PemesananModel();
        $userModel = new \App\Models\UserModel();
        $galeriModel = new \App\Models\GaleriModel(); // Tambahkan ini

        // Menyiapkan semua data untuk dikirim ke view
        $data = [
            'title' => 'Dashboard',
            'total_pesanan' => $pemesananModel->countAllResults(),
            'pesanan_pending' => $pemesananModel->where('status_pemesanan', 'pending')->countAllResults(),
            'total_pendapatan' => $pemesananModel->where('status_pembayaran', 'paid')->selectSum('total_harga')->first()['total_harga'] ?? 0,
            'total_user' => $userModel->countAllResults(),
            'total_galeri' => $galeriModel->countAllResults(), // [BARU] Menghitung total foto galeri
        ];

        // Memuat view dan mengirimkan data
        return view('admin/dashboard_view', $data);
    }
    /**
     * Menampilkan daftar semua pembayaran.
     */
    public function pembayaran()
    {
        $pemesananModel = new PemesananModel();
        $builder = $pemesananModel
            ->select('pemesanan.*, users.nama_lengkap')
            ->join('users', 'users.id = pemesanan.id_user', 'left');

        $keyword = $this->request->getGet('keyword');
        if ($keyword) {
            $builder->like('kode_pemesanan', $keyword)
                ->orLike('users.nama_lengkap', $keyword);
        }

        $data = [
            'title' => 'Manajemen Pembayaran',
            'pemesanan' => $builder->orderBy('created_at', 'DESC')->findAll(),
            'keyword' => $keyword
        ];
        return view('admin/pembayaran_index', $data);
    }

    /**
     * Menampilkan detail satu pembayaran.
     */
    public function detailPembayaran($id)
    {
        $pemesananModel = new PemesananModel();
        $pesanan = $pemesananModel
            ->select('pemesanan.*, jadwal_master.jam_mulai, jadwal_master.jam_selesai, users.nama_lengkap, users.email')
            ->join('jadwal_master', 'jadwal_master.id = pemesanan.id_jadwal_master')
            ->join('users', 'users.id = pemesanan.id_user', 'left')
            ->where('pemesanan.id', $id)
            ->first();

        if (!$pesanan) {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }

        $data = [
            'title' => 'Detail Pembayaran #' . $pesanan['id'],
            'pesanan' => $pesanan,
        ];
        return view('admin/pembayaran_detail', $data);
    }

    /**
     * Memproses update status pembayaran dan pemesanan.
     */
    public function updateStatus()
    {
        // 1. Ambil data dari form POST dengan aman
        $idPesanan = $this->request->getPost('id_pesanan');
        $statusPembayaran = $this->request->getPost('status_pembayaran');
        $statusPemesanan = $this->request->getPost('status_pemesanan');

        // Validasi dasar untuk memastikan data tidak kosong
        if (empty($idPesanan) || empty($statusPembayaran) || empty($statusPemesanan)) {
            session()->setFlashdata('error', 'Terjadi kesalahan, data tidak lengkap.');
            return redirect()->back();
        }

        // 2. Siapkan data untuk di-update dalam bentuk array
        $dataUpdate = [
            'status_pembayaran' => $statusPembayaran,
            'status_pemesanan' => $statusPemesanan,
        ];

        // 3. Lakukan update menggunakan Model
        $pemesananModel = new \App\Models\PemesananModel();

        // Gunakan blok try-catch untuk menangani kemungkinan error database
        try {
            // Lakukan update berdasarkan ID ($idPesanan) dengan data dari $dataUpdate
            $pemesananModel->update($idPesanan, $dataUpdate);

            // Jika berhasil, set pesan sukses
            session()->setFlashdata('success', 'Status pemesanan berhasil diperbarui.');
        } catch (\Exception $e) {
            // Jika gagal, set pesan error dengan detail dari database
            session()->setFlashdata('error', 'Gagal memperbarui status: ' . $e->getMessage());
        }

        // 4. Redirect kembali ke halaman detail yang sama
        return redirect()->to('admin/pembayaran/detail/' . $idPesanan);
    }

    /**
     * Menampilkan halaman manajemen slot waktu (jadwal).
     */
    public function jadwal()
    {
        $jadwalModel = new \App\Models\JadwalMasterModel();
        $keyword = $this->request->getGet('keyword');

        if ($keyword) {
            // [UPDATED] Pencarian sekarang juga mencakup kolom 'hari'
            $query = $jadwalModel->like('hari', $keyword)
                ->orLike('jam_mulai', $keyword)
                ->orLike('harga', $keyword);
        } else {
            $query = $jadwalModel;
        }

        $data = [
            'title' => 'Manajemen Slot Waktu',
            'jadwal' => $query->orderBy('jam_mulai', 'ASC')->findAll(),
            'keyword' => $keyword
        ];

        return view('admin/jadwal_index', $data);
    }

    // Ganti fungsi simpanJadwal() yang lama dengan ini
    public function simpanJadwal()
    {
        $jadwalModel = new \App\Models\JadwalMasterModel();

        $jadwalModel->save([
            'id' => $this->request->getPost('id'),
            'hari' => $this->request->getPost('hari'), // [BARU] Menyimpan data hari
            'jam_mulai' => $this->request->getPost('jam_mulai'),
            'jam_selesai' => $this->request->getPost('jam_selesai'),
            'harga' => $this->request->getPost('harga'),
        ]);

        return redirect()->to('/admin/jadwal')->with('success', 'Data jadwal berhasil disimpan.');
    }
    /**
     * Menghapus satu slot waktu.
     */
    public function hapusJadwal($id)
    {
        $jadwalModel = new JadwalMasterModel();
        $jadwalModel->delete($id);
        return redirect()->to('/admin/jadwal')->with('success', 'Data jadwal berhasil dihapus.');
    }

    /**
     * Menampilkan daftar semua pengguna.
     */
    // =================================================================
    // FUNGSI UNTUK MANAJEMEN PENGGUNA (CRUD & SEARCH)
    // =================================================================

    /**
     * [UPDATED] Menampilkan daftar pengguna dengan fitur pencarian.
     */
    public function users()
    {
        $userModel = new UserModel();
        $keyword = $this->request->getGet('keyword');

        if ($keyword) {
            $query = $userModel->like('nama_lengkap', $keyword)
                ->orLike('email', $keyword);
        } else {
            $query = $userModel;
        }

        $data = [
            'title' => 'Manajemen Pengguna',
            'users' => $query->orderBy('id', 'DESC')->findAll(),
            'keyword' => $keyword,
        ];
        return view('admin/users_index', $data);
    }

    /**
     * [BARU] Menyimpan data pengguna baru atau yang diedit.
     */
    public function simpanUser()
    {
        $userModel = new UserModel();
        $id = $this->request->getPost('id');

        // Aturan validasi
        $emailRule = "required|valid_email|is_unique[users.email,id,{$id}]";
        $rules = [
            'nama_lengkap' => 'required|min_length[3]',
            'email' => $emailRule,
            'role' => 'required|in_list[admin,user]',
        ];

        // Password hanya wajib diisi jika membuat user baru
        if (!$id) {
            $rules['password'] = 'required|min_length[8]';
        }

        if (!$this->validate($rules)) {
            return redirect()->back()->withInput()->with('errors', $this->validator->getErrors());
        }

        // Siapkan data untuk disimpan
        $data = [
            'id' => $id,
            'nama_lengkap' => $this->request->getPost('nama_lengkap'),
            'email' => $this->request->getPost('email'),
            'role' => $this->request->getPost('role'),
        ];

        // Hanya update password jika diisi
        if ($this->request->getPost('password')) {
            $data['password'] = $this->request->getPost('password');
        }

        $userModel->save($data);
        return redirect()->to('/admin/users')->with('success', 'Data pengguna berhasil disimpan.');
    }

    /**
     * [BARU] Menghapus pengguna.
     */
    public function hapusUser($id)
    {
        // Mencegah admin menghapus dirinya sendiri
        if ($id == session()->get('user_id')) {
            return redirect()->to('/admin/users')->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $userModel = new UserModel();
        $userModel->delete($id);
        return redirect()->to('/admin/users')->with('success', 'Pengguna berhasil dihapus.');
    }
    // =================================================================
    // FUNGSI UNTUK MANAJEMEN KONTEN (GALERI)
    // =================================================================
    public function galeri()
    {
        $galeriModel = new GaleriModel();

        // Logika Pencarian
        $keyword = $this->request->getGet('keyword');
        if ($keyword) {
            $galeri = $galeriModel->like('judul', $keyword);
        } else {
            $galeri = $galeriModel;
        }

        $data = [
            'title' => 'Manajemen Galeri',
            'galeri' => $galeri->orderBy('created_at', 'DESC')->findAll(),
            'keyword' => $keyword
        ];
        return view('admin/galeri_index', $data);
    }

    public function simpanGaleri()
    {
        $id = $this->request->getPost('id');

        // Aturan validasi dasar
        $rules = [
            'judul' => [
                'rules' => 'required|min_length[3]',
                'errors' => [
                    'required' => 'Judul harus diisi.',
                    'min_length' => 'Judul minimal harus 3 karakter.'
                ]
            ],
            'deskripsi' => [
                'rules' => 'permit_empty|string', // Boleh kosong
            ],
            // Aturan untuk gambar
            'gambar' => [
                // Gambar hanya wajib jika ini data BARU (id kosong)
                'rules' => $id ? 'max_size[gambar,2048]|is_image[gambar]|mime_in[gambar,image/jpg,image/jpeg,image/png]' : 'uploaded[gambar]|max_size[gambar,2048]|is_image[gambar]|mime_in[gambar,image/jpg,image/jpeg,image/png]',
                'errors' => [
                    'uploaded' => 'Anda harus memilih file gambar untuk data baru.',
                    'max_size' => 'Ukuran gambar maksimal 2MB.',
                    'is_image' => 'File yang dipilih bukan gambar.',
                    'mime_in' => 'Format gambar harus jpg, jpeg, atau png.'
                ]
            ]
        ];

        // Jalankan validasi
        if (!$this->validate($rules)) {
            // Jika validasi gagal, kembalikan dengan pesan error dan input lama
            return redirect()->back()->withInput()->with('errors', $this->validator->getErrors());
        }

        $galeriModel = new \App\Models\GaleriModel();

        // [FIXED] Siapkan data yang akan disimpan dari input POST
        $data = [
            'judul'     => $this->request->getPost('judul'),
            'deskripsi' => $this->request->getPost('deskripsi')
        ];

        // Logika untuk menangani file gambar saat UPDATE
        if ($id) {
            $itemLama = $galeriModel->find($id);
            if ($itemLama) {
                // Pertahankan nama file lama sebagai default jika tidak ada gambar baru
                $data['nama_file'] = $itemLama['nama_file'];
            }
        }

        // Proses file gambar jika ada yang diunggah
        $fileGambar = $this->request->getFile('gambar');
        if ($fileGambar->isValid() && !$fileGambar->hasMoved()) {
            // Hapus gambar lama jika ada saat proses edit
            if ($id && isset($itemLama) && file_exists('uploads/galeri/' . $itemLama['nama_file'])) {
                if ($itemLama['nama_file'] != 'default.png') { // Jangan hapus gambar default
                    unlink('uploads/galeri/' . $itemLama['nama_file']);
                }
            }
            // Pindahkan file baru
            $namaFileBaru = $fileGambar->getRandomName();
            $fileGambar->move('uploads/galeri', $namaFileBaru);
            $data['nama_file'] = $namaFileBaru;
        }

        // Simpan ke database menggunakan metode save() yang cerdas
        if ($id) {
            $galeriModel->update($id, $data);
        } else {
            $galeriModel->insert($data);
        }

        return redirect()->to('/admin/galeri')->with('success', 'Data galeri berhasil disimpan.');
    }
    public function detailGaleri($id)
    {
        $galeriModel = new \App\Models\GaleriModel();
        $data = $galeriModel->find($id);

        if ($this->request->isAJAX() && $data) {
            return $this->response->setJSON($data);
        }

        // Jika tidak ditemukan atau bukan request AJAX, kembalikan error
        return $this->response->setStatusCode(404, 'Data tidak ditemukan');
    }
    public function hapusGaleri($id)
    {
        $galeriModel = new GaleriModel();
        // Cari data untuk mendapatkan nama file
        $item = $galeriModel->find($id);
        if ($item) {
            // Hapus file gambar dari server
            if (file_exists('uploads/galeri/' . $item['nama_file'])) {
                unlink('uploads/galeri/' . $item['nama_file']);
            }
            // Hapus data dari database
            $galeriModel->delete($id);
        }
        return redirect()->to('/admin/galeri')->with('success', 'Data galeri berhasil dihapus.');
    }

    public function cetakPembayaran($id)
    {
        $pemesananModel = new \App\Models\PemesananModel();
        $pesanan = $pemesananModel
            ->select('pemesanan.*, jadwal_master.jam_mulai, jadwal_master.jam_selesai, users.nama_lengkap')
            ->join('jadwal_master', 'jadwal_master.id = pemesanan.id_jadwal_master')
            ->join('users', 'users.id = pemesanan.id_user', 'left')
            ->where('pemesanan.id', $id)
            ->first();

        if (!$pesanan) {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }

        $data['pesanan'] = $pesanan;
        return view('admin/pembayaran_cetak', $data);
    }

    public function hapusPembayaran($id)
    {
        $pemesananModel = new \App\Models\PemesananModel();
        $pesanan = $pemesananModel->find($id);

        if ($pesanan) {
            // Hapus file bukti pembayaran jika ada
            if (!empty($pesanan['bukti_pembayaran']) && file_exists('uploads/bukti_pembayaran/' . $pesanan['bukti_pembayaran'])) {
                unlink('uploads/bukti_pembayaran/' . $pesanan['bukti_pembayaran']);
            }
            // Hapus data dari database
            $pemesananModel->delete($id);

            session()->setFlashdata('success', 'Data pemesanan berhasil dihapus.');
        } else {
            session()->setFlashdata('error', 'Data pemesanan tidak ditemukan.');
        }

        return redirect()->to('admin/pembayaran');
    }

    // =================================================================
    // FUNGSI UNTUK MANAJEMEN PESAN KONTAK
    // =================================================================
    public function pesanKontak()
    {
        $kontakModel = new KontakModel();
        $keyword = $this->request->getGet('keyword');

        if ($keyword) {
            $query = $kontakModel->like('nama_pengirim', $keyword)
                ->orLike('email', $keyword)
                ->orLike('pesan', $keyword);
        } else {
            $query = $kontakModel;
        }

        $data = [
            'title' => 'Pesan Kontak Masuk',
            'pesan' => $query->orderBy('created_at', 'DESC')->findAll(),
            'keyword' => $keyword,
        ];
        return view('admin/kontak_index', $data);
    }

    public function hapusPesanKontak($id)
    {
        $kontakModel = new KontakModel();
        $kontakModel->delete($id);
        return redirect()->to('/admin/pesan-kontak')->with('success', 'Pesan berhasil dihapus.');
    }

    // =================================================================
    // FUNGSI UNTUK MANAJEMEN FEEDBACK
    // =================================================================
    public function feedback()
    {
        $feedbackModel = new FeedbackModel();
        $keyword = $this->request->getGet('keyword');

        $builder = $feedbackModel
            ->select('feedback.*, users.nama_lengkap as nama_user')
            ->join('users', 'users.id = feedback.id_user', 'left');

        if ($keyword) {
            $builder->like('users.nama_lengkap', $keyword)
                ->orLike('feedback.komentar', $keyword);
        }

        $data = [
            'title' => 'Kelola Feedback Pengguna',
            'feedbacks' => $builder->orderBy('feedback.created_at', 'DESC')->findAll(),
            'keyword' => $keyword,
        ];
        return view('admin/feedback_index', $data);
    }

    public function hapusFeedback($id)
    {
        $feedbackModel = new FeedbackModel();
        $feedbackModel->delete($id);
        return redirect()->to('/admin/feedback')->with('success', 'Feedback berhasil dihapus.');
    }
}
