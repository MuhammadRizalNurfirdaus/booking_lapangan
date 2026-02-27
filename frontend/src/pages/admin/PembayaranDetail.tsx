import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';

interface PesananDetail {
  id: number;
  kode_pemesanan: string;
  nama_lengkap: string | null;
  email: string | null;
  tanggal_booking: string;
  jam_mulai: string;
  jam_selesai: string;
  total_harga: number;
  status_pembayaran: string;
  status_pemesanan: string;
  bukti_pembayaran: string | null;
}

export default function PembayaranDetail() {
  const { id } = useParams();
  const [pesanan, setPesanan] = useState<PesananDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusBayar, setStatusBayar] = useState('');
  const [statusPesan, setStatusPesan] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/admin/pembayaran/detail/${id}`).then(res => {
      const p = res.data.pesanan;
      setPesanan(p);
      setStatusBayar(p.status_pembayaran);
      setStatusPesan(p.status_pemesanan);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/pembayaran/update-status', {
        id_pesanan: pesanan!.id,
        status_pembayaran: statusBayar,
        status_pemesanan: statusPesan
      });
      setSuccess('Status berhasil diperbarui!');
      setPesanan(prev => prev ? { ...prev, status_pembayaran: statusBayar, status_pemesanan: statusPesan } : null);
    } catch { } finally {
      setSubmitting(false);
    }
  };

  const formatRp = (n: number) => `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;
  const formatTime = (t: string) => t.substring(0, 5);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-light"></div></div>;
  if (!pesanan) return <p className="text-danger">Data tidak ditemukan.</p>;

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb" style={{ backgroundColor: '#34495e' }}>
          <li className="breadcrumb-item"><Link to="/admin/dashboard" style={{ color: '#1abc9c' }}>Dashboard</Link></li>
          <li className="breadcrumb-item"><Link to="/admin/pembayaran" style={{ color: '#1abc9c' }}>Manajemen Pembayaran</Link></li>
          <li className="breadcrumb-item active" style={{ color: '#95a5a6' }}>Detail #{pesanan.id}</li>
        </ol>
      </nav>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="row">
        {/* Left: Detail & Bukti */}
        <div className="col-lg-7 mb-4">
          <div className="card mb-4" style={{ backgroundColor: '#2c3e50', border: '1px solid #455a64' }}>
            <div className="card-header"><h4>Detail Pemesanan Terkait</h4></div>
            <div className="card-body">
              <table className="table table-dark table-borderless">
                <tbody>
                  <tr><td style={{ width: '30%' }}>Pemesan</td><td>: {pesanan.nama_lengkap || 'Guest'} ({pesanan.email || 'N/A'})</td></tr>
                  <tr><td>Kode Pesanan</td><td>: <span className="badge badge-primary">{pesanan.kode_pemesanan}</span></td></tr>
                  <tr><td>Tgl. Booking</td><td>: {new Date(pesanan.tanggal_booking).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
                  <tr><td>Jadwal</td><td>: {formatTime(pesanan.jam_mulai)} - {formatTime(pesanan.jam_selesai)}</td></tr>
                  <tr className="bg-dark"><td className="h5">Total Tagihan</td><td className="h5 text-success">: {formatRp(pesanan.total_harga)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="card" style={{ backgroundColor: '#2c3e50', border: '1px solid #455a64' }}>
            <div className="card-header"><h4>Bukti Pembayaran</h4></div>
            <div className="card-body">
              {pesanan.bukti_pembayaran ? (
                <a href={`/uploads/bukti_pembayaran/${pesanan.bukti_pembayaran}`} target="_blank" rel="noreferrer">
                  <img src={`/uploads/bukti_pembayaran/${pesanan.bukti_pembayaran}`} alt="Bukti" className="img-fluid"
                    style={{ border: '3px solid #455a64', borderRadius: 5 }} />
                </a>
              ) : (
                <div className="alert alert-warning">Pengguna belum mengunggah bukti pembayaran.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Update Status */}
        <div className="col-lg-5 mb-4">
          <div className="card" style={{ backgroundColor: '#2c3e50', border: '1px solid #455a64' }}>
            <div className="card-header"><h4>Update Status</h4></div>
            <div className="card-body">
              <form onSubmit={handleUpdateStatus}>
                <div className="form-group">
                  <label>Status Pembayaran</label>
                  <select className="form-control bg-dark text-white" value={statusBayar} onChange={e => setStatusBayar(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status Pemesanan</label>
                  <select className="form-control bg-dark text-white" value={statusPesan} onChange={e => setStatusPesan(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                  {submitting ? 'Memperbarui...' : 'Update Status'}
                </button>
              </form>
            </div>
          </div>
          <div className="card mt-4" style={{ backgroundColor: '#2c3e50', border: '1px solid #455a64' }}>
            <div className="card-header"><h4>Aksi Lainnya</h4></div>
            <div className="card-body">
              <Link to={`/admin/pembayaran/cetak/${pesanan.id}`} className="btn btn-info btn-block" target="_blank">
                Cetak Bukti Pembayaran
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
