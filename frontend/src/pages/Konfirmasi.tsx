import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

interface Pesanan {
  id: number;
  kode_pemesanan: string;
  tanggal_booking: string;
  jam_mulai: string;
  jam_selesai: string;
  total_harga: number;
  status_pemesanan: string;
  status_pembayaran: string;
  bukti_pembayaran: string | null;
  created_at: string;
}

export default function Konfirmasi() {
  const { kode } = useParams();
  const [pesanan, setPesanan] = useState<Pesanan | null>(null);
  const [loading, setLoading] = useState(true);
  const [bankTujuan, setBankTujuan] = useState('');
  const [buktiFile, setBuktiFile] = useState<File | null>(null);
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchPesanan = () => {
    api.get(`/booking/konfirmasi/${kode}`).then(res => {
      setPesanan(res.data.pesanan);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPesanan(); }, [kode]);

  const formatRp = (n: number) => `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (t: string) => t.substring(0, 5);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buktiFile) return;
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const fd = new FormData();
      fd.append('kode_pemesanan', kode!);
      fd.append('bank_tujuan', bankTujuan);
      fd.append('bukti_pembayaran', buktiFile);
      fd.append('catatan_pembayaran', catatan);
      const res = await api.post('/booking/simpan-pembayaran', fd);
      setSuccess(res.data.message || 'Bukti pembayaran berhasil dikirim!');
      fetchPesanan();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengirim bukti pembayaran');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-light"></div></div>;
  if (!pesanan) return <div className="container my-5"><p className="text-danger">Pesanan tidak ditemukan.</p></div>;

  const getStatusBadge = (status: string, type: 'bayar' | 'pesan') => {
    let cls = 'warning';
    if (type === 'bayar') {
      if (status === 'paid') cls = 'success';
      if (status === 'failed') cls = 'danger';
    } else {
      if (status === 'confirmed') cls = 'success';
      if (status === 'completed') cls = 'primary';
      if (status === 'cancelled') cls = 'danger';
    }
    return <span className={`badge badge-${cls} p-2`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow" style={{ backgroundColor: '#2c3e50', border: '1px solid #455a64' }}>
            <div className="card-header" style={{ backgroundColor: '#34495e', borderBottom: '1px solid #455a64' }}>
              <h3 className="mb-0"><i className="fas fa-file-invoice-dollar"></i> Detail Pemesanan</h3>
            </div>
            <div className="card-body">
              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="row">
                {/* Left: Order details */}
                <div className="col-md-7 mb-4 mb-md-0">
                  <h4>Ringkasan Pesanan</h4>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between" style={{ backgroundColor: 'transparent', borderColor: '#455a64' }}>
                      <span>Tanggal Pemesanan:</span>
                      <strong>{new Date(pesanan.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between" style={{ backgroundColor: 'transparent', borderColor: '#455a64' }}>
                      <span>Tanggal Booking:</span>
                      <strong>{formatDate(pesanan.tanggal_booking)}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between" style={{ backgroundColor: 'transparent', borderColor: '#455a64' }}>
                      <span>Kode Pemesanan:</span>
                      <strong><span className="badge badge-primary p-2">{pesanan.kode_pemesanan}</span></strong>
                    </li>
                  </ul>
                  <hr style={{ borderColor: '#455a64' }} />
                  <h5 className="mt-3">Item Pesanan</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between" style={{ backgroundColor: 'transparent', borderColor: '#455a64' }}>
                      <div>
                        <strong>Booking Lapangan</strong><br />
                        <small>Jadwal: {formatTime(pesanan.jam_mulai)} - {formatTime(pesanan.jam_selesai)}</small>
                      </div>
                      <span>{formatRp(pesanan.total_harga)}</span>
                    </li>
                  </ul>
                  <hr style={{ borderColor: '#455a64' }} />
                  <div className="d-flex justify-content-between h4 mt-3">
                    <span>Total Pembayaran:</span>
                    <strong className="text-success">{formatRp(pesanan.total_harga)}</strong>
                  </div>
                </div>

                {/* Right: Status & Payment */}
                <div className="col-md-5">
                  <h4>Status &amp; Pembayaran</h4>
                  <div className="d-flex justify-content-between mb-3 align-items-center">
                    <span>Status Pesanan:</span>
                    {getStatusBadge(pesanan.status_pemesanan, 'pesan')}
                  </div>
                  <div className="d-flex justify-content-between mb-3 align-items-center">
                    <span>Status Pembayaran:</span>
                    {getStatusBadge(pesanan.status_pembayaran, 'bayar')}
                  </div>
                  <hr style={{ borderColor: '#455a64' }} />

                  {pesanan.status_pembayaran === 'pending' && (
                    <>
                      <div className="alert mt-3" style={{ backgroundColor: '#0c3b59', color: '#9ed8ff', borderColor: '#11527c' }}>
                        <h5 className="alert-heading">Instruksi Pembayaran</h5>
                        <p>Silakan transfer sejumlah <strong>{formatRp(pesanan.total_harga)}</strong> ke salah satu rekening berikut:</p>
                        <ul className="list-unstyled">
                          <li><strong>Bank BCA:</strong> 1234567890 (a.n. Booking Lapangan)</li>
                          <li><strong>Bank BNI:</strong> 0987654321 (a.n. Booking Lapangan)</li>
                        </ul>
                      </div>
                      <form onSubmit={handleUpload} className="mt-4">
                        <div className="form-group">
                          <label>Bank Tujuan Transfer <span className="text-danger">*</span></label>
                          <select className="form-control" value={bankTujuan} onChange={e => setBankTujuan(e.target.value)} required>
                            <option value="">-- Pilih Bank --</option>
                            <option value="BCA">Bank BCA</option>
                            <option value="BNI">Bank BNI</option>
                            <option value="Lainnya">Bank Lainnya</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Unggah Bukti Transfer <span className="text-danger">*</span></label>
                          <input type="file" className="form-control-file" accept="image/*"
                            onChange={e => setBuktiFile(e.target.files?.[0] || null)} required />
                          <small className="form-text text-muted">Format: JPG, PNG. Maks: 2MB.</small>
                        </div>
                        <div className="form-group">
                          <label>Catatan Tambahan (Opsional)</label>
                          <textarea className="form-control" rows={2} placeholder="Contoh: transfer dari rekening a.n. Budi S."
                            value={catatan} onChange={e => setCatatan(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-success btn-block mt-4" disabled={submitting}>
                          {submitting ? 'Mengirim...' : 'KIRIM KONFIRMASI PEMBAYARAN'}
                        </button>
                      </form>
                    </>
                  )}

                  {pesanan.status_pembayaran === 'paid' && pesanan.status_pemesanan === 'pending' && (
                    <div className="alert mt-4" style={{ backgroundColor: '#0c3b59', color: '#9ed8ff', borderColor: '#11527c' }}>
                      <h4 className="alert-heading">Pembayaran Diterima!</h4>
                      <p className="mb-0">Terima kasih, pembayaran Anda telah kami terima. Mohon tunggu pesanan Anda dikonfirmasi oleh admin.</p>
                    </div>
                  )}

                  {pesanan.status_pemesanan === 'confirmed' && (
                    <div className="alert mt-4" style={{ backgroundColor: '#1e4620', color: '#a3e0a5', borderColor: '#2a642d' }}>
                      <h4 className="alert-heading">Pesanan Dikonfirmasi!</h4>
                      <p className="mb-0">Pemesanan Anda sudah siap. Silakan cetak struk sebagai bukti saat datang ke lokasi.</p>
                    </div>
                  )}

                  {pesanan.status_pemesanan === 'completed' && (
                    <div className="alert alert-primary mt-4">
                      <h4 className="alert-heading">Pesanan Selesai</h4>
                      <p className="mb-0">Terima kasih telah bermain di tempat kami.</p>
                    </div>
                  )}

                  {(pesanan.status_pemesanan === 'cancelled' || pesanan.status_pembayaran === 'failed') && (
                    <div className="alert mt-4" style={{ backgroundColor: '#5c2121', color: '#f8d7da', borderColor: '#843534' }}>
                      <h4 className="alert-heading">Pesanan Dibatalkan</h4>
                      <p className="mb-0">Pesanan ini telah dibatalkan. Silakan hubungi kami jika terjadi kesalahan.</p>
                    </div>
                  )}
                </div>
              </div>

              <hr style={{ borderColor: '#455a64' }} />
              <div className="d-flex justify-content-end align-items-center mt-3">
                {pesanan.status_pembayaran === 'paid' && ['confirmed', 'completed'].includes(pesanan.status_pemesanan) && (
                  <Link to={`/struk/cetak/${pesanan.kode_pemesanan}`} className="btn btn-success mr-2" target="_blank">
                    <i className="fas fa-print"></i> Cetak Struk
                  </Link>
                )}
                <Link to="/riwayat" className="btn btn-primary">Lihat Riwayat Pemesanan</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
