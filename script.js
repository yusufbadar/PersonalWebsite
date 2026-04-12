const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const body = document.body;
const loader = document.getElementById("loader");
const loaderBars = document.querySelectorAll("#loader-bars .logo-bar");
const loaderBarsSvg = document.getElementById("loader-bars-svg");
const loaderYB = document.getElementById("loader-yb");
const loaderText = document.getElementById("loader-text");
const progressFill = document.getElementById("progress-line-fill");
const nav = document.getElementById("site-nav");
const splitLines = document.querySelectorAll(".split-line");
const revealItems = [...document.querySelectorAll(".reveal")];
const depthItems = [...document.querySelectorAll("[data-depth]")];
const heroCanvas = document.getElementById("hero-flow");
const marketPaths = document.querySelectorAll(".market-path");
const marketCandles = document.querySelectorAll(".market-candles span");
const planetOrbits = document.querySelectorAll(".planet-orbit");
const planets = document.querySelectorAll(".planet");
const themeToggle = document.getElementById("theme-toggle");
const metricValues = document.querySelectorAll(".metric-value[data-count]");
const magneticElements = document.querySelectorAll(".magnetic");
const bannerLines = document.querySelectorAll(".banner-line span");
const timelineCanvas = document.getElementById("timeline-canvas");

body.classList.add("is-locked");

function splitHeadline() {
  splitLines.forEach((line) => {
    const text = line.dataset.text || "";
    line.innerHTML = "";
    [...text].forEach((character) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = character === " " ? "\u00A0" : character;
      line.appendChild(span);
    });
  });
}

function updateChrome() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = total <= 0 ? 0 : window.scrollY / total;
  progressFill.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
  nav.classList.toggle("is-solid", window.scrollY > 24);
}

function initThemeToggle() {
  const stored = localStorage.getItem("theme");
  if (stored) {
    document.documentElement.setAttribute("data-theme", stored);
  }

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

function initLoader() {
  if (prefersReducedMotion || typeof anime === "undefined") {
    loader.classList.add("is-hidden");
    body.classList.remove("is-locked");
    revealItems.forEach((item) => {
      item.style.opacity = 1;
      item.style.transform = "translateY(0)";
    });
    document.querySelectorAll(".char").forEach((ch) => {
      ch.style.transform = "translateY(0)";
      ch.style.opacity = 1;
    });
    metricValues.forEach((el) => {
      el.textContent = formatCount(el);
    });
    return;
  }

  const tl = anime.timeline({ easing: "easeOutExpo" });

  tl.add({
    targets: loaderBars,
    scaleY: [0, 1],
    opacity: [0, 1],
    delay: anime.stagger(55),
    duration: 500,
    easing: "easeOutCubic"
  });

  tl.add({
    targets: loaderBars,
    opacity: [1, 0],
    scaleY: [1, 0.3],
    delay: anime.stagger(40, { from: "center" }),
    duration: 380,
    easing: "easeInQuad"
  }, "+=200");

  tl.add({
    targets: loaderBarsSvg,
    opacity: [1, 0],
    duration: 200,
    easing: "easeOutQuad"
  });

  tl.add({
    targets: loaderYB,
    opacity: [0, 1],
    scale: [0.7, 1],
    duration: 600,
    easing: "easeOutCubic"
  }, "-=150");

  tl.add({
    targets: loaderText,
    opacity: [0, 1],
    translateY: [12, 0],
    duration: 400,
    easing: "easeOutCubic"
  }, "-=300");

  tl.add({
    targets: loader,
    opacity: [1, 0],
    duration: 600,
    delay: 400,
    easing: "easeInOutQuad",
    complete: () => {
      loader.classList.add("is-hidden");
      body.classList.remove("is-locked");
      animateIntro();
    }
  });
}

function animateIntro() {
  if (prefersReducedMotion || typeof anime === "undefined") return;

  anime({
    targets: ".char",
    translateY: ["110%", "0%"],
    opacity: [0, 1],
    delay: anime.stagger(32, { start: 60 }),
    duration: 900,
    easing: "easeOutExpo"
  });

  anime({
    targets: ".hero .reveal, .hero-metrics .reveal",
    opacity: [0, 1],
    translateY: [36, 0],
    delay: anime.stagger(80, { start: 200 }),
    duration: 820,
    easing: "easeOutExpo"
  });

  startProjectAnimations();
}

function startProjectAnimations() {
  if (prefersReducedMotion || typeof anime === "undefined") return;

  anime({
    targets: marketPaths,
    translateY: [-8, 8],
    direction: "alternate",
    easing: "easeInOutSine",
    duration: 2800,
    delay: anime.stagger(180),
    loop: true
  });

  anime({
    targets: marketCandles,
    scaleY: [0.5, 1],
    direction: "alternate",
    easing: "easeInOutSine",
    duration: 1700,
    delay: anime.stagger(90),
    loop: true
  });

  anime({
    targets: planetOrbits,
    rotate: (_, index) => [index * 60, index * 60 + 360],
    easing: "linear",
    duration: 18000,
    loop: true,
    delay: anime.stagger(600)
  });

  anime({
    targets: planets,
    scale: [0.85, 1.15],
    direction: "alternate",
    easing: "easeInOutSine",
    duration: 2000,
    delay: anime.stagger(150),
    loop: true
  });
}

function formatCount(el) {
  const raw = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const suffix = el.dataset.suffix || "";

  if (raw >= 1000000) {
    return (raw / 1000000).toFixed(0) + "M" + suffix;
  }
  if (raw >= 1000) {
    return (raw / 1000).toFixed(0) + "K" + suffix;
  }
  return raw.toFixed(decimals) + suffix;
}

function animateCounter(el) {
  if (prefersReducedMotion || typeof anime === "undefined") {
    el.textContent = formatCount(el);
    return;
  }

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
      if (v >= 1000000) {
        el.textContent = Math.floor(v / 1000000) + "M" + suffix;
      } else if (v >= 1000) {
        el.textContent = Math.floor(v / 1000) + "K" + suffix;
      } else {
        el.textContent = v.toFixed(decimals) + suffix;
      }
    }
  });
}

