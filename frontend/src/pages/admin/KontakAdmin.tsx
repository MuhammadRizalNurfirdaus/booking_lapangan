import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

interface PesanItem {
  id: number;
  nama_pengirim: string;
  email: string;
  pesan: string;
  created_at: string;
}

export default function KontakAdmin() {
  const [data, setData] = useState<PesanItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = (kw = '') => {
    setLoading(true);
    api.get(`/admin/pesan-kontak${kw ? `?keyword=${kw}` : ''}`).then(res => {
      setData(res.data.pesan || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchData(keyword); };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin?')) return;
    await api.delete(`/admin/pesan-kontak/${id}`);
    fetchData(keyword);
  };

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb" style={{ backgroundColor: '#34495e' }}>
          <li className="breadcrumb-item"><Link to="/admin/dashboard" style={{ color: '#1abc9c' }}>Dashboard</Link></li>
          <li className="breadcrumb-item active" style={{ color: '#95a5a6' }}>Kelola Pesan Kontak</li>
        </ol>
      </nav>

      <div className="card" style={{ backgroundColor: '#2c3e50', border: '1px solid #455a64' }}>
        <div className="card-header"><h4>Pesan Kontak Masuk</h4></div>
        <div className="card-body">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Cari nama, email, atau isi pesan..."
                value={keyword} onChange={e => setKeyword(e.target.value)} />
              <div className="input-group-append"><button className="btn btn-primary">Cari</button></div>
            </div>
          </form>

          {loading ? (
            <div className="text-center"><div className="spinner-border text-light"></div></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-striped">
                <thead>
                  <tr><th>ID</th><th>Nama Pengirim</th><th>Email</th><th>Pesan</th><th>Tanggal</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr><td colSpan={6} className="text-center">Tidak ada pesan masuk.</td></tr>
                  ) : data.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.nama_pengirim}</td>
                      <td><a href={`mailto:${item.email}`}>{item.email}</a></td>
                      <td style={{ whiteSpace: 'pre-wrap' }}>{item.pesan}</td>
                      <td>{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Hapus</button></td>
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
