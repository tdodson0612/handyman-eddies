/* ==========================================================
   Handyman Eddie's — Site Scripts
   ========================================================== */

// ---- Settings: change these in one place ----
const HOURLY_RATE = 90;
const BUSINESS_EMAIL = "eddie@example.com"; // contact form sends here

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- Header shadow, back-to-top & active nav link ---------- */
  const header = document.querySelector(".site-header");
  const backToTop = document.querySelector(".back-to-top");
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".main-nav a:not(.btn)");

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 10);
    backToTop.classList.toggle("show", y > 600);

    let current = "";
    sections.forEach((sec) => {
      if (y >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`)
    );
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal-on-scroll animation ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Animated number counters ---------- */
  const animateCount = (el) => {
    const target = Number(el.dataset.count);
    const duration = 1500;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

  /* ---------- Labor estimator ---------- */
  const hours = document.getElementById("hours");
  const hoursOut = document.getElementById("hours-out");
  const total = document.getElementById("estimate-total");
  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const updateEstimate = () => {
    const h = Number(hours.value);
    hoursOut.textContent = h;
    total.textContent = money.format(h * HOURLY_RATE);
  };
  hours.addEventListener("input", updateEstimate);
  updateEstimate();

  /* ---------- Portfolio filter ---------- */
  const filterButtons = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");

  filterButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.filter;
      projects.forEach((p) => {
        const show = cat === "all" || p.dataset.category === cat;
        p.classList.toggle("hidden", !show);
      });
    })
  );

  /* ---------- Reviews slider ---------- */
  const slides = document.querySelectorAll(".slide");
  const dotsWrap = document.querySelector(".slider-dots");
  let currentSlide = 0;
  let timer;

  const showSlide = (i) => {
    slides[currentSlide].classList.remove("active");
    dotsWrap.children[currentSlide].setAttribute("aria-selected", "false");
    currentSlide = (i + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
    dotsWrap.children[currentSlide].setAttribute("aria-selected", "true");
  };

  const startAuto = () => {
    clearInterval(timer);
    timer = setInterval(() => showSlide(currentSlide + 1), 6000);
  };

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Review ${i + 1}`);
    dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
    dot.addEventListener("click", () => {
      showSlide(i);
      startAuto();
    });
    dotsWrap.appendChild(dot);
  });
  startAuto();

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById("contact-form");
  const status = form.querySelector(".form-status");

  const rules = {
    name: (v) => v.trim().length >= 2 || "Please enter your name.",
    phone: (v) => v.replace(/\D/g, "").length >= 10 || "Please enter a valid phone number.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Please enter a valid email.",
    message: (v) => v.trim().length >= 10 || "Please tell us a bit more (10+ characters).",
  };

  const validateField = (input) => {
    const rule = rules[input.name];
    if (!rule) return true;
    const result = rule(input.value);
    const field = input.closest(".field");
    const errorEl = field.querySelector(".error");
    if (result === true) {
      field.classList.remove("invalid");
      errorEl.textContent = "";
      return true;
    }
    field.classList.add("invalid");
    errorEl.textContent = result;
    return false;
  };

  Object.keys(rules).forEach((name) => {
    form.elements[name].addEventListener("blur", (e) => validateField(e.target));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const allValid = Object.keys(rules)
      .map((name) => validateField(form.elements[name]))
      .every(Boolean);

    if (!allValid) {
      status.style.color = "#c0392b";
      status.textContent = "Please fix the highlighted fields.";
      return;
    }

    // No server needed: opens the visitor's email app with the details filled in.
    const d = Object.fromEntries(new FormData(form));
    const subject = `Estimate request: ${d.service}`;
    const body =
      `Name: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email}\n` +
      `Service: ${d.service}\n\nProject details:\n${d.message}`;
    window.location.href =
      `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    status.style.color = "#2e7d32";
    status.textContent = "Thanks! Your email app should open so you can send the request.";
    form.reset();
  });
});
