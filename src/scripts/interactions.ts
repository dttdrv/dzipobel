// ─── Module A: Scroll Reveal ───────────────────────────────────────
// Staggered fade-in with blur, Apple-style entrance
function setupScrollReveal(): void {
  const elements = document.querySelectorAll<HTMLElement>(".reveal");
  if (elements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  for (const el of elements) {
    observer.observe(el);
  }
}

// ─── Module B: Card Tilt (Liquid Glass) ───────────────────────────
// Smooth perspective tilt with spring-like interpolation
function setupCardTilt(): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const cards = document.querySelectorAll<HTMLElement>(".card-item");
  const state = new WeakMap<
    HTMLElement,
    { targetX: number; targetY: number; currentX: number; currentY: number; raf: number }
  >();

  for (const card of cards) {
    state.set(card, { targetX: 0, targetY: 0, currentX: 0, currentY: 0, raf: 0 });

    card.addEventListener("mousemove", (e: MouseEvent) => {
      const s = state.get(card);
      if (!s) return;
      const rect = card.getBoundingClientRect();
      const offsetX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const offsetY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      s.targetX = -offsetY * 3;
      s.targetY = offsetX * 3;

      if (!s.raf) {
        const animate = () => {
          // Spring-like lerp factor
          s.currentX += (s.targetX - s.currentX) * 0.12;
          s.currentY += (s.targetY - s.currentY) * 0.12;

          card.style.transform = `perspective(800px) rotateX(${s.currentX}deg) rotateY(${s.currentY}deg) scale3d(1.01, 1.01, 1.01)`;

          if (
            Math.abs(s.targetX - s.currentX) > 0.01 ||
            Math.abs(s.targetY - s.currentY) > 0.01
          ) {
            s.raf = requestAnimationFrame(animate);
          } else {
            s.raf = 0;
          }
        };
        s.raf = requestAnimationFrame(animate);
      }
    });

    card.addEventListener("mouseleave", () => {
      const s = state.get(card);
      if (!s) return;
      s.targetX = 0;
      s.targetY = 0;

      // Smooth spring-back animation
      const springBack = () => {
        s.currentX += (0 - s.currentX) * 0.08;
        s.currentY += (0 - s.currentY) * 0.08;

        if (Math.abs(s.currentX) > 0.01 || Math.abs(s.currentY) > 0.01) {
          card.style.transform = `perspective(800px) rotateX(${s.currentX}deg) rotateY(${s.currentY}deg)`;
          s.raf = requestAnimationFrame(springBack);
        } else {
          card.style.transform = "";
          s.raf = 0;
        }
      };
      if (s.raf) cancelAnimationFrame(s.raf);
      s.raf = requestAnimationFrame(springBack);
    });
  }
}

// ─── Module C: Grammar Card Tilt ──────────────────────────────────
function setupGrammarCardTilt(): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const cards = document.querySelectorAll<HTMLElement>(".grammar-card");
  for (const card of cards) {
    card.addEventListener("mouseenter", () => {
      card.style.transition =
        "transform 600ms cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 500ms ease, background 350ms ease";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transition =
        "transform 600ms cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 500ms ease, background 350ms ease";
    });
  }
}

// ─── Module D: Search Expansion ───────────────────────────────────
function setupSearchToggle(): void {
  const toggle = document.querySelector<HTMLButtonElement>(
    "[data-search-toggle]",
  );
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    if (window.location.pathname !== "/") {
      window.location.href = "/?search=1";
      return;
    }

    const nav = document.getElementById("site-nav");
    if (!nav) return;

    const originalHTML = nav.innerHTML;
    const hadNavClass = nav.classList.contains("nav");

    nav.classList.remove("nav");
    nav.classList.add("nav-expanded");

    nav.innerHTML = `
      <a href="/" class="nav-brand" aria-label="ДЗИ библиотека">ДЗИ по БЕЛ</a>
      <input type="text" placeholder="Търсене…" aria-label="Търсене" />
      <button class="nav-close" aria-label="Затвори">✕</button>
    `;

    const input = nav.querySelector<HTMLInputElement>("input");
    const closeBtn = nav.querySelector<HTMLButtonElement>(".nav-close");

    if (input) {
      input.focus();
      input.addEventListener("input", () => {
        document.dispatchEvent(
          new CustomEvent("search-input", { detail: input.value }),
        );
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        nav.classList.remove("nav-expanded");
        if (hadNavClass) nav.classList.add("nav");
        nav.innerHTML = originalHTML;

        document.dispatchEvent(
          new CustomEvent("search-input", { detail: "" }),
        );

        setupSearchToggle();
      });
    }
  });
}

// ─── Init ──────────────────────────────────────────────────────────
function init(): void {
  const marker = document.documentElement;
  if (marker.dataset.interactionsInit) return;
  marker.dataset.interactionsInit = "1";

  // Mark nav as loaded after first animation completes — prevents
  // the entrance animation from replaying on Astro page transitions
  const nav = document.getElementById("site-nav");
  if (nav && !marker.dataset.navLoaded) {
    nav.addEventListener(
      "animationend",
      () => {
        marker.dataset.navLoaded = "1";
      },
      { once: true },
    );
  }

  setupScrollReveal();
  setupCardTilt();
  setupGrammarCardTilt();
  setupSearchToggle();
}

document.addEventListener("DOMContentLoaded", init);
document.addEventListener("astro:page-load", () => {
  delete document.documentElement.dataset.interactionsInit;
  init();
});
