import Swal from 'sweetalert2';
import { clearToken } from '../../utils/auth';
import {
  askNotificationPermission,
  subscribeUserToPush,
  unsubscribeUserFromPush,
} from '../../utils/pushHelper';

let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.getElementById('installButton');
  if (installBtn && !window.matchMedia('(display-mode: standalone)').matches) {
    installBtn.style.display = 'inline-flex';
  }
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  const installBtn = document.getElementById('installButton');
  if (installBtn) installBtn.style.display = 'none';
});

const Navbar = {
  render() {
    return `
      <nav class="navbar" role="navigation" aria-label="Navigasi utama">
        <div class="brand">
          <a href="#/home" class="site-title">STORYN AJA</a>
          <button class="hamburger" id="hamburgerBtn" aria-label="Buka menu">&#9776;</button>
        </div>
        <ul class="nav-list" id="navList">
          <li><a href="#/home">Beranda</a></li>
          <li><a href="#/add-story">Tambah Cerita</a></li>
          <li><a href="#/my-story">My Story</a></li>
          <li><a href="#/about">Tentang</a></li>
          <li>
            <button id="notifButton" class="icon-button" aria-label="Kelola Notifikasi">
              <i class="fa-solid fa-bell"></i>
              <span id="notifStatus">Subscribe</span>
            </button>
          </li>
          <li>
            <button id="installButton" class="icon-button" style="display:none;">
              <i class="fa-solid fa-download"></i> Pasang Aplikasi
            </button>
          </li>
          <li><a href="#" id="logout">Logout</a></li>
        </ul>
      </nav>
    `;
  },

  async afterRender() {
    // Hamburger
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navList = document.getElementById('navList');
    if (hamburgerBtn && navList) {
      hamburgerBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
      });
    }

    // Logout
    const logoutLink = document.getElementById('logout');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        Swal.fire({
          title: 'Apakah kamu yakin?',
          text: 'Kamu akan keluar dari aplikasi.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, Logout!',
          cancelButtonText: 'Batal',
        }).then((result) => {
          if (result.isConfirmed) {
            clearToken();
            window.location.hash = '#/';
          }
        });
      });
    }

    // Notifikasi
    const notifButton = document.getElementById('notifButton');
    const notifStatus = document.getElementById('notifStatus');
    if (notifButton && notifStatus) {
      const registration = await navigator.serviceWorker.ready;
      const existing = await registration.pushManager.getSubscription();
      notifStatus.textContent = existing ? 'Unsubscribe' : 'Subscribe';

      notifButton.addEventListener('click', async () => {
        const permission = await askNotificationPermission();
        if (permission !== 'granted') {
          Swal.fire('Info', 'Notifikasi tidak diizinkan.', 'info');
          return;
        }

        if (notifStatus.textContent === 'Subscribe') {
          await subscribeUserToPush();
          Swal.fire('Berhasil!', 'Notifikasi diaktifkan.', 'success');
        } else {
          await unsubscribeUserFromPush();
          Swal.fire('Berhasil!', 'Notifikasi dinonaktifkan.', 'info');
        }

        const updated = await registration.pushManager.getSubscription();
        notifStatus.textContent = updated ? 'Unsubscribe' : 'Subscribe';
      });
    }

    // Pasang Aplikasi (PWA)
    const installButton = document.getElementById('installButton');
    if (installButton) {
      installButton.addEventListener('click', () => {
        if (!deferredPrompt) return;

        // ✅ Harus langsung dipanggil dari user gesture
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then((choice) => {
          if (choice.outcome === 'accepted') {
            Swal.fire('Terima kasih!', 'Aplikasi berhasil dipasang.', 'success');
          } else {
            Swal.fire('Batal', 'Pemasangan dibatalkan.', 'info');
          }

          installButton.style.display = 'none';
          deferredPrompt = null;
        });
      });

      // Sembunyikan jika mode standalone
      if (window.matchMedia('(display-mode: standalone)').matches) {
        installButton.style.display = 'none';
      }
    }
  },
};

export default Navbar;
