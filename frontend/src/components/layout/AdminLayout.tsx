import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import React, { useState } from 'react';

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  const fotoUrl = user?.foto_profil
    ? (user.foto_profil.startsWith('http') ? user.foto_profil : `/uploads/profil/${user.foto_profil}`)
    : '/images/logo.jpg';

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? '' : 'd-none'}`} style={{
        width: '260px',
        backgroundColor: '#1a2533',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        overflowY: 'auto',
        zIndex: 1000
      }}>
        <div className="p-3 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <img src={fotoUrl} alt="Profile" className="rounded-circle mb-2" width="80" height="80" style={{ objectFit: 'cover' }} />
          <h6 className="text-white mb-0">{user?.nama_lengkap}</h6>
          <small className="text-white-50">Administrator</small>
        </div>

        <nav className="mt-3">
          <div className="px-3 mb-2"><small className="text-white-50 text-uppercase font-weight-bold">Menu Utama</small></div>
          <Link to="/admin/dashboard" className={`sidebar-link d-block px-3 py-2 text-white text-decoration-none ${isActive('/admin/dashboard')}`}>
            <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
          </Link>
          <Link to="/admin/pembayaran" className={`sidebar-link d-block px-3 py-2 text-white text-decoration-none ${isActive('/admin/pembayaran')}`}>
            <i className="fas fa-money-bill-wave mr-2"></i>Pembayaran
          </Link>

          <div className="px-3 mb-2 mt-3"><small className="text-white-50 text-uppercase font-weight-bold">Kelola Data</small></div>
          <Link to="/admin/jadwal" className={`sidebar-link d-block px-3 py-2 text-white text-decoration-none ${isActive('/admin/jadwal')}`}>
            <i className="fas fa-calendar-alt mr-2"></i>Jadwal & Harga
          </Link>
          <Link to="/admin/users" className={`sidebar-link d-block px-3 py-2 text-white text-decoration-none ${isActive('/admin/users')}`}>
            <i className="fas fa-users mr-2"></i>Pengguna
          </Link>
          <Link to="/admin/galeri" className={`sidebar-link d-block px-3 py-2 text-white text-decoration-none ${isActive('/admin/galeri')}`}>
            <i className="fas fa-images mr-2"></i>Galeri
          </Link>

          <div className="px-3 mb-2 mt-3"><small className="text-white-50 text-uppercase font-weight-bold">Komunikasi</small></div>
          <Link to="/admin/pesan-kontak" className={`sidebar-link d-block px-3 py-2 text-white text-decoration-none ${isActive('/admin/pesan-kontak')}`}>
            <i className="fas fa-envelope mr-2"></i>Pesan Kontak
          </Link>
          <Link to="/admin/feedback" className={`sidebar-link d-block px-3 py-2 text-white text-decoration-none ${isActive('/admin/feedback')}`}>
            <i className="fas fa-comments mr-2"></i>Feedback
          </Link>

          <div className="px-3 mb-2 mt-3"><small className="text-white-50 text-uppercase font-weight-bold">Lainnya</small></div>
          <Link to="/" className="sidebar-link d-block px-3 py-2 text-white text-decoration-none">
            <i className="fas fa-home mr-2"></i>Ke Beranda
          </Link>
          <button onClick={handleLogout} className="sidebar-link d-block px-3 py-2 text-danger text-decoration-none border-0 bg-transparent w-100 text-left" style={{ cursor: 'pointer' }}>
            <i className="fas fa-sign-out-alt mr-2"></i>Logout
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: sidebarOpen ? '260px' : '0', width: sidebarOpen ? 'calc(100% - 260px)' : '100%', transition: 'all 0.3s' }}>
        <nav className="navbar navbar-dark px-3" style={{ backgroundColor: '#1a2533', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <button className="btn btn-outline-light btn-sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className="fas fa-bars"></i>
          </button>
          <span className="text-white font-weight-bold">Admin Panel</span>
          <div></div>
        </nav>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
