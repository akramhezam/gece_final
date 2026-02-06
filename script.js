/**
 * GACECCon Website - Main JavaScript
 * Global African Company for Engineering and Construction
 *
 * This file contains all shared functionality:
 * - Navigation & mobile menu
 * - Hero carousel
 * - Scroll animations (IntersectionObserver)
 * - Counter animations
 * - Dynamic content loading from JSON
 * - Project filtering & modal
 * - Testimonials carousel
 * - Form handling
 * - FAQ accordion
 * - Back to top button
 */

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Debounce function to limit rate of function calls
 */
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Fetch JSON data from file
 */
async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return null;
    }
}

function getStatusLabel(status) {
    if (!status) return 'Ongoing';
    return /finished|completed/i.test(status) ? 'Completed' : 'Ongoing';
}


// ============================================================
// NAVIGATION
// ============================================================

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('open');
            if (isOpen) {
                mobileMenu.classList.remove('open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            } else {
                mobileMenu.classList.add('open');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            }
        });

        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Navbar scroll effect
    if (navbar) {
        const handleScroll = debounce(() => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        }, 10);

        window.addEventListener('scroll', handleScroll);
    }
}

// ============================================================
// HERO CAROUSEL
// ============================================================

function initHeroCarousel() {
    const carousel = document.getElementById('hero-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot-indicator');
    let currentSlide = 0;
    let autoPlayInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Dot navigation
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showSlide(i);
            stopAutoPlay();
            startAutoPlay();
        });
    });

    // Start autoplay
    if (slides.length > 1) {
        startAutoPlay();
    }

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
}

// ============================================================
// SCROLL ANIMATIONS
// ============================================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-up');

    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        if (el.classList.contains('visible')) return;
        observer.observe(el);
        // Immediately reveal elements already in the viewport when observed.
        // This fixes dynamically injected elements that land in view before the
        // observer fires its first callback (race on GitHub Pages vs local).
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50 && rect.bottom > 0) {
            el.classList.add('visible');
            observer.unobserve(el);
        }
    });
}

// ============================================================
// COUNTER ANIMATIONS
// ============================================================

function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ============================================================
// SERVICES LOADING
// ============================================================

