<?php

namespace App\Controllers;

use App\Models\JadwalMasterModel;
use App\Models\PemesananModel;

class Booking extends BaseController
{
    /**
     * Fungsi ini menampilkan halaman utama form booking.
     * Dipanggil oleh rute: GET /booking
     */
    public function index()
    {
        $data = [
            'title' => 'Form Booking Lapangan Sepak Bola',
            'user' => null
        ];
        if (session()->get('isLoggedIn')) {
            $data['user'] = (new \App\Models\UserModel())->find(session()->get('user_id'));
        }
        return view('booking/form_booking', $data);
    }

    /**
     * Menyimpan data pemesanan baru.
     * Logika ini menangani 3 skenario: Admin, User Login, dan Tamu.
     */
    public function store()
    {
        // 1. Aturan Validasi
        // Aturan dasar yang selalu diperlukan
        $rules = [
            'tanggal_booking' => 'required|valid_date',
            'id_jadwal'       => 'required|integer',
        ];

        // Tambahkan aturan validasi untuk nama, email, dan hp HANYA JIKA yang booking BUKAN admin
        if (session()->get('role') !== 'admin') {
            $rules['nama_pemesan'] = 'required|min_length[3]';
            $rules['email_pemesan'] = 'required|valid_email';
            $rules['nomor_hp_pemesan'] = 'required|min_length[10]|max_length[15]';
        }

        // Jalankan validasi
        if (!$this->validate($rules)) {
            // Jika gagal, kembali ke halaman form dengan input dan pesan error
            return redirect()->back()->withInput()->with('errors', $this->validator->getErrors());
        }

        // 2. Ambil Detail Jadwal dari Database
        $jadwalModel = new \App\Models\JadwalMasterModel();
        $idJadwal = $this->request->getPost('id_jadwal');
        $jadwalDipilih = $jadwalModel->find($idJadwal);

        // Penanganan error jika ID jadwal tidak valid
        if (!$jadwalDipilih) {
            return redirect()->back()->withInput()->with('error', 'Jadwal yang dipilih tidak valid atau sudah tidak tersedia.');
        }

        // 3. Siapkan Data Pemesan Secara Kondisional
        $namaPemesan = '';
        $emailPemesan = '';
        $hpPemesan = '';
        $statusPemesanan = 'pending';
        $statusPembayaran = 'pending';

        // Jika yang booking adalah admin (untuk pesanan offline)
        if (session()->get('role') === 'admin') {
            $namaPemesan = "Pesanan Offline (Admin)";
            $emailPemesan = session()->get('email'); // Gunakan email admin
            $hpPemesan = "000000"; // Nomor HP placeholder

            // Pesanan offline dianggap langsung lunas dan terkonfirmasi
            $statusPemesanan = 'confirmed';
            $statusPembayaran = 'paid';
        } else {
            // Jika user biasa atau tamu, ambil data dari form
            $namaPemesan = $this->request->getPost('nama_pemesan');
            $emailPemesan = $this->request->getPost('email_pemesan');
            $hpPemesan = $this->request->getPost('nomor_hp_pemesan');
        }

        // 4. Siapkan Array Data Lengkap untuk Disimpan
        $dataPemesanan = [
            'kode_pemesanan'    => 'BOOK-' . strtoupper(uniqid()),
            'id_user'           => session()->get('user_id'), // Akan null jika tamu, dan itu tidak apa-apa
            'id_jadwal_master'  => $idJadwal,
            'nama_pemesan'      => $namaPemesan,
            'email_pemesan'     => $emailPemesan,
            'nomor_hp_pemesan'  => $hpPemesan,
            'tanggal_booking'   => $this->request->getPost('tanggal_booking'),
            'total_harga'       => $jadwalDipilih['harga'],
            'status_pemesanan'  => $statusPemesanan,
            'status_pembayaran' => $statusPembayaran,
        ];

        // 5. Simpan ke Database
        $pemesananModel = new \App\Models\PemesananModel();
        $pemesananModel->insert($dataPemesanan);

        // 6. Arahkan Pengguna (Redirect) Secara Kondisional
        if (session()->get('role') === 'admin') {
            // Jika admin, arahkan ke daftar pembayaran di panel admin
            return redirect()->to('admin/pembayaran')->with('success', 'Booking offline berhasil ditambahkan.');
        } else {
            // Jika user biasa, arahkan ke halaman konfirmasi
            return redirect()->to('/booking/konfirmasi/' . $dataPemesanan['kode_pemesanan']);
        }
    }

