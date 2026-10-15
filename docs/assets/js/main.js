"use strict";

function setupScrollAnimations() {
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motionPreference.matches || !("IntersectionObserver" in window)) return;

  const elements = document.querySelectorAll(
    ".hero-copy > *, .gallery img, .image-caption, .section-wave, " +
    ".about-heading, .about-copy > *, .contact-heading, .contact-links, .site-footer"
  );
  const reveal = (element) => {
    element.classList.add("is-visible");
    observer.unobserve(element);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) reveal(entry.target);
    });
  }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });

  elements.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
    // Keyboard navigation must never land on an invisible link.
    element.addEventListener("focusin", () => reveal(element), { once: true });
  });

  motionPreference.addEventListener("change", (event) => {
    if (event.matches) {
      observer.disconnect();
      elements.forEach((element) => element.classList.add("is-visible"));
    }
  });
}

async function loadContent() {
  try {
    const response = await fetch("content/pl.json");
    if (!response.ok) throw new Error(`Content request failed: ${response.status}`);
    const content = await response.json();
    const getText = (key) => key.split(".").reduce((value, part) => value?.[part], content);

    document.querySelectorAll("[data-text]").forEach((element) => {
      const text = getText(element.dataset.text);
      if (typeof text !== "string") throw new Error(`Missing content: ${element.dataset.text}`);
      element.textContent = text;
    });
    document.querySelectorAll("[data-label]").forEach((element) => {
      element.setAttribute("aria-label", getText(element.dataset.label));
    });
    document.title = content.meta.title;
    document.querySelector('meta[name="description"]').content = content.meta.description;

    const gallery = document.getElementById("gallery");
    content.gallery.images.forEach((photo, index) => {
      const image = document.createElement("img");
      image.src = photo.src;
      image.alt = photo.alt;
      image.width = photo.width;
      image.height = photo.height;
      image.loading = index === 0 ? "eager" : "lazy";
      if (index === 0) image.fetchPriority = "high";
      gallery.append(image);
    });

    const socialIcons = {
      Instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
      Facebook: '<path d="M14 21v-8h3l.5-4H14V7c0-1.2.4-2 2-2h2V1.5c-.7-.1-1.7-.2-3-.2-3 0-5 1.8-5 5.2V9H7v4h3v8z" fill="currentColor" stroke="none"/>'
    };
    document.querySelectorAll("[data-social-links]").forEach((socialLinks) => {
      content.contact.socials.forEach((social) => {
        const hasUrl = /^https:\/\//i.test(social.url);
        const element = document.createElement(hasUrl ? "a" : "div");
        element.className = "social-link";
        if (hasUrl) {
          element.href = social.url;
          element.target = "_blank";
          element.rel = "noopener noreferrer";
        } else {
          element.classList.add("social-placeholder");
          element.setAttribute("aria-disabled", "true");
        }
        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("viewBox", "0 0 24 24");
        icon.setAttribute("fill", "none");
        icon.setAttribute("stroke", "currentColor");
        icon.setAttribute("stroke-width", "1.7");
        icon.setAttribute("aria-hidden", "true");
        icon.classList.add("social-icon");
        icon.innerHTML = socialIcons[social.name] || "";
        const name = document.createElement("span");
        name.textContent = social.name;
        const status = document.createElement("span");
        status.className = "social-status";
        status.textContent = hasUrl ? "↗" : content.contact.placeholder;
        if (hasUrl) status.setAttribute("aria-hidden", "true");
        const label = document.createElement("span");
        label.className = "social-name";
        label.append(icon, name);
        element.append(label, status);
        socialLinks.append(element);
      });
    });
    if (content.contact.socials.every((social) => /^https:\/\//i.test(social.url))) {
      document.querySelector(".contact-note").hidden = true;
    }
    document.documentElement.classList.add("content-ready");
    setupScrollAnimations();
  } catch (error) {
    document.getElementById("load-error").hidden = false;
    console.error("Unable to load Dolia content:", error);
  }
}

loadContent();
