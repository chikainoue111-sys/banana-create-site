(function () {
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-site-nav]");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  var frames = document.querySelectorAll(".media-frame");
  frames.forEach(function (frame) {
    var img = frame.querySelector("img");
    if (!img) return;

    function markMissing() {
      frame.classList.add("is-missing");
    }

    img.addEventListener("error", markMissing);
    if (img.complete && img.naturalWidth === 0) {
      markMissing();
    }
  });
})();
