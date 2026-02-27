import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Kontak() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    nama_pengirim: user?.nama_lengkap || '',
    email: user?.email || '',
    pesan: ''
  });
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setErrors([]);
    setLoading(true);
    try {
      const res = await api.post('/home/kontak/kirim', form);
      setSuccess(res.data.message || 'Pesan berhasil dikirim!');
      setForm({ ...form, pesan: '' });
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setErrors(Array.isArray(msg) ? msg : [msg || 'Gagal mengirim pesan']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card bg-dark p-4 shadow">
            <div className="card-body">
              <h2 className="text-center">Hubungi Kami</h2>
              <p className="text-center text-muted mb-4">Ada pertanyaan atau saran? Kirimkan kepada kami.</p>

              {success && <div className="alert alert-success">{success}</div>}
              {errors.length > 0 && (
                <div className="alert alert-danger">
                  <ul className="mb-0">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nama Anda</label>
                  <input type="text" className="form-control" value={form.nama_pengirim}
                    onChange={e => setForm({ ...form, nama_pengirim: e.target.value })}
                    readOnly={!!user} required />
                </div>
                <div className="form-group">
                  <label>Email Anda</label>
                  <input type="email" className="form-control" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    readOnly={!!user} required />
                </div>
                <div className="form-group">
                  <label>Pesan</label>
                  <textarea className="form-control" rows={5} value={form.pesan}
                    onChange={e => setForm({ ...form, pesan: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
