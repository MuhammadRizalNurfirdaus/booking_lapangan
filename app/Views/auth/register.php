<!DOCTYPE html>
<html lang="id">

<head>
    <title>Registrasi - Booking Lapangan</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <!-- CSS Kustom -->
    <style>
        body {
            background-color: #1a2533;
            color: #f8f9fa;
        }

        .auth-card {
            background-color: #2c3e50;
            border: 1px solid #455a64;
            border-radius: 10px;
        }

        .auth-card .form-control {
            background-color: #455a64;
            color: white;
            border: 1px solid #546e7a;
        }

        .auth-card .form-control:focus {
            background-color: #546e7a;
            color: white;
            border-color: #78909c;
            box-shadow: none;
        }

        .auth-card .form-control::placeholder {
            color: #b0bec5;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="row justify-content-center align-items-center" style="min-height: 100vh;">
            <div class="col-md-6">
                <div class="card auth-card p-4">
                    <div class="text-center mb-4">
                        <a href="<?= site_url('/') ?>">
                            <img src="<?= base_url('images/logo.jpg') ?>" alt="Logo" style="height: 80px;">
                        </a>
                        <h3 class="mt-3">Buat Akun Baru</h3>
                        <p class="text-muted">Lengkapi form di bawah ini untuk bergabung.</p>
                    </div>
                    <div class="card-body p-0">
                        <?php if (session()->getFlashdata('errors')): ?>
                            <div class="alert alert-danger">
                                <ul class="mb-0"><?php foreach (session('errors') as $error) : ?><li><?= esc($error) ?></li><?php endforeach ?></ul>
                            </div>
                        <?php endif; ?>

                        <form action="<?= site_url('register') ?>" method="post">
                            <?= csrf_field() ?>
                            <div class="form-group">
                                <label for="nama_lengkap">Nama Lengkap</label>
                                <input type="text" name="nama_lengkap" id="nama_lengkap" class="form-control" placeholder="Masukkan nama lengkap Anda" value="<?= old('nama_lengkap') ?>" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Alamat Email</label>
                                <input type="email" name="email" id="email" class="form-control" placeholder="contoh@email.com" value="<?= old('email') ?>" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" name="password" class="form-control" placeholder="Minimal 8 karakter" required>
                            </div>
                            <div class="form-group">
                                <label for="pass_confirm">Konfirmasi Password</label>
                                <input type="password" name="pass_confirm" class="form-control" placeholder="Ketik ulang password" required>
                            </div>
                            <button type="submit" class="btn btn-success btn-block btn-lg mt-4">Buat Akun</button>
                        </form>
                    </div>
                    <div class="text-center mt-4">
                        <small class="text-muted">Sudah punya akun? <a href="<?= site_url('login') ?>" class="text-success">Masuk di sini</a></small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>