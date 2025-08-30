/* =========================================
   Felles script.js for hele nettstedet
   (index + bilutvalg + evt. flere)
   ========================================= */

/* Utils */
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const $  = (sel, root = document) => root.querySelector(sel);
const debounce = (fn, ms = 300) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

/* =========================
   NAV/MENY (tilgjengelig)
   ========================= */
(() => {
  const navMenu   = $("#nav-menu");
  const navToggle = $("#nav-toggle");
  const navClose  = $("#nav-close");
  const body = document.body;
  let lastFocusedBeforeMenu = null;

  function openMenu() {
    if (!navMenu) return;
    navMenu.classList.add("show-menu");
    body.style.overflow = "hidden";
    lastFocusedBeforeMenu = document.activeElement;
    const firstLink = navMenu.querySelector(".nav__link");
    firstLink && firstLink.focus();
  }

  function closeMenu() {
    if (!navMenu) return;
    navMenu.classList.remove("show-menu");
    body.style.overflow = "";
    if (navToggle && lastFocusedBeforeMenu === navToggle) navToggle.focus();
  }

  navToggle?.addEventListener("click", openMenu);
  navClose?.addEventListener("click", closeMenu);

  // ESC for å lukke
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu?.classList.contains("show-menu")) closeMenu();
  });

  // Klikk på backdrop
  navMenu?.addEventListener("click", (e) => {
    if (e.target === navMenu) closeMenu();
  });

  // Lenke-klikk (mobil)
  $$(".nav__link").forEach((link) =>
    link.addEventListener("click", () => {
      navMenu?.classList.remove("show-menu");
      body.style.overflow = "";
    })
  );
})();

/* =========================
   HEADER BAKGRUNN PÅ SCROLL
   ========================= */
(() => {
  const header = $("#header");
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY >= 50) header.classList.add("scroll-header");
    else header.classList.remove("scroll-header");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* =========================
   AKTIV LENKE I MENYEN
   ========================= */
(() => {
  const sections = $$("section[id]");
  if (!sections.length) return;

  let ticking = false;
  function setActiveLink() {
    const scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop    = current.offsetTop - 80;
      const sectionId     = current.getAttribute("id");
      const link = document.querySelector(`.nav__menu a[href="#${sectionId}"]`);
      if (!link) return;
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) link.classList.add("active-link");
      else link.classList.remove("active-link");
    });
  }
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        setActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  setActiveLink();
})();

/* =========================
   SCROLL-TOP KNAPP
   ========================= */
(() => {
  const btn = $("#scroll-top");
  if (!btn) return;
  const show = () => (window.scrollY >= 350 ? btn.classList.add("show") : btn.classList.remove("show"));
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", show, { passive: true });
  show();
})();

/* =========================
   PROSJEKT-FILTER (forside, statisk)
   ========================= */
(() => {
  const filterButtons = $$(".projects .filter__btn");
  const projectCards  = $$(".projects .project__card");
  if (!filterButtons.length || !projectCards.length) return;

  function setFilter(value) {
    projectCards.forEach((card) => {
      const match = value === "all" || card.getAttribute("data-category") === value;
      card.classList.toggle("is-hidden", !match);
      card.setAttribute("aria-hidden", String(!match));
      $$("a, button", card).forEach((el) => (el.tabIndex = match ? 0 : -1));
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((b) => {
        b.classList.remove("filter__btn--active");
        b.setAttribute("aria-selected", "false");
      });
      button.classList.add("filter__btn--active");
      button.setAttribute("aria-selected", "true");
      setFilter(button.getAttribute("data-filter") || "all");
    });
  });

  const active = document.querySelector(".projects .filter__btn--active");
  setFilter(active?.getAttribute("data-filter") || "all");
})();

/* =========================
   KONTAKTSKJEMA – VALIDERING
   ========================= */
