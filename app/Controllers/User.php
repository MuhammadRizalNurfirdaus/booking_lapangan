<?php

namespace App\Controllers;

use App\Models\PemesananModel;
use App\Models\FeedbackModel;

class User extends BaseController
{
    public function riwayat()
    {
        $pemesananModel = new PemesananModel();
        $data = [
            'title' => 'Riwayat Pemesanan',
            'pemesanan' => $pemesananModel->where('id_user', session()->get('user_id'))->orderBy('created_at', 'DESC')->findAll(),
        ];
        return view('user/riwayat_view', $data);
    }

    public function kirimFeedback()
    {
        // Validasi input
        $rules = [
            'id_pemesanan' => 'required|integer',
            'rating'       => 'required|integer|in_list[1,2,3,4,5]',
            'komentar'     => 'required|min_length[5]',
        ];

        if (!$this->validate($rules)) {
            return redirect()->back()->withInput()->with('error', 'Gagal mengirim feedback. Pastikan semua field terisi dengan benar.');
        }

        $feedbackModel = new \App\Models\FeedbackModel();

        // Kode save() ini sekarang akan berhasil karena model sudah diperbaiki
        $feedbackModel->save([
            'id_user'      => session()->get('user_id'),
            'id_pemesanan' => $this->request->getPost('id_pemesanan'),
            'komentar'     => $this->request->getPost('komentar'),
            'rating'       => $this->request->getPost('rating'),
        ]);

        return redirect()->to('/riwayat')->with('success', 'Terima kasih atas feedback Anda!');
    }
    /**
     * [BARU] Menghapus data pemesanan milik pengguna.
     */
    public function hapusRiwayat($id)
    {
        $pemesananModel = new \App\Models\PemesananModel();

        // Verifikasi bahwa pesanan ini benar-benar milik user yang sedang login
        $pesanan = $pemesananModel->where('id', $id)
            ->where('id_user', session()->get('user_id'))
            ->first();

        if ($pesanan) {
            // Hapus data dari database
            $pemesananModel->delete($id);
            session()->setFlashdata('success', 'Riwayat pemesanan berhasil dihapus.');
        } else {
            session()->setFlashdata('error', 'Gagal menghapus riwayat. Pesanan tidak ditemukan.');
        }

        return redirect()->to('/riwayat');
    }

    /**
     * [BARU] Menampilkan halaman struk untuk dicetak.
     */
    public function cetakStruk($kodePemesanan)
    {
        $pemesananModel = new \App\Models\PemesananModel();

        // Verifikasi bahwa pesanan ini milik user yang sedang login
        $pesanan = $pemesananModel
            ->select('pemesanan.*, jadwal_master.jam_mulai, jadwal_master.jam_selesai, users.nama_lengkap')
            ->join('jadwal_master', 'jadwal_master.id = pemesanan.id_jadwal_master')
            ->join('users', 'users.id = pemesanan.id_user', 'left')
            ->where('kode_pemesanan', $kodePemesanan)
            ->where('pemesanan.id_user', session()->get('user_id'))
            ->first();

        if (!$pesanan || $pesanan['status_pembayaran'] !== 'paid') {
            // Tolak jika pesanan tidak ada atau belum lunas
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound('Struk tidak tersedia.');
        }

        $data['pesanan'] = $pesanan;
        // Kita bisa menggunakan kembali view cetak dari admin
        return view('admin/pembayaran_cetak', $data);
    }
}
