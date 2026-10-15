# dolia-website

A single-page website for Dolia, a handmade handbag brand. Built with HTML, CSS and JavaScript, intended for GitHub Pages.

## Run locally

Install the Live Server extension in VS Code, then right-click `docs/index.html` and select **Open with Live Server**. Any local HTTP server will also work. Opening the file directly will not load the JSON content.

No build or dependency installation is required.

## Structure

```text
README.md                 Project documentation
docs/                     Website files / GitHub Pages root
  index.html              Page layout
  .nojekyll               Disable Jekyll processing
  content/
    pl.json               Text, image list and social links
  assets/
    css/style.css         Styles
    js/main.js            Content loading and interactions
    images/
      bags/               Bag photos
      logo/               Logo variants
```

Website content lives in `docs/content/pl.json`. Other languages can use separate files such as `en.json`; language switching is not implemented yet.
