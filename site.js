const paths = {
  site: "site.json",
  posts: "posts.json",
  artworks: "artworks.json"
};

const state = {
  posts: [],
  artworks: [],
  postFilter: "全部",
  workFilter: "全部"
};

const selectors = {
  siteName: "[data-site-name]",
  siteKicker: "[data-site-kicker]",
  siteHeroTitle: "[data-site-hero-title]",
  siteDescription: "[data-site-description]",
  siteLocation: "[data-site-location]",
  siteCurrent: "[data-site-current]",
  siteIntroTitle: "[data-site-intro-title]",
  siteIntroCopy: "[data-site-intro-copy]",
  siteAboutTitle: "[data-site-about-title]",
  siteAboutCopy: "[data-site-about-copy]",
  footerName: "[data-footer-name]",
  footerNote: "[data-footer-note]",
  contactList: "[data-contact-list]",
  featuredPost: "[data-featured-post]",
  typewriter: "[data-typewriter]",
  postList: "[data-post-list]",
  postFilters: "[data-post-filters]",
  workList: "[data-work-list]",
  workFilters: "[data-work-filters]",
  dialog: "[data-work-dialog]",
  dialogContent: "[data-dialog-content]",
  dialogClose: "[data-dialog-close]"
};

const $ = (selector) => document.querySelector(selector);

function setText(selector, text) {
  const node = $(selector);
  if (node && text) node.textContent = text;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(`${value}T00:00:00`));
}

function imageStyle(src, fallback) {
  if (src) return `--image: url("${src}")`;
  return `--image: ${fallback}`;
}

function unique(values) {
  return ["全部", ...new Set(values.flat().filter(Boolean))];
}

function renderSite(site) {
  document.title = site.metaTitle || site.name || document.title;
  setText(selectors.siteName, site.name);
  setText(selectors.siteKicker, site.kicker);
  setText(selectors.siteHeroTitle, site.heroTitle);
  setText(selectors.siteDescription, site.description);
  setText(selectors.siteLocation, site.location);
  setText(selectors.siteCurrent, site.currentFocus);
  setText(selectors.siteIntroTitle, site.introTitle);
  setText(selectors.siteIntroCopy, site.introCopy);
  setText(selectors.siteAboutTitle, site.aboutTitle);
  setText(selectors.siteAboutCopy, site.aboutCopy);
  setText(selectors.footerName, site.name);
  setText(selectors.footerNote, site.footerNote);
  startTypewriter(site.heroTitle);

  const contactList = $(selectors.contactList);
  contactList.innerHTML = "";
  site.contacts.forEach((contact) => {
    const item = document.createElement("li");
    item.innerHTML = `<a href="${contact.href}" target="_blank" rel="noreferrer">${contact.label}</a>`;
    contactList.append(item);
  });
}

function startTypewriter(phrase) {
  const node = $(selectors.typewriter);
  if (!node || !phrase) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    node.textContent = phrase;
    return;
  }

  let charIndex = 0;
  const chars = Array.from(phrase);
  node.textContent = "";

  const tick = () => {
    node.textContent = chars.slice(0, charIndex).join("");
    if (charIndex <= chars.length) {
      charIndex += 1;
      window.setTimeout(tick, 92);
    }
  };

  tick();
}

function renderFeatured() {
  const container = $(selectors.featuredPost);
  if (!container || !state.posts.length) return;

  const post = state.posts[0];
  const artwork = state.artworks.find((work) => work.image) || {};
  const fallback = "linear-gradient(135deg, #dedede, #f7f7f7)";

  container.style = imageStyle(artwork.image, fallback);
  container.innerHTML = `
    <div class="feature-image" aria-hidden="true"></div>
    <div>
      <div class="feature-meta">
        <span>${formatDate(post.date)}</span>
        <span>${post.category}</span>
      </div>
      <h2 id="feature-title">${post.title}</h2>
      <p>${post.excerpt}</p>
    </div>
  `;
}

