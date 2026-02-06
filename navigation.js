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







// ---- Footer Reel (with desktop drag-to-scroll + momentum) ----
const FOOTER_MOUNT_SELECTOR = "#footer-reel";
const WINDOW_SIZE = 15;
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
    .map((f) => ({ ...f, _idNum: Number(f?.properties?.id) }))
    .filter((f) => Number.isFinite(f._idNum))
    .sort((a, b) => a._idNum - b._idNum);

  const currIdx = features.findIndex((f) => f._idNum === currentIdNum);

  const tiles = [];
  for (let offset = WINDOW_SIZE; offset >= 1; offset--) tiles.push(features[currIdx - offset] ?? null);
  tiles.push(features[currIdx] ?? null);
  for (let offset = 1; offset <= WINDOW_SIZE; offset++) tiles.push(features[currIdx + offset] ?? null);

  const track = document.createElement("div");
  track.className = "footer-reel__track";

  tiles.forEach((f, i) => {
    let label = "";
    if (i === WINDOW_SIZE - 1) label = "– Prev";
    else if (i === WINDOW_SIZE) label = "– Current";
    else if (i === WINDOW_SIZE + 1) label = "– Next";

    const el = f ? renderTile(f, label) : renderPlaceholder();
    if (i === WINDOW_SIZE) el.classList.add("is-current");
    track.appendChild(el);
  });

  mount.replaceChildren(track);

  // enable desktop drag-scroll (mouse) with inertial fling
  initDesktopDragScroll(track);

  // center current tile smoothly (after layout)
  const currentEl = track.children[WINDOW_SIZE];
  if (currentEl) {
    requestAnimationFrame(() => {
      const left = Math.max(
        0,
        currentEl.offsetLeft - (track.clientWidth - currentEl.clientWidth) / 2
      );
      if ("scrollTo" in track) {
        try {
          track.scrollTo({ left, behavior: "smooth" });
        } catch {
          track.scrollLeft = left;
        }
      } else {
        track.scrollLeft = left;
      }
    });
  }
}

function renderTile(feature, label = "") {
  const p = feature.properties || {};
  const a = document.createElement("a");
  a.className = "footer-reel__tile";
  a.href = prefixPath(p.link || "");

  const thumb = document.createElement("span");
  thumb.className = "footer-reel__thumb";

  const img = document.createElement("img");
  img.src = prefixPath(p.image || p.hero || "");
  img.alt = p.title || "";
  img.draggable = false; // stop ghost-image while dragging
  thumb.appendChild(img);

  const meta = document.createElement("div");
  meta.className = "footer-reel__meta";
  const numberText = String(p.id ?? "").padStart(3, "0");
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
  return "../" + String(path).replace(/^\/+/, ""); // ensure exactly one ../
}

// --- Desktop drag-to-scroll with momentum/fling ---
    function initDesktopDragScroll(track) {
        // Only enable on fine pointers (mouse). Touch remains native.
        const hasFinePointer = typeof window.matchMedia === "function"
            ? window.matchMedia("(pointer: fine)").matches
            : true;
        if (!hasFinePointer) return;

        let isDown = false;
        let startX = 0;
        let startScroll = 0;
        let dragged = false;

        // Velocity sampling
        let lastX = 0;
        let lastT = 0;
        let velocity = 0; 
        const DRAG_THRESHOLD = 5;          
        const MAX_ABS_VELOCITY = 2.0;      
        const FLING_MIN_VELOCITY = 0.15;   
        const FRICTION = 0.95;             
        const FRAME_MS = 16;               
        let flingId = 0;                   

        function clampScroll(x) {
            const max = track.scrollWidth - track.clientWidth;
            if (max <= 0) return 0;
            return Math.min(Math.max(0, x), max);
        }

        function stopFling() {
            if (flingId) {
                cancelAnimationFrame(flingId);
                flingId = 0;
            }
        }

        function startFling(v0) {
            stopFling();
            let v = Math.max(Math.min(v0, MAX_ABS_VELOCITY), -MAX_ABS_VELOCITY);

            const step = () => {
                if (isDown) {
                    flingId = 0;
                    return;
                }
                track.scrollLeft = clampScroll(track.scrollLeft - v * FRAME_MS);
                v *= FRICTION;

                const atEdge = track.scrollLeft === 0 || track.scrollLeft === track.scrollWidth - track.clientWidth;
                if (Math.abs(v) < 0.02 || atEdge) {
                    flingId = 0;
                    return;
                }
                flingId = requestAnimationFrame(step);
            };
            flingId = requestAnimationFrame(step);
        }

        function onPointerDown(e) {
            if (e.pointerType !== "mouse" || e.button !== 0) return;
            isDown = true;
            dragged = false;
            startX = e.clientX;
            startScroll = track.scrollLeft;
            lastX = e.clientX;
            lastT = performance.now();
            stopFling();
            
            // --- CHANGE 1: DO NOT Capture/Add Class here yet ---
            // We wait until the user moves > 5px in onPointerMove
        }

        function onPointerMove(e) {
            if (!isDown || e.pointerType !== "mouse") return;
            const now = performance.now();
            const dx = e.clientX - startX;

            // --- CHANGE 2: Activate Drag Mode only after threshold ---
            if (!dragged && Math.abs(dx) > DRAG_THRESHOLD) {
                dragged = true;
                track.classList.add("is-dragging"); // Now CSS triggers
                try { track.setPointerCapture?.(e.pointerId); } catch {} // Now we capture
            }

            if (dragged) {
                // Only scroll if we are officially dragging
                track.scrollLeft = clampScroll(startScroll - dx);
                
                const dt = now - lastT || 1;
                velocity = (e.clientX - lastX) / dt;
                lastX = e.clientX;
                lastT = now;
            }
        }

        function endDrag(e) {
            if (!isDown) return;
            isDown = false;
            
            // Cleanup
            track.classList.remove("is-dragging");
            try { track.releasePointerCapture?.(e.pointerId); } catch {}

            // Start fling only if we were dragging
            if (dragged && Math.abs(velocity) >= FLING_MIN_VELOCITY) {
                startFling(velocity);
            }
            dragged = false;
        }

        function onClickCapture(e) {
            // Block the click only if we actually dragged
            if (dragged) {
                e.preventDefault();
                e.stopPropagation();
            }
        }

        track.addEventListener("pointerdown", onPointerDown, { passive: true });
        track.addEventListener("pointermove", onPointerMove, { passive: true });
        track.addEventListener("pointerup", endDrag, { passive: true });
        track.addEventListener("pointercancel", endDrag, { passive: true });
        track.addEventListener("mouseleave", endDrag, { passive: true });
        track.addEventListener("click", onClickCapture, { capture: true });
    }

// ---- end ----
