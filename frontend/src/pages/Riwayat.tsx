import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

interface Pemesanan {
  id: number;
  kode_pemesanan: string;
  tanggal_booking: string;
  total_harga: number;
  status_pembayaran: string;
  status_pemesanan: string;
}

export default function Riwayat() {
  const [pemesanan, setPemesanan] = useState<Pemesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(5);
  const [komentar, setKomentar] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/user/riwayat').then(res => {
      setPemesanan(res.data.pemesanan || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleDeleteRiwayat = async (id: number) => {
    if (!confirm('Yakin ingin menghapus riwayat ini?')) return;
    try {
      await api.delete(`/user/riwayat/${id}`);
      setPemesanan(prev => prev.filter(p => p.id !== id));
      setSuccess('Riwayat berhasil dihapus');
    } catch { }
  };

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/user/feedback', { rating, komentar });
      setSuccess('Feedback berhasil dikirim!');
      setShowFeedback(false);
      setKomentar('');
    } catch { } finally {
      setSubmitting(false);
    }
  };

  const formatRp = (n: number) => `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-light"></div></div>;

  return (
    <div className="container my-5">
      <h3>Riwayat Pemesanan Anda</h3>
      {success && <div className="alert alert-success">{success}</div>}
      <table className="table table-dark table-hover">
        <thead>
          <tr>
            <th>Kode</th>
            <th>Tgl. Booking</th>
            <th>Total</th>
            <th>Status Bayar</th>
            <th>Status Pesanan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pemesanan.length === 0 ? (
            <tr><td colSpan={6} className="text-center">Belum ada riwayat pemesanan.</td></tr>
          ) : pemesanan.map(p => (
            <tr key={p.id}>
              <td>{p.kode_pemesanan}</td>
              <td>{p.tanggal_booking}</td>
              <td>{formatRp(p.total_harga)}</td>
              <td>
                <span className={`badge badge-${p.status_pembayaran === 'paid' ? 'success' : 'warning'}`}>
                  {p.status_pembayaran}
                </span>
              </td>
              <td>
                <span className={`badge badge-${p.status_pemesanan === 'confirmed' ? 'success' : p.status_pemesanan === 'completed' ? 'primary' : p.status_pemesanan === 'cancelled' ? 'danger' : 'info'}`}>
                  {p.status_pemesanan}
                </span>
              </td>
              <td>
                <Link to={`/booking/konfirmasi/${p.kode_pemesanan}`} className="btn btn-sm btn-info mr-1">Detail</Link>
                {p.status_pemesanan === 'completed' && (
                  <button className="btn btn-sm btn-warning mr-1" onClick={() => setShowFeedback(true)}>Beri Feedback</button>
                )}
                {p.status_pemesanan === 'cancelled' && (
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteRiwayat(p.id)}>Hapus</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowFeedback(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-content bg-dark">
              <div className="modal-header">
                <h5>Beri Feedback</h5>
                <button type="button" className="close text-white" onClick={() => setShowFeedback(false)}>&times;</button>
              </div>
              <form onSubmit={handleFeedback}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Rating (1-5)</label>
                    <input type="number" className="form-control" min={1} max={5}
                      value={rating} onChange={e => setRating(Number(e.target.value))} required />
                  </div>
                  <div className="form-group">
                    <label>Komentar</label>
                    <textarea className="form-control" value={komentar}
                      onChange={e => setKomentar(e.target.value)} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Mengirim...' : 'Kirim'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
