import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

interface PemesananItem {
  id: number;
  kode_pemesanan: string;
  nama_lengkap: string | null;
  tanggal_booking: string;
  status_pembayaran: string;
  status_pemesanan: string;
}

export default function Pembayaran() {
  const [data, setData] = useState<PemesananItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchData = (kw = '') => {
    setLoading(true);
    api.get(`/admin/pembayaran${kw ? `?keyword=${kw}` : ''}`).then(res => {
      setData(res.data.pemesanan || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(keyword);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini secara permanen?')) return;
    try {
      await api.delete(`/admin/pembayaran/${id}`);
      setSuccess('Data berhasil dihapus');
      fetchData(keyword);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus');
    }
  };

  const getPaymentBadge = (status: string) => {
    const cls = status === 'paid' ? 'success' : status === 'failed' ? 'danger' : 'warning';
    return <span className={`badge badge-${cls} p-2`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  const getOrderBadge = (status: string) => {
    const map: Record<string, string> = { confirmed: 'success', completed: 'primary', cancelled: 'danger' };
    return <span className={`badge badge-${map[status] || 'warning'} p-2`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb" style={{ backgroundColor: '#34495e' }}>
          <li className="breadcrumb-item"><Link to="/admin/dashboard" style={{ color: '#1abc9c' }}>Dashboard</Link></li>
          <li className="breadcrumb-item active" style={{ color: '#95a5a6' }}>Manajemen Pembayaran</li>
        </ol>
      </nav>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card" style={{ backgroundColor: '#2c3e50', border: '1px solid #455a64' }}>
        <div className="card-header"><h4>Daftar Transaksi Pembayaran</h4></div>
        <div className="card-body">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Cari Kode Pesanan atau Nama Pemesan..."
                value={keyword} onChange={e => setKeyword(e.target.value)} />
              <div className="input-group-append">
                <button className="btn btn-primary"><i className="fas fa-search"></i> Cari</button>
              </div>
            </div>
          </form>

          {loading ? (
            <div className="text-center"><div className="spinner-border text-light"></div></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Kode Pesanan</th>
                    <th>Nama Pemesan</th>
                    <th>Tgl. Booking</th>
                    <th>Status Bayar</th>
                    <th>Status Pesanan</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr><td colSpan={7} className="text-center">Tidak ada data pemesanan.</td></tr>
                  ) : data.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.kode_pemesanan}</td>
                      <td>{item.nama_lengkap || 'Guest'}</td>
                      <td>{new Date(item.tanggal_booking).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td>{getPaymentBadge(item.status_pembayaran)}</td>
                      <td>{getOrderBadge(item.status_pemesanan)}</td>
                      <td className="text-center">
                        <div className="btn-group">
                          <Link to={`/admin/pembayaran/detail/${item.id}`} className="btn btn-info btn-sm">Detail</Link>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
