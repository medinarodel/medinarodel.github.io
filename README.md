# Rodel Medina portfolio

Static, dependency-free portfolio built with semantic HTML, responsive CSS, and a small progressive-enhancement script. The interface is a conversation-led portfolio, using a familiar chat layout as a way to explore projects, career history, and engineering tools. Answers are curated from confirmed notes and do not depend on a live AI service. On mobile, navigation becomes a slide-in drawer and the conversation composer stays anchored at the bottom. Light and dark themes follow the system preference by default; a visitor's choice is saved locally.

## Content status

- Seven project case studies (NeuroFlow, XPL, GravyWork, Rover, Field Reporting Platform, Field Network Platform, Geographic Data Platform) live in `index.html` as expandable items in the work index, so they are crawlable. Chat answers copy their content from the HTML, so edit case study text in `index.html` only.
- The career section presents Sourcepad and Microblink employment, then independent contract engineering from 2023 with parallel client engagements. Dates are shown as years only.
- The domain is `rodm.dev`. The canonical URL, Open Graph and Twitter/X card tags, JSON-LD (`WebSite`, `ProfilePage`, `Person`), `sitemap.xml`, and the sitemap line in `robots.txt` use it.
- The share image `og-image.png` (1200×630) is rendered from `og/og-image.html` with headless Chrome at a 1200×630 window. Icons: `favicon.svg` (switches to a light tile in dark mode), `favicon-96.png`, `apple-touch-icon.png`, all using the "r." mark. The same mark is inline SVG in `index.html` and `markSvg` in `app.js`; change all of them together. Re-render the PNGs if the title or mark changes, and update `lastmod` in `sitemap.xml` when content changes.
- The Contact answer links to Rodel’s email and the résumé PDF (`rodel-medina-resume.pdf`). The PDF is printed from `resume/resume.html` with headless Chrome (A4); update both together, using the same verified wording as the case studies. LinkedIn and GitHub are not added.

The page uses no client screenshots or proprietary assets. Reduced-motion preferences disable entrance and status animations.

## Coding agents

- `AGENTS.md` is the shared project guidance for coding agents.
- `CLAUDE.md` imports `AGENTS.md` so Claude Code can use the same source of truth.
- Private content notes live in `AGENTS.local.md`. It is listed in `.gitignore` and is never committed.

## Deployment

- The site is published with GitHub Pages from the `medinarodel/medinarodel.github.io` repository. Every committed file is public.
- `CNAME` sets the custom domain `rodm.dev`. `.nojekyll` makes GitHub Pages serve the files as they are.
