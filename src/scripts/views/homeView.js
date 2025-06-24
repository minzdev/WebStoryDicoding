import { isUserLoggedIn } from '../utils/auth';
import Navbar from './components/navbar';
import L from 'leaflet';
import Footer from './components/footer';
import HomePresenter from '../presenters/homePresenter';
import { openMapModal, initMapModalEvents } from '../utils/mapHelper.js';
import { getAllOfflineStories } from '../utils/story-idb';

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const Home = {
  async render() {
    if (!isUserLoggedIn()) {
      window.location.hash = '#/login';
      return '';
    }

    return `
      
      <section class="home-page">
        <h2 id="home-title" class="add-story-title" tabindex="-1">Daftar Cerita</h2>

        <section 
          id="stories" 
          class="story-grid" 
          aria-labelledby="home-title" 
          role="region">
        </section>

        <br>
        <h2 id="add-story-heading" class="add-story-title" tabindex="-1">Peta Cerita</h2>
        <div 
          id="map" 
          class="home-map" 
          role="application" 
          aria-label="Peta lokasi cerita"
          aria-labelledby="add-story-heading">
        </div>
      </section>
        
    `;
  },

  async afterRender() {
    Navbar.afterRender();

    let stories;
    try {
      stories = await HomePresenter.getStories();
    } catch (err) {
      console.warn('Gagal mengambil data dari API, coba ambil dari IndexedDB:', err);
      stories = await getAllOfflineStories();
    }

    const storiesContainer = document.getElementById('stories');

    if (!storiesContainer) return;

    if (!stories || stories.length === 0) {
      storiesContainer.innerHTML = '<p>Tidak ada cerita untuk ditampilkan.</p>';
    } else {
      storiesContainer.innerHTML = stories.map((story) => `
        <article class="story-card" tabindex="0" aria-label="Cerita oleh ${story.name}">
          <img src="${story.photoUrl}" alt="Cerita oleh ${story.name}" />
          <div class="story-content">
            <h3>${story.name}</h3>
            <p class="story-description">${story.description}</p>
            <p class="story-date">${formatDate(story.createdAt)}</p>
            ${
              story.lat && story.lon
                ? `<button class="lihat-peta-btn" data-lat="${story.lat}" data-lon="${story.lon}">
                     Lihat Peta
                   </button>`
                : ''
            }
          </div>
        </article>
      `).join('');
    }

    // Event: Tombol "Lihat Peta"
    document.querySelectorAll('.lihat-peta-btn')?.forEach((btn) => {
      btn.addEventListener('click', () => {
        const lat = parseFloat(btn.dataset.lat);
        const lon = parseFloat(btn.dataset.lon);
        if (!isNaN(lat) && !isNaN(lon)) {
          openMapModal(lat, lon);
        }
      });
    });

    // Peta utama
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      const map = L.map(mapContainer).setView([-2.5489, 118.0149], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      if (stories && Array.isArray(stories)) {
        stories.forEach((story) => {
          if (story.lat && story.lon) {
            L.marker([story.lat, story.lon])
              .addTo(map)
              .bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
          }
        });
      }

      setTimeout(() => map.invalidateSize(), 0);
    }

    // Fokus ke judul utama
    document.getElementById('home-title')?.focus();

    try {
      initMapModalEvents();
    } catch (e) {
      console.warn('initMapModalEvents() gagal:', e.message);
    }
  },
};

export default Home;