/* ═══════════════════════════════════════════
   Gili — Cookie consent
   Shared by index.html, impressum.html, datenschutz.html.
   Gates Google Analytics and Meta Pixel behind explicit opt-in consent.
════════════════════════════════════════════ */
(function () {
  'use strict';

  // ─── EDITABLE: real tracking IDs ───
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';   // set real GA4 Measurement ID
  const META_PIXEL_ID     = '0000000000000';  // set real Meta Pixel ID

  const STORAGE_KEY = 'gili_cookie_consent';

  function getConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setConsent(consent) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      analytics: !!consent.analytics,
      marketing: !!consent.marketing,
      timestamp: new Date().toISOString(),
    }));
  }

  function loadAnalytics() {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.indexOf('XXXX') !== -1) return;
    if (window.__giliAnalyticsLoaded) return;
    window.__giliAnalyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);
  }

  function loadMetaPixel() {
    if (!META_PIXEL_ID || META_PIXEL_ID.indexOf('000000') !== -1) return;
    if (window.__giliPixelLoaded) return;
    window.__giliPixelLoaded = true;

    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function applyConsent(consent) {
    if (consent.analytics) loadAnalytics();
    if (consent.marketing) loadMetaPixel();
  }

  function buildBanner() {
    const wrap = document.createElement('div');
    wrap.id = 'cookie-consent-banner';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-label', 'Cookie-Einstellungen');
    wrap.style.cssText = [
      'position:fixed', 'left:0', 'right:0', 'bottom:0', 'z-index:100',
      'background:#FDFAF7', 'border-top:1px solid #EFE7E1',
      'box-shadow:0 -4px 28px rgba(42,40,37,0.08)',
      'font-family:"Instrument Sans",system-ui,sans-serif',
    ].join(';');

    wrap.innerHTML = `
      <div style="max-width:56rem;margin:0 auto;padding:20px 20px 24px;">
        <p style="font-family:'DM Serif Display',Georgia,serif;font-size:19px;color:#2A2825;margin:0 0 8px;">
          Cookies auf gili.live
        </p>
        <p style="font-size:14px;line-height:1.5;color:#8A8580;margin:0 0 16px;max-width:42rem;">
          Wir verwenden notwendige Cookies, damit die Seite funktioniert. Mit deiner Einwilligung
          nutzen wir zusätzlich Analyse- und Marketing-Cookies, um zu verstehen, wie die Seite
          genutzt wird. Du kannst deine Auswahl jederzeit über „Cookie-Einstellungen“ im Footer ändern.
        </p>

        <div id="cookie-consent-details" style="display:none;margin:0 0 18px;padding:14px 16px;background:#FFFFFF;border:1px solid #EFE7E1;border-radius:12px;">
          <label style="display:flex;align-items:center;gap:10px;font-size:13.5px;color:#2A2825;margin-bottom:10px;">
            <input type="checkbox" checked disabled style="width:16px;height:16px;" />
            Notwendig — immer aktiv (z. B. Speicherung deiner Cookie-Entscheidung)
          </label>
          <label style="display:flex;align-items:center;gap:10px;font-size:13.5px;color:#2A2825;margin-bottom:10px;">
            <input type="checkbox" id="cookie-toggle-analytics" style="width:16px;height:16px;" />
            Analyse (Google Analytics)
          </label>
          <label style="display:flex;align-items:center;gap:10px;font-size:13.5px;color:#2A2825;margin-bottom:14px;">
            <input type="checkbox" id="cookie-toggle-marketing" style="width:16px;height:16px;" />
            Marketing (Meta Pixel)
          </label>
          <button id="cookie-save-selection" style="font-size:13.5px;font-weight:600;color:#2A2825;background:#FDFAF7;border:1px solid #EFE7E1;border-radius:10px;padding:9px 16px;cursor:pointer;">
            Auswahl speichern
          </button>
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
          <button id="cookie-accept-all" style="font-size:14px;font-weight:600;color:#2A2825;background:#E8A0A8;border:none;border-radius:10px;padding:11px 20px;cursor:pointer;">
            Alle akzeptieren
          </button>
          <button id="cookie-necessary-only" style="font-size:14px;font-weight:600;color:#2A2825;background:#FDFAF7;border:1px solid #EFE7E1;border-radius:10px;padding:11px 20px;cursor:pointer;">
            Nur notwendige
          </button>
          <button id="cookie-toggle-details" style="font-size:13px;font-weight:500;color:#8A8580;background:none;border:none;padding:11px 4px;cursor:pointer;text-decoration:underline;">
            Einstellungen
          </button>
        </div>
      </div>
    `;

    return wrap;
  }

  function showBanner() {
    if (document.getElementById('cookie-consent-banner')) return;

    const banner = buildBanner();
    document.body.appendChild(banner);

    const details = banner.querySelector('#cookie-consent-details');
    const analyticsToggle = banner.querySelector('#cookie-toggle-analytics');
    const marketingToggle = banner.querySelector('#cookie-toggle-marketing');

    const existing = getConsent();
    if (existing) {
      analyticsToggle.checked = !!existing.analytics;
      marketingToggle.checked = !!existing.marketing;
    }

    function close() {
      banner.remove();
    }

    banner.querySelector('#cookie-accept-all').addEventListener('click', () => {
      const consent = { analytics: true, marketing: true };
      setConsent(consent);
      applyConsent(consent);
      close();
    });

    banner.querySelector('#cookie-necessary-only').addEventListener('click', () => {
      const consent = { analytics: false, marketing: false };
      setConsent(consent);
      close();
    });

    banner.querySelector('#cookie-toggle-details').addEventListener('click', () => {
      details.style.display = details.style.display === 'none' ? 'block' : 'none';
    });

    banner.querySelector('#cookie-save-selection').addEventListener('click', () => {
      const consent = {
        analytics: analyticsToggle.checked,
        marketing: marketingToggle.checked,
      };
      setConsent(consent);
      applyConsent(consent);
      close();
    });
  }

  function init() {
    const consent = getConsent();
    if (consent) {
      applyConsent(consent);
    } else {
      showBanner();
    }

    document.querySelectorAll('.cookie-settings-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        showBanner();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
