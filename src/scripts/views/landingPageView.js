import heroImg from '../../assets/img/hero.png';

const landingPage = {
  async render() {
    return `
      <section style="view-transition-name: landing-content" class="container landing-page">
        <div class="hero">
          <h1>Selamat Datang di <span class="highlight"> <br>Web Story</span></h1>
          <p class="tagline">Bagikan cerita dan lokasi Anda bersama dunia.</p>
          <div class="action-buttons">
            <a href="#/login" class="btn btn-primary">Login</a>
            <a href="#/register" class="btn btn-outline">Register</a>
          </div>
        </div>
        <div class="illustration">
          <img src="${heroImg}" alt="Ilustrasi berbagi cerita" />
        </div>
      </section>
    `;
  },

  async afterRender() {},
};

export default landingPage;
