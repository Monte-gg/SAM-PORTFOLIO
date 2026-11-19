// SAM PORTFOLIO – interactions
document.documentElement.classList.add("js");

/* ---------- 0. Light / dark theme (remembered between visits) ---------- */
const themeBtn = document.getElementById("theme-toggle");
function showThemeIcon() {
  themeBtn.textContent = document.documentElement.dataset.theme === "dark" ? "\u2600" : "\u263E";
}
themeBtn.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
  showThemeIcon();
});
showThemeIcon();

/* ---------- 1. Mobile menu ---------- */
const toggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("nav-links");
toggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    toggle.setAttribute("aria-expanded", false);
  })
);

/* ---------- 2. Highlight current section in the menu ---------- */
const sections = document.querySelectorAll("main section[id]");
const links = navLinks.querySelectorAll("a:not(.nav-cta)");
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => spy.observe(s));

/* ---------- 3. Scroll reveal ---------- */
const reveal = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        reveal.unobserve(e.target);
      }
    }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));

/* ---------- 4. Project filter ---------- */
const filterButtons = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".card-project");
filterButtons.forEach((btn) =>
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    projectCards.forEach((card) =>
      card.classList.toggle("hidden", f !== "all" && card.dataset.category !== f)
    );
  })
);

/* ---------- 5. Project details popup ---------- */
const modal = document.getElementById("project-modal");
const modalContent = document.getElementById("modal-content");

function openModal(card) {
  const tag = card.querySelector(".tag").textContent;
  const title = card.querySelector("h3").textContent;
  const meta = card.querySelector(".meta");
  const details = card.querySelector(".details").innerHTML;
  modalContent.innerHTML =
    `<span class="tag">${tag}</span><h3>${title}</h3>` +
    (meta ? `<p class="meta">${meta.textContent}</p>` : "") +
    details;
  modal.showModal();
}
document.querySelectorAll("[data-modal]").forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.closest("a")) return; // let real links work normally
    openModal(card);
  });
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(card);
    }
  });
});
modal.querySelector(".modal-close").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close();
});

/* ---------- 6. Contact form (opens your email app) ---------- */
const form = document.getElementById("contact-form");
const note = document.getElementById("form-note");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const subject = encodeURIComponent("Portfolio message from " + d.get("name"));
  const body = encodeURIComponent(d.get("message") + "\n\nFrom: " + d.get("name") + " (" + d.get("email") + ")");
  window.location.href = `mailto:nzungasamuel@gmail.com?subject=${subject}&body=${body}`;
  note.textContent = "Opening your email app…";
  form.reset();
});
