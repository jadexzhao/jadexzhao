(function () {
  const root = document.querySelector("[data-storybook]");
  if (!root) return;

  const scenes = Array.from(root.querySelectorAll("[data-scene]"));
  const status = root.querySelector("[data-status]");
  const prev = root.querySelector("[data-prev]");
  const next = root.querySelector("[data-next]");
  const restarts = root.querySelectorAll("[data-restart], [data-restart-inline]");
  let index = 0;

  function show(nextIndex) {
    index = Math.max(0, Math.min(scenes.length - 1, nextIndex));
    scenes.forEach((scene, i) => {
      const on = i === index;
      scene.classList.toggle("is-on", on);
      scene.hidden = !on;
    });
    if (status) {
      status.textContent = "Scene " + (index + 1) + " of " + scenes.length;
    }
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === scenes.length - 1;
  }

  prev?.addEventListener("click", () => show(index - 1));
  next?.addEventListener("click", () => show(index + 1));
  restarts.forEach((btn) => btn.addEventListener("click", () => show(0)));

  document.addEventListener("keydown", (event) => {
    const tag = event.target instanceof HTMLElement ? event.target.tagName : "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      show(index + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(index - 1);
    }
  });

  show(0);
})();
