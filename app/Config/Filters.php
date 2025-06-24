<?php

namespace Config;

use CodeIgniter\Config\Filters as BaseFilters;
use CodeIgniter\Filters\Cors;
use CodeIgniter\Filters\CSRF;
use CodeIgniter\Filters\DebugToolbar;
use CodeIgniter\Filters\ForceHTTPS;
use CodeIgniter\Filters\Honeypot;
use CodeIgniter\Filters\InvalidChars;
use CodeIgniter\Filters\PageCache;
use CodeIgniter\Filters\PerformanceMetrics;
use CodeIgniter\Filters\SecureHeaders;

class Filters extends BaseFilters
{
    /**
     * Konfigurasi alias untuk kelas-kelas Filter.
     */
    public array $aliases = [
        'csrf'          => CSRF::class,
        'toolbar'       => DebugToolbar::class,
        'honeypot'      => Honeypot::class,
        'invalidchars'  => InvalidChars::class,
        'secureheaders' => SecureHeaders::class,
        'admin'         => \App\Filters\AdminFilter::class, // Filter admin yang kita buat
        'login'         => \App\Filters\LoginFilter::class, // Filter login yang kita buat
        'forcehttps'    => ForceHTTPS::class, // [FIX] Menambahkan alias yang hilang
        'pagecache'     => PageCache::class, // [FIX] Menambahkan alias yang hilang
        'performance'   => PerformanceMetrics::class, // [FIX] Menambahkan alias yang hilang
    ];

    /**
     * Daftar filter khusus yang diperlukan.
     * Filter ini akan selalu dijalankan.
     */
    public array $required = [
        'before' => [
            // 'forcehttps', // Dinonaktifkan selama development di localhost
            // 'pagecache',  // Dinonaktifkan selama development
        ],
        'after' => [
            'toolbar',     // Selalu aktifkan Debug Toolbar saat development
            // 'pagecache',   // Dinonaktifkan selama development
            // 'performance', // Dinonaktifkan selama development
        ],
    ];

    /**
     * Daftar alias filter yang selalu diterapkan
     * sebelum dan sesudah setiap request.
     */
    public array $globals = [
        'before' => [
            // 'honeypot',
            // 'csrf',
            // 'invalidchars',
        ],
        'after' => [
            // 'honeypot',
            // 'secureheaders',
        ],
    ];

    /**
     * Daftar alias filter yang bekerja pada
     * metode HTTP tertentu (GET, POST, dll.).
     */
    public array $methods = [];

    /**
     * Daftar alias filter yang harus dijalankan pada
     * pola URI tertentu.
     */
    public array $filters = [];
}
