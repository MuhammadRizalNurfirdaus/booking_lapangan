import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

interface PesananCetak {
  kode_pemesanan: string;
  nama_lengkap: string | null;
  tanggal_booking: string;
  jam_mulai: string;
  jam_selesai: string;
  total_harga: number;
}

export default function PembayaranCetak() {
  const { id } = useParams();
  const [pesanan, setPesanan] = useState<PesananCetak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/pembayaran/cetak/${id}`).then(res => {
      setPesanan(res.data.pesanan);
    }).finally(() => setLoading(false));
  }, [id]);

  const formatRp = (n: number) => `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;
  const formatTime = (t: string) => t.substring(0, 5);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  if (!pesanan) return <p>Data tidak ditemukan.</p>;

  return (
    <div style={{ backgroundColor: 'white', color: 'black', minHeight: '100vh' }}>
      <style>{`@media print { .no-print { display: none; } }`}</style>
      <div className="container mt-4">
        <div className="text-center" style={{ borderBottom: '2px solid black', paddingBottom: 10, marginBottom: 20 }}>
          <img src="/images/logo.jpg" alt="Logo" style={{ maxHeight: 80 }} />
          <h2>Booking Lapangan</h2>
          <p>Jln. Lapangan Raya No. 123, Kota Futsal</p>
        </div>
        <h3 className="text-center mb-4">BUKTI PEMBAYARAN</h3>
        <table className="table table-bordered">
          <tbody>
            <tr><th style={{ width: '30%' }}>Kode Pemesanan</th><td>{pesanan.kode_pemesanan}</td></tr>
            <tr><th>Nama Pemesan</th><td>{pesanan.nama_lengkap || 'Guest'}</td></tr>
            <tr><th>Tanggal Booking</th><td>{new Date(pesanan.tanggal_booking).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
            <tr><th>Jadwal</th><td>{formatTime(pesanan.jam_mulai)} - {formatTime(pesanan.jam_selesai)}</td></tr>
            <tr><th>Total Bayar</th><td><strong>{formatRp(pesanan.total_harga)}</strong></td></tr>
            <tr><th>Status</th><td><strong>LUNAS</strong></td></tr>
          </tbody>
        </table>
        <p className="text-center mt-4">Terima kasih telah melakukan pemesanan.</p>
        <div className="text-center mt-5 no-print">
          <button onClick={() => window.print()} className="btn btn-primary mr-2">Cetak</button>
          <button onClick={() => window.close()} className="btn btn-secondary">Tutup</button>
        </div>
      </div>
    </div>
  );
}
