(function () {
  "use strict";

  var topbar = document.getElementById("topbar");
  var progress = document.getElementById("progress");
  var links = Array.prototype.slice.call(document.querySelectorAll(".remote a[href^='#']"));
  var sections = links
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var scrolled = window.scrollY || document.documentElement.scrollTop;
    if (progress) progress.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + "%";
    if (topbar) topbar.classList.toggle("is-stuck", scrolled > 4);
  }

  function setActive(id) {
    links.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
    });
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -58% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();
