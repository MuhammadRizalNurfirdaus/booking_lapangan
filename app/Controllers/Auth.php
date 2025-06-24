<?php

namespace App\Controllers;

use App\Models\UserModel;

class Auth extends BaseController
{
    // Menampilkan halaman login
    public function login()
    {
        return view('auth/login');
    }

    // Memproses usaha login
    public function attemptLogin()
    {
        $userModel = new \App\Models\UserModel();
        $email = $this->request->getPost('email');
        $password = $this->request->getPost('password');

        $user = $userModel->where('email', $email)->first();

        if (!$user || !password_verify($password, $user['password'])) {
            return redirect()->to('/login')->with('error', 'Email atau password salah.');
        }

        $this->setUserSession($user);

        if ($user['role'] === 'admin') {
            return redirect()->to('/admin/dashboard');
        } else {
            // Arahkan ke halaman riwayat setelah login berhasil
            return redirect()->to('/riwayat');
        }
    }
    // Set session user
    private function setUserSession($user)
    {
        $data = [
            'user_id'       => $user['id'],
            'nama_lengkap'  => $user['nama_lengkap'],
            'email'         => $user['email'],
            'role'          => $user['role'],
            'foto_profil'   => $user['foto_profil'], // [FIXED] Menambahkan foto profil ke session
            'isLoggedIn'    => true,
        ];

        session()->set($data);
    }
    // Menampilkan halaman registrasi
    public function register()
    {
        return view('auth/register');
    }

    // Memproses pendaftaran user baru
    public function attemptRegister()
    {
        $validation = $this->validate([
            'nama_lengkap' => 'required|min_length[3]',
            'email' => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[8]',
            'pass_confirm' => 'required|matches[password]',
        ]);

        if (!$validation) {
            return redirect()->to('/register')->withInput()->with('errors', $this->validator->getErrors());
        }

        $userModel = new UserModel();
        $userModel->save([
            'nama_lengkap' => $this->request->getPost('nama_lengkap'),
            'email' => $this->request->getPost('email'),
            'password' => $this->request->getPost('password'),
            'role' => 'user' // Default role
        ]);

        // Buat satu user admin secara manual di database
        // setelah pendaftaran pertama berhasil.

        return redirect()->to('/login')->with('success', 'Registrasi berhasil! Silakan login.');
    }

    // Fungsi untuk logout
    public function logout()
    {
        session()->destroy();
        return redirect()->to('/login');
    }
}
