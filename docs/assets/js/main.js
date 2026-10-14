"use strict";

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

    const socialLinks = document.getElementById("social-links");
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
      }
      const name = document.createElement("span");
      name.textContent = social.name;
      const status = document.createElement("span");
      status.className = "social-status";
      status.textContent = hasUrl ? "↗" : content.contact.placeholder;
      if (hasUrl) status.setAttribute("aria-hidden", "true");
      element.append(name, status);
      socialLinks.append(element);
    });
    if (content.contact.socials.every((social) => /^https:\/\//i.test(social.url))) {
      document.querySelector(".contact-note").hidden = true;
    }
    document.documentElement.classList.add("content-ready");
  } catch (error) {
    document.getElementById("load-error").hidden = false;
    console.error("Unable to load Dolia content:", error);
  }
}

loadContent();
