import RegisterPresenter from '../presenters/registerPresenter';

const registerPage = {
  async render() {
    return `
      <section id="register-section" class="auth-page container" style="view-transition-name: register-content">
        <div class="auth-box">
          <h2>Daftar ke <span class="highlight">Web Story</span></h2>
          <form id="register-form">
            <div class="form-group">
              <label for="name">Nama</label>
              <input type="text" id="name" placeholder="Masukkan nama" required />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" placeholder="Masukkan email" required />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" placeholder="Masukkan password" required />
            </div>
            <button type="submit" class="btn btn-primary">Daftar</button>
          </form>
          <p class="switch-link">Sudah punya akun? <a href="#/login">Login di sini</a></p>

          <div id="loading-indicator" class="loading hidden" aria-live="polite">
            <div class="spinner" role="status" aria-label="Sedang mendaftar"></div>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const presenter = RegisterPresenter(this);
    const form = document.getElementById('register-form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value;

      presenter.handleRegister({ name, email, password });
    });
  },

  showLoading() {
    document.getElementById('loading-indicator').classList.remove('hidden');
  },

  hideLoading() {
    document.getElementById('loading-indicator').classList.add('hidden');
  },

  showSuccess(message) {
    alert(message);
  },

  showError(message) {
    alert(`Registrasi gagal: ${message}`);
  },

  navigateToLogin() {
    window.location.hash = '#/login';
  },
};

export default registerPage;