function initReveals() {
  if (prefersReducedMotion || typeof anime === "undefined") {
    revealItems.forEach((item) => {
      item.style.opacity = 1;
      item.style.transform = "translateY(0)";
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        anime({
          targets: el,
          opacity: [0, 1],
          translateY: [34, 0],
          duration: 820,
          easing: "easeOutExpo"
        });

        if (el.classList.contains("project-banner") && bannerLines.length) {
          anime({
            targets: bannerLines,
            scaleX: [0, 1],
            delay: anime.stagger(60),
            duration: 700,
            easing: "easeOutExpo"
          });
        }

        observer.unobserve(el);
      });
    },
    { threshold: 0.12 }
  );

  revealItems
    .filter((item) => !item.closest(".hero") && !item.closest(".hero-metrics"))
    .forEach((item) => observer.observe(item));

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  metricValues.forEach((el) => counterObserver.observe(el));
}

function initTimelineCanvas() {
  if (!timelineCanvas || prefersReducedMotion) return;

  const section = document.getElementById("experience");
  const ctx = timelineCanvas.getContext("2d");
  let lines = [];
  let started = false;
  let startTime = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = section.offsetHeight;
    timelineCanvas.width = w * dpr;
    timelineCanvas.height = h * dpr;
    timelineCanvas.style.width = w + "px";
    timelineCanvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = 14;
    lines = [];
    for (let i = 0; i < count; i++) {
      const yBase = (i + 0.5) / count * h;
      lines.push({
        y: yBase + (Math.random() - 0.5) * 10,
        targetWidth: 0.08 + Math.random() * 0.26,
        delay: i * 120 + Math.random() * 150,
        opacity: 0.09 + Math.random() * 0.13,
        thickness: 1 + Math.random() * 2
      });
    }

    if (started) drawStatic();
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function drawStatic() {
    const w = window.innerWidth;
    const h = section.offsetHeight;
    ctx.clearRect(0, 0, w, h);
    const theme = document.documentElement.getAttribute("data-theme");
    const rgb = theme === "dark" ? "255,255,255" : "17,17,17";

    lines.forEach((line) => {
      const lineWidth = w * line.targetWidth;
      ctx.beginPath();
      ctx.moveTo(0, line.y);
      ctx.lineTo(lineWidth, line.y);
      ctx.strokeStyle = `rgba(${rgb},${line.opacity})`;
      ctx.lineWidth = line.thickness;
      ctx.lineCap = "round";
      ctx.stroke();
    });
  }

  function draw(now) {
    if (!started) return;
    const elapsed = now - startTime;
    const w = window.innerWidth;
    const h = section.offsetHeight;

    ctx.clearRect(0, 0, w, h);
    const theme = document.documentElement.getAttribute("data-theme");
    const rgb = theme === "dark" ? "255,255,255" : "17,17,17";

    let allDone = true;
    lines.forEach((line) => {
      const t = Math.max(0, elapsed - line.delay) / 1800;
      const progress = easeOutCubic(Math.min(t, 1));
      if (progress < 0.999) allDone = false;

      const lineWidth = w * line.targetWidth * progress;
      if (lineWidth < 1) return;

      ctx.beginPath();
      ctx.moveTo(0, line.y);
      ctx.lineTo(lineWidth, line.y);
      ctx.strokeStyle = `rgba(${rgb},${line.opacity})`;
      ctx.lineWidth = line.thickness;
      ctx.lineCap = "round";
      ctx.stroke();
    });

    if (!allDone) {
      requestAnimationFrame(draw);
    }
  }

  resize();
  window.addEventListener("resize", resize);

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        startTime = performance.now();
        requestAnimationFrame(draw);
        observer.disconnect();
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(section);
}

