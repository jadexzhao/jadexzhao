/**
 * jadexzhao · briefcase · hidden door cross-links
 * Console hint + typed sequences + footer whisper.
 * Keyboard paths documented in console; no focus traps.
 */
(function () {
  "use strict";

  var GREEN = "#3f5b3f";
  var BUFFER_MAX = 24;
  var buffer = "";
  var fired = {};
  var reduce = false;

  try {
    reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (_e) {
    /* ignore */
  }

  console.log(
    "%c🌊 jadewowgreen · ship handle · same person, four doors",
    "color:" + GREEN + ";font-size:14px;font-weight:600"
  );
  console.log(
    "%chidden paths: type matcha · phoenix · duck (keyboard, not in a text field)",
    "color:" + GREEN + ";font-size:11px"
  );

  var DOORS = {
    matcha: {
      label: "Cookie classroom",
      url: "https://matchaxmoxie.github.io/matchaxmoxie/",
    },
    phoenix: {
      label: "Essays & notes",
      url: "https://zhao-langxi.github.io/zhao-langxi/",
    },
    duck: {
      label: "Duck farm sandbox",
      url: "https://jadexzhao.github.io/jadexzhao/duck-farm/",
    },
  };

  function ensureToast() {
    var el = document.getElementById("door-egg-toast");
    if (el) return el;
    el = document.createElement("p");
    el.id = "door-egg-toast";
    el.className = "door-egg-toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.hidden = true;
    document.body.appendChild(el);
    return el;
  }

  function showDoorToast(doorKey) {
    var door = DOORS[doorKey];
    if (!door) return;
    var el = ensureToast();
    el.innerHTML =
      door.label +
      ' · <a href="' +
      door.url +
      '" rel="noopener noreferrer">' +
      door.url.replace(/^https:\/\//, "") +
      "</a>";
    el.hidden = false;
    el.classList.add("is-visible");
    window.setTimeout(function () {
      el.classList.remove("is-visible");
      window.setTimeout(function () {
        el.hidden = true;
      }, reduce ? 0 : 280);
    }, 3200);
  }

  function fireOnce(key) {
    if (fired[key]) return;
    fired[key] = true;
    showDoorToast(key);
    window.setTimeout(function () {
      fired[key] = false;
    }, 4000);
  }

  function isTypingContext(target) {
    if (!target || !target.tagName) return false;
    var tag = target.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    if (target.isContentEditable) return true;
    return false;
  }

  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (isTypingContext(e.target)) return;
    if (e.key.length !== 1) return;
    buffer = (buffer + e.key.toLowerCase()).slice(-BUFFER_MAX);
    Object.keys(DOORS).forEach(function (word) {
      if (buffer.endsWith(word)) fireOnce(word);
    });
  });

  var dragon = document.querySelector(".egg-dragon");
  if (dragon) {
    var lastTap = 0;
    dragon.addEventListener("click", function () {
      var now = Date.now();
      if (now - lastTap < 420) fireOnce("phoenix");
      lastTap = now;
    });
    dragon.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fireOnce("phoenix");
      }
    });
  }
})();
