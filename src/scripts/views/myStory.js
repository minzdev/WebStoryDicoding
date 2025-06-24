// File: src/scripts/views/pages/myStory.js
import {
  getAllOfflineStories,
  deleteOfflineStory,
} from '../utils/story-idb';
import Swal from 'sweetalert2';

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

const MyStory = {
  async render() {
    return `
      <section class="home-page">
        <h2 id="home-title" class="add-story-title" tabindex="-1">Cerita Tersimpan</h2>
  
        <section 
          id="stories" 
          class="story-grid" 
          aria-labelledby="home-title" 
          role="region">
        </section>
  
        <p class="offline-info" style="margin-top: 2rem; font-style: italic; color: #555;">
          🗺️ Map lokasi/peta hanya dapat dilihat saat dalam keadaan online.
        </p>
      </section>
    `;
  },
  
  async afterRender() {
    const stories = await getAllOfflineStories();
    const storiesContainer = document.getElementById('stories');

    if (!stories || stories.length === 0) {
      storiesContainer.innerHTML = '<p>Tidak ada cerita tersimpan.</p>';
      return;
    }

    storiesContainer.innerHTML = stories.map((story) => `
      <article class="story-card" tabindex="0" aria-label="Cerita offline">
        <img src="${story.image}" alt="Cerita offline" />
        <div class="story-content">
          <h3>${story.description}</h3>
          <p class="story-description">📍 (${story.lat}, ${story.lon})</p>
          <p class="story-date">🕒 ${formatDate(story.timestamp)}</p>
          <button 
            class="lihat-peta-btn bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition delete-button" 
            data-id="${story.id}">
            Hapus
          </button>
        </div>
      </article>
    `).join('');

    document.querySelectorAll('.delete-button')?.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const result = await Swal.fire({
          title: 'Hapus Cerita?',
          text: 'Cerita akan dihapus dari penyimpanan offline.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#e3342f',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Ya, Hapus!',
          cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
          await deleteOfflineStory(id);
          this.afterRender();
        }
      });
    });
  }
};

export default MyStory;
