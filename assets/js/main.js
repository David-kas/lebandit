(function () {
  "use strict";

  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function lazyLoadImages() {
    var images = document.querySelectorAll("img[data-src]");
    if (!("IntersectionObserver" in window)) {
      images.forEach(function (img) {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add("loaded");
        }
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            img.classList.add("loaded");
          }
          io.unobserve(img);
        });
      },
      { rootMargin: "120px" }
    );
    images.forEach(function (img) {
      io.observe(img);
    });
  }

  lazyLoadImages();
})();
