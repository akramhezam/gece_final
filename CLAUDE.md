# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GACEC (Global African Company for Engineering and Construction) is a pure frontend static website built with vanilla HTML, CSS (Tailwind via CDN), and JavaScript. No build process, no backend, no frameworks.

**Key Principle**: This is a content-driven static site. All dynamic content comes from JSON files in `/data/`, not from a CMS or database.

## Running the Site

**Development**:
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

**Production**: The site auto-deploys to GitHub Pages on push to `main` branch via `.github/workflows/deploy-pages.yml`.

## Architecture

### Content System

All editable content lives in `/data/*.json`:
- `services.json` - Service catalog (11 services)
- `projects.json` - Project portfolio (7+ projects)
- `testimonials.json` - Client testimonials
- `about.json` - Company information
- `staff.json` - Team and resources
- `contact.json` - Contact information
- `references.json` - Reference list

**Important**: When updating content, edit these JSON files. The JavaScript (`script.js`) dynamically loads and renders them.

### JavaScript Architecture (`script.js`)

The main script is organized into functional sections:
1. **Utility Functions** - `fetchJSON()`, `debounce()`, status helpers
2. **Navigation** - Mobile menu, navbar scroll effects
3. **Hero Carousel** - Auto-rotating image slides with Ken Burns effect
4. **Scroll Animations** - IntersectionObserver-based fade-ins
5. **Counter Animations** - Animated stat counters
6. **Dynamic Content Loading** - Services, projects, testimonials from JSON
7. **Project Filtering** - Category-based project filtering
8. **Forms** - Contact form handling
9. **Back to Top** - Scroll-to-top button

**Key Pattern**: All dynamic content uses `fetchJSON()` to load data, then builds HTML via template literals and `innerHTML`.

### Page Structure

7 HTML pages share a common structure:
- `index.html` - Homepage (hero, services preview, featured projects)
- `book.html` - Company information and history
- `services.html` - Full service catalog
- `projects.html` - Complete project portfolio
- `staff.html` - Team and resources
- `gallery.html` - Image gallery
- `contact.html` - Contact form and location

Each page includes:
- Same navigation/header
- Same footer
- Tailwind CSS via CDN (configured inline in `<head>`)
- Google Fonts (IBM Plex Sans, Source Sans 3, IBM Plex Mono)
- `styles/theme.css` for custom animations and overrides
- `script.js` for all interactions

### Styling System

**Tailwind Config** (inline in each HTML `<head>`):
```javascript
theme.extend.colors = {
  primary: '#0B1F3B',        // Navy
  safety: '#3B7A57',          // Emerald green
  industrial: '#0B1F3B',
  concrete: { light: '#F6F8FA', DEFAULT: '#E9EEF3' }
}
```

**Custom CSS** (`styles/theme.css`):
- CSS variables for design tokens
- Custom animations (kenBurns, fadeSlideUp, badgeFloat)
- Hover effects for cards
- Mobile menu transitions

**Animation Pattern**: Uses `IntersectionObserver` for scroll-triggered `.fade-in`, `.slide-left`, `.slide-right` classes.

### Data Schema Patterns

**Services** (`services.json`):
```json
{
  "id": "unique-slug",
  "title": "Service Name",
  "shortDesc": "Brief description",
  "fullDesc": "Detailed description",
  "icon": "heroicon-name",
  "features": ["Feature 1", "Feature 2"],
  "image": "path/to/image.webp"
}
```

**Projects** (`projects.json`):
```json
{
  "id": "unique-slug",
  "title": "Project Name",
  "year": "2020",
  "category": "Buildings|Commercial|Infrastructure|Religious|Residential",
  "type": "Project type description",
  "client": "Client name",
  "location": "Location",
  "shortDesc": "Brief description",
  "fullDesc": "Detailed description",
  "imageUrls": ["path/to/image.webp"],
  "featured": true|false
}
```

## Common Tasks

### Adding a New Service

1. Add service object to `data/services.json`
2. Follow the schema above
3. Icon should be a Heroicons name (rendered via SVG path in JS)
4. Image can be local (`images/...`) or external URL

### Adding a New Project

1. Add project object to `data/projects.json`
2. Set `featured: true` to show on homepage
3. Category must match one of the filter buttons in `projects.html`
4. Add project images to `images/` folder

### Updating Company Info

Edit `data/about.json` - changes reflect on homepage and `book.html`.

### Modifying Design/Colors

1. **Brand colors**: Update Tailwind config in each HTML `<head>`
2. **Animations**: Edit `styles/theme.css`
3. **Component styles**: Most styling is inline Tailwind classes

### Navigation Changes

Update navigation links in **all 7 HTML files**:
- Desktop menu (around line 323-347)
- Mobile menu (around line 367-375)
- Footer (around line 843-853)

## Image Optimization

- Prefer `.webp` format for modern browsers
- Images in `images/` folder are committed to repo
- External images use Unsplash CDN (`?w=800&h=600&fit=crop`)
- Hero carousel images should be optimized (lazy loading on slides 2+)

## Deployment

**GitHub Pages**: Automatic on push to `main`. The workflow:
1. Excludes `.git`, `.github`, `site/` directory
2. Excludes large PDFs (`data/gacec book.pdf`)
3. Deploys everything else to `gh-pages` branch

**Manual Deploy**: Copy all files to any static host (Netlify, Vercel, S3, etc.).

## Code Patterns to Follow

### Dynamic Content Loading
```javascript
const data = await fetchJSON('data/services.json');
if (!data?.services) return;
data.services.forEach(service => {
  const html = `<div class="service-card">...</div>`;
  container.innerHTML += html;
});
```

### Scroll Animations
Elements with `.fade-in`, `.slide-left`, `.slide-right` are observed:
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});
```

### Mobile Menu Toggle
Uses class-based toggle (not inline styles):
```javascript
mobileMenu.classList.toggle('open');
mobileMenuBtn.setAttribute('aria-expanded', isOpen);
```

## Browser Compatibility

- Modern browsers only (ES6+, IntersectionObserver)
- Tailwind CSS via CDN (auto-prefixes)
- No polyfills included
- Uses `async/await` for JSON loading

## Performance Notes

- Hero images: First slide loads eagerly (`loading="eager"`), others lazy
- JSON files are small (<10KB each) and cached by browser
- Tailwind CDN is a tradeoff: simple development vs. larger CSS
- No JavaScript bundling/minification (vanilla JS is already small)

## Important Files

- `script.js` - All JavaScript functionality (1,700+ lines)
- `styles/theme.css` - Custom CSS variables, animations, overrides
- `data/*.json` - All editable content
- `.github/workflows/deploy-pages.yml` - Deployment automation
- `README.md` - User-facing documentation

## Constraints

- **No admin panel**: Admin features were removed (no backend). Content updates require JSON editing.
- **No database**: All data is in static JSON files.
- **No build step**: Changes to HTML/CSS/JS are used directly.
- **No CMS**: This is intentional for simplicity and security.

## Testing Locally

After making changes:
1. Open site via `python -m http.server 8000`
2. Test all 7 pages
3. Test mobile menu (< 1024px width)
4. Test project filtering on `projects.html`
5. Test hero carousel auto-rotation
6. Check console for JSON loading errors
