import loginPage from './views/loginView';
import registerPage from './views/registerView';
import homePage from './views/homeView';
import addStoryPage from './views/addStoryView';
import aboutPage from './views/aboutView';
import landingPage from './views/landingPageView';
import myStoryPage from './views/myStory';

import applyViewTransition from './utils/transition';

const routes = {
  '#/login': loginPage,
  '#/register': registerPage,
  '#/home': homePage,
  '#/add-story': addStoryPage,
  '#/about': aboutPage,
  '#/my-story': myStoryPage,
  '#/': landingPage,
};

let currentPage = null;

const renderPage = async () => {
  const hash = window.location.hash;
  const page = routes[hash] || landingPage;
  const app = document.getElementById('app');

  if (currentPage?.destroy) {
    await currentPage.destroy();
  }

  currentPage = page;

  await applyViewTransition(async () => {
    app.innerHTML = await page.render();
    if (page.afterRender) await page.afterRender();

    const mainContent = document.querySelector('#main-content');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
    }

    document.dispatchEvent(new Event('spa-page-rendered'));
  });
};

window.addEventListener('hashchange', renderPage);
window.addEventListener('load', renderPage);