(() => {
  const form = $("#contact-form");
  if (!form) return;
  const showAlert = (msg) => alert(msg);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameEl    = $("#name");
    const emailEl   = $("#email");
    const phoneEl   = $("#phone");
    const messageEl = $("#message");

    const name    = nameEl?.value.trim() || "";
    const email   = emailEl?.value.trim() || "";
    const phone   = phoneEl?.value.trim() || "";
    const message = messageEl?.value.trim() || "";

    if (!name || !email || !message) return showAlert("Vennligst fyll ut alle obligatoriske felt (*).");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(email)) return (showAlert("Vennligst oppgi en gyldig e‑postadresse."), emailEl?.focus());

    if (phone && !/^[0-9 +()\-]{5,}$/.test(phone))
      return (showAlert("Vennligst oppgi et gyldig telefonnummer."), phoneEl?.focus());

    showAlert("Melding sendt! Vi kontakter deg snart.");
    form.reset();
  });
})();

/* =========================
   COUNTUP (Hero stats)
   ========================= */
(() => {
  const items = $$("[data-countup]");
  if (!items.length) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const formatNumber = (value, decimals) =>
    Number(value).toLocaleString("nb-NO", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function animateCount(el) {
    const end      = parseFloat(el.getAttribute("data-count-to")) || 0;
    const start    = parseFloat(el.getAttribute("data-start")) || 0;
    const duration = parseInt(el.getAttribute("data-duration"), 10) || 1800;
    const decimals = parseInt(el.getAttribute("data-decimals"), 10) || 0;
    const prefix   = el.getAttribute("data-prefix") || "";
    const suffix   = el.getAttribute("data-suffix") || "";

    if (reduceMotion) {
      el.textContent = `${prefix}${formatNumber(end, decimals)}${suffix}`;
      el.setAttribute("data-counted", "true");
      return;
    }

    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased    = easeOutCubic(progress);
      const current  = start + (end - start) * eased;
      el.textContent = `${prefix}${formatNumber(current, decimals)}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
      else {
        el.textContent = `${prefix}${formatNumber(end, decimals)}${suffix}`;
        el.setAttribute("data-counted", "true");
      }
    };
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll("[data-countup]").forEach((el) => {
          if (el.getAttribute("data-counted") !== "true") animateCount(el);
        });
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  const container = $(".hero__stats");
  if (container) observer.observe(container);
  else items.forEach((el) => observer.observe(el));
})();

/* =========================
   SCROLL REVEAL (defensiv)
   ========================= */
(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof ScrollReveal === "undefined" || prefersReducedMotion) return;
    const sr = ScrollReveal({ origin: "top", distance: "60px", duration: 2500, delay: 400 });
    sr.reveal(`.hero__content, .about__image, .contact__info`, { origin: "left" });
    sr.reveal(`.hero__image, .about__content, .contact__form`, { origin: "right" });
    sr.reveal(`.section__header, .footer__content`, { interval: 100 });
    sr.reveal(`.hero__stats, .service__card, .project__card, .testimonial__card`, { interval: 100 });
  });
})();

/* =========================
   HASH OFFSET (fallback)
   ========================= */
(() => {
  function ensureHashOffset() {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.substring(1));
      if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: "smooth" });
    }
  }
  window.addEventListener("hashchange", ensureHashOffset);
})();

/* ======================================================
   BILUTVALG-SIDE – Directus: søk, filtrer, sorter, paginer
   Med: AbortController, requestId guard, debounce og cache (SWR)
   ====================================================== */
(() => {
  const carsGrid = $("#cars-grid");
  if (!carsGrid) return; // ikke på bilutvalg-siden

  // UI‑refs
  const resultCount   = $("#result-count");
  const searchEl      = $("#search");
  const sortEl        = $("#sort");
  const filterButtons = $$(".projects__filter .filter__btn");
  const filtersForm   = $("#filters-form");
  const applyBtn      = $("#apply-filters");
  const resetBtn      = $("#reset-filters");
  const prevBtn       = $("#prev-page");
  const nextBtn       = $("#next-page");
  const pageIndicator = $("#page-indicator");

  // Directus config
  const DIRECTUS_URL  = "https://lasse-bil.directus.app";
  const DIRECTUS_TOKEN = "";          // valgfritt: sett token her hvis du ikke bruker Public
  const ASSET_KEY      = "optimized"; // må matche preset du laget i Directus
  const PAGE_SIZE      = 12;

  // State
  const state = {
    page: 1,
    category: "all",
    query: "",
    sort: "relevance",
    filters: {
      body: [], fuel: [], gear: [],
      "year-min": "", "year-max": "",
      "price-min": "", "price-max": ""
    },
    total: 0,
  };

  // In‑memory cache (SWR)
  // key -> { ts, rows, total }
  const cache = new Map();
  const CACHE_TTL_MS = 60_000; // 60s

  // request control
  let currentController = null;
  let lastRequestId = 0;

  // Helpers
  const nok = (v) =>
    v == null ? "" : Number(v).toLocaleString("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 0 });
  const km = (v) => (v == null ? "" : `${Number(v).toLocaleString("nb-NO")} km`);

  function imageUrl(fileId, { w = 960, h = 540, fit = "cover", format = "webp" } = {}) {
    if (!fileId) return "assets/images/projects/placeholder-car.jpg";
    // Bruk preset (raskt via CDN), fallback håndteres onerror i <img>
    return `${DIRECTUS_URL}/assets/${fileId}?key=${ASSET_KEY}`;
  }
  const escapeAttr = (str) => (str || "").replace(/"/g, "&quot;");

  function cardTemplate(car) {
    const {
      title, description, mileage, price, year, fuel_type, transmission, category, image, listing_url
    } = car;

    const imgId  = image && (image.id || image);
    const imgSrc = imageUrl(imgId);
    const cat    = (category || "").toString().trim();
    const ext    = listing_url && listing_url.trim() ? listing_url.trim() : "#";

    return `
      <div class="project__card" data-category="${escapeAttr(cat)}">
        <div class="project__image">
          <img
            src="${imgSrc}"
            alt="${escapeAttr(title || "Bil")}"
            class="project__img"
            loading="lazy"
            decoding="async"
            onerror="this.onerror=null;this.src='assets/images/projects/placeholder-car.jpg';"
          >
          <div class="project__overlay" aria-hidden="true">
            <div class="project__actions">
              <a class="project__btn" href="${escapeAttr(ext)}" target="_blank" rel="noopener" aria-label="Åpne annonse i ny fane">
                <i class="fas fa-external-link-alt" aria-hidden="true"></i>
              </a>
              <a class="project__btn" href="tel:+4732891234" aria-label="Ring oss om ${escapeAttr(title || "bilen")}">
                <i class="fas fa-phone" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="project__content">
          ${cat ? `<span class="project__category">${escapeAttr(cat.charAt(0).toUpperCase() + cat.slice(1))}</span>` : ""}
          <h3 class="project__title">${escapeAttr(title || "Uten tittel")}</h3>
          ${description ? `<p class="project__description">${description}</p>` : ""}
          <div class="project__details">
            ${year ? `<span class="project__detail"><i class="fas fa-calendar" aria-hidden="true"></i>${year}</span>` : ""}
            ${mileage ? `<span class="project__detail"><i class="fas fa-tachometer-alt" aria-hidden="true"></i>${km(mileage)}</span>` : ""}
            ${fuel_type ? `<span class="project__detail"><i class="fas fa-gas-pump" aria-hidden="true"></i>${escapeAttr(fuel_type)}</span>` : ""}
            ${transmission ? `<span class="project__detail"><i class="fas fa-cog" aria-hidden="true"></i>${escapeAttr(transmission)}</span>` : ""}
          </div>
          <div class="project__price">
            ${price ? `<span class="project__price-amount">${nok(price)}</span>` : ""}
          </div>
          <a href="index.html#kontakt" class="btn btn--secondary btn--small project__contact-btn">
            <i class="fas fa-paper-plane" aria-hidden="true"></i> Kontakt oss
          </a>
        </div>
      </div>
    `;
  }

  /* ---------- Directus spørring ---------- */
  function titleCase(v = "") {
  v = String(v).trim();
  if (!v) return v;
  // spesial-case for norsk
  if (v.toLowerCase() === "elektrisk") return "Elektrisk";
  if (v.toLowerCase() === "hybrid") return "Hybrid";
  if (v.toLowerCase() === "bensin") return "Bensin";
  if (v.toLowerCase() === "diesel") return "Diesel";
  if (v.toLowerCase() === "automat") return "Automat";
  if (v.toLowerCase() === "manuell") return "Manuell";
  // fallback: enkel Title Case
  return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
}

function buildDirectusFilter() {
  const and = [];

  // status = published
  and.push({ status: { _eq: "published" } });

  // kategori (fra top-chips)
  if (state.category && state.category !== "all") {
    and.push({ category: { _eq: state.category } });
  }

  // søk (tittel, beskrivelse, fuel_type, transmission)
  if (state.query) {
    const q = state.query;
    and.push({
      _or: [
        { title:        { _icontains: q } },
        { description:  { _icontains: q } },
        { fuel_type:    { _icontains: q } },
        { transmission: { _icontains: q } }
      ],
    });
  }

  // sidefiltre fra skjema
  const f = state.filters;

  if (f.body?.length) {
    and.push({ category: { _in: f.body } }); // disse matcher allerede DB'en hos deg
  }

  if (f.fuel?.length) {
    const fuels = f.fuel.map(titleCase); // f.eks. ["bensin","elektrisk"] -> ["Bensin","Elektrisk"]
    and.push({ fuel_type: { _in: fuels } });
  }

  if (f.gear?.length) {
    const gears = f.gear.map(titleCase);  // ["automat"] -> ["Automat"]
    and.push({ transmission: { _in: gears } });
  }

  if (f["year-min"])  and.push({ year:  { _gte: Number(f["year-min"]) } });
  if (f["year-max"])  and.push({ year:  { _lte: Number(f["year-max"]) } });
  if (f["price-min"]) and.push({ price: { _gte: Number(f["price-min"]) } });
  if (f["price-max"]) and.push({ price: { _lte: Number(f["price-max"]) } });

  return { _and: and };
}


  function sortToDirectus() {
    switch (state.sort) {
      case "price-asc":  return "price";
      case "price-desc": return "-price";
      case "year-desc":  return "-year";
      case "km-asc":     return "mileage";
      default:           return "-date_created";
    }
  }

  function buildKey() {
    // cache-key som reflekterer hele spørringa
    return JSON.stringify({
      page: state.page,
      category: state.category,
      query: state.query,
      sort: state.sort,
      filters: state.filters,
      limit: PAGE_SIZE
    });
  }

  async function fetchCarsActual(signal) {
    const params = new URLSearchParams();
    params.set(
      "fields",
      [
        "id","title","description","mileage","price","year",
        "fuel_type","transmission","category","image","listing_url","status"
      ].join(",")
    );
    params.set("filter", JSON.stringify(buildDirectusFilter()));
    params.set("sort",   sortToDirectus());
    params.set("limit",  String(PAGE_SIZE));
    params.set("page",   String(state.page));
    params.set("meta",   "filter_count");

    const headers = { Accept: "application/json" };
    if (DIRECTUS_TOKEN) headers.Authorization = `Bearer ${DIRECTUS_TOKEN}`;

    const res = await fetch(`${DIRECTUS_URL}/items/cars?${params.toString()}`, {
      headers,
      credentials: "omit",
      cache: "default",
      signal
    });

    if (!res.ok) throw new Error(`HTTP ${res.status} – ${res.statusText}`);
    const json = await res.json();
    return { rows: json.data || [], total: json?.meta?.filter_count ?? 0 };
  }

  /* ---------- UI states ---------- */
  function setLoading() {
    carsGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-light)">Laster biler …</div>`;
  }
  function setEmpty() {
    carsGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-light)">Ingen biler matchet filtrene.</div>`;
  }
  function setError(msg) {
    carsGrid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:2rem;">
        <p style="color:var(--error-color);font-weight:600">Kunne ikke hente biler.</p>
        <p style="color:var(--text-light)">${msg || "Prøv igjen senere."}</p>
      </div>`;
  }

  function renderRows(rows) {
    carsGrid.innerHTML = rows.map(cardTemplate).join("");
    if (typeof ScrollReveal !== "undefined") {
      const sr = ScrollReveal();
      sr.reveal(".project__card", { interval: 100, distance: "30px", origin: "bottom", duration: 800 });
    }
  }

  /* ---------- Render med abort, race-guard og cache ---------- */
  async function render({ useCacheFirst = true } = {}) {
    const key = buildKey();
    const now = Date.now();

    // Avbryt pågående request
    if (currentController) currentController.abort();
    currentController = new AbortController();
    const { signal } = currentController;

    const myRequestId = ++lastRequestId;

    // Cache-first visning (SWR)
    if (useCacheFirst && cache.has(key)) {
      const cached = cache.get(key);
      if (now - cached.ts < CACHE_TTL_MS) {
        // Vis med en gang
        renderRows(cached.rows);
        updateMetaUI(cached.total);
        // Revalider i bakgrunnen uten å forstyrre UI hvis alt er friskt
        try {
          const fresh = await fetchCarsActual(signal);
          if (myRequestId !== lastRequestId) return; // annen nyere request kom
          cache.set(key, { ...fresh, ts: Date.now() });
          // Bare oppdater om det faktisk er forskjell (valgfritt, her oppdaterer vi uansett)
          renderRows(fresh.rows);
          updateMetaUI(fresh.total);
          return;
        } catch (e) {
          if (e.name === "AbortError") return;
          // La cached stå – ikke overstyr med error
          console.error(e);
          return;
        }
      }
    }

    // Ingen gyldig cache → full last
    setLoading();
    try {
      const data = await fetchCarsActual(signal);
      if (myRequestId !== lastRequestId) return; // eldre svar, ignorer
      cache.set(key, { ...data, ts: Date.now() });

      if (!data.rows.length) setEmpty();
      else renderRows(data.rows);

      updateMetaUI(data.total);
    } catch (e) {
      if (e.name === "AbortError") return; // forventet
      console.error(e);
      setError(e.message);
    }
  }

  function updateMetaUI(total) {
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    resultCount  && (resultCount.textContent   = `Viser ${total} bil${total === 1 ? "" : "er"}`);
    pageIndicator && (pageIndicator.textContent = `Side ${state.page} / ${totalPages}`);
    prevBtn && (prevBtn.disabled = state.page <= 1);
    nextBtn && (nextBtn.disabled = state.page >= totalPages);
  }

  /* ---------- Event wiring (med debounce) ---------- */
  // Kategori-chips (øverst)
  const onChipClick = debounce((btn) => {
    filterButtons.forEach((b) => {
      b.classList.remove("filter__btn--active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("filter__btn--active");
    btn.setAttribute("aria-selected", "true");
    state.category = btn.getAttribute("data-filter") || "all";
    state.page = 1;
    render();
  }, 150);

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => onChipClick(btn));
  });

  // Søk (debounce)
  const onSearch = debounce((e) => {
    state.query = (e.target.value || "").trim().toLowerCase();
    state.page = 1;
    render();
  }, 300);
  searchEl?.addEventListener("input", onSearch);

  // Sortering (debounce)
  const onSortChange = debounce((e) => {
    state.sort = e.target.value;
    state.page = 1;
    render();
  }, 150);
  sortEl?.addEventListener("change", onSortChange);

  // Sidefiltre (debounce på "Bruk filtre")
  const applyFilters = debounce(() => {
    const form    = new FormData(filtersForm);
    const entries = Object.fromEntries(form.entries());
    state.filters = {
      body:  $$('#filters-form input[name="body"]:checked').map((i) => i.value),
      fuel:  $$('#filters-form input[name="fuel"]:checked').map((i) => i.value),
      gear:  $$('#filters-form input[name="gear"]:checked').map((i) => i.value),
      "year-min":  entries["year-min"]  || "",
      "year-max":  entries["year-max"]  || "",
      "price-min": entries["price-min"] || "",
      "price-max": entries["price-max"] || "",
    };
    state.page = 1;
    render();
  }, 200);

  applyBtn?.addEventListener("click", applyFilters);

  resetBtn?.addEventListener("click", () => {
    filtersForm?.reset();
    state.filters = { body: [], fuel: [], gear: [], "year-min": "", "year-max": "", "price-min": "", "price-max": "" };
    state.page = 1;
    render();
  });

  // Paginering
  prevBtn?.addEventListener("click", () => {
    if (state.page > 1) {
      state.page--;
      render({ useCacheFirst: true });
    }
  });
  nextBtn?.addEventListener("click", () => {
    state.page++;
    render({ useCacheFirst: true });
  });

  // Init
  render();
})();
