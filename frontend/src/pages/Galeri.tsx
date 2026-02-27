import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

interface Foto {
  id: number;
  judul: string;
  nama_file: string;
  deskripsi: string;
  created_at: string;
}

export default function Galeri() {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/home/galeri').then(res => {
      setFotos(res.data.fotos || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-light"></div></div>;

  return (
    <>
      <div className="container my-5">
        <h2 className="text-center mb-4 font-weight-bold">Galeri Foto Lapangan</h2>
        <hr style={{ borderColor: '#455a64' }} />
        <div className="row mt-5">
          {fotos.length === 0 ? (
            <p className="text-center col-12 text-muted">Belum ada foto di galeri.</p>
          ) : fotos.map(foto => (
            <div key={foto.id} className="col-md-4 mb-4">
              <Link to={`/galeri/detail/${foto.id}`} className="card bg-dark gallery-card" style={{ textDecoration: 'none', color: 'white' }}>
                <div className="gallery-img-container">
                  <img src={`/uploads/galeri/${foto.nama_file}`} alt={foto.judul} />
                </div>
                <div className="card-body">
                  <h5 className="card-title text-truncate">{foto.judul}</h5>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3960.984021275996!2d108.5011933!3d-6.9687585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwNTgnMDcuNSJTIDEwOMKwMzAnMDQuMyJF!5e0!3m2!1sen!2sid!4v1687654321098!5m2!1sen!2sid"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lokasi Lapangan"
        ></iframe>
      </div>
    </>
  );
}
