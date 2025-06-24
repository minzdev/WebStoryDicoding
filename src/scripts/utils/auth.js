const TOKEN_KEY = 'token';

const auth = {
  // Simpan token ke localStorage
  saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Ambil token dari localStorage
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Hapus token dari localStorage (saat logout)
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Periksa apakah user sudah login
  isUserLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};

// Ekspor fungsi-fungsi secara named
export const saveToken = auth.saveToken;
export const getToken = auth.getToken;
export const clearToken = auth.clearToken;
export const isUserLoggedIn = auth.isUserLoggedIn;

export default auth;  // Tetap ekspor auth sebagai default jika ingin digunakan juga secara keseluruhan
