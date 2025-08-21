// ----------  Navigation Header  ----------

(function () {
  // Run after DOM is parsed (in case defer isn't used for some reason)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    const nav = document.getElementById("nav");
    if (!nav) return;

    let lastY = window.scrollY || 0;
    let ticking = false;

    // Tune these if you want different sensitivity
    const SHOW_THRESHOLD = 5; // px to scroll UP before showing
    const HIDE_THRESHOLD = 5; // px to scroll DOWN before hiding

    let upAccum = 0;   // distance scrolled up since last direction change
    let downAccum = 0; // distance scrolled down since last direction change
    let isHidden = false;

    function handleScroll() {
      const y = window.scrollY || 0;
      const delta = y - lastY;

      // Optional: add a shadow once we’re off the top
      if (y > 2) nav.classList.add("nav--scrolled");
      else nav.classList.remove("nav--scrolled");

      if (delta > 0) {
        // Scrolling DOWN
        downAccum += delta;
        upAccum = 0;

        if (!isHidden && downAccum > HIDE_THRESHOLD) {
          nav.classList.add("nav--hidden");
          isHidden = true;
        }
      } else if (delta < 0) {
        // Scrolling UP
        upAccum += -delta;
        downAccum = 0;

        if (isHidden && upAccum > SHOW_THRESHOLD) {
          nav.classList.remove("nav--hidden");
          isHidden = false;
        }
      }

      // Always show at very top
      if (y <= 0 && isHidden) {
        nav.classList.remove("nav--hidden");
        isHidden = false;
      }

      lastY = y;
      ticking = false;
    }

    function onScrollRaf() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(handleScroll);
      }
    }

    window.addEventListener("scroll", onScrollRaf, { passive: true });
  }
})();






// ----------  Navigation Footer ----------

// ----------  Navigation Footer ----------

const FOOTER_MOUNT_SELECTOR = "#footer-reel";
const WINDOW_SIZE = 5;
window.XPLR_PINS = null; // store data globally

document.addEventListener("DOMContentLoaded", () => {
  const mount = document.querySelector(FOOTER_MOUNT_SELECTOR);
  if (!mount) return;

  const geojsonUrl = mount.getAttribute("data-geojson");
  const currentIdRaw = document.body.dataset.currentId || mount.dataset.currentId;
  if (!geojsonUrl || !currentIdRaw) return;

  fetch(geojsonUrl)
    .then((r) => r.json())
    .then((data) => {
      window.XPLR_PINS = data;
      renderFooterReelFromData(data, mount, currentIdRaw);
    })
    .catch((err) => console.error("Footer reel: failed to load GeoJSON:", err));
});

function renderFooterReelFromData(data, mount, currentIdRaw) {
  if (!data || !Array.isArray(data.features)) return;

  const currentIdNum = Number(currentIdRaw);
  const features = data.features
    .map((f) => ({ ...f, _idNum: Number(f.properties.id) }))
    .sort((a, b) => a._idNum - b._idNum);

  const currIdx = features.findIndex((f) => f._idNum === currentIdNum);

  const tiles = [];
  for (let offset = WINDOW_SIZE; offset >= 1; offset--) {
    tiles.push(features[currIdx - offset] ?? null);
  }
  tiles.push(features[currIdx] ?? null);
  for (let offset = 1; offset <= WINDOW_SIZE; offset++) {
    tiles.push(features[currIdx + offset] ?? null);
  }

  const track = document.createElement("div");
  track.className = "footer-reel__track";

  tiles.forEach((f, i) => {
    // Label only the immediate neighbors and the current tile
    let label = "";
    if (i === WINDOW_SIZE - 1) label = "– Prev";
    else if (i === WINDOW_SIZE) label = "– Current";
    else if (i === WINDOW_SIZE + 1) label = "– Next";

    const el = f ? renderTile(f, label) : renderPlaceholder();
    if (i === WINDOW_SIZE) el.classList.add("is-current");
    track.appendChild(el);
  });

  mount.replaceChildren(track);

  // center current tile
  const currentEl = track.children[WINDOW_SIZE];
  if (currentEl) {
    requestAnimationFrame(() => {
      const left = currentEl.offsetLeft - (track.clientWidth - currentEl.clientWidth) / 2;
      track.scrollLeft = left;
    });
  }
}

function renderTile(feature, label = "") {
  const p = feature.properties;
  const a = document.createElement("a");
  a.className = "footer-reel__tile";
  a.href = prefixPath(p.link);

  const thumb = document.createElement("span");
  thumb.className = "footer-reel__thumb";
  const img = document.createElement("img");
  img.src = prefixPath(p.image || p.hero || "");
  img.alt = p.title || "";
  thumb.appendChild(img);

  const meta = document.createElement("div");
  meta.className = "footer-reel__meta";
  // "XXX Previous/Current/Next"
  const numberText = String(p.id).padStart(3, "0");
  meta.textContent = label ? `${numberText} ${label}` : numberText;

  const title = document.createElement("div");
  title.className = "footer-reel__title";
  title.textContent = p.title || "Untitled";

  const loc = document.createElement("div");
  loc.className = "footer-reel__loc";
  loc.textContent = [p.location, p.country].filter(Boolean).join(", ");

  a.appendChild(thumb);
  a.appendChild(meta);
  a.appendChild(title);
  a.appendChild(loc);

  return a;
}

function renderPlaceholder() {
  const div = document.createElement("div");
  div.className = "footer-reel__tile is-placeholder";
  return div;
}

function prefixPath(path) {
  if (!path) return "";
  return "../" + path.replace(/^\/+/, ""); // ensure exactly one ../
}
