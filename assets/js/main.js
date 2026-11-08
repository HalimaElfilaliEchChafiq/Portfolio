document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------------------------------------------------------
  // 1) Typewriter effect
  // ---------------------------------------------------------------------------
  const typewriterPhrases = [
    "Future Ingénieure IA & Data",
    "Spécialiste RAG & Agents IA",
    "Architecte de Systèmes GenAI",
    "Passionnée d'IA Industrielle",
  ];

  const typingSpeed = 80;
  const phraseDelay = 2000;
  const deletingSpeed = 45;

  const typewriterTarget = document.querySelector("[data-typewriter]");

  if (typewriterTarget) {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const runTypewriter = () => {
      const currentPhrase = typewriterPhrases[phraseIndex];

      if (!isDeleting) {
        charIndex += 1;
        typewriterTarget.textContent = currentPhrase.slice(0, charIndex);

        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          window.setTimeout(runTypewriter, phraseDelay);
          return;
        }

        window.setTimeout(runTypewriter, typingSpeed);
        return;
      }

      charIndex -= 1;
      typewriterTarget.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
        window.setTimeout(runTypewriter, 280);
        return;
      }

      window.setTimeout(runTypewriter, deletingSpeed);
    };

    runTypewriter();
  }

  // ---------------------------------------------------------------------------
  // 2) Mobile hamburger menu
  // ---------------------------------------------------------------------------
  const hamburger = document.getElementById("nav-hamburger");
  const navMenu = document.getElementById("nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", String(!isOpen));
      navMenu.classList.toggle("is-open", !isOpen);
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("is-open");
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 3) Smooth scroll for all in-page anchor links
  // ---------------------------------------------------------------------------
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const rawTarget = link.getAttribute("href");
      if (!rawTarget || rawTarget === "#") {
        return;
      }

      const targetElement = document.querySelector(rawTarget);
      if (!targetElement) {
        return;
      }

      event.preventDefault();
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // ---------------------------------------------------------------------------
  // 4) Navbar glassmorphism activation on scroll
  // ---------------------------------------------------------------------------
  const navbar = document.querySelector(".navbar");

  const updateNavbarOnScroll = () => {
    if (!navbar) {
      return;
    }

    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", updateNavbarOnScroll, { passive: true });
  updateNavbarOnScroll();

  // ---------------------------------------------------------------------------
  // 5) IntersectionObserver for fade-in + slide-up (.fade-in)
  // ---------------------------------------------------------------------------
  const fadeElements = document.querySelectorAll(".fade-in");

  if (fadeElements.length > 0) {
    fadeElements.forEach((element) => {
      // Ensure initial hidden state even if CSS class is missing in some blocks.
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = "opacity 700ms ease, transform 700ms ease";
    });

    const fadeObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    fadeElements.forEach((element) => fadeObserver.observe(element));
  }

  // ---------------------------------------------------------------------------
  // 6) Animated hero counters (0 -> target in 1500ms with easing)
  // ---------------------------------------------------------------------------
  const counters = document.querySelectorAll("[data-counter-target]");
  const counterDuration = 1500;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (counterElement) => {
    const targetValue = Number(counterElement.dataset.counterTarget || 0);
    const suffix = counterElement.dataset.counterSuffix || "";

    if (!Number.isFinite(targetValue)) {
      return;
    }

    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / counterDuration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentValue = Math.round(targetValue * easedProgress);

      counterElement.textContent = `${currentValue}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  if (counters.length > 0) {
    const countersObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => countersObserver.observe(counter));
  }

  // ---------------------------------------------------------------------------
  // 7) Hero canvas particles (50 points, 5% opacity, lines if distance < 120px)
  // ---------------------------------------------------------------------------
  const heroCanvas = document.getElementById("hero-canvas");

  if (heroCanvas) {
    const ctx = heroCanvas.getContext("2d");
    const particleCount = 50;
    const maxDistance = 120;
    const particles = [];

    const resizeCanvas = () => {
      const heroSection = heroCanvas.parentElement;
      const width = heroSection ? heroSection.clientWidth : window.innerWidth;
      const height = heroSection ? heroSection.clientHeight : 420;

      heroCanvas.width = width;
      heroCanvas.height = height;
    };

    const createParticles = () => {
      particles.length = 0;

      for (let i = 0; i < particleCount; i += 1) {
        particles.push({
          x: Math.random() * heroCanvas.width,
          y: Math.random() * heroCanvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.8 + 0.8,
        });
      }
    };

    const drawFrame = () => {
      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x <= 0 || p.x >= heroCanvas.width) {
          p.vx *= -1;
        }

        if (p.y <= 0 || p.y >= heroCanvas.height) {
          p.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(214, 197, 177, 0.08)";
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);

          if (distance < maxDistance) {
            const alpha = (1 - distance / maxDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(214, 197, 177, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      window.requestAnimationFrame(drawFrame);
    };

    resizeCanvas();
    createParticles();
    drawFrame();

    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
    });
  }

  // ---------------------------------------------------------------------------
  // 8) Email copy to clipboard + toast (2s)
  // ---------------------------------------------------------------------------
  const copyEmailTrigger = document.querySelector("[data-copy-email]");

  const showToast = (message) => {
    let toast = document.getElementById("copy-toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "copy-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      toast.style.position = "fixed";
      toast.style.right = "1rem";
      toast.style.bottom = "1rem";
      toast.style.zIndex = "1200";
      toast.style.padding = "0.65rem 0.95rem";
      toast.style.border = "1px solid rgba(203, 184, 162, 0.45)";
      toast.style.borderRadius = "0.65rem";
      toast.style.background = "rgba(33, 27, 22, 0.95)";
      toast.style.color = "#f3ece4";
      toast.style.fontSize = "0.9rem";
      toast.style.boxShadow = "0 0 20px rgba(169, 136, 106, 0.25)";
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      toast.style.transition = "opacity 200ms ease, transform 200ms ease";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
    }, 2000);
  };

  if (copyEmailTrigger) {
    copyEmailTrigger.addEventListener("click", async (event) => {
      event.preventDefault();
      const email = copyEmailTrigger.getAttribute("data-copy-email");

      if (!email) {
        return;
      }

      try {
        await navigator.clipboard.writeText(email);
        showToast("Email copié !");
      } catch (_error) {
        showToast("Impossible de copier l'email.");
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 9) Active nav link tracking with IntersectionObserver
  // ---------------------------------------------------------------------------
  const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));

  if (navLinks.length > 0) {
    const sectionMap = new Map();

    navLinks.forEach((link) => {
      const sectionId = link.getAttribute("href");
      if (!sectionId || sectionId === "#") {
        return;
      }

      const section = document.querySelector(sectionId);
      if (section) {
        sectionMap.set(section, link);
      }
    });

    const updateActiveLink = (activeLink) => {
      navLinks.forEach((link) => {
        const isActive = link === activeLink;
        link.classList.toggle("active", isActive);
        link.setAttribute("aria-current", isActive ? "page" : "false");
      });
    };

    const activeObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length === 0) {
          return;
        }

        const topEntry = visibleEntries[0];
        const activeLink = sectionMap.get(topEntry.target);

        if (activeLink) {
          updateActiveLink(activeLink);
        }
      },
      {
        root: null,
        threshold: [0.2, 0.4, 0.6],
        rootMargin: "-30% 0px -55% 0px",
      }
    );

    sectionMap.forEach((_link, section) => activeObserver.observe(section));
  }
});
