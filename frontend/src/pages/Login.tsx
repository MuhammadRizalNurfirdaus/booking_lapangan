import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-md-5">
          <div className="card auth-card p-4">
            <div className="text-center mb-4">
              <Link to="/"><img src="/images/logo.jpg" alt="Logo" style={{ height: 80 }} /></Link>
              <h3 className="mt-3">Selamat Datang!</h3>
              <p className="text-muted">Masuk untuk memulai sesi Anda.</p>
            </div>
            <div className="card-body p-0">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Alamat Email</label>
                  <input type="email" id="email" className="form-control" placeholder="contoh@email.com"
                    value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" className="form-control" placeholder="Masukkan password Anda"
                    value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-success btn-block btn-lg mt-4" disabled={loading}>
                  {loading ? 'Memproses...' : 'Masuk'}
                </button>
              </form>
              <hr style={{ borderColor: '#455a64' }} />
              <button onClick={handleGoogleLogin} className="btn btn-danger btn-block">
                <i className="fab fa-google mr-2"></i>Masuk dengan Google
              </button>
            </div>
            <div className="text-center mt-4">
              <small className="text-muted">Baru di sini? <Link to="/register" className="text-success">Buat Akun</Link></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