function updateDepthParallax() {
  if (prefersReducedMotion) return;

  depthItems.forEach((item) => {
    const depth = Number(item.dataset.depth || 0.1);
    const rect = item.getBoundingClientRect();
    const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
    const normalized = Math.max(Math.min(offset / window.innerHeight, 1), -1);
    item.style.transform = `translateY(${normalized * depth * -120}px)`;
  });
}

function initMagneticElements() {
  if (prefersReducedMotion) return;

  magneticElements.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 0.25;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
      el.style.transition = "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)";
      setTimeout(() => { el.style.transition = ""; }, 500);
    });
  });
}

function initFlowField(canvas) {
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const pointer = { x: 0.5, y: 0.5, active: false };
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(Math.floor(rect.width), 1);
    height = Math.max(Math.floor(rect.height), 1);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function getStrokeColor() {
    const theme = document.documentElement.getAttribute("data-theme");
    return theme === "dark"
      ? "rgba(255, 255, 255, 0.55)"
      : "rgba(17, 17, 17, 0.65)";
  }

  function draw(time) {
    context.clearRect(0, 0, width, height);
    context.lineWidth = 1;
    context.strokeStyle = getStrokeColor();

    const columns = Math.max(Math.floor(width / 22), 20);
    const rows = Math.max(Math.floor(height / 24), 18);
    const pointerX = pointer.x * width;
    const pointerY = pointer.y * height;

    for (let xIndex = 0; xIndex <= columns; xIndex += 1) {
      const baseX = (xIndex / columns) * width;
      context.beginPath();

      for (let yIndex = 0; yIndex <= rows; yIndex += 1) {
        const y = (yIndex / rows) * height;
        const distanceX = baseX - pointerX;
        const distanceY = y - pointerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY) || 1;
        const pointerForce = pointer.active ? Math.max(0, 1 - distance / 240) * 28 : 0;
        const wave = Math.sin(y * 0.018 + time * 0.0012 + xIndex * 0.32) * 12;
        const waveB = Math.cos(y * 0.012 - time * 0.001 + xIndex * 0.18) * 8;
        const bend = pointerForce * Math.cos(distanceY * 0.03);
        const x = baseX + wave + waveB + bend;

        if (yIndex === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.stroke();
    }

    animationFrame = window.requestAnimationFrame(draw);
  }

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width;
    pointer.y = (event.clientY - rect.top) / rect.height;
    pointer.active = true;
  });

  canvas.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  resize();
  animationFrame = window.requestAnimationFrame(draw);

  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(animationFrame);
    resize();
    animationFrame = window.requestAnimationFrame(draw);
  });
}

function initMC2D() {
  const canvas = document.getElementById("mc-2d-canvas");
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext("2d");
  const NUM_PATHS = 100;
  const STEPS = 200;
  let paths = [];
  let w = 0;
  let h = 0;
  let started = false;
  let startTime = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    generatePaths();
    if (started) drawStatic();
  }

  function generatePaths() {
    paths = [];
    const dx = w / STEPS;

    for (let i = 0; i < NUM_PATHS; i++) {
      const startY = h * 0.42 + Math.random() * h * 0.16;
      const points = [{ x: 0, y: startY }];
      let y = startY;
      const drift = (Math.random() - 0.5) * 0.55;
      const vol = 2 + Math.random() * 4.5;

      for (let s = 1; s <= STEPS; s++) {
        y += drift + (Math.random() - 0.5) * vol;
        y = Math.max(6, Math.min(h - 6, y));
        points.push({ x: s * dx, y: y });
      }

      paths.push({
        points: points,
        hue: 170 + Math.random() * 50,
        sat: 40 + Math.random() * 30,
        opacity: 0.15 + Math.random() * 0.35,
        lineWidth: 0.5 + Math.random() * 0.8
      });
    }

    paths.sort(function (a, b) { return a.opacity - b.opacity; });
  }

  function getColor(path) {
    var theme = document.documentElement.getAttribute("data-theme");
    var light = theme === "dark" ? 68 : 32;
    return "hsla(" + path.hue + "," + path.sat + "%," + light + "%," + path.opacity + ")";
  }

  function drawStatic() {
    ctx.clearRect(0, 0, w, h);
    paths.forEach(function (path) {
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (var i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.strokeStyle = getColor(path);
      ctx.lineWidth = path.lineWidth;
      ctx.stroke();
    });
  }

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function draw(now) {
    if (!started) return;

    var elapsed = now - startTime;
    var progress = Math.min(elapsed / 2200, 1);
    var stepsToShow = Math.floor(easeOutCubic(progress) * STEPS);

    ctx.clearRect(0, 0, w, h);

    paths.forEach(function (path) {
      if (stepsToShow < 2) return;
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      var end = Math.min(stepsToShow, path.points.length);
      for (var i = 1; i < end; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.strokeStyle = getColor(path);
      ctx.lineWidth = path.lineWidth;
      ctx.stroke();
    });

    if (progress < 1) {
      requestAnimationFrame(draw);
    }
  }

  resize();
  window.addEventListener("resize", resize);

  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !started) {
      started = true;
      startTime = performance.now();
      requestAnimationFrame(draw);
      observer.disconnect();
    }
  }, { threshold: 0.15 });

  observer.observe(canvas);
}

