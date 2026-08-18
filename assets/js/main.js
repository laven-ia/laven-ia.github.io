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
