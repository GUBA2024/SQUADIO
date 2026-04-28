/* ==========================================
   SQUADIO — script.js
   Mobile menu · Toast · Waitlist form
   ========================================== */

/* ── Config ──────────────────────────────
   Paste your Google Apps Script Web App URL here.
   Leave empty ("") to see a guide message instead.
   ──────────────────────────────────────── */
const WAITLIST_ENDPOINT = "";

/* ── Mobile menu toggle ───────────────── */
(function () {
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!isOpen));
    if (isOpen) {
      menu.hidden = true;
    } else {
      menu.hidden = false;
    }
  });

  // Close mobile menu when a link inside it is clicked
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      btn.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    });
  });
})();

/* ── Set current year in footer ───────── */
(function () {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
})();

/* ── Toast notification ───────────────── */
function showToast(msg, duration) {
  duration = duration || 3500;
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.hidden = true;
  }, duration);
}

/* ── Coming Soon handler ──────────────── */
function comingSoon(e) {
  if (e) e.preventDefault();
  showToast("🚀 قريبًا على المتاجر — سجل اهتمامك أدناه!");
  return false;
}

/* ── Waitlist form ────────────────────── */
(function () {
  const form = document.getElementById("waitlistForm");
  const msgEl = document.getElementById("formMsg");
  if (!form) return;

  // Local dedupe — store submitted emails in localStorage
  function isDuplicate(email) {
    try {
      var stored = JSON.parse(localStorage.getItem("squadio_waitlist") || "[]");
      return stored.indexOf(email.toLowerCase()) !== -1;
    } catch (_) {
      return false;
    }
  }

  function markSubmitted(email) {
    try {
      var stored = JSON.parse(localStorage.getItem("squadio_waitlist") || "[]");
      if (stored.indexOf(email.toLowerCase()) === -1) {
        stored.push(email.toLowerCase());
      }
      localStorage.setItem("squadio_waitlist", JSON.stringify(stored));
    } catch (_) {}
  }

  function setMsg(text, type) {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.className = "form__msg form__msg--" + type;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var emailInput = form.querySelector('input[type="email"]');
    var submitBtn = form.querySelector('button[type="submit"]');
    var email = (emailInput ? emailInput.value : "").trim();

    if (!email) {
      setMsg("⚠️ رجاءً أدخل إيميلك.", "error");
      return;
    }

    // Check for duplicate submission
    if (isDuplicate(email)) {
      setMsg("✅ أنت مسجل بالفعل! سنتواصل معك قريبًا.", "info");
      showToast("✅ أنت مسجل بالفعل!");
      return;
    }

    // If endpoint is not configured, show guide
    if (!WAITLIST_ENDPOINT || WAITLIST_ENDPOINT === "") {
      setMsg(
        "⚙️ الـ Endpoint غير مضبوط بعد — راجع README لربط Google Sheets.",
        "error"
      );
      return;
    }

    // Disable button during submission
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "جاري التسجيل...";
    }
    setMsg("", "info");

    // Submit via fetch with no-cors fallback
    fetch(WAITLIST_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, timestamp: new Date().toISOString() }),
    })
      .then(function () {
        markSubmitted(email);
        setMsg("🎉 تم التسجيل! سنتواصل معك عند الإطلاق.", "success");
        showToast("🎉 تم التسجيل بنجاح!");
        if (emailInput) emailInput.value = "";
      })
      .catch(function () {
        setMsg("❌ حدث خطأ في الاتصال. حاول مرة ثانية.", "error");
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "تسجيل";
        }
      });
  });
})();

/* ── Smooth scroll for anchor links ───── */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    var targetId = this.getAttribute("href").slice(1);
    if (!targetId) return;
    var target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
