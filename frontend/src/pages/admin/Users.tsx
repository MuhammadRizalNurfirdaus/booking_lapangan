import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

interface UserItem {
  id: number;
  nama_lengkap: string;
  email: string;
  role: string;
  created_at: string;
}

export default function Users() {
  const [data, setData] = useState<UserItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<UserItem | null>(null);
  const [form, setForm] = useState({ nama_lengkap: '', email: '', password: '', role: 'user' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = (kw = '') => {
    setLoading(true);
    api.get(`/admin/users${kw ? `?keyword=${kw}` : ''}`).then(res => {
      setData(res.data.users || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchData(keyword); };

  const openAdd = () => {
    setEditItem(null);
    setForm({ nama_lengkap: '', email: '', password: '', role: 'user' });
    setShowModal(true);
  };

  const openEdit = (item: UserItem) => {
    setEditItem(item);
    setForm({ nama_lengkap: item.nama_lengkap, email: item.email, password: '', role: item.role });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload: any = { ...form };
      if (editItem) payload.id = editItem.id;
      if (!payload.password) delete payload.password;
      await api.post('/admin/users/simpan', payload);
      setSuccess(editItem ? 'Pengguna berhasil diperbarui!' : 'Pengguna berhasil ditambah!');
      setShowModal(false);
      fetchData(keyword);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus pengguna ini?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setSuccess('Pengguna berhasil dihapus');
      fetchData(keyword);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus');
    }
  };

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb" style={{ backgroundColor: '#34495e' }}>
          <li className="breadcrumb-item"><Link to="/admin/dashboard" style={{ color: '#1abc9c' }}>Dashboard</Link></li>
          <li className="breadcrumb-item active" style={{ color: '#95a5a6' }}>Manajemen Pengguna</li>
        </ol>
      </nav>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card" style={{ backgroundColor: '#2c3e50', border: '1px solid #455a64' }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4>Daftar Pengguna Terdaftar</h4>
          <button className="btn btn-success" onClick={openAdd}><i className="fas fa-plus"></i> Tambah Pengguna</button>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Cari nama atau email pengguna..."
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
                  <tr><th>ID</th><th>Nama Lengkap</th><th>Email</th><th>Role</th><th>Terdaftar</th><th className="text-center">Aksi</th></tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr><td colSpan={6} className="text-center">Tidak ada pengguna.</td></tr>
                  ) : data.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.nama_lengkap}</td>
                      <td>{user.email}</td>
                      <td><span className={`badge badge-${user.role === 'admin' ? 'success' : 'secondary'} p-2`}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span></td>
                      <td>{new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="text-center">
                        <div className="btn-group">
                          <button className="btn btn-warning btn-sm" onClick={() => openEdit(user)}><i className="fas fa-edit"></i> Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}><i className="fas fa-trash"></i> Hapus</button>
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
                <h5 className="modal-title">{editItem ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>&times;</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Nama Lengkap</label>
                    <input type="text" className="form-control" value={form.nama_lengkap}
                      onChange={e => setForm({ ...form, nama_lengkap: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      required={!editItem} />
                    {editItem && <small className="form-text text-muted">Kosongkan jika tidak ingin mengubah password.</small>}
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select className="form-control" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Menyimpan...' : 'Simpan'}
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
