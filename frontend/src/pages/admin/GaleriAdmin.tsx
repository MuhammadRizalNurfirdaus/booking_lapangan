import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

interface GaleriItem {
  id: number;
  judul: string;
  nama_file: string;
  deskripsi: string;
  created_at: string;
}

export default function GaleriAdmin() {
  const [data, setData] = useState<GaleriItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailItem, setDetailItem] = useState<GaleriItem | null>(null);
  const [editItem, setEditItem] = useState<GaleriItem | null>(null);
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [gambar, setGambar] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = (kw = '') => {
    setLoading(true);
    api.get(`/admin/galeri${kw ? `?keyword=${kw}` : ''}`).then(res => {
      setData(res.data.galeri || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchData(keyword); };

  const openAdd = () => {
    setEditItem(null);
    setJudul('');
    setDeskripsi('');
    setGambar(null);
    setShowModal(true);
  };

  const openEdit = (item: GaleriItem) => {
    setEditItem(item);
    setJudul(item.judul);
    setDeskripsi(item.deskripsi);
    setGambar(null);
    setShowModal(true);
  };

  const openDetail = (item: GaleriItem) => {
    setDetailItem(item);
    setShowDetailModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors([]);
    try {
      const fd = new FormData();
      if (editItem) fd.append('id', String(editItem.id));
      fd.append('judul', judul);
      fd.append('deskripsi', deskripsi);
      if (gambar) fd.append('gambar', gambar);
      await api.post('/admin/galeri/simpan', fd);
      setSuccess(editItem ? 'Galeri berhasil diperbarui!' : 'Foto berhasil ditambah!');
      setShowModal(false);
      fetchData(keyword);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setErrors(Array.isArray(msg) ? msg : [msg || 'Gagal menyimpan']);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin?')) return;
    await api.delete(`/admin/galeri/${id}`);
    setSuccess('Foto berhasil dihapus');
    fetchData(keyword);
  };

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb" style={{ backgroundColor: '#34495e' }}>
          <li className="breadcrumb-item"><Link to="/admin/dashboard" style={{ color: '#1abc9c' }}>Dashboard</Link></li>
          <li className="breadcrumb-item active" style={{ color: '#95a5a6' }}>Manajemen Galeri</li>
        </ol>
      </nav>

      {success && <div className="alert alert-success">{success}</div>}
      {errors.length > 0 && (
        <div className="alert alert-danger">
          <ul className="mb-0">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}

      <div className="card" style={{ backgroundColor: '#2c3e50', border: '1px solid #455a64' }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4>Daftar Foto Galeri</h4>
          <button className="btn btn-success" onClick={openAdd}><i className="fas fa-plus"></i> Tambah Foto Baru</button>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Cari berdasarkan judul atau deskripsi..."
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
                  <tr><th>No.</th><th>Gambar</th><th>Judul</th><th>Deskripsi (Singkat)</th><th>Dibuat</th><th className="text-center">Aksi</th></tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr><td colSpan={6} className="text-center">Tidak ada data.</td></tr>
                  ) : data.map((item, idx) => (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td><img src={`/uploads/galeri/${item.nama_file}`} height={50} alt={item.judul} /></td>
                      <td>{item.judul}</td>
                      <td>{item.deskripsi.substring(0, 50)}...</td>
                      <td>{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="text-center">
                        <div className="btn-group">
                          <button className="btn btn-info btn-sm" onClick={() => openDetail(item)}><i className="fas fa-eye"></i> Detail</button>
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editItem ? 'Edit Foto Galeri' : 'Tambah Foto Baru'}</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>&times;</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Judul/Keterangan</label>
                    <input type="text" className="form-control" value={judul} onChange={e => setJudul(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Deskripsi</label>
                    <textarea className="form-control" rows={5} placeholder="Jelaskan detail tentang foto ini..."
                      value={deskripsi} onChange={e => setDeskripsi(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Gambar</label>
                    <input type="file" className="form-control-file" accept="image/*"
                      onChange={e => setGambar(e.target.files?.[0] || null)} required={!editItem} />
                    <small className="form-text text-muted">{editItem ? 'Kosongkan jika tidak ingin mengubah gambar.' : 'Gambar wajib diisi.'}</small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && detailItem && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowDetailModal(false)}>
          <div className="modal-dialog modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{detailItem.judul}</h5>
                <button type="button" className="close" onClick={() => setShowDetailModal(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-3">
                  <img src={`/uploads/galeri/${detailItem.nama_file}`} className="img-fluid" style={{ maxHeight: 400, borderRadius: 5 }} alt={detailItem.judul} />
                </div>
                <hr />
                <h4>Deskripsi:</h4>
                <p style={{ whiteSpace: 'pre-wrap' }}>{detailItem.deskripsi}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