function initMC3D() {
  const canvas = document.getElementById("mc-3d-canvas");
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext("2d");
  const GRID = 26;
  let w = 0;
  let h = 0;
  let started = false;
  let running = false;
  let rafId = 0;
  let angle = 0.5;
  let heights = [];

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function generateSurface() {
    heights = [];
    for (var i = 0; i <= GRID; i++) {
      heights[i] = [];
      for (var j = 0; j <= GRID; j++) {
        var nx = (i / GRID - 0.5) * 8;
        var ny = (j / GRID - 0.5) * 8;
        heights[i][j] =
          Math.sin(nx * 0.9) * Math.cos(ny * 0.7) * 1.5 +
          Math.sin(nx * 0.4 + ny * 0.5) * 1 +
          Math.cos(nx * 0.8 - ny * 0.3) * 0.6 +
          (Math.random() - 0.5) * 2;
      }
    }
  }

  function project(px, py, pz) {
    var cosA = Math.cos(angle);
    var sinA = Math.sin(angle);
    var rx = px * cosA - pz * sinA;
    var rz = px * sinA + pz * cosA;

    var tilt = -0.52;
    var cosT = Math.cos(tilt);
    var sinT = Math.sin(tilt);
    var ry = py * cosT - rz * sinT;
    var rz2 = py * sinT + rz * cosT;

    var size = Math.min(w, h) * 0.75;
    var fov = size * 2.2;
    var scale = fov / Math.max(fov + rz2, 1);

    return {
      x: rx * scale + w * 0.5,
      y: ry * scale + h * 0.52
    };
  }

  function draw() {
    if (!running) return;

    ctx.clearRect(0, 0, w, h);
    var theme = document.documentElement.getAttribute("data-theme");
    angle += 0.0018;
    var time = performance.now() * 0.001;
    var size = Math.min(w, h) * 0.75;
    var heightScale = size * 0.07;

    for (var pass = 0; pass < 2; pass++) {
      for (var i = 0; i <= GRID; i++) {
        ctx.beginPath();
        var hSum = 0;

        for (var j = 0; j <= GRID; j++) {
          var row = pass === 0 ? i : j;
          var col = pass === 0 ? j : i;

          var px = (row / GRID - 0.5) * size;
          var pz = (col / GRID - 0.5) * size;
          var baseH = heights[row][col];
          var py = baseH * heightScale + Math.sin(time * 0.35 + row * 0.18 + col * 0.12) * 1.8;
          hSum += baseH;

          var pt = project(px, -py, pz);
          if (j === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }

        hSum /= (GRID + 1);
        var hn = Math.max(0, Math.min(1, (hSum + 3) / 6));
        var hue = 175 + hn * 40;
        var light = theme === "dark" ? 65 : 32;
        var alpha = 0.15 + hn * 0.3;

        ctx.strokeStyle = "hsla(" + hue + ",50%," + light + "%," + alpha + ")";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    rafId = requestAnimationFrame(draw);
  }

  generateSurface();
  resize();
  window.addEventListener("resize", resize);

  var observer = new IntersectionObserver(function (entries) {
    var visible = entries[0].isIntersecting;
    if (visible && !started) {
      started = true;
      running = true;
      rafId = requestAnimationFrame(draw);
    } else if (visible && !running) {
      running = true;
      rafId = requestAnimationFrame(draw);
    } else if (!visible && running) {
      running = false;
      cancelAnimationFrame(rafId);
    }
  }, { threshold: 0.05 });

  observer.observe(canvas);
}

let ticking = false;

function onScroll() {
  updateChrome();
  if (prefersReducedMotion) return;

  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateDepthParallax();
      ticking = false;
    });
    ticking = true;
  }
}

splitHeadline();
updateChrome();
updateDepthParallax();
initFlowField(heroCanvas);
initReveals();
initThemeToggle();
initMagneticElements();
initTimelineCanvas();
initMC2D();
initMC3D();
initLoader();

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", () => {
  updateChrome();
  updateDepthParallax();
});
