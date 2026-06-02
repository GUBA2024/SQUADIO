const preloader = document.getElementById("preloader");
const body = document.body;

window.addEventListener("load", () => {
  setTimeout(() => {
    if (preloader) preloader.classList.add("hide");
    body.classList.add("page-ready");
  }, 500);
});

// Mobile navigation
(() => {
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("mainNav");
  if (!menuBtn || !nav) return;

  menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuBtn.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
    });
  });
})();

// Theme toggle (dark/light)
(() => {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const storedTheme = localStorage.getItem("law_theme");
  if (storedTheme === "light") {
    body.classList.add("light");
    toggle.textContent = "🌙";
  }

  toggle.addEventListener("click", () => {
    body.classList.toggle("light");
    const isLight = body.classList.contains("light");
    toggle.textContent = isLight ? "🌙" : "☀";
    localStorage.setItem("law_theme", isLight ? "light" : "dark");
  });
})();

// Smooth scrolling with safe internal anchors
(() => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href") || "";
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();

// Reveal animations
(() => {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach((el) => observer.observe(el));
})();

// Counter animation
(() => {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  const animateCounter = (counter) => {
    const target = Number(counter.getAttribute("data-target")) || 0;
    const duration = 1500;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(target * eased).toLocaleString("ar-EG");
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
})();

// Testimonials slider
(() => {
  const slides = Array.from(document.querySelectorAll(".testimonial"));
  const prevBtn = document.getElementById("prevTestimonial");
  const nextBtn = document.getElementById("nextTestimonial");
  if (!slides.length || !prevBtn || !nextBtn) return;

  let index = 0;
  let autoTimer;

  const show = (i) => {
    slides.forEach((slide, idx) => {
      slide.classList.toggle("active", idx === i);
    });
  };

  const next = () => {
    index = (index + 1) % slides.length;
    show(index);
  };

  const prev = () => {
    index = (index - 1 + slides.length) % slides.length;
    show(index);
  };

  const startAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 4500);
  };

  nextBtn.addEventListener("click", () => {
    next();
    startAuto();
  });

  prevBtn.addEventListener("click", () => {
    prev();
    startAuto();
  });

  show(index);
  startAuto();
})();

// FAQ accordion (single open)
(() => {
  const faqs = document.querySelectorAll(".faq details");
  faqs.forEach((faq) => {
    faq.addEventListener("toggle", () => {
      if (!faq.open) return;
      faqs.forEach((other) => {
        if (other !== faq) other.open = false;
      });
    });
  });
})();

// Contact form UX
(() => {
  const form = document.getElementById("contactForm");
  const msg = document.getElementById("contactMsg");
  if (!form || !msg) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !phone || !email || !message) {
      msg.textContent = "يرجى استكمال جميع الحقول المطلوبة.";
      return;
    }

    msg.textContent = "تم استلام رسالتك بنجاح، وسيتم التواصل معك قريبًا.";
    form.reset();
  });
})();

// GSAP micro animations
(() => {
  if (typeof window.gsap === "undefined") return;
  window.gsap.from(".hero h1, .hero .subtitle, .hero .hero__cta", {
    opacity: 0,
    y: 24,
    duration: 1.1,
    stagger: 0.16,
    ease: "power3.out",
  });
})();

// Three.js justice scale scene
(() => {
  if (typeof window.THREE === "undefined") return;

  const canvas = document.getElementById("justiceCanvas");
  if (!canvas) return;

  const THREE = window.THREE;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x08132a, 12, 26);

  const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 2.2, 8.2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);

  const keyLight = new THREE.PointLight(0xf0ce86, 2.2, 22);
  keyLight.position.set(4, 5, 3);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0x3e72ff, 1.1, 18);
  fillLight.position.set(-4, 2, 3);
  scene.add(fillLight);

  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0xd8b56a,
    metalness: 0.82,
    roughness: 0.24,
  });

  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 2.6, 24), metalMaterial);
  stand.position.y = 0.7;
  scene.add(stand);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.3, 0.35, 32), metalMaterial);
  base.position.y = -0.8;
  scene.add(base);

  const arm = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.14, 0.14), metalMaterial);
  arm.position.y = 2.06;
  scene.add(arm);

  const top = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 24), metalMaterial);
  top.position.y = 2.13;
  scene.add(top);

  const createPlate = (x) => {
    const group = new THREE.Group();

    const chainGeo = new THREE.CylinderGeometry(0.02, 0.02, 1, 10);
    const chainLeft = new THREE.Mesh(chainGeo, metalMaterial);
    const chainRight = new THREE.Mesh(chainGeo, metalMaterial);
    chainLeft.position.set(-0.4, -0.5, 0);
    chainRight.position.set(0.4, -0.5, 0);

    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.08, 30), metalMaterial);
    plate.position.set(0, -1.02, 0);

    group.add(chainLeft, chainRight, plate);
    group.position.set(x, 2.0, 0);
    return group;
  };

  const leftPlate = createPlate(-1.84);
  const rightPlate = createPlate(1.84);

  scene.add(leftPlate);
  scene.add(rightPlate);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(8, 40),
    new THREE.MeshStandardMaterial({ color: 0x0c1630, metalness: 0.1, roughness: 0.9 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1;
  scene.add(floor);

  const particleCount = 120;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = Math.random() * 8 - 1;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({ color: 0xf0ce86, size: 0.06, transparent: true, opacity: 0.85 })
  );
  scene.add(particles);

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  window.addEventListener("resize", resize);

  const clock = new THREE.Clock();
  const animate = () => {
    const elapsed = clock.getElapsedTime();
    arm.rotation.z = Math.sin(elapsed * 1.1) * 0.08;
    leftPlate.position.y = 2.0 - Math.sin(elapsed * 1.1) * 0.18;
    rightPlate.position.y = 2.0 + Math.sin(elapsed * 1.1) * 0.18;

    scene.rotation.y = Math.sin(elapsed * 0.3) * 0.15;
    particles.rotation.y += 0.0009;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
})();
