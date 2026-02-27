import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Profil() {
  const { user, refreshUser } = useAuth();
  const [nama, setNama] = useState(user?.nama_lengkap || '');
  const [email, setEmail] = useState(user?.email || '');
  const [foto, setFoto] = useState<File | null>(null);
  const [successProfile, setSuccessProfile] = useState('');
  const [errorsProfile, setErrorsProfile] = useState<string[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
  const [successPassword, setSuccessPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);

  const fotoUrl = user?.foto_profil
    ? (user.foto_profil.startsWith('http') ? user.foto_profil : `/uploads/profil/${user.foto_profil}`)
    : '/images/logo.jpg';

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessProfile('');
    setErrorsProfile([]);
    setLoadingProfile(true);
    try {
      const fd = new FormData();
      fd.append('nama_lengkap', nama);
      fd.append('email', email);
      if (foto) fd.append('foto_profil', foto);
      const res = await api.post('/profil/update', fd);
      if (res.data.token) localStorage.setItem('token', res.data.token);
      setSuccessProfile(res.data.message || 'Profil berhasil diperbarui!');
      await refreshUser();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setErrorsProfile(Array.isArray(msg) ? msg : [msg || 'Gagal memperbarui profil']);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessPassword('');
    setErrorPassword('');
    if (passwordBaru !== konfirmasiPassword) {
      setErrorPassword('Password baru dan konfirmasi tidak cocok');
      return;
    }
    setLoadingPassword(true);
    try {
      const res = await api.post('/profil/update-password', {
        password_lama: passwordLama,
        password_baru: passwordBaru,
        konfirmasi_password: konfirmasiPassword
      });
      setSuccessPassword(res.data.message || 'Password berhasil diubah!');
      setPasswordLama('');
      setPasswordBaru('');
      setKonfirmasiPassword('');
    } catch (err: any) {
      setErrorPassword(err.response?.data?.message || 'Gagal mengubah password');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4">Profil Saya</h3>

      {successProfile && <div className="alert alert-success">{successProfile}</div>}
      {successPassword && <div className="alert alert-success">{successPassword}</div>}
      {errorPassword && <div className="alert alert-danger">{errorPassword}</div>}
      {errorsProfile.length > 0 && (
        <div className="alert alert-danger">
          <ul className="mb-0">{errorsProfile.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}

      <div className="row">
        {/* Left: Photo card */}
        <div className="col-lg-4">
          <div className="card bg-dark text-white text-center">
            <div className="card-body">
              <img className="img-fluid rounded-circle mb-3" src={fotoUrl} alt={user?.nama_lengkap}
                style={{ width: 150, height: 150, objectFit: 'cover' }} />
              <h5 className="card-title">{user?.nama_lengkap}</h5>
              <p className="card-text text-muted">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Right: Edit forms */}
        <div className="col-lg-8">
          <div className="card bg-dark text-white mb-4">
            <div className="card-header">Edit Informasi Profil</div>
            <div className="card-body">
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input type="text" className="form-control" value={nama} onChange={e => setNama(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Ganti Foto Profil (Opsional)</label>
                  <input type="file" className="form-control-file" accept="image/*"
                    onChange={e => setFoto(e.target.files?.[0] || null)} />
                  <small className="form-text text-muted">Format: JPG, PNG. Maks: 2MB.</small>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loadingProfile}>
                  {loadingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </form>
            </div>
          </div>

          <div className="card bg-dark text-white">
            <div className="card-header">Ubah Password</div>
            <div className="card-body">
              <form onSubmit={handleUpdatePassword}>
                <div className="form-group">
                  <label>Password Lama</label>
                  <input type="password" className="form-control" value={passwordLama}
                    onChange={e => setPasswordLama(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Password Baru</label>
                  <input type="password" className="form-control" value={passwordBaru}
                    onChange={e => setPasswordBaru(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Konfirmasi Password Baru</label>
                  <input type="password" className="form-control" value={konfirmasiPassword}
                    onChange={e => setKonfirmasiPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-warning" disabled={loadingPassword}>
                  {loadingPassword ? 'Memproses...' : 'Ubah Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
