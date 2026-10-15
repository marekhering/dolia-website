# dolia-website

A Polish-language, single-page website for Dolia, a handmade handbag brand founded by two sisters. Built with plain HTML, CSS and JavaScript.

```text
README.md                 Project documentation (English)
docs/                     GitHub Pages website files
  index.html              Home page layout
  .nojekyll               Disable Jekyll processing on GitHub Pages
  content/
    pl.json               Polish copy, image list and social URLs
  assets/
    css/style.css         Responsive styles
    js/main.js            Content loading and rendering
    images/               Photos, logos and icons
```

## Preview

Serve `docs/` with a local HTTP server (for example, VS Code Live Server) and open `index.html` through that server. Opening the HTML directly with `file://` will not load the JSON content. No build or dependency installation is required.

## Content

Edit `docs/content/pl.json` to update website copy. Add photos to `assets/images/bags/` and entries to `gallery.images` (path, alternative text and dimensions). Add full HTTPS profile addresses to `contact.socials[].url`; blank addresses display a non-clickable placeholder. The pending-profile note disappears once both addresses are filled in.

Future translations can use sibling JSON files such as `en.json`; a language selector is not implemented. Content currently requires JavaScript. The HTML contains only the layout and fallback error messages.

## Hosting

The site is prepared for GitHub Pages using the `main` branch and `/docs` folder. Asset paths are relative to support a repository URL. Publishing has not been configured.
