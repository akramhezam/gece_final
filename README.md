# GACEC Website

A clean, modern, responsive frontend website for GACEC (Global African Company for Engineering and Construction).

## Quick Start

**Option 1: Open directly**
- Just open `index.html` in your web browser

**Option 2: Local server** (recommended for full functionality)
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

## Project Structure

```
gravity/
│
├── 📄 HTML Pages (7 pages)
│   ├── index.html       → Homepage with hero slider, services, featured projects
│   ├── book.html        → Company information and history
│   ├── services.html    → Complete services catalog
│   ├── projects.html    → Full project portfolio
│   ├── staff.html       → Resources and team information
│   ├── gallery.html     → Image gallery showcase
│   └── contact.html     → Contact form and location
│
├── 🎨 Assets
│   ├── script.js        → All JavaScript functionality (66KB)
│   ├── styles/
│   │   └── theme.css    → Custom theme and animations (17KB)
│   └── images/          → Logo, projects, branding assets
│
└── 📊 Data (JSON files for easy content updates)
    ├── about.json       → Company information
    ├── services.json    → Service offerings (8KB)
    ├── projects.json    → Project portfolio (5KB)
    ├── testimonials.json
    ├── staff.json
    ├── references.json
    └── contact.json
```

**Total Size:** ~340KB (excluding images)

## How to Use

This is a pure frontend website. No build process or server required.

### Local Development

1. Simply open `index.html` in your web browser
2. Or use a local server:
   ```bash
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

### Deployment

Upload all files to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Any web server

## Features

- Responsive design (mobile, tablet, desktop)
- Dynamic content loaded from JSON files
- Hero image carousel
- Service and project showcases
- Contact form
- Image gallery
- Modern UI with Tailwind CSS

## Technologies

- HTML5
- CSS3 (Tailwind CSS via CDN)
- Vanilla JavaScript
- JSON for data management

## Pages Overview

- **Homepage** - Company overview, featured services and projects
- **Company** - Detailed company history and capabilities
- **Services** - Complete list of construction services
- **Projects** - Portfolio of completed work
- **Resources** - Staff and company resources
- **Gallery** - Project images and branding
- **Contact** - Contact form and location details

## Customization

Edit the JSON files in the `data/` folder to update:
- Services offered
- Project portfolio
- Staff information
- Testimonials
- Contact details

No coding required to update content.