    /**
     * Menyediakan data jadwal untuk JavaScript (AJAX).
     * [FIXED] Sekarang juga memfilter slot waktu yang sudah terlewat untuk hari ini.
     */
    public function getJadwal()
    {
        // 1. Ambil dan validasi tanggal dari request
        $tanggalString = $this->request->getGet('tanggal');
        if (!$tanggalString) {
            return $this->response->setJSON(['status' => 'error', 'message' => 'Tanggal tidak valid.'])->setStatusCode(400);
        }

        try {
            $tanggalDipilih = new \DateTime($tanggalString);
        } catch (\Exception $e) {
            return $this->response->setJSON(['status' => 'error', 'message' => 'Format tanggal tidak valid.'])->setStatusCode(400);
        }

        // 2. Tentukan jenis hari (Weekday/Weekend)
        $nomorHari = (int) $tanggalDipilih->format('w');
        $jenisHari = ($nomorHari === 0 || $nomorHari === 6) ? 'Weekend' : 'Weekday';

        // 3. Ambil data dari database
        $jadwalModel = new \App\Models\JadwalMasterModel();
        $pemesananModel = new \App\Models\PemesananModel();

        // Ambil semua slot yang sesuai dengan JENIS HARI
        $semuaSlot = $jadwalModel->where('hari', $jenisHari)
            ->orderBy('jam_mulai', 'ASC')
            ->findAll();

        // Ambil ID slot yang SUDAH DIBOOKING pada tanggal tersebut
        $idSlotTerpesan = $pemesananModel
            ->where('tanggal_booking', $tanggalString)
            ->whereIn('status_pemesanan', ['pending', 'confirmed'])
            ->findColumn('id_jadwal_master') ?? [];

        // Saring slot yang sudah dibooking
        $slotTersedia = array_filter($semuaSlot, function ($slot) use ($idSlotTerpesan) {
            return !in_array($slot['id'], $idSlotTerpesan);
        });

        // =================================================================
        // [LOGIKA BARU] Saring waktu yang sudah terlewat HANYA JIKA tanggal yang dipilih adalah HARI INI
        // =================================================================
        $tanggalHariIni = new \DateTime('now', new \DateTimeZone('Asia/Jakarta')); // Sesuaikan dengan timezone Anda

        // Membandingkan hanya bagian tanggal (tanpa waktu)
        if ($tanggalDipilih->format('Y-m-d') === $tanggalHariIni->format('Y-m-d')) {
            $waktuSekarang = $tanggalHariIni->format('H:i:s');

            $slotTersedia = array_filter($slotTersedia, function ($slot) use ($waktuSekarang) {
                // Hanya tampilkan slot yang jam mulainya LEBIH DARI waktu sekarang
                return $slot['jam_mulai'] > $waktuSekarang;
            });
        }

        // 5. Kembalikan data dalam format JSON
        return $this->response->setJSON(['status' => 'success', 'jadwal' => array_values($slotTersedia)]);
    }

    /**
     * Fungsi ini menampilkan halaman konfirmasi setelah booking.
     * Dipanggil oleh rute: GET /booking/konfirmasi/(:segment)
     */
    public function konfirmasi($kodePemesanan)
    {
        $pemesananModel = new \App\Models\PemesananModel();

        // Query ini sudah mengambil semua data yang kita butuhkan
        $pesanan = $pemesananModel
            ->select('pemesanan.*, jadwal_master.jam_mulai, jadwal_master.jam_selesai')
            ->join('jadwal_master', 'jadwal_master.id = pemesanan.id_jadwal_master')
            ->where('kode_pemesanan', $kodePemesanan)
            ->first();

        if (!$pesanan) {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }

        $data = [
            'title'   => 'Konfirmasi Pemesanan',
            'pesanan' => $pesanan, // Data ini dikirim ke view
        ];
        return view('booking/halaman_konfirmasi', $data);
    }

    /**
     * Fungsi ini memproses form upload bukti pembayaran.
     * Dipanggil oleh rute: POST /booking/simpan-pembayaran
     */
    public function simpanPembayaran()
    {
        $validationRules = [
            'kode_pemesanan' => 'required',
            'bank_tujuan' => 'required',
            'bukti_pembayaran' => [
                'rules' => 'uploaded[bukti_pembayaran]|max_size[bukti_pembayaran,2048]|is_image[bukti_pembayaran]|mime_in[bukti_pembayaran,image/jpg,image/jpeg,image/png,image/gif]',
                'errors' => [
                    'uploaded' => 'Anda harus mengunggah bukti pembayaran.',
                    'max_size' => 'Ukuran file maksimal adalah 2MB.',
                    'is_image' => 'File yang diunggah harus berupa gambar.',
                ]
            ]
        ];

        if (!$this->validate($validationRules)) {
            return redirect()->back()->withInput()->with('errors', $this->validator->getErrors());
        }

        $fileBukti = $this->request->getFile('bukti_pembayaran');
        if ($fileBukti->isValid() && !$fileBukti->hasMoved()) {
            if (!is_dir('uploads/bukti_pembayaran')) {
                mkdir('uploads/bukti_pembayaran', 0777, true);
            }

            $namaFileBaru = $fileBukti->getRandomName();
            $fileBukti->move('uploads/bukti_pembayaran', $namaFileBaru);

            $kodePemesanan = $this->request->getPost('kode_pemesanan');
            $pemesananModel = new \App\Models\PemesananModel();

            $dataUpdate = [
                'bank_tujuan' => $this->request->getPost('bank_tujuan'),
                'catatan_pembayaran' => $this->request->getPost('catatan_pembayaran'),
                'bukti_pembayaran' => $namaFileBaru,
                'status_pembayaran' => 'paid',
                'waktu_pembayaran' => date('Y-m-d H:i:s')
            ];
            $pemesananModel->where('kode_pemesanan', $kodePemesanan)->set($dataUpdate)->update();

            // [FIXED] Arahkan ke halaman riwayat dengan pesan sukses
            session()->setFlashdata('success', 'Konfirmasi pembayaran berhasil dikirim. Pesanan Anda sedang ditinjau oleh admin.');
            return redirect()->to('/riwayat'); // Mengarahkan ke halaman riwayat
        }

        session()->setFlashdata('error', 'Gagal mengunggah file. Silakan coba lagi.');
        return redirect()->back()->withInput();
    }
}
