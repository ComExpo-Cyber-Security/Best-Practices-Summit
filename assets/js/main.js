"use strict";

const header = document.getElementById("header");

window.onload = function () {
  headerAnimation();
};

window.onresize = function () {
  headerAnimation();
};

window.onscroll = function () {
  headerAnimation();
};

function headerAnimation() {
  let scrollTop = window.scrollY;
  if (scrollTop > 100) {
    header.classList.add("header-shrink");
  } else {
    header.classList.remove("header-shrink");
  }
}

let scrollLinks = document.querySelectorAll(".scrollto");
const pageNavWrapper = document.getElementById("navigation");

scrollLinks.forEach((scrollLink) => {
  scrollLink.addEventListener("click", (e) => {
    const href = scrollLink.getAttribute("href");
    if (!href || href.charAt(0) !== "#") {
      return;
    }
    e.preventDefault();
    let element = document.querySelector(href);
    if (!element) return;
    const yOffset = 69;
    const y =
      element.getBoundingClientRect().top + window.pageYOffset - yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
    if (pageNavWrapper && pageNavWrapper.classList.contains("show")) {
      pageNavWrapper.classList.remove("show");
    }
  });
});

let spy = new Gumshoe("#navigation a", {
  offset: 69,
});

/* ======= Countdown ========= */
let target_date = new Date("Mar 07, 2026").getTime();
let days, hours, minutes, seconds;
let countdown = document.getElementById("countdown-box");
let days_span = document.createElement("SPAN");
days_span.className = "days";
countdown.appendChild(days_span);
let hours_span = document.createElement("SPAN");
hours_span.className = "hours";
countdown.appendChild(hours_span);
let minutes_span = document.createElement("SPAN");
minutes_span.className = "minutes";
countdown.appendChild(minutes_span);
let secs_span = document.createElement("SPAN");
secs_span.className = "secs";
countdown.appendChild(secs_span);

setInterval(function () {
  let current_date = new Date().getTime();
  let seconds_left = (target_date - current_date) / 1000;
  days = parseInt(seconds_left / 86400);
  seconds_left = seconds_left % 86400;
  hours = parseInt(seconds_left / 3600);
  seconds_left = seconds_left % 3600;
  minutes = parseInt(seconds_left / 60);
  seconds = parseInt(seconds_left % 60);

  days_span.innerHTML =
    '<span class="number">' +
    days +
    "</span>" +
    '<span class="unit">Days</span>';
  hours_span.innerHTML =
    '<span class="number">' +
    hours +
    "</span>" +
    '<span class="unit">Hrs</span>';
  minutes_span.innerHTML =
    '<span class="number">' +
    minutes +
    "</span>" +
    '<span class="unit">Mins</span>';
  secs_span.innerHTML =
    '<span class="number">' +
    seconds +
    "</span>" +
    '<span class="unit">Secs</span>';
}, 1000);

// ===== Attendees: load from JSON and render =====

async function fetchAttendees(url = "assets/data/attendees.json") {
  const container = document.getElementById("attendees-container");
  const loader = document.getElementById("attendees-loader");
  const errorEl = document.getElementById("attendees-error");
  const countEl = document.getElementById("attendees-count");

  if (!container || !countEl || !errorEl) return;

  // show loader
  if (loader) loader.style.display = "block";
  errorEl.style.display = "none";

  try {
    const resp = await fetch(url, { cache: "no-cache" });
    if (!resp.ok) throw new Error("Network response not ok");
    const data = await resp.json();
    renderAttendees(Array.isArray(data) ? data : [], container, countEl);
  } catch (err) {
    console.error("Failed to load attendees", err);
    errorEl.style.display = "block";
    if (countEl) countEl.textContent = "0";
  } finally {
    if (loader) loader.style.display = "none";
  }
}

