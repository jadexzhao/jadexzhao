const FILTER_ALL = "All";
const GROUP_ORDER = [
  "Engineering",
  "AI research",
  "Accessibility",
  "Client work",
];

const chips = document.getElementById("filter-chips");
const groupsRoot = document.getElementById("project-groups");
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
    project.workGroup,
    ...(project.tags || []),
  ].join(" ");
  return normalise(blob).includes(query);
}

function tagMatches(project, tag) {
  if (tag === FILTER_ALL) {
    return true;
  }
  if (GROUP_ORDER.includes(tag)) {
    return project.workGroup === tag;
  }
  return (project.tags || []).includes(tag);
}

function cardHtml(project) {
  const url = project.url;
  const href = project.external ? url : `../${url}`;
  const perm =
    project.permission === "CONFIRM"
      ? ' <span class="tag">Awaiting share approval</span>'
      : "";
  const rel = project.external ? ' rel="noopener noreferrer"' : "";
  return `<li><a class="card-link" href="${href}"${rel}><h3>${project.title}</h3><p class="meta">${project.year} · ${project.role}</p><p>${project.dek}</p>${perm}</a></li>`;
}

function render() {
  if (!groupsRoot) {
    return;
  }
  const query = normalise(searchInput?.value || "");
  const visible = projects.filter(
    (p) => tagMatches(p, activeFilter) && matches(p, query),
  );

  groupsRoot.innerHTML = "";
  if (visible.length === 0) {
    groupsRoot.innerHTML =
      '<p class="meta" role="status">No projects match. Try another filter or search.</p>';
    return;
  }

  const groups = GROUP_ORDER.filter((name) =>
    visible.some((p) => p.workGroup === name),
  );
  for (const name of groups) {
    const items = visible.filter((p) => p.workGroup === name);
    const section = document.createElement("section");
    section.className = "archive-group";
    section.innerHTML = `<h3>${name}</h3><ul class="project-grid">${items
      .map(cardHtml)
      .join("")}</ul>`;
    groupsRoot.appendChild(section);
  }
}

function buildChips() {
  if (!chips) {
    return;
  }
  const labels = [FILTER_ALL, ...GROUP_ORDER];
  chips.innerHTML = "";
  for (const tag of labels) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = tag;
    btn.setAttribute("aria-pressed", tag === activeFilter ? "true" : "false");
    btn.addEventListener("click", () => {
      activeFilter = tag;
      for (const child of chips.querySelectorAll("button")) {
        child.setAttribute(
          "aria-pressed",
          child.textContent === activeFilter ? "true" : "false",
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
    .filter((p) => p.permission !== "PRIVATE" && p.workArchive !== false)
    .sort((a, b) => (layerOrder[a.layer] ?? 9) - (layerOrder[b.layer] ?? 9));
  buildChips();
  searchInput?.addEventListener("input", render);
  render();
}

init().catch(() => {
  if (groupsRoot) {
    groupsRoot.innerHTML =
      '<p class="meta">Could not load projects.json. Open this page from the deployed site or a local server.</p>';
  }
});
