import { createStory } from '../utils/api';
import { saveStoryToIDB } from '../utils/story-idb';

const AddStoryPresenter = (view) => {
  let stream = null;
  let capturedImage = null;
  let selectedFile = null;

  const startCamera = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      view.onCameraStarted(stream);
    } catch (err) {
      view.showAlert('Tidak dapat mengakses kamera');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
      view.onCameraStopped();
    }
  };

  const handleCaptureImage = () => {
    const video = view.getCameraPreviewElement();
    if (!video) return;

    view.captureImageFromVideo(video, (imageDataUrl) => {
      capturedImage = imageDataUrl;
      view.onImageCaptured(imageDataUrl);
    });
  };

  const handleFileSelected = (file) => {
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      capturedImage = null;
      view.onImageCaptured(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const initMap = (mapElement, onClickLocation) => {
    if (!navigator.onLine || !mapElement) return;
  
    const map = L.map(mapElement).setView([-6.2, 106.8], 5);
    const marker = L.marker([-6.2, 106.8], { draggable: true }).addTo(map);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);
  
    map.on('click', function (e) {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onClickLocation(lat, lng);
    });
  
    setTimeout(() => map.invalidateSize(), 0);
  };
  const handleFormSubmit = async ({ description, lat, lon }) => {
    try {
      const formData = new FormData();
      formData.append('description', description);

      if (selectedFile) {
        formData.append('photo', selectedFile);
      } else if (capturedImage) {
        const blob = await fetch(capturedImage).then((res) => res.blob());
        formData.append('photo', blob, 'captured.jpg');
      } else {
        throw new Error('Silakan pilih atau ambil foto terlebih dahulu.');
      }

      if (lat && lon) {
        formData.append('lat', lat);
        formData.append('lon', lon);
      }

      await createStory(formData);
      view.onSubmitSuccess();
    } catch (err) {
      view.onSubmitError(err.message || 'Terjadi kesalahan saat mengirim cerita');
    }
  };

  const handleSaveOffline = async ({ description, lat, lon }) => {
    try {
      if (!description) {
        view.showAlert('Deskripsi harus diisi');
        return;
      }

      if (!capturedImage && !selectedFile) {
        view.showAlert('Silakan ambil atau unggah gambar');
        return;
      }

      const imageData = capturedImage || await readFileAsDataURL(selectedFile);

      const story = {
        id: new Date().toISOString(),
        description,
        lat,
        lon,
        image: imageData,
        timestamp: Date.now(),
      };

      await saveStoryToIDB(story);
      view.onSaveOfflineSuccess();
    } catch (error) {
      view.onSaveOfflineError(error.message || 'Gagal menyimpan cerita offline');
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const cleanupOnNavigation = () => {
    stopCamera();
  };

  return {
    startCamera,
    stopCamera,
    handleCaptureImage,
    handleFileSelected,
    initMap,
    handleFormSubmit,
    handleSaveOffline,
    cleanupOnNavigation,
  };
};

export default AddStoryPresenter;
