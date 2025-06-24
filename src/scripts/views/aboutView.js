import Navbar from './components/navbar';
import { isUserLoggedIn } from '../utils/auth';
import Footer from './components/footer';

const About = {
  async render() {
    if (!isUserLoggedIn()) {
      window.location.hash = '#/login';
      return '';
    }

    return `
    

        <section class="container">
          <h2>Tentang Aplikasi</h2>
          <p>
            Web Story adalah aplikasi berbasis web yang memungkinkan pengguna untuk membagikan cerita mereka dalam bentuk deskripsi, foto, dan lokasi peta. Aplikasi ini dikembangkan sebagai bagian dari proyek submission Dicoding Academy.
          </p>
          <p>Fitur utama:</p>
          <ul>
            <li>Login dan register</li>
            <li>Menampilkan daftar cerita dengan gambar dan lokasi</li>
            <li>Menambahkan cerita dengan kamera dan klik peta</li>
            <li>Aksesibilitas dan transisi halaman</li>
          </ul>
          <p><strong>Dibuat oleh Suparman – 2025</strong></p>
        </section>
     
     
    `;
  },

  async afterRender() {
    Navbar.afterRender();
  },
};

export default About;
