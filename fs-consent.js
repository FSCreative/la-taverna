/*! FS Consent 1.0.1 · Cookie- & Einwilligungs-Banner · FS Creative · fs-creative.at */
(function () {
  'use strict';
  if (window.FSConsent) return;
  var ME = document.currentScript;

  var KEY = 'fs-consent';
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000; // nach 12 Monaten erneut fragen
  var OPTIONAL = ['media', 'analytics', 'marketing'];

  // ---------------------------------------------------------------- Texte
  var T = {
    sie: {
      title: 'Cookies & externe Inhalte',
      text: 'Wir verwenden technisch notwendige Cookies, damit diese Website funktioniert. Mit Ihrer Zustimmung laden wir zusätzlich {list}. Dabei können Daten wie Ihre IP-Adresse an die jeweiligen Anbieter übertragen werden. Ihre Auswahl können Sie jederzeit unter „Cookie-Einstellungen“ ändern.',
      infoTitle: 'Cookies',
      infoText: 'Diese Website verwendet ausschließlich technisch notwendige Cookies bzw. lokalen Speicher. Es werden keine Cookies zu Werbe- oder Analysezwecken gesetzt.',
      acceptAll: 'Alle akzeptieren',
      necessaryOnly: 'Nur notwendige',
      settings: 'Einstellungen',
      save: 'Auswahl speichern',
      ok: 'Verstanden',
      back: 'Zurück',
      privacy: 'Datenschutz',
      imprint: 'Impressum',
      settingsTitle: 'Cookie-Einstellungen',
      settingsText: 'Wählen Sie, welche Inhalte wir laden dürfen. Notwendige Cookies sind immer aktiv.',
      always: 'Immer aktiv',
      services: 'Anbieter',
      includes: 'Umfasst',
      phText: 'Hier wird ein Inhalt von {service} angezeigt. Beim Laden werden Daten wie Ihre IP-Adresse an {provider} übertragen.',
      phRemember: 'Externe Medien immer erlauben',
      loadMap: 'Karte laden',
      loadVideo: 'Video laden',
      loadForm: 'Formular aktivieren',
      loadOther: 'Inhalt laden',
      and: 'und',
      cat: {
        necessary: ['Notwendig', 'Damit die Website funktioniert, z. B. zum Speichern dieser Auswahl, für Formulare, Warenkorb oder Login.'],
        media: ['Externe Medien', 'Inhalte anderer Plattformen wie Karten, Videos oder Social-Media-Beiträge.'],
        analytics: ['Statistik', 'Hilft uns zu verstehen, wie Besucher die Website nutzen, damit wir sie verbessern können.'],
        marketing: ['Marketing', 'Wird verwendet, um Werbung auf anderen Plattformen passender auszuspielen und deren Erfolg zu messen.']
      },
      listCat: { media: 'externe Medien', analytics: 'Statistik-Dienste', marketing: 'Marketing-Dienste' }
    },
    du: {
      title: 'Cookies & externe Inhalte',
      text: 'Wir verwenden technisch notwendige Cookies, damit diese Website funktioniert. Mit deiner Zustimmung laden wir zusätzlich {list}. Dabei können Daten wie deine IP-Adresse an die jeweiligen Anbieter übertragen werden. Deine Auswahl kannst du jederzeit unter „Cookie-Einstellungen“ ändern.',
      infoTitle: 'Cookies',
      infoText: 'Diese Website verwendet ausschließlich technisch notwendige Cookies bzw. lokalen Speicher. Es werden keine Cookies zu Werbe- oder Analysezwecken gesetzt.',
      settingsText: 'Wähle, welche Inhalte wir laden dürfen. Notwendige Cookies sind immer aktiv.',
      phText: 'Hier wird ein Inhalt von {service} angezeigt. Beim Laden werden Daten wie deine IP-Adresse an {provider} übertragen.'
    },
    en: {
      title: 'Cookies & external content',
      text: 'We use technically necessary cookies to make this website work. With your consent we also load {list}. In doing so, data such as your IP address may be transmitted to the respective providers. You can change your choice at any time under “Cookie settings”.',
      infoTitle: 'Cookies',
      infoText: 'This website only uses technically necessary cookies or local storage. No cookies are set for advertising or analytics purposes.',
      acceptAll: 'Accept all',
      necessaryOnly: 'Necessary only',
      settings: 'Settings',
      save: 'Save selection',
      ok: 'Got it',
      back: 'Back',
      privacy: 'Privacy policy',
      imprint: 'Imprint',
      settingsTitle: 'Cookie settings',
      settingsText: 'Choose which content we may load. Necessary cookies are always active.',
      always: 'Always active',
      services: 'Providers',
      includes: 'Includes',
      phText: 'Content from {service} is shown here. Loading it transmits data such as your IP address to {provider}.',
      phRemember: 'Always allow external media',
      loadMap: 'Load map',
      loadVideo: 'Load video',
      loadForm: 'Enable form',
      loadOther: 'Load content',
      and: 'and',
      cat: {
        necessary: ['Necessary', 'Required for the website to work, e.g. to remember this choice, for forms, cart or login.'],
        media: ['External media', 'Content from other platforms such as maps, videos or social media posts.'],
        analytics: ['Statistics', 'Helps us understand how visitors use the website so we can improve it.'],
        marketing: ['Marketing', 'Used to show more relevant ads on other platforms and to measure their success.']
      },
      listCat: { media: 'external media', analytics: 'statistics services', marketing: 'marketing services' }
    },
    nl: {
      title: 'Cookies & externe inhoud',
      text: 'Wij gebruiken technisch noodzakelijke cookies om deze website te laten werken. Met uw toestemming laden wij daarnaast {list}. Daarbij kunnen gegevens zoals uw IP-adres aan de betreffende aanbieders worden doorgegeven. U kunt uw keuze altijd wijzigen via „Cookie-instellingen”.',
      infoTitle: 'Cookies',
      infoText: 'Deze website gebruikt uitsluitend technisch noodzakelijke cookies of lokale opslag. Er worden geen cookies voor reclame- of analysedoeleinden geplaatst.',
      acceptAll: 'Alles accepteren',
      necessaryOnly: 'Alleen noodzakelijke',
      settings: 'Instellingen',
      save: 'Keuze opslaan',
      ok: 'Begrepen',
      back: 'Terug',
      privacy: 'Privacy',
      imprint: 'Colofon',
      settingsTitle: 'Cookie-instellingen',
      settingsText: 'Kies welke inhoud wij mogen laden. Noodzakelijke cookies zijn altijd actief.',
      always: 'Altijd actief',
      services: 'Aanbieders',
      includes: 'Omvat',
      phText: 'Hier wordt inhoud van {service} getoond. Bij het laden worden gegevens zoals uw IP-adres aan {provider} doorgegeven.',
      phRemember: 'Externe media altijd toestaan',
      loadMap: 'Kaart laden',
      loadVideo: 'Video laden',
      loadForm: 'Formulier activeren',
      loadOther: 'Inhoud laden',
      and: 'en',
      cat: {
        necessary: ['Noodzakelijk', 'Nodig om de website te laten werken, bijv. om deze keuze te onthouden, voor formulieren, winkelwagen of login.'],
        media: ['Externe media', 'Inhoud van andere platforms zoals kaarten, video’s of berichten op sociale media.'],
        analytics: ['Statistieken', 'Helpt ons te begrijpen hoe bezoekers de website gebruiken, zodat wij deze kunnen verbeteren.'],
        marketing: ['Marketing', 'Wordt gebruikt om relevantere advertenties op andere platforms te tonen en het succes daarvan te meten.']
      },
      listCat: { media: 'externe media', analytics: 'statistiekdiensten', marketing: 'marketingdiensten' }
    }
  };

  var PROVIDERS = {
    'google maps': 'Google', 'youtube': 'Google (YouTube)', 'google recaptcha': 'Google', 'recaptcha': 'Google',
    'vimeo': 'Vimeo', 'instagram': 'Meta', 'facebook': 'Meta', 'openstreetmap': 'die OpenStreetMap Foundation',
    'spotify': 'Spotify', 'komoot': 'komoot', 'outdooractive': 'Outdooractive', 'calendly': 'Calendly'
  };

  // ---------------------------------------------------------------- Konfiguration
  function readConfig() {
    var cfg = {};
    var el = document.getElementById('fs-consent-config');
    if (el) { try { cfg = JSON.parse(el.textContent || '{}'); } catch (e) { console.warn('[FSConsent] Konfiguration ungültig', e); } }
    var win = window.FS_CONSENT || {};
    for (var k in win) if (Object.prototype.hasOwnProperty.call(win, k)) cfg[k] = win[k];
    return cfg;
  }

  var cfg = readConfig();
  var htmlLang = (document.documentElement.lang || 'de').slice(0, 2).toLowerCase();
  var lang = cfg.lang || (htmlLang === 'en' || htmlLang === 'nl' ? htmlLang : 'de');
  var txt = {};
  (function () {
    var k;
    for (k in T.sie) txt[k] = T.sie[k];               // Fallback für fehlende Schlüssel
    if (lang === 'en' || lang === 'nl') for (k in T[lang]) txt[k] = T[lang][k];
    else if (cfg.tone === 'du') for (k in T.du) txt[k] = T.du[k];
    var over = cfg.texts || {};
    for (k in over) txt[k] = over[k];
  })();

  // categories: { media: ['Google Maps', 'YouTube'], analytics: ['Google Analytics'] }
  var cats = {};
  (function () {
    var c = cfg.categories || {};
    if (Array.isArray(c)) c.forEach(function (n) { cats[n] = []; });
    else for (var n in c) cats[n] = c[n] || [];
  })();
  var catNames = OPTIONAL.filter(function (n) { return n in cats; });
  var infoMode = catNames.length === 0;

  // ---------------------------------------------------------------- Speicher
  var memory = null; // Fallback, falls localStorage gesperrt ist
  function load() {
    var raw = null;
    try { raw = window.localStorage.getItem(KEY); } catch (e) { raw = memory; }
    if (!raw) return null;
    try {
      var s = JSON.parse(raw);
      if (!s || !s.ts || Date.now() - s.ts > MAX_AGE) return null;
      return s;
    } catch (e) { return null; }
  }
  function store(choices) {
    var s = JSON.stringify({ v: 1, ts: Date.now(), c: choices });
    memory = s;
    try { window.localStorage.setItem(KEY, s); } catch (e) { /* privater Modus */ }
  }

  var saved = load();
  var state = {};
  catNames.forEach(function (n) { state[n] = !!(saved && saved.c && saved.c[n]); });
  var decided = !!saved && catNames.every(function (n) { return saved.c && n in saved.c; });

  // ---------------------------------------------------------------- Helfer
  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) for (var a in attrs) {
      if (a === 'text') el.textContent = attrs[a];
      else if (a === 'html') el.innerHTML = attrs[a];
      else if (a.slice(0, 2) === 'on') el.addEventListener(a.slice(2), attrs[a]);
      else if (attrs[a] !== false && attrs[a] != null) el.setAttribute(a, attrs[a] === true ? '' : attrs[a]);
    }
    (children || []).forEach(function (c) { if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function joinList(items) {
    if (items.length <= 1) return items.join('');
    return items.slice(0, -1).join(', ') + ' ' + txt.and + ' ' + items[items.length - 1];
  }
  function emit(name, detail) {
    var ev;
    try { ev = new CustomEvent(name, { detail: detail }); } catch (e) { ev = document.createEvent('CustomEvent'); ev.initCustomEvent(name, false, false, detail); }
    window.dispatchEvent(ev);
  }
  function snapshot() { var o = {}; for (var k in state) o[k] = state[k]; return o; }

  // ---------------------------------------------------------------- Theme
  var THEME_VARS = {
    bg: '--fsc-bg', fg: '--fsc-fg', muted: '--fsc-muted', accent: '--fsc-accent', accentFg: '--fsc-accent-fg',
    border: '--fsc-border', radius: '--fsc-radius', buttonRadius: '--fsc-btn-radius', font: '--fsc-font',
    headingFont: '--fsc-heading-font', headingWeight: '--fsc-heading-weight', headingTransform: '--fsc-heading-transform',
    headingSpacing: '--fsc-heading-spacing', buttonTransform: '--fsc-btn-transform', buttonWeight: '--fsc-btn-weight',
    buttonSpacing: '--fsc-btn-spacing', shadow: '--fsc-shadow', link: '--fsc-link', toggleOff: '--fsc-toggle-off',
    phBg: '--fsc-ph-bg', phFg: '--fsc-ph-fg', fontSize: '--fsc-font-size', zIndex: '--fsc-z'
  };
  function applyTheme(el) {
    var t = cfg.theme || {};
    for (var k in t) if (THEME_VARS[k]) el.style.setProperty(THEME_VARS[k], t[k]);
  }

  function ensureCss() {
    if (cfg.cssHref === false || cssReady) return;
    // CSS schon da (per <link> oder gebündelt, z. B. in Next.js)? Dann nichts nachladen.
    var probe = h('div', { 'class': 'fsc-root' });
    probe.style.display = 'none';
    document.body.appendChild(probe);
    var present = window.getComputedStyle(probe).position === 'fixed';
    document.body.removeChild(probe);
    cssReady = true;
    if (present) return;
    var src = cfg.cssHref;
    if (!src) {
      var me = ME || document.querySelector('script[src*="fs-consent"]');
      src = me && me.src ? me.src.replace(/\.js(\?.*)?$/, '.css$1') : '/fs-consent.css';
    }
    document.head.appendChild(h('link', { rel: 'stylesheet', href: src }));
  }

  // ---------------------------------------------------------------- Banner
  var root = null;
  var lastFocus = null;
  var cssReady = false;
  var hidden = false;
  var fab = null;

  // Optional: kleiner runder Button zum Wiederöffnen (für Seiten ohne passenden Footer-Link)
  function showFab() {
    if (!cfg.reopenButton || fab || hidden || !document.body) return;
    ensureCss();
    fab = h('button', { type: 'button', 'class': 'fsc-fab fsc-fab-' + (cfg.reopenButton === 'right' ? 'right' : 'left'), 'aria-label': txt.settingsTitle, title: txt.settingsTitle, onclick: function () { open(); },
      html: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Zm-3.5 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-7 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/></svg>' });
    applyTheme(fab);
    document.body.appendChild(fab);
  }

  function linksRow() {
    var row = h('p', { 'class': 'fsc-links' });
    if (cfg.privacyUrl !== false) row.appendChild(h('a', { href: cfg.privacyUrl || '/datenschutz', text: txt.privacy }));
    if (cfg.imprintUrl) row.appendChild(h('a', { href: cfg.imprintUrl, text: txt.imprint }));
    return row.childNodes.length ? row : null;
  }

  function btn(label, cls, onclick) {
    return h('button', { type: 'button', 'class': 'fsc-btn ' + (cls || ''), onclick: onclick, text: label });
  }

  function mainView() {
    if (infoMode) {
      return h('div', { 'class': 'fsc-view' }, [
        h('p', { 'class': 'fsc-title', id: 'fsc-title', text: cfg.title || txt.infoTitle }),
        h('p', { 'class': 'fsc-text', text: cfg.text || txt.infoText }),
        h('div', { 'class': 'fsc-actions' }, [btn(txt.ok, 'fsc-btn-primary', function () { decide({}); })]),
        linksRow()
      ]);
    }
    var listItems = catNames.map(function (n) {
      var svc = cats[n] || [];
      return txt.listCat[n] + (svc.length ? ' (' + svc.join(', ') + ')' : '');
    });
    var text = (cfg.text || txt.text).replace('{list}', joinList(listItems));
    return h('div', { 'class': 'fsc-view' }, [
      h('p', { 'class': 'fsc-title', id: 'fsc-title', text: cfg.title || txt.title }),
      h('p', { 'class': 'fsc-text', text: text }),
      h('div', { 'class': 'fsc-actions' }, [
        btn(txt.acceptAll, 'fsc-btn-primary', function () { decide(allChoices(true)); }),
        btn(txt.necessaryOnly, 'fsc-btn-primary', function () { decide(allChoices(false)); }),
        btn(txt.settings, 'fsc-btn-ghost', function () { render('settings'); })
      ]),
      linksRow()
    ]);
  }

  function settingsView() {
    var draft = snapshot();
    var list = h('div', { 'class': 'fsc-cats' });
    ['necessary'].concat(catNames).forEach(function (n) {
      var info = txt.cat[n] || [n, ''];
      var id = 'fsc-cat-' + n;
      var control;
      if (n === 'necessary') {
        control = h('span', { 'class': 'fsc-always', text: txt.always });
      } else {
        var input = h('input', { type: 'checkbox', id: id, role: 'switch', 'class': 'fsc-switch-input', onchange: function (e) { draft[n] = e.target.checked; } });
        input.checked = !!draft[n];
        control = h('span', { 'class': 'fsc-switch' }, [input, h('span', { 'class': 'fsc-switch-ui', 'aria-hidden': 'true' })]);
      }
      var svc = n === 'necessary' ? (cats.necessary || []) : (cats[n] || []);
      list.appendChild(h('div', { 'class': 'fsc-cat' }, [
        h('div', { 'class': 'fsc-cat-head' }, [
          h('label', { 'class': 'fsc-cat-name', 'for': n === 'necessary' ? false : id, text: info[0] }),
          control
        ]),
        h('p', { 'class': 'fsc-cat-desc', text: info[1] }),
        svc.length ? h('p', { 'class': 'fsc-cat-svc', text: (n === 'necessary' ? txt.includes : txt.services) + ': ' + svc.join(', ') }) : null
      ]));
    });
    return h('div', { 'class': 'fsc-view fsc-view-settings' }, [
      h('p', { 'class': 'fsc-title', id: 'fsc-title', text: txt.settingsTitle }),
      h('p', { 'class': 'fsc-text', text: txt.settingsText }),
      list,
      h('div', { 'class': 'fsc-actions' }, [
        btn(txt.save, 'fsc-btn-primary', function () { decide(draft); }),
        btn(txt.acceptAll, 'fsc-btn-primary', function () { decide(allChoices(true)); }),
        decided ? null : btn(txt.back, 'fsc-btn-ghost', function () { render('main'); })
      ]),
      linksRow()
    ]);
  }

  function allChoices(v) { var o = {}; catNames.forEach(function (n) { o[n] = v; }); return o; }

  function render(view) {
    if (!document.body || hidden) return;
    if (!root) {
      ensureCss();
      root = h('div', { 'class': 'fsc-root fsc-pos-' + (cfg.position || 'bottom-left'), role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'fsc-title' });
      applyTheme(root);
      root.addEventListener('keydown', function (e) { if (e.key === 'Escape' && decided) close(); });
      document.body.appendChild(root);
    }
    root.innerHTML = '';
    var card = h('div', { 'class': 'fsc-card', tabindex: '-1' }, [view === 'settings' && !infoMode ? settingsView() : mainView()]);
    root.appendChild(card);
    // Reflow erzwingen, damit die Einblend-Animation läuft
    void card.offsetWidth;
    root.classList.add('fsc-open');
    return card;
  }

  function close() {
    if (!root) return;
    root.classList.remove('fsc-open');
    var r = root;
    root = null;
    setTimeout(function () { if (r.parentNode) r.parentNode.removeChild(r); }, 250);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) { /* egal */ } }
    lastFocus = null;
  }

  function decide(choices) {
    var revoked = catNames.some(function (n) { return state[n] && !choices[n]; });
    catNames.forEach(function (n) { state[n] = !!choices[n]; });
    decided = true;
    store(snapshot());
    close();
    showFab();
    // Widerruf: bereits geladene Dienste lassen sich nur durch Neuladen stoppen
    if (revoked) { window.location.reload(); return; }
    apply();
    emit('fs-consent:change', snapshot());
  }

  function open(view) {
    lastFocus = document.activeElement;
    var card = render(view || (infoMode ? 'main' : 'settings'));
    if (card) setTimeout(function () { var f = card.querySelector('input, button'); (f || card).focus(); }, 30);
  }

  // ---------------------------------------------------------------- Inhalte freischalten
  var listeners = [];

  function kindOf(el, service) {
    var k = el.getAttribute('data-kind');
    if (k) return k;
    var s = (service + ' ' + (el.getAttribute('data-src') || '')).toLowerCase();
    if (/map|karte|openstreetmap|leaflet/.test(s)) return 'map';
    if (/youtube|vimeo|video/.test(s)) return 'video';
    if (/recaptcha|captcha|\bform(ular)?\b/.test(s)) return 'form';
    return 'other';
  }

  function placeholder(el, cat, onLoad) {
    var service = el.getAttribute('data-service') || 'externen Anbietern';
    var provider = el.getAttribute('data-provider') || PROVIDERS[service.toLowerCase()] || service;
    if (lang !== 'de') provider = provider.replace(/^die /, lang === 'nl' ? 'de ' : 'the ');
    var kind = kindOf(el, service);
    var label = { map: txt.loadMap, video: txt.loadVideo, form: txt.loadForm }[kind] || txt.loadOther;
    var remember = h('input', { type: 'checkbox' });
    var ph = h('div', { 'class': 'fsc-ph fsc-ph-' + kind, 'data-fsc-ph': '' }, [
      h('div', { 'class': 'fsc-ph-inner' }, [
        h('p', { 'class': 'fsc-ph-title', text: el.getAttribute('data-title') || service }),
        h('p', { 'class': 'fsc-ph-text', html: esc(txt.phText).replace('{service}', '<strong>' + esc(service) + '</strong>').replace('{provider}', esc(provider)) + (cfg.privacyUrl === false ? '' : ' <a href="' + esc(cfg.privacyUrl || '/datenschutz') + '">' + esc(txt.privacy) + '</a>') }),
        h('button', { type: 'button', 'class': 'fsc-btn fsc-btn-primary', text: label, onclick: function () {
          if (remember.checked) FSConsent.allow(cat); else onLoad();
        } }),
        cat === 'media' ? h('label', { 'class': 'fsc-ph-remember' }, [remember, ' ' + txt.phRemember]) : null
      ])
    ]);
    applyTheme(ph);
    return ph;
  }

  function activateScript(el) {
    var s = document.createElement('script');
    for (var i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      if (a.name === 'type' || a.name === 'data-consent' || a.name === 'data-type') continue;
      s.setAttribute(a.name, a.value);
    }
    s.type = el.getAttribute('data-type') || 'text/javascript';
    if (!el.src) s.text = el.text;
    el.parentNode.replaceChild(s, el);
  }

  function activateFrame(el) {
    var ph = el.__fscPh;
    if (ph && ph.parentNode) ph.parentNode.removeChild(ph);
    el.__fscPh = null;
    el.style.display = el.__fscDisplay || '';
    if (el.tagName === 'IFRAME') {
      el.setAttribute('src', el.getAttribute('data-src'));
    } else {
      // <div data-consent-embed> → iframe hineinsetzen
      el.innerHTML = '';
      var f = h('iframe', {
        src: el.getAttribute('data-src'), title: el.getAttribute('data-title') || el.getAttribute('data-service') || '',
        loading: 'lazy', allow: el.getAttribute('data-allow') || false, allowfullscreen: el.hasAttribute('data-allowfullscreen'),
        referrerpolicy: el.getAttribute('data-referrerpolicy') || 'strict-origin-when-cross-origin'
      });
      f.className = 'fsc-frame';
      el.appendChild(f);
    }
    el.setAttribute('data-consent-loaded', '');
  }

  function blockFrame(el, cat) {
    if (el.__fscPh || el.hasAttribute('data-consent-loaded')) return;
    var load = function () { activateFrame(el); };
    var ph = placeholder(el, cat, load);
    if (el.tagName === 'IFRAME') {
      // Platzhalter übernimmt Größe & Klassen des iframes
      var cs = window.getComputedStyle(el);
      var hgt = el.getBoundingClientRect().height || parseInt(el.getAttribute('height'), 10) || 0;
      if (el.className) ph.className += ' ' + el.className;
      ph.style.minHeight = Math.max(hgt, 220) + 'px';
      ph.style.borderRadius = cs.borderRadius || '0px';
      var w = el.getAttribute('width');
      if (w && /^\d+$/.test(w)) ph.style.maxWidth = w + 'px';
      el.__fscDisplay = el.style.display;
      el.style.display = 'none';
      el.parentNode.insertBefore(ph, el);
    } else {
      el.innerHTML = '';
      el.appendChild(ph);
    }
    el.__fscPh = ph;
  }

  function scan(scope) {
    scope = scope || document;
    if (!scope.querySelectorAll) return;
    var nodes = scope.querySelectorAll('[data-consent]:not([data-consent-loaded]), [data-consent-embed]:not([data-consent-loaded])');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var cat = el.getAttribute('data-consent') || el.getAttribute('data-consent-embed');
      var ok = cat === 'necessary' || !!state[cat];
      if (el.tagName === 'SCRIPT') { if (ok && el.type === 'text/plain') activateScript(el); continue; }
      if (!el.hasAttribute('data-src')) continue;
      if (ok) activateFrame(el); else blockFrame(el, cat);
    }
  }

  function apply() {
    scan(document);
    listeners.forEach(function (fn) { try { fn(snapshot()); } catch (e) { console.error(e); } });
  }

  // ---------------------------------------------------------------- Öffentliche API
  var FSConsent = {
    version: '1.0.1',
    has: function (cat) { return cat === 'necessary' || !!state[cat]; },
    get: snapshot,
    decided: function () { return decided; },
    open: function () { open(); },
    allow: function (cat) {
      if (OPTIONAL.indexOf(cat) >= 0 && catNames.indexOf(cat) < 0) { cats[cat] = cats[cat] || []; catNames = OPTIONAL.filter(function (n) { return n in cats; }); infoMode = false; }
      var c = snapshot(); c[cat] = true; decide(c);
    },
    set: function (choices) { decide(choices || {}); },
    reset: function () {
      try { window.localStorage.removeItem(KEY); } catch (e) { /* egal */ }
      memory = null; decided = false;
      catNames.forEach(function (n) { state[n] = false; });
      render('main');
    },
    hide: function () { hidden = true; if (root) { root.parentNode && root.parentNode.removeChild(root); root = null; } if (fab) fab.style.display = 'none'; },
    show: function () { hidden = false; if (fab) fab.style.display = ''; if (!decided) render('main'); else showFab(); },
    onChange: function (fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (f) { return f !== fn; }); }; },
    scan: scan
  };
  window.FSConsent = FSConsent;

  // Links „Cookie-Einstellungen“: <a href="#cookie-einstellungen"> oder [data-consent-open]
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-consent-open], a[href="#cookie-einstellungen"], a[href="#cookies"], a[href="#cookie-settings"]') : null;
    if (!t) return;
    e.preventDefault();
    open();
  });

  // Sicherheitsnetz: blockierte Inhalte, deren Kategorie nicht konfiguriert ist, trotzdem im Banner nennen
  function registerFromDom() {
    var nodes = document.querySelectorAll('[data-consent], [data-consent-embed]');
    for (var i = 0; i < nodes.length; i++) {
      var cat = nodes[i].getAttribute('data-consent') || nodes[i].getAttribute('data-consent-embed');
      if (OPTIONAL.indexOf(cat) < 0) continue;
      if (!(cat in cats)) { cats[cat] = []; console.warn('[FSConsent] Kategorie "' + cat + '" fehlt in der Konfiguration'); }
      var svc = nodes[i].getAttribute('data-service');
      if (svc && cats[cat].indexOf(svc) < 0) cats[cat].push(svc);
    }
    catNames = OPTIONAL.filter(function (n) { return n in cats; });
    infoMode = catNames.length === 0;
    catNames.forEach(function (n) { if (!(n in state)) state[n] = !!(saved && saved.c && saved.c[n]); });
    decided = !!saved && catNames.every(function (n) { return saved.c && n in saved.c; });
  }

  function excluded() {
    var ex = cfg.exclude || [];
    for (var i = 0; i < ex.length; i++) if (window.location.pathname.indexOf(ex[i]) === 0) return true;
    return false;
  }

  function start() {
    if (excluded()) hidden = true;
    if (cfg.exclude && window.history && history.pushState) {
      // Client-Navigation (Next.js & Co.): beim Wechsel in ausgeschlossene Bereiche ausblenden
      var check = function () { var ex = excluded(); if (ex && !hidden) FSConsent.hide(); else if (!ex && hidden) FSConsent.show(); };
      ['pushState', 'replaceState'].forEach(function (m) {
        var orig = history[m];
        history[m] = function () { var r = orig.apply(this, arguments); setTimeout(check, 0); return r; };
      });
      window.addEventListener('popstate', check);
    }
    registerFromDom();
    scan(document);
    if (window.MutationObserver) {
      new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) for (var j = 0; j < muts[i].addedNodes.length; j++) {
          var n = muts[i].addedNodes[j];
          if (n.nodeType !== 1 || (root && root.contains(n)) || (n.hasAttribute && n.hasAttribute('data-fsc-ph'))) continue;
          if (n.hasAttribute('data-consent') || n.hasAttribute('data-consent-embed')) scan(n.parentNode || document);
          else scan(n);
        }
      }).observe(document.documentElement, { childList: true, subtree: true });
    }
    if (!decided && !cfg.silent) render('main'); else showFab();
    emit('fs-consent:ready', snapshot());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
