# Ubuntu Paws Rescue – Website Project (Parts 1 to 3)

> **Student information (complete before submitting)**
> - Full name: `[YOUR FULL NAME]`
> - Student number: `[YOUR STUDENT NUMBER]`
> - Subject name and code: `[SUBJECT NAME AND CODE]`
> - Group (if applicable): `[GROUP]`
> - Live site: `[YOUR NETLIFY / GITHUB PAGES URL]`

---

## Table of contents
1. [Project overview](#1-project-overview)
2. [Website goals and objectives](#2-website-goals-and-objectives)
3. [Key features and functionality](#3-key-features-and-functionality)
4. [Sitemap and folder structure](#4-sitemap-and-folder-structure)
5. [Timeline and milestones](#5-timeline-and-milestones)
6. [Part 1 details](#6-part-1-details)
7. [Part 2 details](#7-part-2-details)
8. [Part 3 details (this submission)](#8-part-3-details-this-submission)
9. [Changelog](#9-changelog)
10. [Testing and debugging](#10-testing-and-debugging)
11. [Deployment](#11-deployment)
12. [Git workflow and commit history](#12-git-workflow-and-commit-history)
13. [References](#13-references)

---

## 1. Project overview

**Ubuntu Paws Rescue** is a *fictional* non-profit animal rescue based in Johannesburg, South Africa. The organisation rescues and rehomes dogs and cats, runs a low-cost sterilisation clinic, and relies on volunteers, foster carers and monthly sponsors. The website presents the organisation, lets visitors search its services, enquire about volunteering, sponsoring, adopting or fostering, and contact the team.

The storyline is hypothetical, so all names, addresses, prices and statistics are invented but realistic. The email address uses the reserved `.example` domain so that no real person is contacted.

**Target audience:** Johannesburg residents aged 18 to 60 who are looking to adopt, volunteer, sponsor or get affordable veterinary care for a pet, and local schools.

## 2. Website goals and objectives

| Goal | How it is measured (KPI) |
|------|--------------------------|
| Increase adoptions | Number of adoption enquiries submitted per month |
| Grow the volunteer base | Number of volunteer enquiries per month |
| Generate monthly sponsorships | Number of sponsorship enquiries; conversion to sponsors |
| Raise local visibility | Organic search visits for terms such as "animal rescue Johannesburg" |
| Provide a usable, accessible site | Pages pass keyboard navigation and work from 360 px to desktop width |

## 3. Key features and functionality

| Feature | Where | Files |
|---------|-------|-------|
| Responsive layout with breakpoints at 900 px and 600 px, relative units, mobile menu | All pages | `css/style.css`, `js/main.js` |
| Scroll-reveal animation and animated counters | Home | `css/style.css`, `js/main.js` |
| Tabs (Our story / Mission / Vision) | About | `js/main.js` |
| Gallery with lightbox (native `<dialog>`) | About | `js/gallery.js` |
| Dynamic services loaded with `fetch()`, plus search, category filter and sort | Services | `js/services.js`, `data/services.json` |
| Accordion FAQ | Services | `js/main.js` |
| Enquiry form with JavaScript validation and AJAX cost and availability response | Enquiry | `js/forms.js`, `data/enquiry-rates.json` |
| Contact form that validates and compiles an email to the recipient set in the code | Contact | `js/forms.js` |
| Interactive Leaflet map with two locations | Contact | `js/map.js` |
| SEO: titles, descriptions, headings, alt text, canonical URLs, Open Graph, JSON-LD, `robots.txt`, `sitemap.xml` | All pages | see section 8.3 |
| Security: Content Security Policy, security headers, safe DOM methods | All pages | `_headers`, `<meta>` CSP |

## 4. Sitemap and folder structure

```
Home (index.html)
├── About (about.html)        – story, mission, vision, team, gallery
├── Services (services.html)  – searchable services, FAQ
├── Enquiry (enquiry.html)    – volunteer / sponsor / adopt / foster / school form
└── Contact (contact.html)    – two-location map, contact form
```

```
ubuntu-paws-rescue/
├── index.html  about.html  services.html  enquiry.html  contact.html
├── robots.txt  sitemap.xml  _headers  README.md
├── css/    style.css
├── js/     main.js  gallery.js  services.js  forms.js  map.js
├── data/   services.json  enquiry-rates.json
└── images/ logo.svg  favicon.svg  hero-paw-pattern.svg  gallery-*.svg (6 files)
```

The brief requires at least five pages (`index`, `about`, `services`, `enquiry`, `contact`) and the folders `css`, `js` and `images`. A `data` folder was added to hold the JSON files that the JavaScript loads, and `robots.txt`, `sitemap.xml` and `_headers` were added in the root for Part 3 (SEO and security). These extra items are documented here as the brief requires.

## 5. Timeline and milestones

> Replace the dates with the submission dates of your subject.

| Milestone | Date | Status |
|-----------|------|--------|
| Part 1: proposal, content research, HTML structure | `[DATE]` | Submitted |
| Part 2: CSS and responsive design | `[DATE]` | Submitted, feedback received |
| Part 3: JavaScript, forms, SEO, deployment | `[DATE]` | This submission |

## 6. Part 1 details

> Complete from your submitted Website Project Proposal (organisation overview, two proposals, content sources, wireframes). Part 1 feedback has not been added yet. See the changelog placeholder in section 9.

## 7. Part 2 details

Part 2 delivered the external stylesheet `css/style.css`, a CSS reset, typography, a flexbox and grid layout, `:hover`, `:focus` and `:active` states, and a responsive design (multi-column on desktop, single column on mobile). Part 2 feedback said the CSS and responsive design were strong, so they were kept and extended rather than rewritten.

**Responsive screenshot evidence (Part 2 requirement):** `[INSERT SCREENSHOTS: desktop, tablet and mobile, including different devices, taken with browser developer tools]`

## 8. Part 3 details (this submission)

### 8.1 JavaScript enhancements

**Interactive elements**

- **Tabs** (`main.js`): follow the WAI-ARIA tabs pattern (W3C, n.d.a). Arrow keys, Home and End move between tabs and only the active panel is shown.
- **Accordion** (`main.js`): FAQ buttons toggle `aria-expanded` and an animated panel (CSS `grid-template-rows` transition). Only one panel is open at a time, following the accordion pattern (W3C, n.d.b).
- **Modal / lightbox** (`gallery.js`): the gallery uses the native `<dialog>` element (MDN, n.d.a), which provides a modal backdrop, focus trapping and Escape-to-close. Previous and Next buttons and the arrow keys move through the six images, and focus returns to the thumbnail that opened it.
- **Interactive map** (`map.js`): Leaflet (Agafonkin, 2023) with OpenStreetMap tiles (OpenStreetMap contributors, n.d.). One marker per location is created from the `data-*` attributes in `contact.html`, so the page list and the map always agree. There are two locations, as the brief requires (more than one).
- **Animations and transitions** (`style.css`, `main.js`): scroll-reveal using the Intersection Observer API (MDN, n.d.b), animated number counters using `requestAnimationFrame`, hover transitions on cards and buttons, and a tab fade-in. Animations are disabled when the user prefers reduced motion (`prefers-reduced-motion`).
- **DOM manipulation** (`services.js`, `forms.js`, `gallery.js`): cards, options, error messages and form responses are created with `createElement`, `appendChild` and `textContent`. `innerHTML` is not used with data, which prevents script injection.

**Dynamic content** (`services.js`)

The eight services are stored in `data/services.json` and loaded with the Fetch API (MDN, n.d.c). The visitor can:
- **search** by typing (matches name, description and category),
- **filter** by category (the category list is built from the data), and
- **sort** by name or price, ascending or descending.

A live-region message ("Showing 3 of 8 services") announces results to screen readers, and a friendly message is shown if the file cannot be loaded.

### 8.2 Forms

Both forms use `<form>`, `<label>`, `<input>`, `<select>` and `<textarea>`, with HTML5 attributes (`required`, `type="email"`, `type="tel"`, `type="date"`, `min`, `max`, `minlength`, `maxlength`) as a fallback. `novalidate` is set so that JavaScript can show consistent, specific messages.

| Rule | Details |
|------|---------|
| Name | 2 to 60 characters; letters, spaces, hyphens, apostrophes |
| Email | must match `name@domain.tld` |
| Phone | South African format: `0` or `+27` followed by 9 digits; spaces, dashes and brackets ignored. Required on the enquiry form, optional on the contact form |
| Date (enquiry) | real calendar date, from tomorrow up to 12 months ahead |
| Quantity (enquiry) | whole number from 1 to 50 |
| Message | enquiry 10 to 500 characters; contact 20 to 1000 characters; live character counter |
| Selects / consent | must be chosen / ticked |

**Error handling:** each field has its own message below it (`aria-live="polite"`), the field gets a red border and `aria-invalid="true"`, and focus moves to the first invalid field on submit. Fields are validated when the visitor leaves them, then re-checked as they type once they have been flagged.

**`enquiry.html` (purpose: ask about a service and get a quote).** After validation, the form uses AJAX (`fetch`) to load `data/enquiry-rates.json` and shows a response **without reloading the page**: the cost (for example sponsoring 2 animals gives R500 per month), the availability for the chosen weekday and opening hours, or the next available day if the chosen day is closed, and a note about what to expect.

**`contact.html` (purpose: send a general message).** After validation, the form compiles a formatted email (type, name, email, phone, message) and shows a preview. The **Open in my email app** button is a `mailto:` link to the recipient set in `js/forms.js` (`RECIPIENT`). Values are passed through `encodeURIComponent`, and line breaks are removed from the subject to avoid header injection. If a form service URL is placed in `FORM_ENDPOINT`, the data is also posted asynchronously with `fetch` (and the `connect-src` directive in the CSP must then be extended to include that URL).

**Form submission / `action`:** both forms carry an `action` attribute pointing back to their own page as a no-JavaScript fallback. With JavaScript enabled, `submit` is intercepted and the AJAX flow above is used.

### 8.3 Search Engine Optimisation

**On-page SEO**

| Item | Implementation |
|------|----------------|
| Keyword research | Focus terms chosen for local intent: *animal rescue Johannesburg*, *adopt a dog Johannesburg*, *volunteer animal shelter*, *sterilisation clinic*, *sponsor an animal*. They appear naturally in titles, descriptions, headings and body text rather than being repeated artificially (Google, n.d.a) |
| Title tags and meta descriptions | Unique title (about 40 to 60 characters) and description (140 to 146 characters) on every page |
| Header tags | One `<h1>` per page, then `<h2>` and `<h3>` in order |
| Image optimisation | Descriptive file names (`gallery-adoption-day.svg`, not `img1.svg`), meaningful `alt` text, width and height set, `loading="lazy"` on gallery images. Images are lightweight SVG files |
| URL structure | Short, lowercase, descriptive paths: `/services.html`, `/contact.html` |
| Internal linking | Body text links between pages (for example from the home page to services, enquiry and contact) plus the footer quick links |
| Mobile-friendliness | `viewport` meta tag, responsive layout, touch-sized buttons |
| Canonical, Open Graph and Twitter tags | Present on every page |
| Structured data | JSON-LD using the `AnimalShelter` type (Schema.org, n.d.) on the home and contact pages, which supports local search |

**Off-page SEO (plan; this is carried out after deployment, not in code)**

- **Backlinks:** ask local pet shops, vets, schools and community Facebook groups to link to the site, and list the shelter in local business directories.
- **Social media:** share adoption stories and event announcements with a link back to the site, using the Open Graph tags so previews show correctly.
- **Local SEO:** claim a Google Business Profile with the same name, address and phone number used on the contact page, and keep them consistent.

**Additional requests**

- **`robots.txt`:** allows crawling of all pages, excludes `/data/` (files for the site's scripts) and points to the sitemap (Google, n.d.b).
- **`sitemap.xml`:** lists all five pages with `lastmod` and `priority` (Google, n.d.c). The domain is a placeholder that **must be replaced with your real deployed URL** (also in `robots.txt`, the canonical and Open Graph tags, and the JSON-LD) before submitting to Google Search Console.
- **Page speed:** no frameworks or jQuery, one small stylesheet, scripts loaded with `defer`, SVG images, lazy-loaded gallery, cache headers in `_headers`, and Leaflet loaded only on the contact page.
- **Security:** a Content Security Policy that only allows the site's own files plus the Leaflet library and OpenStreetMap tiles (OWASP Foundation, n.d.); Leaflet is loaded with Subresource Integrity hashes; `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy` headers set in `_headers` (Netlify, n.d.a); no use of `innerHTML` with data; email links are encoded. The CSP `<meta>` tag keeps most protection in place on hosts that ignore `_headers`, such as GitHub Pages.

### 8.4 Accessibility notes
Skip link, semantic landmarks (`header`, `nav`, `main`, `footer`), visible focus outlines, labelled form controls, error messages announced to screen readers, keyboard-operable tabs, accordion and lightbox, sufficient colour contrast, and reduced-motion support.

## 9. Changelog

All dates are 2026. Entries are grouped by the feedback they respond to, then by new Part 3 work.

### 9.1 Edits made in response to Part 2 feedback

**Feedback received:** *"External CSS and responsive design are strong, but missing JavaScript, documentation, a changelog, references, and Git history reduces functionality."*

| # | Feedback point | What was changed | Files affected |
|---|----------------|------------------|----------------|
| 1 | External CSS and responsive design are strong | **Kept.** The stylesheet structure, relative units and breakpoints were retained and extended with new components (tabs, accordion, lightbox, map, form states, animations) in clearly labelled sections, so existing styling stays consistent. | `css/style.css` |
| 2 | Missing JavaScript | Added a `js/` folder with five scripts (`main.js`, `gallery.js`, `services.js`, `forms.js`, `map.js`). They add navigation, tabs, accordion, animations, lightbox, map, dynamic content with search, filter and sort, and validated AJAX forms. Each file starts with a comment block explaining its purpose. Pages load them with `defer`. | `js/*`, all `.html` files |
| 3 | Missing documentation | Wrote this README (overview, goals, features, sitemap, folder structure, timeline, per-part details, testing, deployment, Git workflow). Added explanatory comments throughout the HTML, CSS and JavaScript. | `README.md`, all source files |
| 4 | Missing changelog | Created this changelog section, with detailed entries for the feedback fixes (9.1) and the new work (9.2). | `README.md` |
| 5 | Missing references | Added the Harvard-style reference list (section 13) and in-text citations for libraries, patterns and guidance used. Images are original SVG artwork made for this project, so no third-party image licences apply. | `README.md` |
| 6 | Missing Git history | Initialised version control with small, descriptive commits (one per feature; see section 12) instead of a single large upload, so the evolution of the project is visible. | Git repository |

### 9.2 New in Part 3

| Date | Type | Change |
|------|------|--------|
| 27 Oct | Added | Project structure, original SVG images (logo, favicon, hero pattern, six gallery images) |
| 27 Oct | Added | Five HTML pages with shared header, navigation (`aria-current`), footer and semantic structure |
| 27 Oct | Changed | Stylesheet extended with Part 3 components and a `prefers-reduced-motion` rule |
| 27 Oct | Added | `main.js`: mobile menu, scroll-reveal, counters, tabs, accordion |
| 27 Oct | Added | `gallery.js`: lightbox with keyboard support and focus return |
| 27 Oct | Added | `services.js` and `data/services.json`: dynamic services with search, filter, sort |
| 27 Oct | Added | `map.js`: Leaflet map with two markers; cards also focus markers |
| 27 Oct | Added | `forms.js`, `data/enquiry-rates.json`: validation, error handling, AJAX enquiry response, compiled contact email |
| 27 Oct | Added | `robots.txt`, `sitemap.xml`, `_headers`, meta tags, Open Graph tags, JSON-LD |
| 27 Oct | Added | README documentation, changelog and references |

### 9.3 Part 1 feedback
> **Not yet recorded.** Part 1 feedback has not been added. When you have it, add one row per feedback point using the same table as 9.1 (point, change made, files affected).

## 10. Testing and debugging

**Checks run during development**
- JavaScript syntax check on all five scripts: passed.
- Link and file check: every `href` and `src` points to an existing file; no duplicate `id` values; exactly one `<h1>` per page.
- Both JSON data files parse correctly.

**Checks still to be done by the student in a browser (record results here)**

| Test | Chrome | Firefox | Edge / Safari | Phone |
|------|--------|---------|---------------|-------|
| Navigation links and mobile menu | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Tabs, accordion, lightbox (keyboard and mouse) | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Services search, filter and sort | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Enquiry form: invalid then valid input, response shown | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Contact form: email preview and mail link | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Map loads with two markers and popups | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

Important: serve the site through a web server (for example the VS Code **Live Server** extension, or `python -m http.server`) when testing. Opening the files by double-clicking blocks `fetch()` for the JSON files in most browsers.

**Screenshot evidence:** `[INSERT SCREENSHOTS of desktop, tablet and mobile, and of an invalid and a valid form submission]`

## 11. Deployment

**Netlify (drag and drop)**
1. Create a free account at netlify.com.
2. Open **Add new site → Deploy manually** and drag the project folder onto the page (Netlify, n.d.b).
3. Netlify gives the site a URL. Rename it under **Site configuration → Change site name** if you want.
4. Replace the placeholder domain `https://ubuntu-paws-rescue.netlify.app` in `sitemap.xml`, `robots.txt`, the canonical and Open Graph tags and the JSON-LD with the real URL, commit, and redeploy.

**GitHub Pages (alternative)**
1. Push the project to a GitHub repository.
2. In **Settings → Pages**, choose the branch and `/ (root)` as the publishing source (GitHub, n.d.).
3. Wait for the build, then use the URL shown. Replace the placeholder domain as above.

Record the final URL at the top of this README.

## 12. Git workflow and commit history

Work was committed in small steps with descriptive messages, using the convention `type(scope): summary` (`feat`, `docs`, `chore`, `style`). Suggested workflow for the remaining work:

```bash
git add <changed files>
git commit -m "feat(forms): validate enquiry phone numbers for SA format"
git push origin main
```

Keep committing and pushing as you change things (feedback fixes, screenshots, URL replacement), because the lecturer reads the history as evidence of progress. Do not rewrite or back-date commits.

## 13. References

All code in this project was written for this assignment. The sources below informed the techniques, patterns and libraries used. **Check every link opens and update the "Accessed" dates to the date you actually viewed each page.** Add any further source you consult yourself.

Agafonkin, V. (2023) *Leaflet: an open-source JavaScript library for interactive maps*, version 1.9.4. Available at: https://leafletjs.com/ (Accessed: 27 October 2026).

Google (n.d.a) *SEO Starter Guide*. Google Search Central. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide (Accessed: 27 October 2026).

Google (n.d.b) *Introduction to robots.txt*. Google Search Central. Available at: https://developers.google.com/search/docs/crawling-indexing/robots/intro (Accessed: 27 October 2026).

Google (n.d.c) *Build and submit a sitemap*. Google Search Central. Available at: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap (Accessed: 27 October 2026).

GitHub (n.d.) *Configuring a publishing source for your GitHub Pages site*. GitHub Docs. Available at: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site (Accessed: 27 October 2026).

MDN Web Docs (n.d.a) *The Dialog element*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog (Accessed: 27 October 2026).

MDN Web Docs (n.d.b) *Intersection Observer API*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API (Accessed: 27 October 2026).

MDN Web Docs (n.d.c) *Using the Fetch API*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch (Accessed: 27 October 2026).

Netlify (n.d.a) *Custom headers*. Netlify Docs. Available at: https://docs.netlify.com/routing/headers/ (Accessed: 27 October 2026).

Netlify (n.d.b) *Deploy sites*. Netlify Docs. Available at: https://docs.netlify.com/ (Accessed: 27 October 2026).

OpenStreetMap contributors (n.d.) *OpenStreetMap copyright and license*. Available at: https://www.openstreetmap.org/copyright (Accessed: 27 October 2026).

OWASP Foundation (n.d.) *Content Security Policy Cheat Sheet*. OWASP Cheat Sheet Series. Available at: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html (Accessed: 27 October 2026).

Schema.org (n.d.) *AnimalShelter*. Available at: https://schema.org/AnimalShelter (Accessed: 27 October 2026).

W3C (n.d.a) *Tabs pattern*. ARIA Authoring Practices Guide. Available at: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ (Accessed: 27 October 2026).

W3C (n.d.b) *Accordion pattern*. ARIA Authoring Practices Guide. Available at: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/ (Accessed: 27 October 2026).# WEDE
