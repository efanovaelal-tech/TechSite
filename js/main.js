(function () {
  function initMenu() {
    const toggle = document.querySelector('[data-menu-toggle]');
    const panel = document.getElementById('header-panel');
    if (!toggle || !panel) return;

    function setMenu(open) {
      panel.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    }

    toggle.addEventListener('click', () => {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    panel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });
  }

  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initTracking() {
    document.querySelectorAll('[data-track]').forEach((node) => {
      node.addEventListener('click', () => trackEvent(node.dataset.track, { text: node.textContent.trim() }));
    });
  }

  function initAccordion() {
    document.querySelectorAll('[data-accordion] .faq-button').forEach((button) => {
      button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const isOpen = item.classList.toggle('is-open');
        button.setAttribute('aria-expanded', String(isOpen));
      });
    });
  }

  function initMap() {
    const loadButton = document.querySelector('[data-map-load]');
    const map = document.querySelector('[data-map]');
    if (!loadButton || !map) return;

    loadButton.addEventListener('click', () => {
      map.innerHTML = '<iframe class="map-frame" title="Карта проезда" loading="lazy" src="https://yandex.ru/map-widget/v1/?ll=37.617700%2C55.755864&z=10"></iframe>';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initAnchors();
    initTracking();
    initAccordion();
    initMap();
  });
})();
