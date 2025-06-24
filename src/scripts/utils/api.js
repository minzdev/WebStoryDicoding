const API_ENDPOINT = {
  LOGIN: 'https://story-api.dicoding.dev/v1/login',
  REGISTER: 'https://story-api.dicoding.dev/v1/register',
  CREATE_STORY: 'https://story-api.dicoding.dev/v1/stories',
  // Tambahkan endpoint lainnya jika diperlukan
};

const login = async (email, password) => {
  try {
    const response = await fetch(API_ENDPOINT.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal login');

    const { loginResult } = result;
    if (!loginResult?.token) throw new Error('Login berhasil tapi token tidak ditemukan');

    return { loginResult };
  } catch (err) {
    console.error('Login API error:', err);
    throw new Error(err.message || 'Terjadi kesalahan saat login');
  }
};

const register = async ({ name, email, password }) => {
  try {
    const response = await fetch(API_ENDPOINT.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal registrasi');

    return { success: true, message: 'Registrasi berhasil!' };
  } catch (err) {
    console.error('Register API error:', err);
    return { success: false, message: err.message || 'Terjadi kesalahan saat registrasi' };
  }
};

const createStory = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');

    const response = await fetch(API_ENDPOINT.CREATE_STORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // formData bisa berisi file, deskripsi, lokasi, dll
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal mengirim cerita');

    return result;
  } catch (err) {
    console.error('Create Story API error:', err);
    throw new Error(err.message || 'Terjadi kesalahan saat mengirim cerita');
  }
};

// ✅ Export semua fungsi untuk digunakan oleh Presenter
export {
  API_ENDPOINT,
  login,
  register,     // <-- ini sekarang tersedia
  createStory,
};