async function loadServices() {
    const servicesGrid = document.getElementById('services-grid');
    const servicesFullGrid = document.getElementById('services-full-grid');

    let data = await fetchJSON('data/services.json');

    // Fallback for file:// protocol
    if (!data || !data.services) {
        data = {
            services: [
                { id: "building-construction", title: "Building Construction", shortDesc: "Commercial, residential, and mixed-use buildings delivered with precision and safety.", icon: "building-office-2", fullDesc: "From hotels and commercial centers to residential blocks, we deliver end-to-end building projects.", features: ["Commercial and mixed-use buildings", "Residential housing", "Hotels and hospitality", "Structural concrete works", "MEP coordination", "Finishing and fit-out"], image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop" },
                { id: "road-infrastructure", title: "Road & Infrastructure", shortDesc: "Roads, access paths, and site infrastructure that connect and enable growth.", icon: "truck", fullDesc: "We build reliable transport and site infrastructure including access roads, culverts, and associated civil works.", features: ["Access roads and site grading", "Drainage and culverts", "Concrete paving and hardscape", "Logistics yard preparation", "Utility corridors", "Traffic and safety layouts"], image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=600&fit=crop" },
                { id: "water-sewage", title: "Water & Sewage Networks", shortDesc: "Water distribution and sewage networks for sustainable urban growth.", icon: "beaker", fullDesc: "We deliver water and sewage infrastructure that improves public health and supports development.", features: ["Water distribution pipelines", "Sewage and drainage lines", "Manholes and inspection chambers", "Pumping and connection works", "Network rehabilitation", "Testing and commissioning"], image: "https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=800&h=600&fit=crop" },
                { id: "metal-structures", title: "Metal & Iron Structures", shortDesc: "Custom steel and iron structures for commercial and industrial facilities.", icon: "wrench-screwdriver", fullDesc: "Our fabrication and installation services cover iron ceilings, steel framing, and structural elements.", features: ["Iron ceilings and roofing", "Steel framing and supports", "Custom fabrication", "On-site installation", "Protective coatings", "Quality inspections"], image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop" },
                { id: "hangars-warehouses", title: "Hangars & Warehouses", shortDesc: "Large-span structures built for logistics, storage, and operations.", icon: "building-office-2", fullDesc: "We deliver functional hangars and warehouses designed for operational efficiency, clear spans, and heavy-duty use.", features: ["Clear-span structural design", "Industrial-grade flooring", "Roofing and cladding", "Loading bay solutions", "Secure access systems", "Drainage and utilities"], image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop" },
                { id: "mosque-religious", title: "Mosque & Religious Works", shortDesc: "Respectful, detail-oriented construction for religious facilities.", icon: "clipboard-document-check", fullDesc: "We construct mosques and religious facilities with an emphasis on architectural detailing, community needs, and schedule discipline.", features: ["Prayer halls and domes", "Architectural detailing", "Ablution areas", "Lighting and acoustics", "Community spaces", "Finishing and handover"], image: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=800&h=600&fit=crop" }
            ]
        };
    }

    // Home page - service cards (limit to 6)
    if (servicesGrid) {
        const services = data.services.slice(0, 6);
        servicesGrid.innerHTML = services.map((service, index) => `
            <div class="spec-card group fade-in" style="transition-delay: ${index * 0.1}s;">
                <div class="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                    <span class="font-mono text-xs text-safety tracking-widest">[SVC-0${index + 1}]</span>
                    <div class="text-white/20 group-hover:text-safety transition-colors">
                        ${getServiceIcon(service.icon)}
                    </div>
                </div>
                
                <h3 class="text-xl font-heading font-bold text-white mb-3 group-hover:text-safety transition-colors">
                    ${service.title}
                </h3>
                
                <p class="text-concrete/70 text-sm mb-6 leading-relaxed">
                    ${service.shortDesc}
                </p>

                <div class="mt-auto pt-4 border-t border-dashed border-white/10 flex items-center justify-between">
                    <span class="text-xs font-mono text-concrete-dark">STATUS: ACTIVE</span>
                    <a href="services.html#${service.id}" class="text-safety hover:text-white text-xs font-mono uppercase tracking-wider flex items-center">
                        Details <span class="ml-1 text-lg leading-none">&raquo;</span>
                    </a>
                </div>
            </div>
        `).join('');

        initScrollAnimations();
    }

    // Services page - full details (Keeping similar layout but updating aesthetics)
    if (servicesFullGrid) {
        servicesFullGrid.innerHTML = data.services.map((service, index) => `
            <div id="${service.id}" class="grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} border-b border-industrial-light/20 pb-20 mb-20 last:border-0 last:pb-0 last:mb-0">
                <div class="${index % 2 === 1 ? 'lg:order-2 slide-right' : 'slide-left'}">
                    <div class="tech-border p-2 bg-white">
                        <img src="${service.image}" alt="${service.title}" class="w-full h-80 object-cover grayscale hover:grayscale-0 transition-all duration-500" loading="lazy">
                    </div>
                </div>
                <div class="${index % 2 === 1 ? 'lg:order-1 slide-left' : 'slide-right'}">
                    <div class="flex items-center space-x-2 mb-4">
                        <span class="w-2 h-2 bg-safety"></span>
                        <span class="text-safety font-mono text-xs tracking-widest uppercase">/Spec_Sheet_0${index + 1}</span>
                    </div>
                    
                    <h3 class="text-2xl lg:text-3xl font-heading font-bold text-industrial mb-4">${service.title}</h3>
                    <p class="text-industrial-light text-lg mb-6 leading-relaxed font-light">${service.fullDesc}</p>
                    
                    <div class="bg-white border border-concrete-dark/20 p-6 rounded-sm mb-8">
                        <h4 class="font-mono text-xs font-bold text-industrial uppercase mb-4 border-b border-concrete-dark/10 pb-2">Technical Capabilities</h4>
                        <ul class="grid sm:grid-cols-2 gap-3">
                            ${service.features.map(feature => `
                                <li class="flex items-start text-industrial-light text-sm">
                                    <span class="text-safety mr-2">::</span>
                                    ${feature}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <a href="contact.html?service=${service.id}" class="btn-industrial">
                        Request Service
                    </a>
                </div>
            </div>
        `).join('');

        initScrollAnimations();
    }
}

function getServiceIcon(iconName) {
    const icons = {
        'building-office-2': '<svg class="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
        'truck': '<svg class="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>',
        'beaker': '<svg class="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>',
        'bolt': '<svg class="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
        'wrench-screwdriver': '<svg class="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
        'clipboard-document-check': '<svg class="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>'
    };
    return icons[iconName] || icons['building-office-2'];
}

// ============================================================
// PROJECTS LOADING & FILTERING
// ============================================================

let projectsData = [];
let currentFilter = 'all';

async function loadProjects() {
    const featuredGrid = document.getElementById('featured-projects-grid');
    const projectsGrid = document.getElementById('projects-grid');

    let data = await fetchJSON('data/projects.json');

    // Fallback for file:// protocol (local development without a server)
    if (!data || !data.projects) {
        data = {
            projects: [
                { id: "5-1", title: "Mr. AbdulKarim Ahmed Hotel", year: "2021/5", category: "Buildings", type: "Hotel Building", status: "Under construction", client: "Mr. AbdulKarim Ahmed", donor: "Mr. AbdulKarim Ahmed", location: "Djibouti", shortDesc: "Ongoing luxury hotel construction in Djibouti.", fullDesc: "Comprehensive hotel building project including structural works, MEP coordination, and high-end finishing.", imageUrls: ["images/proj/5.jpg", "images/proj/6.jpg", "images/proj/7.jpg"], tasks: ["Site preparation and surveying", "Foundation and structural framing", "Concrete, iron, and slab works", "MEP rough-ins and coordination", "Finishing, fit-out, and quality checks"], requirements: ["Budget: Confidential", "Timeline: Multi-year", "Compliance: Local Djibouti standards", "Challenges: Ongoing coordination", "Safety: Active site management"], featured: true },
                { id: "5-2", title: "A lWalid Company Building", year: "2021/6", category: "Buildings", type: "Commercial and Residential Building", status: "Under construction", client: "Mr. Amar AlZumaiker (A lWalid Company)", donor: "A lWalid Company", location: "Djibouti", shortDesc: "Mixed-use commercial and residential structure.", fullDesc: "A multi-story mixed-use development integrating retail spaces and residential units.", imageUrls: ["images/proj/6.jpg", "images/proj/5.jpg", "images/proj/7.jpg"], tasks: ["Structural design coordination", "Concrete and reinforcement works", "Facade and blockwork", "Internal partitions and finishes", "On-site safety and QA"], requirements: ["Budget: Confidential", "Timeline: Staged delivery", "Compliance: Djibouti urban codes", "Accessibility: Safe circulation", "Durability: Long-term materials"], featured: true },
                { id: "5-3", title: "Dicoo Mobelia Warehouse", year: "2021/03", category: "Industrial", type: "Warehouse", status: "Under construction", client: "Mr. Mohame Ali (Dicoo Mobelia)", donor: "Dicoo Mobelia", location: "Djibouti", shortDesc: "Industrial warehouse construction.", fullDesc: "Design-and-build warehouse project with reinforced foundations and clear-span framing.", imageUrls: ["images/proj/8.jpg", "images/proj/2.jpg", "images/proj/3.jpg"], tasks: ["Site grading and leveling", "Foundation and slab casting", "Steel framing and roof", "Industrial doors and loading bays", "Drainage and utilities"], requirements: ["Budget: Confidential", "Timeline: Phased execution", "Compliance: Industrial safety", "Clear-span interior", "Heavy-load floor specs"], featured: true },
                { id: "5-4", title: "Mr. Mohamed Qemaneh House", year: "2020/11", category: "Residential", type: "House", status: "Under construction", client: "Mr. Mohamed Qemaneh", donor: "Mr. Mohamed Qemaneh", location: "Djibouti", shortDesc: "Private residence with modern finishes.", fullDesc: "Residential build with reinforced concrete structure and high-quality finishing.", imageUrls: ["images/proj/3.jpg", "images/proj/7.jpg", "images/proj/2.jpg"], tasks: ["Foundation and blockwork", "Roofing and waterproofing", "Interior plaster and paint", "Electrical and plumbing", "Final finishing and handover"], requirements: ["Budget: Confidential", "Timeline: Single-season", "Quality: Residential-grade", "Safety: Site supervision", "Comfort: Thermal performance"], featured: false },
                { id: "5-5", title: "Hamoudi Commercial Center", year: "2020/2", category: "Commercial", type: "Concrete works, iron ceiling, design", status: "Finished", client: "Ministry of Awqaf and Islamic Affairs", donor: "Taiba Investment Company", location: "Plus Rambo", shortDesc: "Concrete works, iron ceiling, and design for a commercial center in Plus Rambo.", fullDesc: "Implementation of concrete works on the first floor with iron ceiling work and design. Funded by Taiba Investment Company, located in Plus Rambo.", imageUrls: ["images/proj/7.jpg", "images/proj/8.jpg", "images/proj/2.jpg"], tasks: ["Concrete patching and leveling", "Iron ceiling fabrication", "Design coordination", "Site installation", "Quality inspection"], requirements: ["Budget: Confidential", "Timeline: Short duration", "Coordination: Business hours", "Safety: Work-zone separation", "Finish: Clean detailing"], featured: false },
                { id: "5-6", title: "ALRayan Mall", year: "2020/1", category: "Commercial", type: "Iron ceiling for cafeteria, administration and mosque", status: "Finished", client: "Ministry of Awqaf and Islamic Affairs", donor: "Umm Al-Qura Company", location: "Sunflower, Arheba", shortDesc: "Iron ceiling works for cafeteria, mosque, and administration at Rayan Mall, Arheba.", fullDesc: "Executing the iron ceiling of Al Rayan Cafeteria, the mosque, and the administration block. Area: 1,050 sqm. Funded by Umm Al-Qura Company.", imageUrls: ["images/proj/6.jpg", "images/proj/5.jpg", "images/proj/8.jpg"], tasks: ["Fabrication of iron ceiling frames", "On-site installation", "Coordination with MEP", "Finishing and alignment", "Final inspection"], requirements: ["Budget: Confidential", "Timeline: Tight schedule", "Standards: Structural safety", "Coordination: Multi-zone", "Finish: Clean, durable"], featured: true },
                { id: "5-7", title: "Minister of Labor CNSS Hangar Arta", year: "2020/03", category: "Infrastructure", type: "Hangar", status: "Finished", client: "Ministry of Labor CNSS", donor: "Ministry of Labor CNSS", location: "Arta Governorate", shortDesc: "Hangar construction covering 3,000 sqm in Arta Governorate.", fullDesc: "Execution of a large-scale hangar with an area of 3,000 square meters in Arta Governorate. Owned and funded by the Ministry of Labor CNSS.", imageUrls: ["images/proj/8.jpg", "images/proj/2.jpg", "images/proj/3.jpg"], tasks: ["Site leveling and layout", "Steel structure erection", "Roofing and cladding", "Access door systems", "Handover and testing"], requirements: ["Budget: Confidential", "Timeline: Single quarter", "Safety: Industrial site", "Durability: Weather resistance", "Access: Secure operations"], featured: false },
                { id: "5-8", title: "Binaya-immo Group Foundations (840 Apartments)", year: "2019/07", category: "Buildings", type: "27 building foundations, 200 sqm each", status: "Finished", client: "Ministry of Planning and Development", donor: "Saudi Development Bank", location: "PK-13", shortDesc: "Foundation works for 27 buildings (840 Apartments) at PK-13.", fullDesc: "Implementing 27 buildings, each 200 sqm, for the 840 Apartments project at PK-13. Funded by the Saudi Development Bank.", imageUrls: ["images/proj/2.jpg", "images/proj/3.jpg", "images/proj/8.jpg"], tasks: ["Geotechnical checks", "Foundation excavation", "Rebar and concrete works", "Quality testing and curing", "Batch handover"], requirements: ["Budget: Confidential", "Timeline: Multi-lot", "Compliance: Structural specs", "Consistency: 27 foundations", "Logistics: Material scheduling"], featured: false },
                { id: "5-9", title: "Mosque ELME GASSOD", year: "2023/09", category: "Religious", type: "Mosque construction", status: "Finished", client: "Al-haji Elmi Guesod", donor: "Al-haji Elmi Guesod", location: "Dikhil", shortDesc: "Full mosque with annexes and imam's residence in Dikhil — 750 sqm.", fullDesc: "Mosque for men and women, annexes, and imam's residence in Dikhil. Total area: 750 sqm.", imageUrls: ["images/proj/mosq.jpg", "images/proj/mosq2.jpg", "images/proj/9.jpg"], tasks: ["Foundation and main hall structure", "Dome and architectural elements", "Interior finishes and lighting", "Ablution and service areas", "Final inspection and handover"], requirements: ["Budget: Confidential", "Timeline: 8 months", "Quality: Architectural detail", "Compliance: Religious standards", "Accessibility: Community use"], featured: true },
                { id: "5-10", title: "Mosquee Nashroudiin", year: "2020/04", category: "Religious", type: "Mosque with annexes and imam's residence", status: "Finished", client: "Al-haji Osman Okieh", donor: "Al-haji Osman Okieh", location: "Plateau de Serpent, Djibouti", shortDesc: "Mosque with annexes and imam's residence in Djibouti — 1,150 sqm.", fullDesc: "Mosque for men and women, annexes, and imam's residence on Plateau de Serpent. Total area: 1,150 sqm.", imageUrls: ["images/proj/mosq.jpg", "images/proj/mosq2.jpg", "images/proj/9.jpg"], tasks: ["Foundation and structural works", "Prayer hall and dome construction", "Imam's residence and annexes", "Interior finishing and lighting", "Final inspection and handover"], requirements: ["Budget: Confidential", "Area: 1,150 sqm", "Location: Plateau de Serpent, Djibouti", "Compliance: Religious facility standards", "Accessibility: Community use"], featured: false },
                { id: "5-11", title: "4 Villas Duplex and Terrasse", year: "2020/05", category: "Residential", type: "4 Duplex villas with terraces", status: "Finished", client: "Zahra Ibrahim Direh", donor: "Zahra Ibrahim Direh", location: "Haramous, Djibouti", shortDesc: "4 duplex villas with terraces in Haramous — 1,600 sqm.", fullDesc: "Construction of 4 duplex villas with terraces in Haramous, Djibouti. Total area: 1,600 sqm.", imageUrls: ["images/proj/3.jpg", "images/proj/7.jpg", "images/proj/2.jpg"], tasks: ["Foundation and structural framing", "Duplex layout and partition works", "Terrace construction and waterproofing", "Interior finishing and fit-out", "Final handover and inspection"], requirements: ["Budget: Confidential", "Area: 1,600 sqm (4 villas)", "Location: Haramous, Djibouti", "Type: Duplex with terraces", "Quality: Residential-grade finishing"], featured: false }
            ]
        };
    }

    projectsData = data.projects.map(project => ({
        ...project,
        statusLabel: getStatusLabel(project.status)
    }));

    // Home page - featured projects
    if (featuredGrid) {
        const featured = projectsData.filter(p => p.featured).slice(0, 3);
        featuredGrid.innerHTML = featured.map((project, index) => createProjectCard(project, index)).join('');
        initScrollAnimations();
    }

    // Projects page - all projects with filtering
    if (projectsGrid) {
        renderFilteredProjects();
        initProjectFilters();
    }
}

function createProjectCard(project, index = 0) {
    const statusLabel = project.statusLabel || getStatusLabel(project.status);
    const location = project.location || 'Djibouti';
    const client = project.client || '—';
    const year = project.year || '';

    return `
        <div class="project-card group fade-in cursor-pointer"
             style="transition-delay: ${index * 0.1}s;"
             data-category="${project.category}"
             onclick="openProjectModal('${project.id}')">
            
            <div class="relative aspect-[16/10] overflow-hidden bg-concrete-light">
                <img src="${project.imageUrls[0]}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"></div>
                <div class="absolute top-4 left-4">
                    <span class="inline-flex items-center px-3 py-1 text-xs font-semibold tracking-wide uppercase bg-white/90 text-industrial rounded-full">
                        ${project.category || 'Project'}
                    </span>
                </div>
                ${statusLabel ? `
                <div class="absolute top-4 right-4">
                    <span class="inline-flex items-center px-3 py-1 text-xs font-semibold tracking-wide uppercase bg-industrial text-white rounded-full">
                        ${statusLabel}
                    </span>
                </div>
                ` : ''}
            </div>

            <div class="p-6">
                <h3 class="text-xl font-heading font-bold text-industrial leading-tight mb-3 group-hover:text-safety transition-colors">
                    ${project.title}
                </h3>
                <p class="text-industrial-light text-sm leading-relaxed line-clamp-2">
                    ${project.shortDesc || ''}
                </p>

                <div class="mt-5 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <div class="text-[10px] font-mono text-concrete-dark uppercase tracking-widest">Location</div>
                        <div class="text-industrial font-semibold truncate">${location}</div>
                    </div>
                    <div>
                        <div class="text-[10px] font-mono text-concrete-dark uppercase tracking-widest">Client</div>
                        <div class="text-industrial font-semibold truncate">${client}</div>
                    </div>
                </div>

                <div class="mt-6 flex items-center justify-between text-xs font-mono text-safety">
                    <span>${year}</span>
                    <span class="group-hover:translate-x-1 transition-transform">View Details &raquo;</span>
                </div>
            </div>
        </div>
    `;
}

function renderFilteredProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const projectsCount = document.getElementById('projects-count');
    const noResults = document.getElementById('no-results');

    if (!projectsGrid) return;

    const filtered = currentFilter === 'all'
        ? projectsData
        : projectsData.filter(p => p.category === currentFilter);

    if (filtered.length === 0) {
        projectsGrid.innerHTML = '';
        noResults?.classList.remove('hidden');
    } else {
        noResults?.classList.add('hidden');
        projectsGrid.innerHTML = filtered.map((project, index) => createProjectCard(project, index)).join('');
    }

    if (projectsCount) {
        projectsCount.textContent = filtered.length;
    }

    initScrollAnimations();
}

function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderFilteredProjects();
        });
    });
}

// Project Modal
window.openProjectModal = function (projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById('project-modal');
    if (!modal) return;

    // Populate modal content
    document.getElementById('modal-main-image').src = project.imageUrls[0];
    document.getElementById('modal-main-image').alt = project.title;
    const statusLabel = project.statusLabel || getStatusLabel(project.status);
    document.getElementById('modal-category').textContent = project.category;
    document.getElementById('modal-status').textContent = statusLabel;
    document.getElementById('modal-status').className = `absolute bottom-4 left-4 px-4 py-1 text-sm font-semibold font-mono uppercase tracking-wider ${statusLabel === 'Completed' ? 'bg-green-600/90 text-white' : 'bg-safety/90 text-white'}`;
    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-description').textContent = project.fullDesc;
    document.getElementById('modal-client').textContent = project.client || '—';
    document.getElementById('modal-donor').textContent = project.donor || project.client || '—';
    document.getElementById('modal-location').textContent = project.location || 'Djibouti';
    document.getElementById('modal-year').textContent = project.year;
    document.getElementById('modal-year-badge').textContent = project.year;
    document.getElementById('modal-category-text').textContent = project.category;
    document.getElementById('modal-type').textContent = project.type || project.category;

    // Thumbnails
    const thumbnailsContainer = document.getElementById('modal-thumbnails');
    thumbnailsContainer.innerHTML = project.imageUrls.map((url, i) => `
        <img src="${url}" alt="${project.title} image ${i + 1}"
             class="gallery-thumb w-20 h-16 object-cover cursor-pointer border border-transparent hover:border-safety transition-all ${i === 0 ? 'border-safety' : ''}"
             onclick="changeModalImage('${url}', this)">
    `).join('');

    // Tasks
    document.getElementById('modal-tasks').innerHTML = project.tasks.map(task => `
        <li class="flex items-start text-gray-warm text-sm">
            <svg class="w-4 h-4 text-orange mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            ${task}
        </li>
    `).join('');

    // Requirements
    document.getElementById('modal-requirements').innerHTML = project.requirements.map(req => `
        <li class="flex items-start text-gray-warm text-sm">
            <svg class="w-4 h-4 text-orange mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            ${req}
        </li>
    `).join('');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.changeModalImage = function (url, thumb) {
    document.getElementById('modal-main-image').src = url;
    document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('border-safety'));
    thumb.classList.add('border-safety');
};

function initProjectModal() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const closeBtn = document.getElementById('modal-close');
    const closeBtn2 = document.getElementById('modal-close-btn');

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn?.addEventListener('click', closeModal);
    closeBtn2?.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// ============================================================
// TESTIMONIALS CAROUSEL
// ============================================================

let testimonialIndex = 0;
let testimonialData = [];

async function loadTestimonials() {
    const carousel = document.getElementById('testimonials-carousel');
    if (!carousel) return;

    const data = await fetchJSON('data/testimonials.json');
    if (!data || !data.testimonials) return;

    testimonialData = data.testimonials;

    // Render testimonials
    carousel.innerHTML = testimonialData.map((testimonial, index) => `
        <div class="testimonial-slide ${index === 0 ? 'active' : ''} bg-white p-6 md:p-12 tech-border transition-all duration-500 relative">
             <div class="absolute top-0 left-0 bg-industrial text-white px-3 py-1 font-mono text-xs uppercase tracking-widest border-r border-b border-safety">
                Report_Log_0${index + 1}
            </div>
            
            <div class="mb-8 mt-4 border-b border-concrete-dark/10 pb-6">
                <div class="flex justify-between items-end mb-2">
                    <span class="font-mono text-xs text-concrete-dark uppercase">Satisfaction Index</span>
                    <span class="font-mono text-safety font-bold">${testimonial.rating}.0/5.0</span>
                </div>
                <div class="h-1 w-full bg-concrete-light overflow-hidden">
                    <div class="h-full bg-safety" style="width: ${(testimonial.rating / 5) * 100}%"></div>
                </div>
            </div>

            <blockquote class="font-heading text-industrial text-lg md:text-xl italic mb-8 leading-relaxed relative z-10">
                <span class="text-6xl text-concrete-dark/20 absolute -top-8 -left-4 font-serif">"</span>
                ${testimonial.quote}
            </blockquote>

            <div class="flex items-center space-x-4 border-t border-dashed border-concrete-dark/20 pt-6">
                <div class="relative">
                    <div class="w-12 h-12 rounded-none border border-industrial p-0.5">
                        <img src="${testimonial.image}" alt="${testimonial.name}" class="w-full h-full object-cover grayscale">
                    </div>
                </div>
                <div>
                    <h4 class="font-heading font-bold text-industrial text-sm uppercase tracking-wide">${testimonial.name}</h4>
                    <div class="text-xs font-mono text-concrete-dark mt-0.5 max-w-[200px] truncate">
                        ${testimonial.position} // <span class="text-safety">${testimonial.company}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Render dots
    const dotsContainer = document.getElementById('testimonial-dots');
    if (dotsContainer) {
        dotsContainer.innerHTML = testimonialData.map((_, index) => `
            <button class="w-2 h-2 ${index === 0 ? 'bg-safety w-8' : 'bg-industrial/20'} transition-all duration-300 h-1 rounded-none"
                    data-index="${index}" aria-label="Testimonial ${index + 1}"></button>
        `).join('');

        dotsContainer.addEventListener('click', (e) => {
            if (e.target.dataset.index !== undefined) {
                showTestimonial(parseInt(e.target.dataset.index));
            }
        });
    }

    // Navigation
    document.getElementById('prev-testimonial')?.addEventListener('click', () => {
        showTestimonial(testimonialIndex === 0 ? testimonialData.length - 1 : testimonialIndex - 1);
    });

    document.getElementById('next-testimonial')?.addEventListener('click', () => {
        showTestimonial((testimonialIndex + 1) % testimonialData.length);
    });
}

// ============================================================
// REFERENCES LOADING
// ============================================================

async function loadReferences() {
    const list = document.getElementById('references-list');
    const count = document.getElementById('references-count');
    if (!list) return;

    const data = await fetchJSON('data/references.json');
    if (!data || !data.references) return;

    list.innerHTML = data.references.map((ref, index) => `
        <div class="reference-card bg-white tech-border p-6 fade-in group hover:border-safety transition-colors" style="transition-delay: ${index * 0.05}s;">
            <div class="flex items-center justify-between mb-4">
                <span class="inline-flex items-center bg-safety/10 text-safety px-2 py-1 font-mono text-xs border border-safety/20">Ref ${ref.id}</span>
                <span class="text-xs text-gray-warm">${ref.location || 'Djibouti'}</span>
            </div>
            <h3 class="text-lg font-heading font-bold text-navy mb-2">${ref.project}</h3>
            <p class="text-gray-warm text-sm mb-1">Client: <span class="font-semibold text-navy">${ref.client}</span></p>
            <p class="text-gray-warm text-sm mb-1">Donor: <span class="font-semibold text-navy">${ref.donor}</span></p>
            <p class="text-gray-warm text-sm">Scope: <span class="text-navy">${ref.scope}</span></p>
            <p class="text-xs text-gray-400 mt-3">Contact details available upon request.</p>
        </div>
    `).join('');

    if (count) count.textContent = `${data.references.length} references`;
    initScrollAnimations();
}

// ============================================================
// STAFF LOADING
// ============================================================

async function loadStaff() {
    const list = document.getElementById('staff-list');
    const title = document.getElementById('staff-title');
    const description = document.getElementById('staff-description');
    const count = document.getElementById('staff-count');
    if (!list) return;

    const data = await fetchJSON('data/staff.json');
    if (!data) return;

    if (title) title.textContent = data.title || 'Staff Overview';
    if (description) description.textContent = data.description || '';

    list.innerHTML = (data.items || []).map((item, index) => `
        <div class="staff-card bg-white tech-border p-6 fade-in hover:shadow-lg transition-all" style="transition-delay: ${index * 0.05}s;">
            <h3 class="text-lg font-heading font-bold text-navy mb-2">${item.title}</h3>
            <p class="text-gray-warm text-sm mb-4">${item.detail}</p>
            <div class="bg-concrete-light border-l-2 border-safety p-4 text-industrial font-semibold text-sm">
                ${item.availability}
            </div>
        </div>
    `).join('');

    if (count) count.textContent = `${(data.items || []).length} elements`;
    initScrollAnimations();
}

function showTestimonial(index) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('#testimonial-dots button');

    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('bg-safety', 'w-8');
            dot.classList.remove('bg-industrial/20');
        } else {
            dot.classList.remove('bg-safety', 'w-8');
            dot.classList.add('bg-industrial/20');
        }
    });

    testimonialIndex = index;
}

// ============================================================
// ABOUT PAGE CONTENT
// ============================================================

async function loadAboutContent() {
    const bioContainer = document.getElementById('about-bio');
    const missionContainer = document.getElementById('about-mission');
    const visionContainer = document.getElementById('about-vision');
    const valuesGrid = document.getElementById('values-grid');
    const teamGrid = document.getElementById('team-grid');
    const statsContainer = document.getElementById('about-stats');

    let data = await fetchJSON('data/about.json');

    // fetch() fails on file:// protocol (local development).
    // Fall back to inline data so the page renders correctly without a server.
    if (!data) {
        data = {
            bioHtml: '<p><strong>GACEC</strong> (Global African Company for Engineering and Construction) is a Djibouti-based construction firm delivering reliable civil and building works across the country.</p><p>With over <strong>20 years of team experience</strong>, we combine skilled engineers, planners, and site crews to deliver buildings, roads, water and sewage networks, metal structures, hangars, and foundations.</p><p>We focus on practical delivery, safety, and long-term durability while collaborating closely with clients and local stakeholders.</p>',
            mission: "We are fully responsible for providing our services professionally in accordance with best practices, standards and quality specifications. We understand the demands and aspirations of our customers and build their dreams with a creative touch that exceeds their expectations.",
            vision: "Global leadership in the field of engineering and construction.",
            stats: [
                { label: 'Years Experience', value: '20+' },
                { label: 'Core Disciplines', value: '8' },
                { label: 'Recent Projects', value: '30+' },
                { label: 'Local Partners', value: '50+' }
            ],
            team: [
                { name: 'Eng. Khalil Ahmed', position: 'General Manager', bio: '20+ years in civil engineering and project management.', image: 'images/founder_com.png', linkedin: '#' },
                { name: 'Technical Team', position: 'Site Engineers', bio: 'Dedicated field supervision and quality control.', image: 'images/team/2.jpg', linkedin: '#' },
                { name: 'Support Staff', position: 'Logistics & Admin', bio: 'Ensuring seamless material flow and operations.', image: 'images/team/3.jpg', linkedin: '#' }
            ],
            values: [
                { title: 'Responsibility', description: 'We take full ownership of every project from planning through delivery, ensuring accountability at every stage.', icon: 'shield-check' },
                { title: 'Professionalism', description: 'Our team brings over 20 years of combined experience, applying industry best practices and standards to all work.', icon: 'star' },
                { title: 'Quality', description: 'We deliver workmanship that lasts, using premium materials and rigorous quality control in Djibouti\'s conditions.', icon: 'lightbulb' },
                { title: 'Creativity', description: 'We approach every project with a creative touch, turning client aspirations into innovative, functional solutions.', icon: 'hard-hat' },
                { title: 'Customer Satisfaction', description: 'We understand client demands and aspirations, exceeding expectations through close collaboration and attentive service.', icon: 'users' }
            ]
        };
    }

    // Bio
    if (bioContainer) {
        bioContainer.innerHTML = data.bioHtml;
    }

    // Mission & Vision
    if (missionContainer) missionContainer.textContent = data.mission;
    if (visionContainer) visionContainer.textContent = data.vision;

    // Stats
    if (statsContainer && data.stats) {
        statsContainer.innerHTML = data.stats.map(stat => `
            <div class="text-center fade-in">
                <div class="text-4xl sm:text-5xl font-heading font-bold text-safety mb-2">${stat.value}</div>
                <p class="text-concrete/60 font-mono text-sm uppercase">${stat.label}</p>
            </div>
        `).join('');
    }

    // Values
    if (valuesGrid && data.values) {
        valuesGrid.innerHTML = data.values.map((value, index) => `
            <div class="bg-white p-8 tech-border group hover:border-safety transition-colors fade-in" style="transition-delay: ${index * 0.1}s;">
                <div class="w-14 h-14 bg-industrial-light/5 border border-industrial-light/10 flex items-center justify-center mb-6 group-hover:bg-safety/10 group-hover:border-safety/20 transition-colors">
                    ${getValueIcon(value.icon)}
                </div>
                <h3 class="text-xl font-heading font-bold text-industrial mb-3 group-hover:text-safety transition-colors">${value.title}</h3>
                <p class="text-industrial-light text-sm leading-relaxed">${value.description}</p>
            </div>
        `).join('');
    }

    // Team
    if (teamGrid && data.team) {
        teamGrid.innerHTML = data.team.map((member, index) => `
            <div class="bg-industrial-light/5 border border-white/10 group hover:border-safety/50 transition-all fade-in relative overflow-hidden" style="transition-delay: ${index * 0.1}s;">
                 <!-- ID Badge -->
                <div class="absolute top-4 right-4 z-10 opactiy-0 group-hover:opacity-100 transition-opacity">
                    <span class="bg-safety text-white text-[10px] uppercase font-mono px-2 py-0.5 tracking-widest">Auth_Lvl_3</span>
                </div>

                <div class="aspect-[3/4] relative grayscale group-hover:grayscale-0 transition-all duration-500 bg-industrial-dark">
                    <!-- Placeholder for image if not found, or actual image -->
                    <img src="${member.image}" alt="${member.name}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" onerror="this.src='https://placehold.co/400x600/1a1f2c/fff?text=No+Image'">
                    <div class="absolute inset-0 bg-gradient-to-t from-industrial-dark via-transparent to-transparent opacity-90"></div>
                    
                    <div class="absolute bottom-0 left-0 w-full p-6">
                        <h3 class="font-heading font-bold text-white text-xl uppercase tracking-wide mb-1 flex items-center">
                            ${member.name}
                        </h3>
                        <p class="text-safety font-mono text-xs uppercase tracking-widest mb-4 border-b border-white/10 pb-4 inline-block">
                            // ${member.position}
                        </p>
                        <p class="text-concrete/70 text-sm font-light leading-relaxed border-l-2 border-safety/50 pl-3">
                            ${member.bio}
                        </p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    initScrollAnimations();
}

function getValueIcon(iconName) {
    const icons = {
        'star': '<svg class="w-7 h-7 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>',
        'shield-check': '<svg class="w-7 h-7 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
        'lightbulb': '<svg class="w-7 h-7 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
        'hard-hat': '<svg class="w-7 h-7 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
        'leaf': '<svg class="w-7 h-7 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>',
        'users': '<svg class="w-7 h-7 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>'
    };
    return icons[iconName] || icons['star'];
}

// ============================================================
// CONTACT FORM & FAQ
// ============================================================

function initContactForm() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // For demo purposes - show success message
        // In production, this would submit to Formspree or similar
        const formData = new FormData(form);
        console.log('Form data:', Object.fromEntries(formData));

        // Show success message
        successMessage?.classList.add('show');
        form.reset();

        // Hide after 5 seconds
        setTimeout(() => {
            successMessage?.classList.remove('show');
        }, 5000);
    });

    // Pre-fill service from URL param
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam) {
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            // Map service IDs to option values
            const serviceMap = {
                'buildings': 'building',
                'roads': 'roads',
                'water': 'water',
                'energy': 'energy',
                'renovation': 'renovation',
                'consulting': 'consulting'
            };
            serviceSelect.value = serviceMap[serviceParam] || serviceParam;
        }
    }
}

function initFAQ() {
    const faqBtns = document.querySelectorAll('.faq-btn');

    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('.faq-icon');
            const isOpen = !content.classList.contains('hidden');

            // Close all
            document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
            document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = 'rotate(0deg)');
            document.querySelectorAll('.faq-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));

            // Open clicked (if was closed)
            if (!isOpen) {
                content.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// ============================================================
// BACK TO TOP BUTTON
// ============================================================

function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    const toggleVisibility = debounce(() => {
        if (window.scrollY > 500) {
            btn.classList.remove('opacity-0', 'invisible');
            btn.classList.add('opacity-100', 'visible');
        } else {
            btn.classList.add('opacity-0', 'invisible');
            btn.classList.remove('opacity-100', 'visible');
        }
    }, 100);

    window.addEventListener('scroll', toggleVisibility);

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================================
// ADMIN FUNCTIONALITY
// ============================================================

// Secure password hashing using SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// The hashed version of "akram107"
const ADMIN_PASSWORD_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';

let adminMode = false;
let editableContent = {
    hero: {},
    about: {},
    stats: {},
    services: [],
    projects: [],
    testimonials: []
};

function initAdminPanel() {
    const loginModal = document.getElementById('admin-login-modal');
    const loginForm = document.getElementById('admin-login-form');
    const adminToolbar = document.getElementById('admin-toolbar');
    const adminBtns = document.querySelectorAll('#admin-access-btn, #admin-access-btn-mobile');
    const cancelLoginBtn = document.getElementById('cancel-login-btn');
    const exitEditBtn = document.getElementById('exit-edit-btn');
    const saveChangesBtn = document.getElementById('save-changes-btn');

    if (!loginModal) return;

    // Show login modal
    adminBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.classList.remove('hidden');
            document.getElementById('admin-password').focus();
        });
    });

    // Cancel login
    cancelLoginBtn?.addEventListener('click', () => {
        loginModal.classList.add('hidden');
        document.getElementById('admin-password').value = '';
        document.getElementById('login-error').classList.add('hidden');
    });

    // Handle login
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('admin-password').value;
        const hashedInput = await hashPassword(password);

        if (hashedInput === ADMIN_PASSWORD_HASH) {
            // Login successful
            adminMode = true;
            loginModal.classList.add('hidden');
            adminToolbar?.classList.remove('hidden');
            document.getElementById('admin-password').value = '';
            document.getElementById('login-error').classList.add('hidden');
            enableEditMode();
            showToast('Admin mode activated! Click on content to edit.', 'success');
        } else {
            // Login failed
            document.getElementById('login-error').classList.remove('hidden');
            document.getElementById('admin-password').value = '';
            document.getElementById('admin-password').focus();
        }
    });

    // Exit edit mode
    exitEditBtn?.addEventListener('click', () => {
        if (confirm('Exit edit mode? Unsaved changes will be lost.')) {
            adminMode = false;
            adminToolbar?.classList.add('hidden');
            disableEditMode();
            showToast('Exited admin mode', 'info');
        }
    });

    // Save changes
    saveChangesBtn?.addEventListener('click', () => {
        saveAllChanges();
    });
}

function enableEditMode() {
    // Add visual indicators to editable elements
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.style.marginTop = '60px';
    }

    // Make hero content editable
    makeEditable('h1', 'hero-heading');
    makeEditable('.fade-in p', 'hero-tagline');

    // Make stats editable
    document.querySelectorAll('.counter').forEach((counter, index) => {
        makeCounterEditable(counter, index);
    });

    // Make about section editable
    makeEditable('#about-preview h2', 'about-heading');
    makeEditable('#about-preview p', 'about-paragraph');

    // Add edit icons
    addEditIcons();
}

function disableEditMode() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.style.marginTop = '0';
    }

    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
        el.contentEditable = false;
        el.classList.remove('admin-editable');
    });

    document.querySelectorAll('.edit-icon').forEach(icon => icon.remove());
}

function makeEditable(selector, key) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        if (!el.closest('#admin-toolbar') && !el.closest('#admin-login-modal')) {
            el.contentEditable = true;
            el.classList.add('admin-editable');
            el.dataset.editKey = `${key}-${index}`;

            el.addEventListener('focus', function () {
                this.dataset.originalContent = this.innerHTML;
            });

            el.addEventListener('blur', function () {
                if (this.innerHTML !== this.dataset.originalContent) {
                    showToast('Content updated (not saved yet)', 'info');
                }
            });
        }
    });
}

function makeCounterEditable(counter, index) {
    const parent = counter.parentElement;
    const currentValue = counter.dataset.target;

    const input = document.createElement('input');
    input.type = 'number';
    input.value = currentValue;
    input.className = 'text-4xl sm:text-5xl font-heading font-bold text-navy w-24 text-center bg-yellow-50 border-2 border-orange rounded px-2';
    input.dataset.editKey = `counter-${index}`;

    parent.replaceChild(input, counter.parentElement.firstChild);
}

function addEditIcons() {
    const style = document.createElement('style');
    style.textContent = `
        .admin-editable {
            outline: 2px dashed rgba(249, 115, 22, 0.3) !important;
            outline-offset: 4px;
            cursor: text;
            transition: outline 0.2s;
        }
        .admin-editable:hover {
            outline: 2px dashed rgba(249, 115, 22, 0.6) !important;
            background: rgba(249, 115, 22, 0.05);
        }
        .admin-editable:focus {
            outline: 2px solid #F97316 !important;
            background: white;
        }
    `;
    document.head.appendChild(style);
}

async function saveAllChanges() {
    const changes = {};

    // Collect all edited content
    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
        const key = el.dataset.editKey;
        if (key) {
            changes[key] = el.innerHTML;
        }
    });

    // Collect counter changes
    document.querySelectorAll('input[data-edit-key^="counter-"]').forEach(input => {
        const key = input.dataset.editKey;
        if (key) {
            changes[key] = input.value;
        }
    });

    // Create a downloadable JSON file with the changes
    const dataExport = {
        timestamp: new Date().toISOString(),
        changes: changes,
        note: 'Apply these changes to your data files manually'
    };

    const blob = new Blob([JSON.stringify(dataExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gaceccon-changes-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Changes exported! Upload the JSON file to update your content.', 'success');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-navy';

    toast.className = `${bgColor} text-white px-6 py-4 rounded-lg shadow-xl flex items-center space-x-3 transform translate-x-full transition-transform duration-300`;
    toast.innerHTML = `
        <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${type === 'success' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>' :
            type === 'error' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>' :
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'}
        </svg>
        <span class="font-medium">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => toast.classList.remove('translate-x-full'), 10);

    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    initNavigation();
    initScrollAnimations();
    initCounterAnimations();
    initBackToTop();

    // Page-specific
    initHeroCarousel();
    initProjectModal();
    initContactForm();
    initFAQ();

    // Admin panel
    initAdminPanel();

    // Dynamic content loading
    loadServices();
    loadProjects();
    loadTestimonials();
    loadAboutContent();
    loadReferences();
    loadStaff();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchJSON,
        loadServices,
        loadProjects,
        loadTestimonials,
        loadAboutContent,
        loadReferences,
        loadStaff
    };
}
