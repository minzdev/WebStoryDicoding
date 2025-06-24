import { register } from '../utils/api';

const RegisterPresenter = (view) => {
  const handleRegister = async ({ name, email, password }) => {
    view.showLoading();

    try {
      const result = await register({ name, email, password });

      if (result.success) {
        view.showSuccess(result.message);
        view.navigateToLogin();
      } else {
        view.showError(result.message);
      }
    } catch (error) {
      view.showError(error.message || 'Terjadi kesalahan saat registrasi');
    } finally {
      view.hideLoading();
    }
  };

  return {
    handleRegister,
  };
};

export default RegisterPresenter;
