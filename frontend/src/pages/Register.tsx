import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [form, setForm] = useState({ nama_lengkap: '', email: '', password: '', pass_confirm: '' });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    if (form.password !== form.pass_confirm) {
      setErrors(['Password dan konfirmasi password tidak cocok']);
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', {
        nama_lengkap: form.nama_lengkap,
        email: form.email,
        password: form.password
      });
      navigate('/login');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setErrors(Array.isArray(msg) ? msg : [msg || 'Registrasi gagal']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-md-6">
          <div className="card auth-card p-4">
            <div className="text-center mb-4">
              <Link to="/"><img src="/images/logo.jpg" alt="Logo" style={{ height: 80 }} /></Link>
              <h3 className="mt-3">Buat Akun Baru</h3>
              <p className="text-muted">Lengkapi form di bawah ini untuk bergabung.</p>
            </div>
            <div className="card-body p-0">
              {errors.length > 0 && (
                <div className="alert alert-danger">
                  <ul className="mb-0">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input type="text" name="nama_lengkap" className="form-control" placeholder="Masukkan nama lengkap Anda"
                    value={form.nama_lengkap} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Alamat Email</label>
                  <input type="email" name="email" className="form-control" placeholder="contoh@email.com"
                    value={form.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" name="password" className="form-control" placeholder="Minimal 8 karakter"
                    value={form.password} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Konfirmasi Password</label>
                  <input type="password" name="pass_confirm" className="form-control" placeholder="Ketik ulang password"
                    value={form.pass_confirm} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-success btn-block btn-lg mt-4" disabled={loading}>
                  {loading ? 'Memproses...' : 'Buat Akun'}
                </button>
              </form>
            </div>
            <div className="text-center mt-4">
              <small className="text-muted">Sudah punya akun? <Link to="/login" className="text-success">Masuk di sini</Link></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
