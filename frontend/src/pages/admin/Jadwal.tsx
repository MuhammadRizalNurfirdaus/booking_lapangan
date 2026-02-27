import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

interface JadwalItem {
  id: number;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  harga: number;
}

export default function Jadwal() {
  const [data, setData] = useState<JadwalItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<JadwalItem | null>(null);
  const [form, setForm] = useState({ hari: 'Weekday', jam_mulai: '', jam_selesai: '', harga: 100000 });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = (kw = '') => {
    setLoading(true);
    api.get(`/admin/jadwal${kw ? `?keyword=${kw}` : ''}`).then(res => {
      setData(res.data.jadwal || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchData(keyword); };

  const openAdd = () => {
    setEditItem(null);
    setForm({ hari: 'Weekday', jam_mulai: '', jam_selesai: '', harga: 100000 });
    setShowModal(true);
  };

  const openEdit = (item: JadwalItem) => {
    setEditItem(item);
    setForm({ hari: item.hari, jam_mulai: item.jam_mulai, jam_selesai: item.jam_selesai, harga: item.harga });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/jadwal/simpan', { ...form, id: editItem?.id || undefined });
      setSuccess(editItem ? 'Jadwal berhasil diperbarui!' : 'Jadwal berhasil ditambah!');
      setShowModal(false);
      fetchData(keyword);
    } catch { } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus slot ini?')) return;
    await api.delete(`/admin/jadwal/${id}`);
    setSuccess('Jadwal berhasil dihapus');
    fetchData(keyword);
  };

  const formatRp = (n: number) => `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;
  const formatTime = (t: string) => t.substring(0, 5);

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb" style={{ backgroundColor: '#34495e' }}>
          <li className="breadcrumb-item"><Link to="/admin/dashboard" style={{ color: '#1abc9c' }}>Dashboard</Link></li>
          <li className="breadcrumb-item active" style={{ color: '#95a5a6' }}>Manajemen Slot Waktu</li>
        </ol>
      </nav>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card" style={{ backgroundColor: '#2c3e50', border: '1px solid #455a64' }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4>Daftar Slot Waktu Tersedia</h4>
          <button className="btn btn-success" onClick={openAdd}><i className="fas fa-plus"></i> Tambah Slot Baru</button>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Cari hari, jam mulai, atau harga..."
                value={keyword} onChange={e => setKeyword(e.target.value)} />
              <div className="input-group-append"><button className="btn btn-primary"><i className="fas fa-search"></i> Cari</button></div>
            </div>
          </form>

          {loading ? (
            <div className="text-center"><div className="spinner-border text-light"></div></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-striped table-hover">
                <thead>
                  <tr><th>ID</th><th>Hari</th><th>Jam Mulai</th><th>Jam Selesai</th><th>Harga</th><th className="text-center">Aksi</th></tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr><td colSpan={6} className="text-center">Data tidak ditemukan.</td></tr>
                  ) : data.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td><span className="badge badge-info">{item.hari}</span></td>
                      <td>{formatTime(item.jam_mulai)}</td>
                      <td>{formatTime(item.jam_selesai)}</td>
                      <td>{formatRp(item.harga)}</td>
                      <td className="text-center">
                        <div className="btn-group">
                          <button className="btn btn-warning btn-sm" onClick={() => openEdit(item)}><i className="fas fa-edit"></i> Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}><i className="fas fa-trash"></i> Hapus</button>
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

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editItem ? 'Edit Slot Waktu' : 'Tambah Slot Waktu Baru'}</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>&times;</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Jenis Hari</label>
                    <select className="form-control" value={form.hari} onChange={e => setForm({ ...form, hari: e.target.value })} required>
                      <option value="Weekday">Weekday</option>
                      <option value="Weekend">Weekend</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Jam Mulai</label>
                    <input type="time" className="form-control" value={form.jam_mulai} onChange={e => setForm({ ...form, jam_mulai: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Jam Selesai</label>
                    <input type="time" className="form-control" value={form.jam_selesai} onChange={e => setForm({ ...form, jam_selesai: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Harga</label>
                    <input type="number" className="form-control" value={form.harga} onChange={e => setForm({ ...form, harga: Number(e.target.value) })} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Menyimpan...' : 'Simpan Jadwal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
