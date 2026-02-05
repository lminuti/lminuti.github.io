// SmartCoreAI Documentation - Interactive Features

(function() {
    'use strict';

    // ===== DOM Elements =====
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const themeToggle = document.getElementById('themeToggle');
    const scrollTopBtn = document.getElementById('scrollTop');
    const navList = document.getElementById('navList');

    // ===== Navigation Generation =====
    function generateNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const headings = document.querySelectorAll('h2[id], h3[id]');

        let currentSection = null;
        let navHTML = '';

        headings.forEach(heading => {
            const id = heading.id || heading.closest('section')?.id;
            if (!id) return;

            const text = heading.textContent;
            const isH2 = heading.tagName === 'H2';

            if (isH2) {
                navHTML += `<li><a href="#${id}" class="nav-h2">${text}</a></li>`;
            } else {
                navHTML += `<li><a href="#${id}" class="nav-h3">${text}</a></li>`;
            }
        });

        // If no headings with IDs, generate from sections
        if (!navHTML) {
            sections.forEach(section => {
                const h2 = section.querySelector('h2');
                if (h2) {
                    navHTML += `<li><a href="#${section.id}">${h2.textContent}</a></li>`;
                }
            });
        }

        navList.innerHTML = navHTML;
    }

    // ===== Active Navigation Highlight =====
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-list a');

        let currentSection = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // ===== Theme Management =====
    function getPreferredTheme() {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    }

    function updateThemeIcon(theme) {
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');

        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    // Initialize theme
    function initTheme() {
        const theme = getPreferredTheme();
        if (localStorage.getItem('theme')) {
            setTheme(theme);
        }
    }

    // ===== Mobile Menu =====
    let overlay = null;

    function createOverlay() {
        overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', closeSidebar);
    }

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
    }

    function toggleSidebar() {
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    // ===== Scroll to Top =====
    function handleScroll() {
        // Show/hide scroll to top button
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        // Update active navigation
        updateActiveNav();
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ===== Smooth Scroll for Navigation Links =====
    function handleNavClick(e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        e.preventDefault();

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Close mobile menu after navigation
            if (window.innerWidth <= 1024) {
                closeSidebar();
            }

            // Update URL without triggering scroll
            history.pushState(null, '', href);
        }
    }

    // ===== Code Block Enhancement =====
    function enhanceCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre code');

        codeBlocks.forEach(block => {
            // Add copy button
            const pre = block.parentElement;
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';

            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);

            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            `;
            copyBtn.title = 'Copia codice';
            copyBtn.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
                padding: 6px;
                background: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.2s;
                color: var(--text-secondary);
            `;

            wrapper.appendChild(copyBtn);

            wrapper.addEventListener('mouseenter', () => {
                copyBtn.style.opacity = '1';
            });

            wrapper.addEventListener('mouseleave', () => {
                copyBtn.style.opacity = '0';
            });

            copyBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(block.textContent);
                    copyBtn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    `;
                    copyBtn.style.color = 'var(--success)';

                    setTimeout(() => {
                        copyBtn.innerHTML = `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        `;
                        copyBtn.style.color = 'var(--text-secondary)';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            });
        });
    }

    // ===== Table of Contents Generation =====
    function generateTOC() {
        const sections = [
            { id: 'concetto-di-driver', title: 'Concetto di Driver' },
            { id: 'provider-supportati', title: 'Provider Supportati' },
            { id: 'funzioni-non-supportate', title: 'Funzioni Non Supportate' },
            { id: 'json-strutturate', title: 'Risposte JSON Strutturate' },
            { id: 'chat-conversazionale', title: 'Chat Conversazionale' },
            { id: 'embeddings', title: 'Embeddings' },
            { id: 'tipi-request', title: 'Tipi di Request' },
            { id: 'classi-metodi', title: 'Classi e Metodi' },
            { id: 'livebindings', title: 'LiveBindings' },
            { id: 'eccezioni', title: 'Eccezioni' }
        ];

        let html = '';
        sections.forEach(section => {
            const element = document.getElementById(section.id);
            if (element) {
                html += `<li><a href="#${section.id}">${section.title}</a></li>`;
            }
        });

        navList.innerHTML = html;
    }

    // ===== Keyboard Navigation =====
    function handleKeyboard(e) {
        // Close sidebar on Escape
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeSidebar();
        }

        // Toggle theme with Alt+T
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
    }

    // ===== Initialize =====
    function init() {
        // Create overlay for mobile
        createOverlay();

        // Generate navigation
        generateTOC();

        // Initialize theme
        initTheme();

        // Enhance code blocks
        enhanceCodeBlocks();

        // Event listeners
        menuToggle.addEventListener('click', toggleSidebar);
        themeToggle.addEventListener('click', toggleTheme);
        scrollTopBtn.addEventListener('click', scrollToTop);
        navList.addEventListener('click', handleNavClick);
        window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('keydown', handleKeyboard);

        // Handle system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });

        // Initial scroll position check
        handleScroll();

        // Handle hash on page load
        if (window.location.hash) {
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
