/* ─── REFS ─────────────────────────────────────────────── */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const body = document.body;
const loader = document.getElementById("loader");
const loaderPercent = document.getElementById("loader-percent");
const bigtexts = document.querySelectorAll(".bigtext");
const revealItems = document.querySelectorAll(".parallax-image, .hero-scene, .toolkit-visual-card, .scatter-item");
const heroCanvas = document.getElementById("hero-flow");
const planetOrbits = document.querySelectorAll(".planet-orbit");
const planets = document.querySelectorAll(".planet");
const metricValues = document.querySelectorAll(".metric-value[data-count]");

body.classList.add("is-locked");

const EASE = "cubicBezier(0.62, 0.05, 0.01, 0.99)";

/* ─── SCROLL-DRIVEN IN-VIEW REGISTRY ───────────────────── *
 * IntersectionObserver is unreliable in some embedded/headless
 * renderers, so we drive reveals from scroll position directly.   */

const inViewTargets = [];

function registerInView(el, onEnter, ratio) {
  if (!el) return;
  inViewTargets.push({ el, onEnter, done: false, ratio: ratio == null ? 0.85 : ratio });
}

function checkInView() {
  const vh = window.innerHeight || document.documentElement.clientHeight;
  for (const t of inViewTargets) {
    if (t.done) continue;
    const r = t.el.getBoundingClientRect();
    if (r.bottom > 0 && r.top < vh * t.ratio) {
      t.done = true;
      try { t.onEnter(); } catch (e) { /* keep scanning */ }
    }
  }
}

/* ─── BIGTEXT SPLIT ────────────────────────────────────── */

function splitBigText() {
  bigtexts.forEach((line) => {
    const text = line.dataset.text || line.textContent || "";
    line.innerHTML = "";
    [...text].forEach((character) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = character === " " ? " " : character;
      span.style.minWidth = character === " " ? "0.32em" : "";
      line.appendChild(span);
    });
  });
}

function revealChars(scope, startDelay) {
  const chars = scope.querySelectorAll(".char");
  if (!chars.length) return;
  if (prefersReducedMotion || typeof anime === "undefined") {
    chars.forEach((ch) => { ch.style.transform = "translate3d(0,0,0)"; ch.style.opacity = 1; });
    return;
  }
  anime({
    targets: chars,
    translateY: ["110%", "0%"],
    opacity: [0, 1],
    delay: anime.stagger(24, { start: startDelay || 0 }),
    duration: 1100,
    easing: EASE
  });
}

/* ─── INTRO (after loader) ─────────────────────────────── */

function animateIntro() {
  const heroHead = document.querySelector(".hero-head");
  const heroName = document.querySelector(".hero-name");
  if (heroHead) revealChars(heroHead, 60);
  if (heroName) revealChars(heroName, 340);
  document.querySelectorAll(".hero .bigtext").forEach((el) => (el.dataset.played = "1"));

  // Reveal the hero scene immediately (it's above the fold).
  const heroScene = document.querySelector(".hero-scene");
  if (heroScene) heroScene.classList.add("is-revealed");

  startProjectAnimations();
  checkInView();
}

/* ─── REVEAL REGISTRATION ──────────────────────────────── */

function initReveals() {
  if (prefersReducedMotion) {
    revealItems.forEach((el) => el.classList.add("is-revealed"));
    document.querySelectorAll(".bigtext .char").forEach((ch) => {
      ch.style.transform = "translate3d(0,0,0)"; ch.style.opacity = 1;
    });
    return;
  }

  revealItems.forEach((el) => {
    registerInView(el, () => el.classList.add("is-revealed"), 0.88);
  });

  // Non-hero BigText reveals on scroll.
  bigtexts.forEach((el) => {
    if (el.closest(".hero")) return;
    registerInView(el, () => {
      if (el.dataset.played === "1") return;
      el.dataset.played = "1";
      revealChars(el, 0);
    }, 0.82);
  });

  // Metric counters.
  metricValues.forEach((el) => registerInView(el, () => animateCounter(el), 0.7));
}

/* ─── LOADER (percent counter + wipe) ──────────────────── */

function finishLoader() {
  if (!loader || loader.dataset.done === "1") return;
  loader.dataset.done = "1";
  if (loaderPercent) loaderPercent.textContent = 100;
  loader.classList.add("is-wipeout");
  body.classList.remove("is-locked");
  animateIntro();
  setTimeout(() => loader.classList.add("is-hidden"), 1250);
}

