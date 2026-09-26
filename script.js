(function () {
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-site-nav]");
  if (menuToggle && nav) {
    var mobileMq = window.matchMedia("(max-width: 799px)");

    function syncNavVisibility(isOpen) {
      if (mobileMq.matches) {
        nav.hidden = !isOpen;
      } else {
        nav.hidden = false;
      }
    }

    syncNavVisibility(false);
    var onViewportChange = function () {
      var isOpen = nav.classList.contains("open");
      syncNavVisibility(isOpen);
    };
    if (mobileMq.addEventListener) {
      mobileMq.addEventListener("change", onViewportChange);
    } else if (mobileMq.addListener) {
      mobileMq.addListener(onViewportChange);
    }

    menuToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      syncNavVisibility(isOpen);
    });
  }

  function setupFrame(frame) {
    var img = frame.querySelector("img");
    var fallback = frame.querySelector(".media-fallback");
    if (!img) return;

    function markMissing() {
      frame.classList.add("is-missing");
      if (fallback) {
        fallback.hidden = false;
      }
    }

    img.addEventListener("error", markMissing);
    if (img.complete && img.naturalWidth === 0) {
      markMissing();
    }
  }

  var frames = document.querySelectorAll(".media-frame");
  for (var i = 0; i < frames.length; i += 1) {
    setupFrame(frames[i]);
  }
})();
