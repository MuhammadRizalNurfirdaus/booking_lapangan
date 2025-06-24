<!DOCTYPE html>
<html lang="id">

<head>
    <title>Login - Booking Lapangan</title>
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
            <div class="col-md-5">
                <div class="card auth-card p-4">
                    <div class="text-center mb-4">
                        <a href="<?= site_url('/') ?>">
                            <img src="<?= base_url('images/logo.jpg') ?>" alt="Logo" style="height: 80px;">
                        </a>
                        <h3 class="mt-3">Selamat Datang!</h3>
                        <p class="text-muted">Masuk untuk memulai sesi Anda.</p>
                    </div>
                    <div class="card-body p-0">
                        <?php if (session()->getFlashdata('success')): ?><div class="alert alert-success"><?= session()->getFlashdata('success') ?></div><?php endif; ?>
                        <?php if (session()->getFlashdata('error')): ?><div class="alert alert-danger"><?= session()->getFlashdata('error') ?></div><?php endif; ?>

                        <form action="<?= site_url('login') ?>" method="post">
                            <?= csrf_field() ?>
                            <div class="form-group">
                                <label for="email">Alamat Email</label>
                                <input type="email" name="email" id="email" class="form-control" placeholder="contoh@email.com" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" name="password" id="password" class="form-control" placeholder="Masukkan password Anda" required>
                            </div>
                            <button type="submit" class="btn btn-success btn-block btn-lg mt-4">Masuk</button>
                        </form>
                    </div>
                    <div class="text-center mt-4">
                        <small class="text-muted">Baru di sini? <a href="<?= site_url('register') ?>" class="text-success">Buat Akun</a></small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>