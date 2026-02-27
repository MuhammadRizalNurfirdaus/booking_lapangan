import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

interface Jadwal {
  id: number;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  harga: number;
}

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tanggal, setTanggal] = useState('');
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);
  const [selectedJadwal, setSelectedJadwal] = useState<Jadwal | null>(null);
  const [nomor_hp, setNomorHp] = useState('');
  const [loadingJadwal, setLoadingJadwal] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!tanggal) return;
    setLoadingJadwal(true);
    setSelectedJadwal(null);
    api.get(`/booking/get-jadwal?tanggal=${tanggal}`)
      .then(res => {
        if (res.data.status === 'success') setJadwalList(res.data.jadwal);
        else setJadwalList([]);
      })
      .catch(() => setJadwalList([]))
      .finally(() => setLoadingJadwal(false));
  }, [tanggal]);

  const formatRp = (n: number) => new Intl.NumberFormat('id-ID').format(n);
  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    if (!selectedJadwal) {
      setErrors(['Pilih slot waktu terlebih dahulu']);
      return;
    }
    setSubmitting(true);
    try {
      const payload: any = {
        id_jadwal: selectedJadwal.id,
        tanggal_booking: tanggal
      };
      if (user?.role !== 'admin') {
        payload.nama_pemesan = user?.nama_lengkap;
        payload.email_pemesan = user?.email;
        payload.nomor_hp_pemesan = nomor_hp;
      }
      const res = await api.post('/booking/store', payload);
      navigate(`/booking/konfirmasi/${res.data.kode_pemesanan}`);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setErrors(Array.isArray(msg) ? msg : [msg || 'Gagal membuat pesanan']);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Left column - Form */}
          <div className="col-lg-7 mb-4">
            <div className="card bg-dark text-white shadow">
              <div className="card-header"><h4>1. Isi Detail Pemesanan</h4></div>
              <div className="card-body">
                {errors.length > 0 && (
                  <div className="alert alert-danger">
                    <strong>Gagal!</strong>
                    <ul className="mb-0">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
                  </div>
                )}

                {user?.role !== 'admin' ? (
                  <>
                    <h5>Informasi Kontak</h5>
                    <div className="form-group">
                      <label>Nama Lengkap</label>
                      <input type="text" className="form-control" value={user?.nama_lengkap || ''} readOnly />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" className="form-control" value={user?.email || ''} readOnly />
                    </div>
                    <div className="form-group">
                      <label>Nomor HP Aktif</label>
                      <input type="tel" className="form-control" placeholder="Contoh: 08123456789"
                        value={nomor_hp} onChange={e => setNomorHp(e.target.value)} required />
                    </div>
                    <hr style={{ borderColor: '#455a64' }} />
                  </>
                ) : (
                  <div className="alert alert-info">
                    Anda login sebagai Admin. Data pemesan akan diisi secara otomatis sebagai "Pesanan Offline".
                  </div>
                )}

                <h5 className="mt-4">Pilih Jadwal</h5>
                <div className="form-group">
                  <label>Pilih Tanggal Booking</label>
                  <input type="date" className="form-control" value={tanggal} min={today}
                    onChange={e => setTanggal(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Pilih Slot Waktu Tersedia</label>
                  <div className="border p-3 rounded" style={{ backgroundColor: '#34495e' }}>
                    {!tanggal ? (
                      <p className="text-muted mb-0">Silakan pilih tanggal terlebih dahulu.</p>
                    ) : loadingJadwal ? (
                      <div className="text-center"><div className="spinner-border text-light" /></div>
                    ) : jadwalList.length === 0 ? (
                      <p className="text-warning mb-0">Maaf, tidak ada slot yang tersedia pada tanggal ini.</p>
                    ) : jadwalList.map(slot => (
                      <div key={slot.id} className="form-check bg-light text-dark p-2 rounded mb-2">
                        <input className="form-check-input" type="radio" name="pilihan_jadwal"
                          id={`jadwal_${slot.id}`} checked={selectedJadwal?.id === slot.id}
                          onChange={() => setSelectedJadwal(slot)} />
                        <label className="form-check-label d-flex justify-content-between" htmlFor={`jadwal_${slot.id}`} style={{ width: '100%', cursor: 'pointer' }}>
                          <span><strong>{slot.jam_mulai.substring(0, 5)} - {slot.jam_selesai.substring(0, 5)}</strong> ({slot.hari})</span>
                          <span className="font-weight-bold">Rp {formatRp(slot.harga)}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Summary */}
          <div className="col-lg-5">
            <div className="card bg-dark text-white sticky-top" style={{ top: 100 }}>
              <div className="card-header"><h4>2. Ringkasan Pesanan</h4></div>
              <div className="card-body">
                <table className="table table-dark">
                  <tbody>
                    <tr>
                      <td>Tanggal</td>
                      <td className="text-right font-weight-bold">{tanggal ? formatDate(tanggal) : '-'}</td>
                    </tr>
                    <tr>
                      <td>Jadwal</td>
                      <td className="text-right font-weight-bold">
                        {selectedJadwal ? `${selectedJadwal.jam_mulai.substring(0, 5)} - ${selectedJadwal.jam_selesai.substring(0, 5)}` : '-'}
                      </td>
                    </tr>
                    <tr className="h4">
                      <td>Total</td>
                      <td className="text-right text-success font-weight-bold">
                        Rp {selectedJadwal ? formatRp(selectedJadwal.harga) : '0'}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button type="submit" className="btn btn-success btn-block btn-lg" disabled={submitting}>
                  {submitting ? 'Memproses...' : 'Lanjutkan Pemesanan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
