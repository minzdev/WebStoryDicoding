import { vapidPublicKey } from './vapidKey';
import Swal from 'sweetalert2';

const API_BASE_URL = 'https://story-api.dicoding.dev/v1';

export const askNotificationPermission = async () => {
  if (!('Notification' in window)) return 'denied';
  return await Notification.requestPermission();
};

export const subscribeUserToPush = async () => {
  if (!('serviceWorker' in navigator)) {
    Swal.fire('Oops!', 'Browser tidak mendukung Service Worker', 'error');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const existing = await registration.pushManager.getSubscription();

    if (existing) {
      Swal.fire('Info', 'Notifikasi sudah aktif', 'info');
      return existing;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    console.log('Push Subscription berhasil:', subscription);

    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Gagal', 'Token tidak ditemukan, silakan login kembali.', 'error');
      return;
    }

    const payload = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')))),
        auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')))),
      },
    };

    const response = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Gagal berlangganan notifikasi');

    Swal.fire('Sukses', 'Berhasil berlangganan notifikasi!', 'success');
    return subscription;
  } catch (error) {
    Swal.fire('Gagal', 'Gagal mengaktifkan notifikasi.', 'error');
    console.error('Push error:', error);
  }
};

export const unsubscribeUserFromPush = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      Swal.fire('Info', 'Tidak ada langganan aktif.', 'info');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Gagal', 'Token tidak ditemukan, silakan login kembali.', 'error');
      return;
    }

    const payload = {
      endpoint: subscription.endpoint,
    };

    const response = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Gagal berhenti langganan notifikasi');

    await subscription.unsubscribe();
    Swal.fire('Berhenti', 'Notifikasi berhasil dimatikan', 'success');
  } catch (error) {
    console.error('Unsubscribe error:', error);
    Swal.fire('Gagal', 'Terjadi kesalahan saat unsubscribe.', 'error');
  }
};

export const isUserSubscribed = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  return !!subscription;
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
};
