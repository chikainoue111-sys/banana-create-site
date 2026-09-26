(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector("[data-theme-toggle]");
  const themeLabel = document.querySelector("[data-theme-label]");
  const menuButton = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  const progress = document.querySelector(".scroll-progress");
  const backToTop = document.querySelector("[data-back-to-top]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // 保存領域が使えないブラウザ・設定でも、ページ自体は動作させる。
  try {
    if (localStorage.getItem("banana-theme") === "light") {
      root.dataset.theme = "light";
    }
  } catch (_) {}

  function syncThemeButton() {
    const isLight = root.dataset.theme === "light";
    themeButton.setAttribute("aria-pressed", String(isLight));
    themeButton.setAttribute(
      "aria-label",
      isLight ? "ダークに切り替え" : "ライトに切り替え"
    );
    themeLabel.textContent = isLight ? "ダークに切り替え" : "ライトに切り替え";
  }

  syncThemeButton();
  themeButton.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    syncThemeButton();
    try {
      localStorage.setItem("banana-theme", next);
    } catch (_) {}
  });

  // JSが動いてからモバイル用ナビを折りたたむ。
  root.classList.add("js");

  function closeMenu() {
    menuButton.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  }

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", closeMenu);

  function updateScrollUI() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    progress.style.transform = `scaleX(${ratio})`;
    backToTop.classList.toggle("is-visible", window.scrollY > 450);
  }

  let scrollScheduled = false;
  window.addEventListener("scroll", () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      updateScrollUI();
      scrollScheduled = false;
    });
  }, { passive: true });
  window.addEventListener("resize", updateScrollUI);
  updateScrollUI();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "instant" : "smooth" });
  });

  // 画面に入った要素だけ表示。一度表示した要素は戻っても隠さない。
  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px 40px 0px" });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // マウス位置に応じてゲームカードの光を移動。
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion.matches) {
    document.querySelectorAll(".game-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${event.clientX - bounds.left}px`);
        card.style.setProperty("--mouse-y", `${event.clientY - bounds.top}px`);
      });
    });
  }

  // 画像がまだない場合は、空白ではなく作品名を表示。
  document.querySelectorAll(".media-frame img").forEach((img) => {
    const showFallback = () => {
      img.hidden = true;
      const caption = img.parentElement.querySelector(".media-fallback");
      if (caption) caption.hidden = false;
    };
    img.addEventListener("error", showFallback, { once: true });
    if (img.complete && img.naturalWidth === 0) showFallback();
  });
    // Privacyページ：現在表示している項目を目次に反映
  const legalSections = document.querySelectorAll(
    ".legal-section[id], .legal-contact[id]"
  );
  const legalTocLinks = document.querySelectorAll(".legal-toc a");

  if (
    legalSections.length > 0 &&
    legalTocLinks.length > 0 &&
    "IntersectionObserver" in window
  ) {
    const legalSectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length === 0) return;

        const currentId = visibleSections[0].target.id;

        legalTocLinks.forEach((link) => {
          const isCurrent =
            link.getAttribute("href") === `#${currentId}`;

          link.classList.toggle("is-active", isCurrent);

          if (isCurrent) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.5]
      }
    );

    legalSections.forEach((section) => {
      legalSectionObserver.observe(section);
    });
  }
})();