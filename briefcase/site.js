(function () {
  "use strict";

  var main = document.getElementById("main-content");
  var skip = document.querySelector(".skip-link");
  if (skip && main) {
    skip.addEventListener("click", function () {
      main.focus({ preventScroll: true });
    });
  }

  var sanctuaryForm = document.querySelector(".sanctuary-form");
  if (sanctuaryForm) {
    var reflectionInput = document.getElementById("reflection-input");
    var reflectionStatus = document.getElementById("reflection-status");
    sanctuaryForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var reflection = reflectionInput.value.trim();
      if (!reflection) {
        reflectionStatus.textContent = "Take your time. Write a boundary or clear the prompt before reflecting back.";
        reflectionInput.focus();
        return;
      }
      reflectionStatus.textContent = "Reflection received by the prototype. Nothing was sent or stored.";
    });
    sanctuaryForm.addEventListener("reset", function () {
      window.setTimeout(function () {
        reflectionStatus.textContent = "Reflection cleared. Nothing was sent or stored.";
        reflectionInput.focus();
      }, 0);
    });
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;
  if (reduce || !("IntersectionObserver" in window)) {
    nodes.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );
  nodes.forEach(function (el) {
    observer.observe(el);
  });
})();
