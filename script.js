const dropdown = document.querySelector(".dropdown");
const hamburgerBtn = document.querySelector(".hamburg");
const cancelBtn = document.querySelector(".cancel");
const certificateModal = document.getElementById("certificateModal");
const modalImage = document.getElementById("modalImage");
const revealSelectors = [
  ".education-item",
  ".certification-item",
  ".skill-card",
  ".project-card",
  ".info-item",
  ".about-buttons .section-btn",
  ".social-links a",
  ".contact-form",
  ".personal-statement",
  ".skill-category"
];

function toggleMenu(show) {
  if (!dropdown) {
    return;
  }

  dropdown.classList.toggle("active", show);
  document.body.style.overflow = show ? "hidden" : "";

  if (hamburgerBtn) {
    hamburgerBtn.setAttribute("aria-expanded", String(show));
  }
}

function setActiveNavLink() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll('.nav-container .links a, .dropdown .links a');
  const offset = 120;
  let currentId = "home";

  sections.forEach((section) => {
    const top = section.offsetTop - offset;
    const bottom = top + section.offsetHeight;

    if (window.scrollY >= top && window.scrollY < bottom) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
}

function initTypewriter() {
  const texts = ["Undergraduate", "Web Developer", "Figma UI Designer"];
  const typewriterText = document.querySelector(".typewriter-text");

  if (!typewriterText) {
    return;
  }

  const speeds = {
    typing: 100,
    erasing: 50,
    pauseBetween: 1000,
    pauseAfter: 500
  };

  let textIndex = 0;
  let charIndex = 0;
  let isErasing = false;

  function type() {
    const currentText = texts[textIndex];

    if (!isErasing) {
      typewriterText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentText.length) {
        isErasing = true;
        setTimeout(type, speeds.pauseBetween);
      } else {
        setTimeout(type, speeds.typing);
      }
    } else {
      typewriterText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isErasing = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(type, speeds.pauseAfter);
      } else {
        setTimeout(type, speeds.erasing);
      }
    }
  }

  type();
}

function initRevealAnimations() {
  const revealItems = document.querySelectorAll(revealSelectors.join(", "));

  revealItems.forEach((item, index) => {
    item.classList.add("reveal-item");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 90}ms`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.14,
    rootMargin: "0px 0px -40px 0px"
  });

  revealItems.forEach((item) => observer.observe(item));
}

function downloadCV() {
  const link = document.createElement("a");
  link.href = "assets/Ravidu-Gunawardhana-Resume.pdf";
  link.download = "Ravidu-Gunawardhana-Resume.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function openModal(imageSrc) {
  if (!certificateModal || !modalImage) {
    return;
  }

  certificateModal.style.display = "block";
  modalImage.src = imageSrc;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!certificateModal) {
    return;
  }

  certificateModal.style.display = "none";
  document.body.style.overflow = dropdown?.classList.contains("active") ? "hidden" : "";
}

window.toggleMenu = toggleMenu;
window.downloadCV = downloadCV;
window.openModal = openModal;
window.closeModal = closeModal;

hamburgerBtn?.addEventListener("click", () => toggleMenu(true));
cancelBtn?.addEventListener("click", () => toggleMenu(false));

dropdown?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => toggleMenu(false));
});

document.addEventListener("click", (e) => {
  if (!dropdown?.classList.contains("active")) {
    return;
  }

  if (!e.target.closest(".nav-container") && !e.target.closest(".dropdown")) {
    toggleMenu(false);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (certificateModal?.style.display === "block") {
      closeModal();
      return;
    }

    toggleMenu(false);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    toggleMenu(false);
  }
});

window.addEventListener("scroll", setActiveNavLink);

certificateModal?.addEventListener("click", (e) => {
  if (e.target === certificateModal) {
    closeModal();
  }
});

AOS.init({
  offset: 20,
  duration: 800,
  easing: "ease-in-out",
  once: true
});

document.addEventListener("DOMContentLoaded", () => {
  initTypewriter();
  setActiveNavLink();
  initRevealAnimations();

  document.querySelectorAll("a, button").forEach((element) => {
    element.addEventListener("click", () => {
      setTimeout(() => element.blur(), 120);
    });
  });

  document.getElementById("contactForm")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formMessage = document.getElementById("form-message");

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    fetch(form.action, {
      method: "POST",
      body: new FormData(form)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        formMessage.textContent = "Message sent successfully!";
        formMessage.style.color = "#077b32";
        form.reset();
      })
      .catch(() => {
        formMessage.textContent = "Error sending message. Please try again.";
        formMessage.style.color = "#ff3333";
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
        setTimeout(() => {
          formMessage.textContent = "";
        }, 5000);
      });
  });
});
