import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

interface FeedbackItem {
  id: number;
  id_user: number;
  nama_user: string | null;
  komentar: string;
  rating: number;
  created_at: string;
}

export default function Feedback() {
  const [data, setData] = useState<FeedbackItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = (kw = '') => {
    setLoading(true);
    api.get(`/admin/feedback${kw ? `?keyword=${kw}` : ''}`).then(res => {
      setData(res.data.feedbacks || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchData(keyword); };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin?')) return;
    await api.delete(`/admin/feedback/${id}`);
    fetchData(keyword);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <i key={i} className="fas fa-star text-warning"></i>
    ));
  };

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb" style={{ backgroundColor: '#34495e' }}>
          <li className="breadcrumb-item"><Link to="/admin/dashboard" style={{ color: '#1abc9c' }}>Dashboard</Link></li>
          <li className="breadcrumb-item active" style={{ color: '#95a5a6' }}>Kelola Feedback</li>
        </ol>
      </nav>

      <div className="card" style={{ backgroundColor: '#2c3e50', border: '1px solid #455a64' }}>
        <div className="card-header"><h4>Kelola Feedback Pengguna</h4></div>
        <div className="card-body">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Cari nama pengguna atau komentar..."
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
                  <tr><th>ID</th><th>Pengguna</th><th>Komentar</th><th className="text-center">Rating</th><th>Tanggal</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr><td colSpan={6} className="text-center">Tidak ada feedback.</td></tr>
                  ) : data.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.nama_user || 'Guest'} (ID: {item.id_user})</td>
                      <td style={{ whiteSpace: 'pre-wrap' }}>{item.komentar}</td>
                      <td className="text-center">{renderStars(item.rating)}</td>
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
