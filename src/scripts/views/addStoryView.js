// File: src/scripts/views/pages/addStoryView.js
import AddStoryPresenter from '../presenters/addStoryPresenter';

let presenterInstance = null;

const addStoryView = {
  async render() {
    const isOnline = navigator.onLine;

    return `
      <section class="add-story container" view-transition-name="main-content">
        <h2>Tambah Cerita</h2>
        <form id="addStoryForm">
          <!-- Deskripsi -->
          <div class="form-group">
            <label for="description">Deskripsi:</label>
            <textarea id="description" placeholder="Deskripsi" required></textarea>
          </div>

          <!-- Upload Gambar -->
          <div class="form-group">
            <label for="photoFile">Upload Gambar:</label>
            <input type="file" id="photoFile" accept="image/*" />
          </div>

          <!-- Kamera -->
          <h4>Ambil Foto</h4>
          <div class="form-group">
            <button type="button" id="toggleCamera">Nyalakan Kamera</button>
            <button type="button" id="takePhoto" style="display: none;">Ambil Foto</button>
          </div>

          <video id="camera-preview" autoplay playsinline style="display:none; width:100%; border-radius: 8px; margin-top: 10px;"></video>
          <img id="photo-preview" alt="Preview" style="display:none; width:100%; margin-top: 10px;" />
          <canvas id="photo-canvas" style="display:none;"></canvas>

          <!-- Peta atau Pesan Offline -->
          <div class="form-group" id="map-wrapper">
            <p>Pilih Lokasi:</p>
            ${
              isOnline
                ? `<div id="map" style="height: 300px; border-radius: 8px;"></div>`
                : `<p class="text-red-600 font-medium">🗺️ Peta tidak tersedia saat offline. Masukkan koordinat secara manual.</p>`
            }
          </div>

          <!-- Koordinat -->
          <input type="hidden" id="latitude" />
          <input type="hidden" id="longitude" />
          <div class="form-group">
            <label for="latitude-display">Latitude:</label>
            <input type="text" id="latitude-display" placeholder="Contoh: -6.200000" />
          </div>
          <div class="form-group">
            <label for="longitude-display">Longitude:</label>
            <input type="text" id="longitude-display" placeholder="Contoh: 106.816666" />
          </div>

          <button type="submit">Kirim</button>
          <button id="saveOfflineBtn" type="button">Simpan Cerita</button>
        </form>
      </section>
    `;
  },

  async afterRender() {
    const video = document.getElementById('camera-preview');
    const photo = document.getElementById('photo-preview');
    const isOnline = navigator.onLine;

    presenterInstance = AddStoryPresenter({
      onCameraStarted: (stream) => {
        video.style.display = 'block';
        video.srcObject = stream;
        video.play();
        document.getElementById('takePhoto').style.display = 'inline-block';
      },
      onCameraStopped: () => {
        if (video) {
          video.pause();
          video.srcObject = null;
          video.style.display = 'none';
        }
        document.getElementById('takePhoto').style.display = 'none';
      },
      onImageCaptured: (image) => {
        photo.src = image;
        photo.style.display = 'block';
      },
      getCameraPreviewElement: () => document.getElementById('camera-preview'),
      captureImageFromVideo: (videoElement, callback) => {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(videoElement, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        callback(imageDataUrl);
      },
      showAlert: (msg) => alert(msg),
      onSubmitSuccess: () => {
        alert('Cerita berhasil ditambahkan!');
        window.location.hash = '#/home';
      },
      onSubmitError: (msg) => alert(msg),
      onSaveOfflineSuccess: () => {
        alert('Cerita disimpan offline!');
        window.location.hash = '#/my-story';
      },
      onSaveOfflineError: (msg) => alert(msg),
    });

    // Event listeners
    document.getElementById('toggleCamera').addEventListener('click', () => {
      if (video.srcObject) {
        presenterInstance.stopCamera();
      } else {
        presenterInstance.startCamera();
      }
    });

    document.getElementById('takePhoto').addEventListener('click', () => {
      presenterInstance.handleCaptureImage();
    });

    document.getElementById('photoFile').addEventListener('change', (e) => {
      presenterInstance.handleFileSelected(e.target.files[0]);
    });

    document.getElementById('addStoryForm').addEventListener('submit', (e) => {
      e.preventDefault();
      presenterInstance.handleFormSubmit({
        description: document.getElementById('description').value,
        lat: document.getElementById('latitude').value,
        lon: document.getElementById('longitude').value,
      });
    });

    document.getElementById('saveOfflineBtn').addEventListener('click', () => {
      presenterInstance.handleSaveOffline({
        description: document.getElementById('description').value,
        lat: document.getElementById('latitude').value,
        lon: document.getElementById('longitude').value,
      });
    });

    // Inisialisasi peta hanya jika online dan elemen peta tersedia
    const mapElement = document.getElementById('map');
    if (isOnline && mapElement) {
      presenterInstance.initMap(mapElement, (lat, lon) => {
        document.getElementById('latitude').value = lat;
        document.getElementById('longitude').value = lon;
        document.getElementById('latitude-display').value = lat;
        document.getElementById('longitude-display').value = lon;
      });
    }

    window.addEventListener('hashchange', () => {
      presenterInstance.stopCamera();
    });
  },

  beforeUnmount() {
    presenterInstance?.stopCamera();
  },
};

export default addStoryView;
