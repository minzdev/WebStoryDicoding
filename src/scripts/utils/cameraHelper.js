let stream = null;

export const startCamera = async () => {
  const video = document.getElementById('camera-preview');
  if (!video) {
    console.error('Elemen video tidak ditemukan');
    return null;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Kamera tidak didukung oleh browser ini.');
    return null;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.style.display = 'block';
    return stream;
  } catch (err) {
    alert('Gagal mengakses kamera.');
    console.error(err);
    return null;
  }
};

export const stopCamera = () => {
  const video = document.getElementById('camera-preview');
  if (video) {
    video.style.display = 'none';
  }

  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
};

export const captureImage = () => {
  const video = document.getElementById('camera-preview');
  const canvas = document.getElementById('photo-canvas');

  if (!video || !canvas) {
    console.error('Elemen video atau canvas tidak ditemukan');
    return null;
  }

  const context = canvas.getContext('2d');
  if (!context) {
    console.error('Context 2D tidak dapat dibuat');
    return null;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL('image/jpeg');

  // Tampilkan preview
  const preview = document.getElementById('photo-preview');
  if (preview) {
    preview.src = imageData;
    preview.style.display = 'block';
  }

  return imageData;
};
