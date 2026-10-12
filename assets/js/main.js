(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- Theme ---------- */
  var STORAGE_KEY = 'resume-theme';
  var stored = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    /* private mode */
  }

  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  root.setAttribute('data-theme', stored || (prefersDark.matches ? 'dark' : 'light'));

  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* ignore */
      }
    });
  }

  prefersDark.addEventListener('change', function (e) {
    var hasChoice = false;
    try {
      hasChoice = !!localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      /* ignore */
    }
    if (!hasChoice) root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  });

  /* ---------- Stack logos ---------- */
  var DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';
  var SIMPLE = 'https://cdn.simpleicons.org/';
  var stackIcons = {
    react: { src: DEVICON + 'react/react-original.svg', alt: 'React' },
    typescript: { src: DEVICON + 'typescript/typescript-original.svg', alt: 'TypeScript' },
    javascript: { src: DEVICON + 'javascript/javascript-original.svg', alt: 'JavaScript' },
    vite: { src: DEVICON + 'vitejs/vitejs-original.svg', alt: 'Vite' },
    nextjs: { src: DEVICON + 'nextjs/nextjs-original.svg', alt: 'Next.js', invert: true },
    svelte: { src: DEVICON + 'svelte/svelte-original.svg', alt: 'Svelte' },
    pyqt: { src: DEVICON + 'qt/qt-original.svg', alt: 'Qt' },
    nicegui: { src: DEVICON + 'python/python-original.svg', alt: 'NiceGUI' },
    tanstack: { src: SIMPLE + 'reactquery/FF4154', alt: 'TanStack Query' },
    redux: { src: DEVICON + 'redux/redux-original.svg', alt: 'Redux' },
    context: { src: DEVICON + 'react/react-original.svg', alt: 'React Context API' },
    rest: { src: SIMPLE + 'openapiinitiative/6BA539', alt: 'REST API' },
    websocket: { mark: 'WS' },
    canvas: { src: DEVICON + 'html5/html5-original.svg', alt: 'Canvas API' },
    echarts: { src: SIMPLE + 'apacheecharts/AA344D', alt: 'Apache ECharts' },
    threejs: { src: DEVICON + 'threejs/threejs-original.svg', alt: 'Three.js', invert: true },
    unity: { src: DEVICON + 'unity/unity-original.svg', alt: 'Unity', invert: true },
    rtsp: { mark: 'RT' },
    hls: { mark: 'HL' },
    mediamtx: { mark: 'MTX' },
    ffmpeg: { src: SIMPLE + 'ffmpeg/007808', alt: 'FFmpeg' },
    electron: { src: DEVICON + 'electron/electron-original.svg', alt: 'Electron' },
    pyinstaller: { src: DEVICON + 'python/python-original.svg', alt: 'PyInstaller' },
    fastapi: { src: DEVICON + 'fastapi/fastapi-original.svg', alt: 'FastAPI' },
    python: { src: DEVICON + 'python/python-original.svg', alt: 'Python' },
    qgis: { src: DEVICON + 'qgis/qgis-original.svg', alt: 'QGIS' },
    gltf: { src: SIMPLE + 'khronosgroup/CC3333', alt: 'glTF' },
    git: { src: DEVICON + 'git/git-original.svg', alt: 'Git' },
    jira: { src: DEVICON + 'jira/jira-original.svg', alt: 'Jira' },
    figma: { src: DEVICON + 'figma/figma-original.svg', alt: 'Figma' },
    recharts: { mark: 'RC' },
    csharp: { src: DEVICON + 'csharp/csharp-original.svg', alt: 'C#' },
    ndjson: { src: DEVICON + 'json/json-original.svg', alt: 'NDJSON' }
  };

  Array.prototype.forEach.call(document.querySelectorAll('.chips li[data-stack]'), function (chip) {
    if (chip.querySelector('.stack-logo, .stack-mark')) return;

    var icon = stackIcons[chip.getAttribute('data-stack')];
    if (!icon) return;

    if (icon.src) {
      var img = document.createElement('img');
      img.className = 'stack-logo' + (icon.invert ? ' stack-logo--invert' : '');
      img.src = icon.src;
      img.alt = icon.alt || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      chip.insertBefore(img, chip.firstChild);
      return;
    }

    var mark = document.createElement('span');
    mark.className = 'stack-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = icon.mark;
    chip.insertBefore(mark, chip.firstChild);
  });

  /* ---------- Scroll progress + stuck topbar ---------- */
  var topbar = document.getElementById('topbar');
  var progress = document.getElementById('progress');
  var ticking = false;

  function onScroll() {
    var scrolled = window.scrollY;
    var height = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + '%';
    if (topbar) topbar.classList.toggle('is-stuck', scrolled > 8);
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var targets = document.querySelectorAll(
    '.section__title, .about p, .skill-card, .project, .timeline-group, .etc-card, .metric, .summary-card, .detail-card, .process-card'
  );

  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(targets, function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );

    Array.prototype.forEach.call(targets, function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 6) * 45 + 'ms';
      revealObserver.observe(el);
    });
  }

  /* ---------- Nav scroll-spy ---------- */
  var links = Array.prototype.slice
    .call(document.querySelectorAll('.topbar__nav a[href^="#"], .page-remote a[href^="#"]'));
  var sections = links
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach(function (section) {
      spy.observe(section);
    });
  }
})();
