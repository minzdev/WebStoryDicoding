import LoginPresenter from '../presenters/loginPresenter';

const loginPage = {
  render() {
    return `
      <main class="auth-page container" tabindex="0">
        <div class="auth-box">
          <h2>Masuk ke <span class="highlight">Web Story</span></h2>
          <form id="login-form" class="auth-form" aria-label="Formulir Login">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div class="form-group">
              <label for="password">Kata Sandi</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
            <p class="switch-link">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
          </form>

          <div id="loading-indicator" class="loading hidden" aria-live="polite">
            <div class="spinner" role="status" aria-label="Sedang login"></div>
          </div>
        </div>
      </main>
    `;
  },

  afterRender() {
    const form = document.getElementById('login-form');
    const presenter = LoginPresenter(this); // Inject view ke presenter

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = form.email.value.trim();
      const password = form.password.value.trim();

      presenter.login({ email, password });
    });
  },

  showLoading() {
    document.getElementById('loading-indicator').classList.remove('hidden');
  },

  hideLoading() {
    document.getElementById('loading-indicator').classList.add('hidden');
  },

  showError(message) {
    alert(`Login gagal: ${message}`);
  },

  navigateToHome() {
    window.location.hash = '#/home';
  }
};

export default loginPage;
