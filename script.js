const revealTargets = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: '0px 0px -5% 0px' }
  );

  revealTargets.forEach((element) => observer.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
}

if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.tilt').forEach((card) => {
    const applyTilt = (rotateX, rotateY) => {
      card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    };

    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width;
      const relativeY = (event.clientY - rect.top) / rect.height;
      const rotateY = (relativeX - 0.5) * 10;
      const rotateX = (0.5 - relativeY) * 8;

      applyTilt(rotateX, rotateY);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });

    card.addEventListener('focus', () => {
      applyTilt(2, -2);
    });

    card.addEventListener('blur', () => {
      card.style.transform = '';
    });
  });
}
