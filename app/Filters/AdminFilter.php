<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class AdminFilter implements FilterInterface
{
    /**
     * Fungsi ini berjalan SEBELUM controller dipanggil.
     * Ini adalah tempat yang sempurna untuk memeriksa hak akses.
     *
     * @param RequestInterface $request
     * @param array|null       $arguments
     *
     * @return mixed
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        // Cek 1: Apakah pengguna sudah login?
        // Cek 2: Jika sudah login, apakah rolenya 'admin'?
        if (!session()->get('isLoggedIn') || session()->get('role') !== 'admin') {
            // Jika salah satu kondisi tidak terpenuhi, "tendang" pengguna
            // kembali ke halaman login dengan sebuah pesan error.
            return redirect()->to('/login')->with('error', 'Anda tidak memiliki hak akses ke halaman ini.');
        }
    }

    /**
     * Fungsi ini berjalan SETELAH controller selesai dieksekusi.
     * Untuk kasus ini, kita tidak perlu melakukan apa-apa di sini.
     *
     * @param RequestInterface  $request
     * @param ResponseInterface $response
     * @param array|null        $arguments
     *
     * @return mixed
     */
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Do nothing
    }
}
