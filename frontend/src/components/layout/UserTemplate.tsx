import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

export default function UserTemplate({ children }: Props) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path ? 'active' : '';
  const fotoUrl = user?.foto_profil
    ? (user.foto_profil.startsWith('http') ? user.foto_profil : `/uploads/profil/${user.foto_profil}`)
    : '/images/logo.jpg';

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1a2533' }}>
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src="/images/logo.jpg" alt="Logo" width="40" height="40" className="rounded-circle mr-2" />
            <span className="font-weight-bold">Booking Lapangan</span>
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto">
              <li className={`nav-item ${isActive('/')}`}><Link className="nav-link" to="/"><i className="fas fa-home mr-1"></i>Beranda</Link></li>
              {user && (
                <>
                  <li className={`nav-item ${isActive('/booking')}`}><Link className="nav-link" to="/booking"><i className="fas fa-calendar-plus mr-1"></i>Booking</Link></li>
                  <li className={`nav-item ${isActive('/riwayat')}`}><Link className="nav-link" to="/riwayat"><i className="fas fa-history mr-1"></i>Riwayat</Link></li>
                  <li className={`nav-item ${isActive('/galeri')}`}><Link className="nav-link" to="/galeri"><i className="fas fa-images mr-1"></i>Galeri</Link></li>
                  <li className={`nav-item ${isActive('/kontak')}`}><Link className="nav-link" to="/kontak"><i className="fas fa-envelope mr-1"></i>Kontak</Link></li>
                </>
              )}
            </ul>

            <ul className="navbar-nav">
              {user ? (
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-toggle="dropdown">
                    <img src={fotoUrl} alt="profile" className="rounded-circle mr-2" width="30" height="30" style={{ objectFit: 'cover' }} />
                    <span>{user.nama_lengkap}</span>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right" style={{ backgroundColor: '#2c3e50', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {user.role === 'admin' && (
                      <>
                        <Link className="dropdown-item text-light" to="/admin/dashboard"><i className="fas fa-tachometer-alt mr-2"></i>Dashboard Admin</Link>
                        <div className="dropdown-divider" style={{ borderTopColor: 'rgba(255,255,255,0.1)' }}></div>
                      </>
                    )}
                    <Link className="dropdown-item text-light" to="/profil"><i className="fas fa-user mr-2"></i>Profil Saya</Link>
                    <div className="dropdown-divider" style={{ borderTopColor: 'rgba(255,255,255,0.1)' }}></div>
                    <button className="dropdown-item text-danger" onClick={handleLogout}><i className="fas fa-sign-out-alt mr-2"></i>Logout</button>
                  </div>
                </li>
              ) : (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/login"><i className="fas fa-sign-in-alt mr-1"></i>Login</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/register"><i className="fas fa-user-plus mr-1"></i>Register</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="py-4 mt-5" style={{ backgroundColor: '#1a2533', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container text-center text-white-50">
          <small>&copy; {new Date().getFullYear()} Booking Lapangan Futsal. All rights reserved.</small>
        </div>
      </footer>
    </>
  );
}
