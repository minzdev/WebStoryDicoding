import { getToken } from '../utils/auth';

const StoryModel = {
  async fetchStories() {
    const token = getToken();
    const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || 'Gagal memuat story');
    }

    const result = await response.json();
    return result.listStory;
  },

  async getStoryDetail(id) {
    const token = getToken();
    const response = await fetch(`https://story-api.dicoding.dev/v1/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Gagal mengambil detail cerita');
    }

    return result.story;
  },

  async addStory({ description, photo, lat, lon }) {
    const token = getToken();
    const formData = new FormData();

    // Konversi base64 image menjadi Blob sebelum ditambahkan ke FormData
    if (photo.startsWith('data:image')) {
      formData.append('photo', dataURItoBlob(photo), 'story-photo.jpg');
    } else {
      throw new Error('Format gambar tidak valid');
    }

    formData.append('description', description);
    if (lat && lon) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }

    const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // ❗️Jangan set 'Content-Type' saat pakai FormData!
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('API Error:', result);
      throw new Error(result.message || 'Gagal menambahkan cerita');
    }

    return result;
  }
};

// Fungsi bantu: konversi base64 ke Blob
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}

export default StoryModel;