function initLoader() {
  if (prefersReducedMotion || !loader) {
    if (loader) loader.classList.add("is-hidden");
    body.classList.remove("is-locked");
    document.querySelectorAll(".bigtext .char").forEach((ch) => {
      ch.style.transform = "translate3d(0,0,0)"; ch.style.opacity = 1;
    });
    const heroScene = document.querySelector(".hero-scene");
    if (heroScene) heroScene.classList.add("is-revealed");
    startProjectAnimations();
    checkInView();
    return;
  }

  const start = performance.now();
  const duration = 1700;

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 2.2);
    if (loaderPercent) loaderPercent.textContent = Math.floor(eased * 100);
    if (t < 1) requestAnimationFrame(tick);
    else setTimeout(finishLoader, 200);
  }
  requestAnimationFrame(tick);
  setTimeout(finishLoader, duration + 1600); // hard fallback
}

/* ─── PROJECT VISUAL LOOPS ─────────────────────────────── */

function startProjectAnimations() {
  if (prefersReducedMotion || typeof anime === "undefined") return;
  if (startProjectAnimations.started) return;
  startProjectAnimations.started = true;

  if (planetOrbits.length) {
    anime({ targets: planetOrbits, rotate: (_, i) => [i * 60, i * 60 + 360], easing: "linear", duration: 18000, loop: true, delay: anime.stagger(600) });
  }
  if (planets.length) {
    anime({ targets: planets, scale: [0.85, 1.15], direction: "alternate", easing: "easeInOutSine", duration: 2000, delay: anime.stagger(150), loop: true });
  }
}

/* ─── METRIC COUNTERS ──────────────────────────────────── */

function formatCount(el) {
  const raw = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const suffix = el.dataset.suffix || "";
  if (raw >= 1000000) return Math.floor(raw / 1000000) + "M" + suffix;
  if (raw >= 1000) return Math.floor(raw / 1000) + "K" + suffix;
  return raw.toFixed(decimals) + suffix;
}

function animateCounter(el) {
  if (prefersReducedMotion || typeof anime === "undefined") { el.textContent = formatCount(el); return; }
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const suffix = el.dataset.suffix || "";
  const counter = { value: 0 };
  anime({
    targets: counter,
    value: target,
    round: decimals > 0 ? Math.pow(10, decimals) : 1,
    easing: "easeOutExpo",
    duration: 2000,
    update: () => {
      const v = counter.value;
      if (v >= 1000000) el.textContent = Math.floor(v / 1000000) + "M" + suffix;
      else if (v >= 1000) el.textContent = Math.floor(v / 1000) + "K" + suffix;
      else el.textContent = v.toFixed(decimals) + suffix;
    }
  });
}

/* ─── CANVAS SIZING (robust against CSS transforms) ────── */

function fitCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = canvas.clientWidth;
  let h = canvas.clientHeight;
  if (w < 2 || h < 2) {
    const p = canvas.parentElement;
    if (p) { w = w < 2 ? p.clientWidth : w; h = h < 2 ? p.clientHeight : h; }
  }
  w = Math.max(w, 1); h = Math.max(h, 1);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w, h, ctx };
}

/* ─── HERO FLOW FIELD ──────────────────────────────────── */

