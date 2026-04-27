/**
 * cookies.js — Air Flamme Énergie
 * Gestion du consentement cookies conforme CNIL / ePrivacy
 * - Bloque Google Analytics jusqu'au consentement
 * - Injecte le bandeau + le style automatiquement sur toutes les pages
 * - Expose resetCookieConsent() pour le bouton footer "Gérer mes cookies"
 * ---------------------------------------------------------------
 * À inclure sur TOUTES les pages via :
 * <script src="/js/cookies.js" defer></script>
 * (chemin absolu recommandé pour les sous-pages)
 * ---------------------------------------------------------------
 */

(function () {

  /* ── Configuration ── */
  var GA_ID = 'G-XXXXXXXXXX'; // ← Remplace par ton vrai ID Google Analytics
  var COOKIE_NAME = 'afe_cookie_consent';
  var COOKIE_DURATION_DAYS = 180;

  /* ── Helpers ── */
  function setCookie(name, value, days) {
    var expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + value + '; expires=' + expires + '; path=/; SameSite=Lax; Secure';
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  }

  /* ── Chargement Google Analytics (uniquement après consentement) ── */
  function loadGA() {
    if (GA_ID === 'G-XXXXXXXXXX') return; // pas encore configuré
    var s = document.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    s.async = true;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  function getBasePath() {
    var path = window.location.pathname;
    var parts = path.split('/').filter(Boolean);

    if (window.location.hostname.includes('github.io')) {
      return '/' + (parts[0] || '');
    }

    return '';
  }
  /* ── Injection du CSS du bandeau ── */
  function injectStyle() {
    if (document.getElementById('afe-cookie-style')) return;
    var style = document.createElement('style');
    style.id = 'afe-cookie-style';
    style.textContent = [
      '#afe-cookie-banner {',
      '  position: fixed;',
      '  bottom: 0; left: 0; right: 0;',
      '  background: #1a1a1a;',
      '  color: #f0f0f0;',
      '  font-family: inherit;',
      '  font-size: 14px;',
      '  line-height: 1.5;',
      '  z-index: 99999;',
      '  padding: 16px 24px;',
      '  display: flex;',
      '  flex-wrap: wrap;',
      '  align-items: center;',
      '  gap: 12px;',
      '  box-shadow: 0 -2px 12px rgba(0,0,0,0.3);',
      '}',
      '#afe-cookie-banner p {',
      '  margin: 0;',
      '  flex: 1 1 280px;',
      '}',
      '#afe-cookie-banner a {',
      '  color: #f0a500;',
      '  text-decoration: underline;',
      '}',
      '#afe-cookie-banner .afe-cookie-btns {',
      '  display: flex;',
      '  gap: 10px;',
      '  flex-wrap: wrap;',
      '  flex-shrink: 0;',
      '}',
      '#afe-cookie-banner button {',
      '  padding: 9px 20px;',
      '  border: none;',
      '  border-radius: 6px;',
      '  font-size: 14px;',
      '  font-family: inherit;',
      '  cursor: pointer;',
      '  font-weight: 500;',
      '  transition: opacity 0.15s;',
      '}',
      '#afe-cookie-banner button:hover { opacity: 0.85; }',
      '#afe-btn-accept {',
      '  background: #f0a500;',
      '  color: #1a1a1a;',
      '}',
      '#afe-btn-refuse {',
      '  background: #3a3a3a;',
      '  color: #f0f0f0;',
      '  border: 1px solid #555 !important;',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ── Injection du bandeau dans le DOM ── */
  function injectBanner() {
    if (document.getElementById('afe-cookie-banner')) return;
    var legalLink = window.location.origin + getBasePath() + '/pages/mentions-legales/index.html';
    var banner = document.createElement('div');
    banner.id = 'afe-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Gestion des cookies');
    banner.innerHTML =
      '<p>' +
        'Ce site utilise des cookies analytiques (Google Analytics) pour mesurer l\'audience. ' +
        'Aucun cookie publicitaire. ' +
        '<a href="' + legalLink + '">En savoir plus</a>' +
      '</p>' +
      '<div class="afe-cookie-btns">' +
        '<button id="afe-btn-refuse" type="button">Refuser</button>' +
        '<button id="afe-btn-accept" type="button">Accepter</button>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('afe-btn-accept').addEventListener('click', function () {
      setCookie(COOKIE_NAME, 'accepted', COOKIE_DURATION_DAYS);
      hideBanner();
      loadGA();
    });

    document.getElementById('afe-btn-refuse').addEventListener('click', function () {
      setCookie(COOKIE_NAME, 'refused', COOKIE_DURATION_DAYS);
      hideBanner();
    });
  }

  function hideBanner() {
    var b = document.getElementById('afe-cookie-banner');
    if (b) b.remove();
  }

  /* ── Réinitialisation (bouton footer "Gérer mes cookies") ── */
  window.resetCookieConsent = function () {
    deleteCookie(COOKIE_NAME);
    injectStyle();
    injectBanner();
  };

  /* ── Initialisation au chargement de la page ── */
  function init() {
    var consent = getCookie(COOKIE_NAME);
    if (consent === 'accepted') {
      loadGA(); // déjà accepté → on charge GA directement, sans bandeau
    } else if (consent === 'refused') {
      // refus déjà enregistré → rien à faire
    } else {
      // pas encore de choix → on affiche le bandeau
      injectStyle();
      injectBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
