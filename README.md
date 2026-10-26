# Abid Emam — Portfolio

A developer-focused portfolio for Abid Emam, Medical Student & Creative
Developer, built around a simple idea: medicine, technology and ideas, in
one place.

**Live site:** https://void0null0coder.github.io/abid-emam-portfolio/

## What is on the site

- **Hero** — name, title, tagline, and a live 3D wireframe drawn in the
  browser with plain JavaScript (no 3D library, no network requests).
  It follows the mouse slightly and pauses when the tab is hidden.
- **About** — bio, MBBS at Dinajpur Medical College, and why a medical
  background makes the building better.
- **Projects** — three verified projects, each with its real problem,
  real tech stack, real repository link, and real live demo where one
  exists:
  - **AE-Timer** — multi-board timer app (HTML/CSS/JavaScript).
    Live: https://void0null0coder.github.io/AE-Timer/
  - **AyaatSync** — mood-based Qur'an verse app: 80 ayats, 20 per mood
    (Happy, Sad, Angry, Anxious), with Arabic script, English
    translation and Surah reference (React + TypeScript + Vite).
    Its demo is its StackBlitz workspace, not a GitHub Pages site.
  - **DjMC Exam Todo** — 29-day, 140-task exam tracker with a 60-item
    revision tracker (HTML/CSS/JavaScript).
    Live: https://void0null0coder.github.io/djmc-exam-todo/
- **Exploring** — interests, presented as interests, not as measured
  proficiency.
- **Path** — a short timeline, including future interests such as a
  digital presence for Boi Bichitra Rajshahi, a family bookshop.
- **Contact** — GitHub profile link. A public email address and other
  social links are intentionally *not* listed until Abid confirms them.

## Tech

Plain HTML, CSS and JavaScript. No build step, no backend, no tracking,
no external fonts or images. That keeps the site fast, easy to host on
GitHub Pages, and easy to edit by hand.

## Run it locally

Any static server works, for example:

```bash
cd abid-emam-portfolio
python3 -m http.server 8000
```

Then open http://localhost:8000/ in a browser.

(Opening `index.html` directly also works — all links are relative.)

## Deploy on GitHub Pages

1. Push this folder to the `abid-emam-portfolio` repository, `main` branch.
2. In the repository: Settings → Pages → Source: "Deploy from a branch",
   Branch: `main`, Folder: `/ (root)` → Save.
3. The site appears at
   https://void0null0coder.github.io/abid-emam-portfolio/

## How to update it

- **A project:** edit its card in `index.html` (name, description, tags,
  links). Keep the description tied to what the project actually does.
- **The photo:** the hero shows Abid's photo (`photo.jpg`, a square
  crop of the portrait he supplied, shown inside the circular frame).
  To swap it later, just replace `photo.jpg` with a new square image
  of the same name — no HTML change needed.
- **Email / socials:** add them to the contact section in `index.html`
  only once the addresses are confirmed — never guess one.
- **Colours:** edit the CSS variables at the top of `styles.css`
  (`--violet`, `--cyan`, `--blue`, `--bg`).
- **Motion:** the hero animation already respects
  `prefers-reduced-motion` and pauses on hidden tabs.

## Accessibility notes

Semantic HTML, a skip link, visible focus styles, keyboard-usable
navigation, and reduced-motion support are built in. The 3D canvas is
decorative (`aria-hidden`) and carries no information on its own.