function renderFilters(containerSelector, filters, current, onSelect) {
  const container = $(containerSelector);
  container.innerHTML = "";

  filters.forEach((filter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-chip${filter === current ? " is-active" : ""}`;
    button.textContent = filter;
    button.setAttribute("aria-pressed", String(filter === current));
    button.addEventListener("click", () => onSelect(filter));
    container.append(button);
  });
}

function renderPosts() {
  const postList = $(selectors.postList);
  const posts = state.postFilter === "全部"
    ? state.posts
    : state.posts.filter((post) => post.tags.includes(state.postFilter));

  postList.innerHTML = "";
  if (!posts.length) {
    postList.innerHTML = `<div class="empty-state">这里会显示匹配的日志。</div>`;
    return;
  }

  posts.forEach((post) => {
    const article = document.createElement("article");
    article.className = "post-card";
    article.innerHTML = `
      <div class="post-meta">
        <span>${formatDate(post.date)}</span>
        <span>${post.category}</span>
      </div>
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <div class="post-body">
        ${post.body.map((paragraph) => `<p>${paragraph}</p>`).join("")}
      </div>
      <div class="tag-row">
        ${post.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
    `;
    postList.append(article);
  });
}

function renderWorks() {
  const workList = $(selectors.workList);
  const artworks = state.workFilter === "全部"
    ? state.artworks
    : state.artworks.filter((work) => work.medium === state.workFilter);

  workList.innerHTML = "";
  if (!artworks.length) {
    workList.innerHTML = `<div class="empty-state">这里会显示匹配的作品。</div>`;
    return;
  }

  artworks.forEach((work, index) => {
    const fallback = index % 2
      ? "linear-gradient(135deg, #151515, #68766d 55%, #ba8061)"
      : "linear-gradient(135deg, #1b1b18, #373b34 45%, #d8cfb6)";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "work-card";
    button.style = imageStyle(work.image, fallback);
    button.innerHTML = `
      <div class="work-image" aria-hidden="true"></div>
      <div class="work-content">
        <div class="work-meta">
          <span>${work.year}</span>
          <span>${work.medium}</span>
          <span>${work.size}</span>
        </div>
        <h3>${work.title}</h3>
        <p>${work.summary}</p>
      </div>
    `;
    button.addEventListener("click", () => openWorkDialog(work, fallback));
    workList.append(button);
  });
}

function renderPostFilters() {
  renderFilters(selectors.postFilters, unique(state.posts.map((post) => post.tags)), state.postFilter, (filter) => {
    state.postFilter = filter;
    renderPostFilters();
    renderPosts();
  });
}

function renderWorkFilters() {
  renderFilters(selectors.workFilters, unique(state.artworks.map((work) => [work.medium])), state.workFilter, (filter) => {
    state.workFilter = filter;
    renderWorkFilters();
    renderWorks();
  });
}

function openWorkDialog(work, fallback) {
  const dialog = $(selectors.dialog);
  const content = $(selectors.dialogContent);

  content.innerHTML = `
    <div class="dialog-image" style='${imageStyle(work.image, fallback)}' aria-hidden="true"></div>
    <div class="dialog-text">
      <div class="work-meta">
        <span>${work.year}</span>
        <span>${work.medium}</span>
        <span>${work.size}</span>
      </div>
      <h2>${work.title}</h2>
      <p>${work.statement}</p>
    </div>
  `;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  }
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Cannot load ${path}`);
  return response.json();
}

async function init() {
  try {
    const [site, posts, artworks] = await Promise.all([
      loadJson(paths.site),
      loadJson(paths.posts),
      loadJson(paths.artworks)
    ]);

    state.posts = posts.sort((a, b) => b.date.localeCompare(a.date));
    state.artworks = artworks.sort((a, b) => Number(b.year) - Number(a.year));

    renderSite(site);
    renderFeatured();
    renderPostFilters();
    renderWorkFilters();
    renderPosts();
    renderWorks();
  } catch (error) {
    console.error(error);
    $(selectors.postList).innerHTML = `<div class="empty-state">内容数据暂时没有加载成功。</div>`;
  }
}

$(selectors.dialogClose).addEventListener("click", () => {
  $(selectors.dialog).close();
});

$(selectors.dialog).addEventListener("click", (event) => {
  if (event.target === event.currentTarget) {
    event.currentTarget.close();
  }
});

init();
