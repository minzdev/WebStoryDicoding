import './styles/main.css';
import './styles/navbar.css';
import './scripts/routes';
import Navbar from './scripts/views/components/navbar';
import Footer from './scripts/views/components/footer';

document.addEventListener('DOMContentLoaded', () => {
  const skipLink = document.getElementById('skip-link');
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');

  const getCleanHash = () => location.hash === '' ? '#/' : location.hash;
  const isAuthPage = () => ['#/', '#/login', '#/register'].includes(getCleanHash());

  const renderLayout = () => {
    if (!isAuthPage()) {
      header.innerHTML = Navbar.render();
      Navbar.afterRender();
      footer.innerHTML = Footer.render();
    } else {
      header.innerHTML = '';
      footer.innerHTML = '';
    }

    const mainContent = document.getElementById('main-content');
    if (mainContent && !mainContent.hasAttribute('tabindex')) {
      mainContent.setAttribute('tabindex', '-1');
    }
  };

  // Render awal saat load
  renderLayout();

  // Render ulang saat navigasi SPA
  document.addEventListener('spa-page-rendered', renderLayout);

  // Skip link handler
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      skipLink.blur();

      setTimeout(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus({ preventScroll: true });

          const headerHeight = header?.offsetHeight || 100;
          const topOffset = mainContent.getBoundingClientRect().top + window.scrollY - headerHeight;

          window.scrollTo({
            top: topOffset,
            behavior: 'smooth',
          });
        }
      }, 300);
    });
  }
});

// 🔽 Tambahan: Registrasi Service Worker untuk PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('✅ Service Worker terdaftar:', reg))
      .catch(err => console.error('❌ Gagal mendaftar SW:', err));
  });
}
