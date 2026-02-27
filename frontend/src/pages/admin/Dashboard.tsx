import { useState, useEffect } from 'react';
import api from '../../api';

interface Stats {
  total_pesanan: number;
  pesanan_pending: number;
  total_pendapatan: number;
  total_galeri: number;
  total_user: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ total_pesanan: 0, pesanan_pending: 0, total_pendapatan: 0, total_galeri: 0, total_user: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(res => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  const formatRp = (n: number) => `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-light"></div></div>;

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb" style={{ backgroundColor: '#34495e' }}>
          <li className="breadcrumb-item active" style={{ color: '#95a5a6' }}>Dashboard</li>
        </ol>
      </nav>

      <h4>Ringkasan Pemesanan</h4>
      <div className="row mt-3">
        <div className="col-md-4 mb-4 d-flex align-items-stretch">
          <div className="card text-white bg-primary w-100">
            <div className="card-body d-flex flex-column justify-content-between">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">TOTAL PESANAN</h5>
                <i className="fas fa-clipboard-list fa-3x"></i>
              </div>
              <h3 className="mt-3 mb-0 font-weight-bold">{stats.total_pesanan}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4 d-flex align-items-stretch">
          <div className="card text-white bg-warning w-100">
            <div className="card-body d-flex flex-column justify-content-between">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">PESANAN PENDING</h5>
                <i className="fas fa-clock fa-3x"></i>
              </div>
              <h3 className="mt-3 mb-0 font-weight-bold">{stats.pesanan_pending}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4 d-flex align-items-stretch">
          <div className="card text-white bg-success w-100">
            <div className="card-body d-flex flex-column justify-content-between">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">TOTAL PENDAPATAN</h5>
                <i className="fas fa-dollar-sign fa-3x"></i>
              </div>
              <h3 className="mt-3 mb-0 font-weight-bold">{formatRp(stats.total_pendapatan)}</h3>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mt-3">Ringkasan Konten &amp; Pengguna</h4>
      <div className="row mt-3">
        <div className="col-md-4 mb-4 d-flex align-items-stretch">
          <div className="card text-white bg-danger w-100">
            <div className="card-body d-flex flex-column justify-content-between">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">TOTAL FOTO GALERI</h5>
                <i className="fas fa-images fa-3x"></i>
              </div>
              <h3 className="mt-3 mb-0 font-weight-bold">{stats.total_galeri}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4 d-flex align-items-stretch">
          <div className="card text-white bg-info w-100">
            <div className="card-body d-flex flex-column justify-content-between">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">PENGGUNA TERDAFTAR</h5>
                <i className="fas fa-user-friends fa-3x"></i>
              </div>
              <h3 className="mt-3 mb-0 font-weight-bold">{stats.total_user}</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
