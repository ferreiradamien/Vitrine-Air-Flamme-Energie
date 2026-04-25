/* =====================================================
   BANNIÈRE COOKIES — Air Flamme Énergie
   Conforme CNIL / ePrivacy
   À placer dans /js/cookies.js
   ===================================================== */

(function () {
  const COOKIE_KEY = "afe_cookie_consent";
  const GA_ID = ""; // Remplacer par le vrai ID GA

  /* ---------- Lecture / Écriture cookie ---------- */
  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  }

  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/;SameSite=Lax";
  }

  /* ---------- Chargement Google Analytics ---------- */
  function loadGA() {
    if (window._gaLoaded) return;
    window._gaLoaded = true;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
  }

  /* ---------- Injection du bandeau ---------- */
  function showBanner() {
    const banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Gestion des cookies");
    banner.innerHTML = `
      <div class="cookie-inner">
        <div class="cookie-text">
          <strong>Cookies & confidentialité</strong>
          <p>Nous utilisons Google Analytics pour mesurer l'audience de notre site. Ces données sont anonymisées et ne permettent pas de vous identifier personnellement. Vous pouvez accepter ou refuser ces cookies.</p>
        </div>
        <div class="cookie-actions">
          <button id="cookie-accept" class="cookie-btn cookie-btn--accept">Accepter</button>
          <button id="cookie-refuse" class="cookie-btn cookie-btn--refuse">Refuser</button>
        </div>
      </div>
    `;

    /* Styles inline pour éviter une dépendance CSS externe */
    const style = document.createElement("style");
    style.textContent = `
      #cookie-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #1a1a1a;
        color: #f5f5f5;
        z-index: 9999;
        padding: 0;
        box-shadow: 0 -2px 12px rgba(0,0,0,0.25);
        font-family: inherit;
        animation: slideUp 0.3s ease;
      }
      @keyframes slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }
      .cookie-inner {
        max-width: 960px;
        margin: 0 auto;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 24px;
        flex-wrap: wrap;
      }
      .cookie-text {
        flex: 1;
        min-width: 220px;
      }
      .cookie-text strong {
        display: block;
        font-size: 14px;
        margin-bottom: 4px;
        color: #ffffff;
      }
      .cookie-text p {
        font-size: 12px;
        line-height: 1.5;
        color: #cccccc;
        margin: 0;
      }
      .cookie-actions {
        display: flex;
        gap: 10px;
        flex-shrink: 0;
      }
      .cookie-btn {
        padding: 9px 20px;
        border-radius: 6px;
        border: none;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: opacity 0.15s;
      }
      .cookie-btn:hover { opacity: 0.85; }
      .cookie-btn--accept {
        background: #e85d26;
        color: #fff;
      }
      .cookie-btn--refuse {
        background: transparent;
        color: #cccccc;
        border: 1px solid #555;
      }
      @media (max-width: 480px) {
        .cookie-inner { flex-direction: column; gap: 12px; }
        .cookie-actions { width: 100%; }
        .cookie-btn { flex: 1; text-align: center; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(banner);

    document.getElementById("cookie-accept").addEventListener("click", function () {
      setCookie(COOKIE_KEY, "accepted", 395); // ~13 mois max CNIL
      loadGA();
      removeBanner();
    });

    document.getElementById("cookie-refuse").addEventListener("click", function () {
      setCookie(COOKIE_KEY, "refused", 395);
      removeBanner();
    });
  }

  function removeBanner() {
    const b = document.getElementById("cookie-banner");
    if (b) {
      b.style.animation = "slideDown 0.2s ease forwards";
      b.style.transform = "translateY(100%)";
      setTimeout(() => b.remove(), 250);
    }
  }

  /* ---------- Initialisation ---------- */
  function init() {
    const consent = getCookie(COOKIE_KEY);
    if (consent === "accepted") {
      loadGA();
    } else if (!consent) {
      // Pas encore de choix → afficher le bandeau
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", showBanner);
      } else {
        showBanner();
      }
    }
    // Si "refused" → on ne charge pas GA, pas de bandeau
  }

  init();
})();
