import L from 'leaflet';

let map; // simpan instance map

export function openMapModal(lat, lng) {
  const modal = document.getElementById('map-modal');
  const mapContainer = document.getElementById('map-modal-container');
  modal.style.display = 'block';

  // Bersihkan isi sebelumnya
  mapContainer.innerHTML = '';

  map = L.map('map-modal-container').setView([lat, lng], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  L.marker([lat, lng]).addTo(map);
}

export function initMapModalEvents() {
  const closeBtn = document.getElementById('close-map');
  closeBtn.onclick = () => {
    document.getElementById('map-modal').style.display = 'none';
    if (map) {
      map.remove(); // hapus instance untuk hindari bug
      map = null;
    }
  };
}
