import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';

interface GaleriItem {
  id: number;
  judul: string;
  nama_file: string;
  deskripsi: string;
  created_at: string;
}

export default function GaleriDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<GaleriItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/home/galeri/${id}`).then(res => {
      setItem(res.data.item);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-light"></div></div>;
  if (!item) return <div className="container my-5"><p className="text-muted">Data tidak ditemukan.</p></div>;

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <Link to="/galeri" className="btn btn-outline-light mb-4"><i className="fas fa-arrow-left"></i> Kembali ke Galeri</Link>
          <div className="card bg-dark text-white">
            <div className="card-body p-lg-5">
              <h1 className="font-weight-bold mb-3">{item.judul}</h1>
              <p className="text-muted">Diupload pada: {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <hr style={{ borderColor: '#455a64' }} />
              <div className="my-4 text-center">
                <img src={`/uploads/galeri/${item.nama_file}`} className="img-fluid rounded shadow" alt={item.judul} />
              </div>
              <div className="mt-4">
                <p style={{ whiteSpace: 'pre-wrap', fontSize: '1.1rem', lineHeight: 1.8 }}>{item.deskripsi}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
