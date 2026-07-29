(function () {
  "use strict";

  const STORAGE_KEY = "gili_cookie_consent_v1";
  const POPUP_KEY = "gili_pilot_popup_v1";
  const config = window.GILI_TRACKING || {};
  let loadedStatistics = false;
  let loadedMarketing = false;

  function readConsent() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (_) {
      return null;
    }
  }

  function clearOptionalCookies() {
    const optionalPrefixes = ["_ga", "_gid", "_gat", "_clck", "_clsk", "_fbp", "_fbc"];
    document.cookie.split(";").forEach(function (entry) {
      const name = entry.split("=")[0].trim();
      if (!optionalPrefixes.some((prefix) => name.indexOf(prefix) === 0)) return;
      document.cookie = name + "=; Max-Age=0; path=/; SameSite=Lax";
      if (window.location.hostname.endsWith("gili.live")) {
        document.cookie = name + "=; Max-Age=0; path=/; domain=.gili.live; SameSite=Lax";
      }
    });
  }

  function writeConsent(consent) {
    const previous = readConsent();
    const value = {
      necessary: true,
      statistics: Boolean(consent.statistics),
      marketing: Boolean(consent.marketing),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    document.dispatchEvent(new CustomEvent("gili:consent-updated", { detail: value }));

    const revokedPreviouslyLoadedCategory = previous && (
      (previous.statistics && !value.statistics) ||
      (previous.marketing && !value.marketing)
    );
    if (revokedPreviouslyLoadedCategory) {
      clearOptionalCookies();
      window.location.reload();
      return value;
    }

    applyConsent(value);
    return value;
  }

  function loadScript(src, id) {
    if (!src || (id && document.getElementById(id))) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    if (id) script.id = id;
    document.head.appendChild(script);
  }

  function loadStatistics() {
    if (loadedStatistics) return;
    loadedStatistics = true;

    if (config.ga4Id) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", config.ga4Id, { anonymize_ip: true });
      loadScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(config.ga4Id), "gili-ga4");
    }

    if (config.clarityId) {
      window.clarity = window.clarity || function () {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };
      loadScript("https://www.clarity.ms/tag/" + encodeURIComponent(config.clarityId), "gili-clarity");
      window.clarity("consentv2", { analytics_Storage: "granted", ad_Storage: "denied" });
    }
  }

  function loadMarketing() {
    if (loadedMarketing) return;
    loadedMarketing = true;

    if (config.metaPixelId) {
      window.fbq = window.fbq || function () {
        window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
      };
      if (!window._fbq) window._fbq = window.fbq;
      window.fbq.push = window.fbq;
      window.fbq.loaded = true;
      window.fbq.version = "2.0";
      window.fbq.queue = [];
      loadScript("https://connect.facebook.net/en_US/fbevents.js", "gili-meta-pixel");
      window.fbq("init", config.metaPixelId);
      window.fbq("track", "PageView");
    }
  }

  function applyConsent(consent) {
    if (!consent) return;
    if (consent.statistics) loadStatistics();
    if (consent.marketing) loadMarketing();
  }

  function trackStatisticsEvent(name, parameters) {
    const consent = readConsent();
    if (!consent || !consent.statistics || !window.gtag) return;
    window.gtag("event", name, parameters || {});
  }

  function trackMarketingEvent(name, parameters) {
    const consent = readConsent();
    if (!consent || !consent.marketing || !window.fbq) return;
    window.fbq("track", name, parameters || {});
  }

  function setModalVisible(modal, visible) {
    if (!modal) return;
    modal.classList.toggle("privacy-hidden", !visible);
    modal.setAttribute("aria-hidden", String(!visible));
    document.body.classList.toggle("privacy-locked", visible);
    if (visible) {
      const focusTarget = modal.querySelector("button, input, a");
      if (focusTarget) window.setTimeout(() => focusTarget.focus(), 0);
    }
  }

  function initConsentUi() {
    const banner = document.getElementById("cookie-banner");
    const settings = document.getElementById("cookie-settings");
    const statisticsToggle = document.getElementById("consent-statistics");
    const marketingToggle = document.getElementById("consent-marketing");

    if (!banner || !settings) return;

    function openSettings() {
      const saved = readConsent();
      statisticsToggle.checked = Boolean(saved && saved.statistics);
      marketingToggle.checked = Boolean(saved && saved.marketing);
      setModalVisible(banner, false);
      setModalVisible(settings, true);
    }

    function finish(consent) {
      writeConsent(consent);
      setModalVisible(banner, false);
      setModalVisible(settings, false);
    }

    document.querySelectorAll("[data-cookie-settings]").forEach((button) => {
      button.addEventListener("click", openSettings);
    });
    document.querySelectorAll("[data-consent-all]").forEach((button) => {
      button.addEventListener("click", () => finish({ statistics: true, marketing: true }));
    });
    document.querySelectorAll("[data-consent-reject]").forEach((button) => {
      button.addEventListener("click", () => finish({ statistics: false, marketing: false }));
    });
    document.querySelectorAll("[data-consent-save]").forEach((button) => {
      button.addEventListener("click", () => finish({
        statistics: statisticsToggle.checked,
        marketing: marketingToggle.checked
      }));
    });
    document.querySelectorAll("[data-close-settings]").forEach((button) => {
      button.addEventListener("click", () => setModalVisible(settings, false));
    });

    const consent = readConsent();
    if (consent) {
      applyConsent(consent);
    } else {
      setModalVisible(banner, true);
    }
  }

  function initPilotPopup() {
    const popup = document.getElementById("pilot-popup");
    const form = document.getElementById("pilot-form");
    if (!popup || !form) return;

    const closeButtons = popup.querySelectorAll("[data-close-pilot]");
    const status = document.getElementById("pilot-status");
    const submitButton = form.querySelector('button[type="submit"]');
    const fourteenDays = 14 * 24 * 60 * 60 * 1000;

    function closePopup() {
      localStorage.setItem(POPUP_KEY, String(Date.now()));
      setModalVisible(popup, false);
    }

    closeButtons.forEach((button) => button.addEventListener("click", closePopup));

    function schedulePopup() {
      const dismissedAt = Number(localStorage.getItem(POPUP_KEY) || 0);
      if (dismissedAt && Date.now() - dismissedAt <= fourteenDays) return;
      window.setTimeout(() => {
        if (readConsent()) {
          setModalVisible(popup, true);
          trackStatisticsEvent("pilot_popup_view", { form_name: "pilot_interest" });
          if (window.clarity) window.clarity("set", "pilot_popup", "shown");
        }
      }, 8000);
    }

    if (readConsent()) {
      schedulePopup();
    } else {
      document.addEventListener("gili:consent-updated", schedulePopup, { once: true });
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      submitButton.disabled = true;
      status.textContent = "Wird gesendet …";

      try {
        const body = new URLSearchParams(new FormData(form)).toString();
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body
        });
        if (!response.ok) throw new Error("Form submission failed");
        trackStatisticsEvent("generate_lead", {
          form_name: "pilot_interest",
          method: "website_popup"
        });
        trackMarketingEvent("Lead", { content_name: "Gili pilot interest" });
        if (window.clarity) window.clarity("set", "pilot_form", "submitted");
        form.reset();
        status.textContent = "Danke. Wir melden uns mit den Pilot-Details bei dir.";
        localStorage.setItem(POPUP_KEY, String(Date.now()));
        window.setTimeout(() => setModalVisible(popup, false), 2200);
      } catch (_) {
        status.textContent = "Das hat gerade nicht geklappt. Schreib uns bitte an hallo@gili.live.";
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  function initInteractionTracking() {
    document.addEventListener("click", function (event) {
      const demoLink = event.target.closest(".demo-btn, #nav-cta, #nav-cta-mobile");
      if (!demoLink) return;
      trackStatisticsEvent("demo_cta_click", {
        link_text: (demoLink.textContent || "").trim().slice(0, 100)
      });
      if (window.clarity) window.clarity("set", "demo_cta", "clicked");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initConsentUi();
    initPilotPopup();
    initInteractionTracking();
  });
})();
