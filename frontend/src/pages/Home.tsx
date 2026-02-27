import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="hero-section">
      <div className="container text-white">
        <h1 className="display-3 font-weight-bold">Rasakan Sensasi Bermain Terbaik</h1>
        <p className="lead my-4">Booking lapangan sepak bola dengan fasilitas standar internasional, mudah dan cepat.</p>
        <div>
          <Link to={user ? '/booking' : '/login'} className="btn btn-success btn-lg mx-2">Booking Sekarang</Link>
          <Link to={user ? '/galeri' : '/login'} className="btn btn-outline-light btn-lg mx-2">Lihat Galeri</Link>
        </div>
      </div>
    </div>
  );
}
