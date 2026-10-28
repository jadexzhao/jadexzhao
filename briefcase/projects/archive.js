const FILTER_ALL = "All";
const chips = document.getElementById("filter-chips");
const grid = document.getElementById("project-grid");
const searchInput = document.getElementById("project-search");
let projects = [];
let activeFilter = FILTER_ALL;

function normalise(text) {
  return (text || "").toLowerCase();
}

function matches(project, query) {
  if (!query) {
    return true;
  }
  const blob = [
    project.title,
    project.role,
    project.dek,
    project.year,
    ...(project.tags || []),
  ].join(" ");
  return normalise(blob).includes(query);
}

function tagMatches(project, tag) {
  if (tag === FILTER_ALL) {
    return true;
  }
  return (project.tags || []).includes(tag);
}

function render() {
  const query = normalise(searchInput?.value || "");
  const visible = projects.filter(
    (p) => tagMatches(p, activeFilter) && matches(p, query)
  );

  grid.innerHTML = "";
  if (visible.length === 0) {
    grid.innerHTML =
      '<li class="meta">No projects match. Try another filter or search.</li>';
    return;
  }

  for (const project of visible) {
    const li = document.createElement("li");
    const url = project.url;
    const href = project.external ? url : `../${url}`;
    const perm =
      project.permission === "CONFIRM"
        ? ' <span class="tag">Awaiting share approval</span>'
        : "";
    li.innerHTML = `<a class="card-link" href="${href}"${
      project.external ? ' rel="noopener noreferrer"' : ""
    }><h3>${project.title}</h3><p class="meta">${project.year} · ${project.role}</p><p>${project.dek}</p>${perm}</a>`;
    grid.appendChild(li);
  }
}

function buildChips(tags) {
  const sorted = [FILTER_ALL, ...tags.sort()];
  chips.innerHTML = "";
  for (const tag of sorted) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = tag;
    btn.setAttribute("aria-pressed", tag === activeFilter ? "true" : "false");
    btn.addEventListener("click", () => {
      activeFilter = tag;
      for (const child of chips.querySelectorAll("button")) {
        child.setAttribute(
          "aria-pressed",
          child.textContent === activeFilter ? "true" : "false"
        );
      }
      render();
    });
    chips.appendChild(btn);
  }
}

async function init() {
  const res = await fetch("projects.json");
  const data = await res.json();
  const layerOrder = { FEAT: 0, ARCH: 1, TIME: 2 };
  projects = (data.projects || [])
    .filter((p) => p.permission !== "PRIVATE")
    .sort((a, b) => (layerOrder[a.layer] ?? 9) - (layerOrder[b.layer] ?? 9));
  const tagSet = new Set();
  for (const p of projects) {
    for (const t of p.tags || []) {
      tagSet.add(t);
    }
  }
  buildChips([...tagSet]);
  searchInput?.addEventListener("input", render);
  render();
}

init().catch(() => {
  if (grid) {
    grid.innerHTML =
      '<li class="meta">Could not load projects.json. Open this page from the deployed site or a local server.</li>';
  }
});
