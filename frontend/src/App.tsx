import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import UserTemplate from './components/layout/UserTemplate';
import AdminLayout from './components/layout/AdminLayout';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';

// Protected pages
import Galeri from './pages/Galeri';
import GaleriDetail from './pages/GaleriDetail';
import Kontak from './pages/Kontak';
import Booking from './pages/Booking';
import Konfirmasi from './pages/Konfirmasi';
import Riwayat from './pages/Riwayat';
import Profil from './pages/Profil';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminPembayaran from './pages/admin/Pembayaran';
import AdminPembayaranDetail from './pages/admin/PembayaranDetail';
import AdminPembayaranCetak from './pages/admin/PembayaranCetak';
import AdminJadwal from './pages/admin/Jadwal';
import AdminUsers from './pages/admin/Users';
import AdminGaleri from './pages/admin/GaleriAdmin';
import AdminKontak from './pages/admin/KontakAdmin';
import AdminFeedback from './pages/admin/Feedback';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-light"></div></div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-light"></div></div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<UserTemplate><Home /></UserTemplate>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected routes */}
      <Route path="/galeri" element={<ProtectedRoute><UserTemplate><Galeri /></UserTemplate></ProtectedRoute>} />
      <Route path="/galeri/detail/:id" element={<ProtectedRoute><UserTemplate><GaleriDetail /></UserTemplate></ProtectedRoute>} />
      <Route path="/kontak" element={<ProtectedRoute><UserTemplate><Kontak /></UserTemplate></ProtectedRoute>} />
      <Route path="/booking" element={<ProtectedRoute><UserTemplate><Booking /></UserTemplate></ProtectedRoute>} />
      <Route path="/booking/konfirmasi/:kode" element={<ProtectedRoute><UserTemplate><Konfirmasi /></UserTemplate></ProtectedRoute>} />
      <Route path="/riwayat" element={<ProtectedRoute><UserTemplate><Riwayat /></UserTemplate></ProtectedRoute>} />
      <Route path="/profil" element={<ProtectedRoute><UserTemplate><Profil /></UserTemplate></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
      <Route path="/admin/pembayaran" element={<AdminRoute><AdminLayout><AdminPembayaran /></AdminLayout></AdminRoute>} />
      <Route path="/admin/pembayaran/detail/:id" element={<AdminRoute><AdminLayout><AdminPembayaranDetail /></AdminLayout></AdminRoute>} />
      <Route path="/admin/pembayaran/cetak/:id" element={<AdminRoute><AdminPembayaranCetak /></AdminRoute>} />
      <Route path="/admin/jadwal" element={<AdminRoute><AdminLayout><AdminJadwal /></AdminLayout></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
      <Route path="/admin/galeri" element={<AdminRoute><AdminLayout><AdminGaleri /></AdminLayout></AdminRoute>} />
      <Route path="/admin/pesan-kontak" element={<AdminRoute><AdminLayout><AdminKontak /></AdminLayout></AdminRoute>} />
      <Route path="/admin/feedback" element={<AdminRoute><AdminLayout><AdminFeedback /></AdminLayout></AdminRoute>} />
    </Routes>
  );
}

export default App;
