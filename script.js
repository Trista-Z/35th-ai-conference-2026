const I18N = {
  common: {
    en: { navHome: "Home", navProgram: "Program", navSpeakers: "Speakers", navRegistration: "Registration", brandSmall: "HKUST 35th Anniversary", brandStrong: "Human-Machine Symbiosis 2026" },
    zh: { navHome: "首页", navProgram: "议程", navSpeakers: "嘉宾", navRegistration: "报名", brandSmall: "香港科技大学35周年", brandStrong: "人机共生时代 2026" }
  },
  home: {
    en: { heroTitle: "Human-Machine Symbiosis:\nIgniting Responsible AI Futures", heroDesc: "A flagship HKUST 35th Anniversary initiative co-organized with Tsinghua University and the National University of Singapore.", bannerStatic: "Official Banner: Human-Machine Symbiosis · Global Conference on Generative AI Governance · December 4-6, 2026 · HKUST", ctaReg: "Register Now", ctaProgram: "View Program" },
    zh: { heroTitle: "人机共生时代：共塑可信、包容与前瞻的AI治理未来", heroDesc: "港科大35周年重点项目，由港科大、清华大学与新加坡国立大学联合主办。", bannerStatic: "大会横幅：人机共生时代 · 全球生成式AI治理大会 · 2026年12月4-6日 · 香港科技大学", ctaReg: "立即报名", ctaProgram: "查看议程" }
  },
  program: {
    en: { title: "A Three-Track Agenda for Global AI Governance", desc: "The conference combines keynotes, thematic sessions, and policy dialogues.", p1: "Track A: Technical Safety", p2: "Track B: Governance Architecture", p3: "Track C: Education & Society" },
    zh: { title: "三大核心议题，连接技术、政策与教育", desc: "大会由主旨演讲、专题论坛与政策研讨构成。", p1: "支柱一：技术安全", p2: "支柱二：治理框架", p3: "支柱三：人文教育" }
  },
  speakers: {
    en: { title: "Cross-Disciplinary Leadership, Global Influence", desc: "Speaker photos are placeholders for now.", ph: "Photo Placeholder" },
    zh: { title: "跨学科、国际化的治理与技术领军者", desc: "嘉宾头像暂用灰色占位图，后续可替换官方照片。", ph: "头像占位" }
  },
  registration: {
    en: { title: "Secure Your Participation", desc: "Submit via Formspree or your own API endpoint.", submit: "Submit Registration" },
    zh: { title: "提交参会报名", desc: "支持 Formspree 和自建 API 投递。", submit: "提交报名" }
  }
};

function currentLang() {
  return localStorage.getItem("site_lang") || "en";
}

function setLang(lang) {
  localStorage.setItem("site_lang", lang);
  applyI18n();
}

function applyI18n() {
  const lang = currentLang();
  const page = document.body.dataset.page || "home";
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  const title = lang === "zh" ? document.body.dataset.titleZh : document.body.dataset.titleEn;
  if (title) document.title = title;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const [scope, token] = key.split(".");
    const text = I18N[scope]?.[lang]?.[token];
    if (text) {
      // Preserve explicit line breaks in localized copy.
      if (text.includes("\n")) {
        el.innerHTML = text.replace(/\n/g, "<br>");
      } else {
        el.textContent = text;
      }
    }
  });
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
  const pageTitle = document.querySelector("[data-page-title]");
  if (pageTitle) {
    const text = I18N[page]?.[lang]?.title;
    if (text) pageTitle.textContent = text;
  }
  document.querySelectorAll("[data-en][data-zh]").forEach((el) => {
    const content = lang === "zh" ? el.dataset.zh : el.dataset.en;
    if (content) el.textContent = content;
  });
  document.querySelectorAll("[data-ph-en][data-ph-zh]").forEach((el) => {
    el.placeholder = lang === "zh" ? el.dataset.phZh : el.dataset.phEn;
  });
}

function bindLangToggle() {
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (btn.tagName === "A") e.preventDefault();
      setLang(btn.dataset.lang);
    });
  });
}

async function submitRegistration(event) {
  event.preventDefault();
  const form = event.target;
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const mode = document.querySelector('input[name="submit_mode"]:checked')?.value;
  const formspreeEndpoint = form.dataset.formspree;
  const apiEndpoint = form.dataset.api;
  const payload = Object.fromEntries(new FormData(form).entries());

  status.className = "status";
  status.textContent = "Submitting...";
  submitBtn.disabled = true;

  try {
    const endpoint = mode === "api" ? apiEndpoint : formspreeEndpoint;
    if (!endpoint) {
      throw new Error("Submission endpoint is not configured.");
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("Submission failed. Please verify endpoint settings.");
    }

    form.reset();
    status.className = "status ok";
    status.textContent = currentLang() === "zh" ? "提交成功，确认邮件将稍后发送。" : "Registration submitted successfully. A confirmation email will follow shortly.";
  } catch (err) {
    status.className = "status err";
    status.textContent = err.message || (currentLang() === "zh" ? "提交失败，请稍后重试。" : "Submission failed. Please try again.");
  } finally {
    submitBtn.disabled = false;
  }
}

function bindRegistrationForm() {
  const form = document.getElementById("registration-form");
  if (!form) return;
  form.addEventListener("submit", submitRegistration);
}

function startBannerCarousel() {
  const tracks = Array.from(document.querySelectorAll(".banner-track"));
  if (tracks.length < 2) return;
  let i = 0;
  setInterval(() => {
    tracks[i].classList.remove("active");
    i = (i + 1) % tracks.length;
    tracks[i].classList.add("active");
  }, 3500);
}

function highlightActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".navlinks a:not([data-lang])");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");

    if (currentPath.endsWith(href) || (currentPath === "/" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function bindMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".navlinks");
  if (!toggle || !nav) return;

  const syncNavState = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
  };

  syncNavState(false);

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    syncNavState(!isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      syncNavState(false);
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      syncNavState(false);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindLangToggle();
  applyI18n();
  bindRegistrationForm();
  startBannerCarousel();
  highlightActiveNav();
  bindMobileNav();
});