function renderAttendees(list, container, countEl) {
  // clear existing cards but keep loader slot removed earlier
  container.innerHTML = "";
  if (!Array.isArray(list) || list.length === 0) {
    container.innerHTML =
      '<div class="text-center py-4 text-muted">No attendees yet.</div>';
    countEl.textContent = "0";
    return;
  }

  countEl.textContent = String(list.length);

  // Render compact preview: show top 5 inline avatars + names; last item is +N more when list > 5
  const previewCount = 5;
  const previewList = list.slice(0, previewCount);

  previewList.forEach((att) => {
    const node = createAttendeePreview(att);
    container.appendChild(node);
  });

  if (list.length > previewCount) {
    const moreCount = list.length - previewCount;
    const moreEl = document.createElement("div");
    moreEl.className =
      "attendee-more d-flex align-items-center justify-content-center rounded-circle bg-danger text-white fw-bold";
    moreEl.textContent = `+${moreCount}`;
    moreEl.style.cursor = "pointer";
    moreEl.title = `Show all ${list.length} attendees`;
    moreEl.setAttribute("role", "button");
    moreEl.setAttribute("tabindex", "0");
    moreEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        moreEl.click();
      }
    });
    moreEl.addEventListener("click", () => {
      // populate modal and show it
      populateAttendeesModal(list);
      const modalEl = document.getElementById("attendees-modal");
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    });

    // wrap in a container to match grid sizing
    const wrap = document.createElement("div");
    wrap.className = "d-flex align-items-center justify-content-center";
    wrap.appendChild(moreEl);
    container.appendChild(wrap);
  }
}

function createAttendeeCard(att) {
  const col = document.createElement("div");
  col.className = "attendee card rounded-3 p-3 shadow-sm";

  const img = document.createElement("img");
  img.className = "attendee-avatar mb-3 rounded";
  img.alt = att.name || "Attendee";
  img.loading = "lazy";
  img.src = att.avatar || "assets/images/speakers/speaker-1.jpg";
  img.onerror = function () {
    this.src = "assets/images/speakers/speaker-1.jpg";
  };

  const name = document.createElement("h5");
  name.className = "mb-1";
  name.textContent = att.name || "Anonymous";

  const meta = document.createElement("div");
  meta.className = "text-muted small mb-2";
  meta.textContent = [att.role, att.company].filter(Boolean).join(" • ");

  // actions: LinkedIn link (optional)
  const actions = document.createElement("div");
  actions.className = "d-flex justify-content-start align-items-center gap-2";
  if (att.linkedin) {
    const link = document.createElement("a");
    link.href = att.linkedin;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "text-decoration-none";
    link.setAttribute("aria-label", att.name + " on LinkedIn");
    link.innerHTML =
      '<i class="fab fa-linkedin-in fa-lg" aria-hidden="true"></i>';
    actions.appendChild(link);
  }

  col.appendChild(img);
  col.appendChild(name);
  col.appendChild(meta);
  col.appendChild(actions);

  return col;
}

function createAttendeePreview(att) {
  const wrapper = document.createElement("div");
  wrapper.className = "attendee-preview text-center";

  const img = document.createElement("img");
  img.className = "attendee-avatar-preview rounded-circle mb-2";
  img.alt = att.name || "Attendee";
  img.loading = "lazy";
  img.src = att.avatar || "assets/images/speakers/speaker-1.jpg";
  img.onerror = function () {
    this.src = "assets/images/speakers/speaker-1.jpg";
  };

  const name = document.createElement("div");
  name.className = "attendee-preview-name fw-semibold";
  name.textContent = att.name || "Anonymous";

  const meta = document.createElement("div");
  meta.className = "attendee-preview-meta text-muted small";
  const role = att.role || "";
  const company = att.company || "";
  meta.textContent = [role, company].filter(Boolean).join(" • ");

  wrapper.appendChild(img);
  wrapper.appendChild(name);
  if (meta.textContent) wrapper.appendChild(meta);
  return wrapper;
}

function populateAttendeesModal(list) {
  const modalBody = document.getElementById("attendees-modal-body");
  if (!modalBody) return;
  modalBody.innerHTML = "";
  list.forEach((att) => {
    const card = createAttendeeCard(att);
    modalBody.appendChild(card);
  });
}

// Kick off after window load (append to existing onload handler)
window.addEventListener("load", function () {
  // small timeout to ensure DOM nodes present
  setTimeout(() => fetchAttendees(), 100);
});
