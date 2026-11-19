// Mobile navigation
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Reveal sections as they enter the viewport
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

// Subtle cursor glow on devices with a fine pointer
const cursorGlow = document.querySelector(".cursor-glow");
if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
} else {
  cursorGlow.style.display = "none";
}

// Back to top button
const backTop = document.querySelector(".back-top");
window.addEventListener("scroll", () => {
  backTop.classList.toggle("visible", window.scrollY > 500);
});
backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Dynamic footer year
document.querySelector("#year").textContent = new Date().getFullYear();

// Reading progress bar
const progressBar = document.querySelector(".scroll-progress span");
const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
};
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// Highlight the navigation link for the section currently in view
const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) navItems.forEach((link) =>
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)
      );
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach((section) => sectionObserver.observe(section));
}

// Switch between aurora dark and bright pastel themes; remember the choice
const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("tanvir-theme");
if (savedTheme === "light") document.body.classList.add("light-theme");
if (themeToggle) {
  const refreshThemeLabel = () => {
    const light = document.body.classList.contains("light-theme");
    themeToggle.innerHTML = light ? "☾ <span>NOIR</span>" : "☼ <span>WHITE</span>";
  };
  refreshThemeLabel();
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    localStorage.setItem("tanvir-theme", document.body.classList.contains("light-theme") ? "light" : "dark");
    refreshThemeLabel();
  });
}

// Subtle pointer tilt on cards (desktop only)
if (window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".profile-card, .timeline-card, .skill-panel, .mini-panel").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--tilt-x", `${-((event.clientY - rect.top) / rect.height - .5) * 2}deg`);
      card.style.setProperty("--tilt-y", `${((event.clientX - rect.left) / rect.width - .5) * 2}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
    });
  });
}