function initFlowField(canvas) {
  if (!canvas) return;
  let ctx = canvas.getContext("2d");
  const pointer = { x: 0.5, y: 0.5, active: false };
  let width = 1, height = 1, frame = 0;

  function size() {
    const r = fitCanvas(canvas);
    width = r.w; height = r.h; ctx = r.ctx;
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(24, 24, 22, 0.32)";
    const columns = Math.max(Math.floor(width / 22), 18);
    const rows = Math.max(Math.floor(height / 24), 12);
    const px = pointer.x * width, py = pointer.y * height;

    for (let xi = 0; xi <= columns; xi += 1) {
      const baseX = (xi / columns) * width;
      ctx.beginPath();
      for (let yi = 0; yi <= rows; yi += 1) {
        const y = (yi / rows) * height;
        const dx = baseX - px, dy = y - py;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = pointer.active ? Math.max(0, 1 - dist / 240) * 28 : 0;
        const wave = Math.sin(y * 0.018 + time * 0.0012 + xi * 0.32) * 12;
        const waveB = Math.cos(y * 0.012 - time * 0.001 + xi * 0.18) * 8;
        const bend = force * Math.cos(dy * 0.03);
        const x = baseX + wave + waveB + bend;
        if (yi === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    frame = requestAnimationFrame(draw);
  }

  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = (e.clientX - r.left) / r.width;
    pointer.y = (e.clientY - r.top) / r.height;
    pointer.active = true;
  });
  canvas.addEventListener("pointerleave", () => { pointer.active = false; });

  size();
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(() => size()).observe(canvas);
  window.addEventListener("resize", size);
  frame = requestAnimationFrame(draw);
}

/* ─── MC 2D (stochastic paths) ─────────────────────────── */

function initMC2D() {
  const canvas = document.getElementById("mc-2d-canvas");
  if (!canvas || prefersReducedMotion) return;
  let ctx = canvas.getContext("2d");
  const NUM_PATHS = 80, STEPS = 200;
  let paths = [], w = 1, h = 1, started = false, startTime = 0;

  function size() {
    const r = fitCanvas(canvas);
    w = r.w; h = r.h; ctx = r.ctx;
    generate();
    if (started) drawStatic();
  }
  function generate() {
    paths = [];
    const dx = w / STEPS;
    for (let i = 0; i < NUM_PATHS; i++) {
      const startY = h * 0.42 + Math.random() * h * 0.16;
      const pts = [{ x: 0, y: startY }];
      let y = startY;
      const drift = (Math.random() - 0.5) * 0.55;
      const vol = 2 + Math.random() * 4.5;
      for (let s = 1; s <= STEPS; s++) {
        y += drift + (Math.random() - 0.5) * vol;
        y = Math.max(6, Math.min(h - 6, y));
        pts.push({ x: s * dx, y });
      }
      paths.push({ pts, opacity: 0.15 + Math.random() * 0.35, lineWidth: 0.5 + Math.random() * 0.8 });
    }
    paths.sort((a, b) => a.opacity - b.opacity);
  }
  const color = (p) => `rgba(24, 24, 22, ${p.opacity})`;
  function drawStatic() {
    ctx.clearRect(0, 0, w, h);
    paths.forEach((p) => {
      ctx.beginPath();
      ctx.moveTo(p.pts[0].x, p.pts[0].y);
      for (let i = 1; i < p.pts.length; i++) ctx.lineTo(p.pts[i].x, p.pts[i].y);
      ctx.strokeStyle = color(p); ctx.lineWidth = p.lineWidth; ctx.stroke();
    });
  }
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  function draw(now) {
    if (!started) return;
    const progress = Math.min((now - startTime) / 2200, 1);
    const steps = Math.floor(easeOutCubic(progress) * STEPS);
    ctx.clearRect(0, 0, w, h);
    paths.forEach((p) => {
      if (steps < 2) return;
      ctx.beginPath();
      ctx.moveTo(p.pts[0].x, p.pts[0].y);
      const end = Math.min(steps, p.pts.length);
      for (let i = 1; i < end; i++) ctx.lineTo(p.pts[i].x, p.pts[i].y);
      ctx.strokeStyle = color(p); ctx.lineWidth = p.lineWidth; ctx.stroke();
    });
    if (progress < 1) requestAnimationFrame(draw);
  }

  size();
  window.addEventListener("resize", size);
  registerInView(canvas, () => {
    if (started) return;
    started = true; startTime = performance.now();
    requestAnimationFrame(draw);
  }, 0.85);
}

/* ─── MC 3D (wireframe mesh) ───────────────────────────── */

function initMC3D() {
  const canvas = document.getElementById("mc-3d-canvas");
  if (!canvas || prefersReducedMotion) return;
  let ctx = canvas.getContext("2d");
  const GRID = 24;
  let w = 1, h = 1, started = false, raf = 0, angle = 0.5, heights = [];

  function size() {
    const r = fitCanvas(canvas);
    w = r.w; h = r.h; ctx = r.ctx;
  }
  function surface() {
    heights = [];
    for (let i = 0; i <= GRID; i++) {
      heights[i] = [];
      for (let j = 0; j <= GRID; j++) {
        const nx = (i / GRID - 0.5) * 8, ny = (j / GRID - 0.5) * 8;
        heights[i][j] =
          Math.sin(nx * 0.9) * Math.cos(ny * 0.7) * 1.5 +
          Math.sin(nx * 0.4 + ny * 0.5) * 1 +
          Math.cos(nx * 0.8 - ny * 0.3) * 0.6 +
          (Math.random() - 0.5) * 2;
      }
    }
  }
  function project(px, py, pz) {
    const cosA = Math.cos(angle), sinA = Math.sin(angle);
    const rx = px * cosA - pz * sinA;
    const rz = px * sinA + pz * cosA;
    const tilt = -0.52, cosT = Math.cos(tilt), sinT = Math.sin(tilt);
    const ry = py * cosT - rz * sinT;
    const rz2 = py * sinT + rz * cosT;
    const s = Math.min(w, h) * 0.75, fov = s * 2.2;
    const scale = fov / Math.max(fov + rz2, 1);
    return { x: rx * scale + w * 0.5, y: ry * scale + h * 0.52 };
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    angle += 0.0018;
    const time = performance.now() * 0.001;
    const s = Math.min(w, h) * 0.72, hScale = s * 0.07;

    // Precompute every projected point and its bounding box.
    const pts = [];
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i <= GRID; i++) {
      pts[i] = [];
      for (let j = 0; j <= GRID; j++) {
        const px = (i / GRID - 0.5) * s, pz = (j / GRID - 0.5) * s;
        const baseH = heights[i][j];
        const py = baseH * hScale + Math.sin(time * 0.35 + i * 0.18 + j * 0.12) * 1.8;
        const p = project(px, -py, pz);
        pts[i][j] = p;
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      }
    }
    // Offset so the mesh's bounding box is centered in the canvas.
    const ox = (w - (minX + maxX)) / 2;
    const oy = (h - (minY + maxY)) / 2;

    const stroke = (row, col, hSum) => {
      hSum /= (GRID + 1);
      const hn = Math.max(0, Math.min(1, (hSum + 3) / 6));
      ctx.strokeStyle = `rgba(24, 24, 22, ${0.16 + hn * 0.28})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    };

    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath();
      let hSum = 0;
      for (let j = 0; j <= GRID; j++) {
        const p = pts[i][j]; hSum += heights[i][j];
        if (j === 0) ctx.moveTo(p.x + ox, p.y + oy); else ctx.lineTo(p.x + ox, p.y + oy);
      }
      stroke(i, 0, hSum);
    }
    for (let j = 0; j <= GRID; j++) {
      ctx.beginPath();
      let hSum = 0;
      for (let i = 0; i <= GRID; i++) {
        const p = pts[i][j]; hSum += heights[i][j];
        if (i === 0) ctx.moveTo(p.x + ox, p.y + oy); else ctx.lineTo(p.x + ox, p.y + oy);
      }
      stroke(0, j, hSum);
    }
    raf = requestAnimationFrame(draw);
  }

  surface();
  size();
  window.addEventListener("resize", size);
  registerInView(canvas, () => {
    if (started) return;
    started = true;
    raf = requestAnimationFrame(draw);
  }, 0.85);
}

/* ─── MOBILE MENU ──────────────────────────────────────── */

function initMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  const openBtn = document.getElementById("menu-open");
  const closeBtn = document.getElementById("menu-close");
  if (!menu || !openBtn) return;

  const open = () => {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    openBtn.setAttribute("aria-expanded", "true");
    body.classList.add("is-locked");
  };
  const close = () => {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    openBtn.setAttribute("aria-expanded", "false");
    body.classList.remove("is-locked");
  };

  openBtn.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", close);
  menu.querySelectorAll("[data-menu-link]").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

/* ─── SCROLL LOOP ──────────────────────────────────────── */

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { checkInView(); ticking = false; });
}

/* ─── BOOT ─────────────────────────────────────────────── */

splitBigText();
initReveals();
initMobileMenu();
initFlowField(heroCanvas);
initMC2D();
initMC3D();
initLoader();

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", checkInView, { passive: true });
// A few post-load sweeps in case layout shifts after fonts/images load.
window.addEventListener("load", () => { checkInView(); setTimeout(checkInView, 300); });
setTimeout(checkInView, 1200);
