// Abid Emam portfolio — vanilla JS only.
// Hero: a hand-drawn 3D wireframe (icosahedron + particles) projected onto
// a 2D canvas. No libraries, no network requests, respects reduced motion.
(function () {
  "use strict";

  // Mobile navigation
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      });
    });
  }

  // Scroll reveals
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  // Subtle tilt on project cards (pointer devices only)
  if (window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(800px) rotateY(" + (x * 5) + "deg) rotateX(" + (-y * 5) + "deg) translateY(-3px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  // ---- 3D hero canvas ----
  var canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ctx = canvas.getContext("2d");
  var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var mouseX = 0, mouseY = 0, targetMX = 0, targetMY = 0;

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  // Icosahedron vertices + edges (unit sphere, golden ratio)
  var t = (1 + Math.sqrt(5)) / 2;
  var verts = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
  ].map(function (v) {
    var len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / len, v[1] / len, v[2] / len];
  });
  // Standard icosahedron connectivity: 30 edges, verified geometrically
  // (nearest-neighbour vertex pairs on the unit sphere).
  var edges = [
    [0, 1], [0, 5], [0, 7], [0, 10], [0, 11],
    [1, 5], [1, 7], [1, 8], [1, 9],
    [2, 3], [2, 4], [2, 6], [2, 10], [2, 11],
    [3, 4], [3, 6], [3, 8], [3, 9],
    [4, 5], [4, 9], [4, 11],
    [5, 9], [5, 11],
    [6, 7], [6, 8], [6, 10],
    [7, 8], [7, 10],
    [8, 9],
    [10, 11]
  ];

  // Ambient particles
  var particles = [];
  for (var i = 0; i < 70; i++) {
    particles.push({
      x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 2 - 1,
      s: Math.random() * 1.6 + 0.4
    });
  }

  function rot(v, ax, ay) {
    var cx = Math.cos(ax), sx = Math.sin(ax);
    var cy = Math.cos(ay), sy = Math.sin(ay);
    var y1 = v[1] * cx - v[2] * sx, z1 = v[1] * sx + v[2] * cx;
    var x2 = v[0] * cy + z1 * sy, z2 = -v[0] * sy + z1 * cy;
    return [x2, y1, z2];
  }

  var hero = document.getElementById("hero");
  hero.addEventListener("mousemove", function (e) {
    var r = hero.getBoundingClientRect();
    targetMX = (e.clientX - r.left) / r.width - 0.5;
    targetMY = (e.clientY - r.top) / r.height - 0.5;
  });

  var start = performance.now();
  var running = true;
  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running) requestAnimationFrame(frame);
  });

  function frame(now) {
    if (!running) return;
    var elapsed = (now - start) / 1000;
    mouseX += (targetMX - mouseX) * 0.05;
    mouseY += (targetMY - mouseY) * 0.05;
    ctx.clearRect(0, 0, W, H);

    var cx = W * 0.72, cy = H * 0.42;
    if (W < 900) { cx = W * 0.5; cy = H * 0.28; }
    var R = Math.min(W, H) * 0.26;
    var ax = elapsed * 0.22 + mouseY * 0.4;
    var ay = elapsed * 0.32 + mouseX * 0.6;

    // Particles (behind)
    particles.forEach(function (p) {
      var pr = rot([p.x, p.y, p.z], ax * 0.4, ay * 0.4);
      var depth = (pr[2] + 2) / 3;
      var px = cx + pr[0] * R * 1.9, py = cy + pr[1] * R * 1.9;
      ctx.beginPath();
      ctx.arc(px, py, p.s * depth, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(34,211,238," + (0.12 + depth * 0.35) + ")";
      ctx.fill();
    });

    // Wireframe
    var projected = verts.map(function (v) {
      var r = rot(v, ax, ay);
      var scale = 420 / (420 + r[2] * R * 0.55);
      return [cx + r[0] * R * scale, cy + r[1] * R * scale, r[2]];
    });
    ctx.lineWidth = 1;
    edges.forEach(function (e) {
      var a = projected[e[0]], b = projected[e[1]];
      var alpha = 0.18 + ((a[2] + b[2]) / 2 + 1) * 0.28;
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
      ctx.strokeStyle = "rgba(167,139,250," + alpha.toFixed(3) + ")";
      ctx.stroke();
    });
    projected.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p[0], p[1], 2.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(34,211,238,.8)";
      ctx.fill();
    });

    if (!reduced) requestAnimationFrame(frame);
  }

  // Static single render for reduced motion, animated otherwise
  if (reduced) {
    frame(performance.now());
  } else {
    requestAnimationFrame(frame);
  }
})();
