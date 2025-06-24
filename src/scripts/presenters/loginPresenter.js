import auth from '../utils/auth';
import { login as loginApi } from '../utils/api';

const LoginPresenter = (view) => {
  const login = async ({ email, password }) => {
    view.showLoading();

    try {
      const response = await loginApi(email, password);

      if (response.error) {
        throw new Error(response.message || 'Login gagal');
      }

      const token = response?.loginResult?.token;
      if (!token) throw new Error('Token tidak ditemukan dalam respons');

      auth.saveToken(token);
      view.navigateToHome();
    } catch (error) {
      view.showError(error.message);
    } finally {
      view.hideLoading();
    }
  };

  return {
    login,
  };
};

export default LoginPresenter; // ⬅️ HARUS ADA INI
