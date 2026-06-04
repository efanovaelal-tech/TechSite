const YANDEX_METRIKA_ID = null;

function trackEvent(eventName, eventParams = {}) {
  console.log('Analytics event:', eventName, eventParams);

  if (window.ym && YANDEX_METRIKA_ID) {
    ym(YANDEX_METRIKA_ID, 'reachGoal', eventName, eventParams);
  }

  if (window.gtag) {
    gtag('event', eventName, eventParams);
  }
}
