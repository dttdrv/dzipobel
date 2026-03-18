// ─── Module A: Scroll Reveal ───────────────────────────────────────
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
    { threshold: 0.1 },
  );

  for (const el of elements) {
    observer.observe(el);
  }
}

// ─── Module B: 3D Card Tilt ────────────────────────────────────────
function setupCardTilt(): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const cards = document.querySelectorAll<HTMLElement>(".card-item");

  for (const card of cards) {
    card.addEventListener("mousemove", (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = (e.clientX - centerX) / (rect.width / 2);
      const offsetY = (e.clientY - centerY) / (rect.height / 2);

      const rotateY = offsetX * 4;
      const rotateX = -offsetY * 4;

      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform 0.3s ease";
      card.style.transform = "none";
      // Remove the transition after it completes so it doesn't interfere with mousemove
      card.addEventListener(
        "transitionend",
        () => {
          card.style.transition = "";
        },
        { once: true },
      );
    });
  }
}

// ─── Module C: Search Expansion ────────────────────────────────────
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

    // Save original content so we can restore it
    const originalHTML = nav.innerHTML;
    const hadNavClass = nav.classList.contains("nav");

    // Replace nav content with expanded search form
    nav.classList.remove("nav");
    nav.classList.add("nav-expanded");

    nav.innerHTML = `
      <a href="/" class="nav-brand" aria-label="ДЗИ библиотека">дзі</a>
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

        // Re-attach the search toggle listener to the restored button
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

  setupScrollReveal();
  setupCardTilt();
  setupSearchToggle();
}

document.addEventListener("DOMContentLoaded", init);
document.addEventListener("astro:page-load", () => {
  // Reset the guard so interactions re-bind after a page transition
  delete document.documentElement.dataset.interactionsInit;
  init();
});
