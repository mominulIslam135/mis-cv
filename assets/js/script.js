(() => {
  "use strict";

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
  } else if (prefersLight) {
    root.setAttribute("data-theme", "light");
  }
  themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 12);
    backToTop.classList.toggle("show", window.scrollY > 500);
  };
  document.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    hamburger.classList.toggle("active");
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => navLinks.classList.remove("open"))
  );

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navMap = new Map();
  document.querySelectorAll(".nav-link").forEach((link) => navMap.set(link.dataset.section, link));

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navMap.forEach((link) => link.classList.remove("active"));
          const link = navMap.get(entry.target.id);
          if (link) link.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => navObserver.observe(s));

  /* ---------- Reveal on scroll (AOS-lite) ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.aosDelay || 0;
          setTimeout(() => el.classList.add("aos-in"), Number(delay));
          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll("[data-aos]").forEach((el) => revealObserver.observe(el));

  /* ---------- Typed rotating role text ---------- */
  const typedEl = document.getElementById("typed");
  const roles = [
    "Senior Application Engineer",
    "AMI · HES · Oracle MDM Specialist",
    "Full-Stack Web Developer",
    "Cross-Platform Mobile Engineer",
  ];
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 65);
  }
  typeLoop();

  /* ---------- Animated stat counters ---------- */
  const statEls = document.querySelectorAll(".stat-num");
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        statObserver.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  statEls.forEach((el) => statObserver.observe(el));

  /* ---------- Project card tilt effect ---------- */
  const tiltCards = document.querySelectorAll(".tilt");
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* ---------- Copy email to clipboard ---------- */
  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }
  document.querySelectorAll(".copy-email").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const email = "mominul.cse1677@gmail.com";
      navigator.clipboard?.writeText(email).then(
        () => showToast("Email copied — " + email),
        () => (window.location.href = "mailto:" + email)
      );
    });
  });

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById("backToTop");
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
