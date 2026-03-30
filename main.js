/* ======================================================
   MAIN.JS — Vijayakumar K Portfolio
   Terminal Typing, Carousel, ScrollReveal, Modal, Animations
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========== 1. MOBILE NAV ==========
    const navToggle = document.getElementById('navToggle');
    const mobileNav = document.getElementById('mobileNav');
    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', () => mobileNav.classList.toggle('active'));
        mobileNav.querySelectorAll('a').forEach(link =>
            link.addEventListener('click', () => mobileNav.classList.remove('active'))
        );
    }

    // ========== 2. NAVBAR SHADOW ON SCROLL ==========
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.scrollY > 50
            ? '0 4px 20px rgba(0,0,0,0.1)' : 'none';
    });

    // ========== 3. SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });

    // ========== 4. ACTIVE NAV LINK ==========
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id'); });
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === '#' + current) link.classList.add('active-link');
        });
    });

    // ========== 5. HERO TERMINAL TYPING EFFECT ==========
    const terminalLines = [
        '> Hello, I am Vijayakumar K',
        '$ > Role :Machine Learning Engineer | Generative AI Engineer',
        '$ > Building intelligent AI systems, Web applications...',
        '$ > Skills: Python, TensorFlow, PyTorch, Scikit-learn, YOLO, NLTK',
        '$ > Focus: Agentic Workflows, RAG Architectures, Deep Learning',
        '$ > Status: Open to Work'
    ];

    const terminalBody = document.getElementById('terminalBody');
    const currentLineEl = document.getElementById('currentLine');
    const cursorLineEl = document.querySelector('.term-cursor-line');
    let lineIndex = 0;
    let charIndex = 0;
    let typingSpeed = 40;

    function typeNextChar() {
        if (lineIndex >= terminalLines.length) {
            setTimeout(() => {
                const completed = terminalBody.querySelectorAll('.term-completed-line');
                completed.forEach(el => el.remove());
                lineIndex = 0;
                charIndex = 0;
                currentLineEl.textContent = '';
                typeNextChar();
            }, 3000);
            return;
        }

        const currentText = terminalLines[lineIndex];

        if (charIndex < currentText.length) {
            currentLineEl.textContent += currentText[charIndex];
            charIndex++;
            setTimeout(typeNextChar, typingSpeed + Math.random() * 30);
        } else {
            const completedLine = document.createElement('div');
            completedLine.className = 'term-completed-line';
            completedLine.textContent = currentText;
            terminalBody.insertBefore(completedLine, cursorLineEl);
            currentLineEl.textContent = '';
            lineIndex++;
            charIndex = 0;
            setTimeout(typeNextChar, 400);
        }
    }

    setTimeout(typeNextChar, 800);

    // ========== 6. PROJECT CAROUSEL ==========
    const track = document.getElementById('carouselTrack');
    const slides = track ? Array.from(track.children) : [];
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    let currentSlide = 0;
    let autoplayInterval;
    let isMobile = window.innerWidth <= 768;
    let visibleCount = isMobile ? 1 : 3;

    function getSlideWidth() {
        return isMobile ? 100 : 33.333;
    }

    function updateCarousel() {
        const slideWidth = getSlideWidth();
        track.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
        slides.forEach((slide, i) => {
            slide.classList.remove('active-slide', 'dim');
            if (isMobile) {
                if (i === currentSlide) slide.classList.add('active-slide');
                else slide.classList.add('dim');
            } else {
                const center = currentSlide + 1;
                if (i === center && i < slides.length) slide.classList.add('active-slide');
                else slide.classList.add('dim');
            }
        });
        if (dotsContainer) {
            Array.from(dotsContainer.children).forEach((dot, i) => {
                dot.classList.toggle('active-dot', i === currentSlide);
            });
        }
    }

    function maxSlideIndex() {
        return Math.max(0, slides.length - visibleCount);
    }

    function nextSlide() {
        currentSlide = currentSlide >= maxSlideIndex() ? 0 : currentSlide + 1;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = currentSlide <= 0 ? maxSlideIndex() : currentSlide - 1;
        updateCarousel();
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, 3000);
    }

    function stopAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
    }

    if (track && slides.length > 0) {
        const totalPositions = maxSlideIndex() + 1;
        for (let i = 0; i < totalPositions; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active-dot' : '');
            dot.addEventListener('click', () => { currentSlide = i; updateCarousel(); startAutoplay(); });
            dotsContainer.appendChild(dot);
        }

        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });

        track.addEventListener('mouseenter', stopAutoplay);
        track.addEventListener('mouseleave', startAutoplay);

        updateCarousel();
        startAutoplay();

        window.addEventListener('resize', () => {
            const wasMobile = isMobile;
            isMobile = window.innerWidth <= 768;
            visibleCount = isMobile ? 1 : 3;
            if (wasMobile !== isMobile) {
                currentSlide = 0;
                dotsContainer.innerHTML = '';
                const newTotal = maxSlideIndex() + 1;
                for (let i = 0; i < newTotal; i++) {
                    const dot = document.createElement('button');
                    dot.className = 'carousel-dot' + (i === 0 ? ' active-dot' : '');
                    dot.addEventListener('click', () => { currentSlide = i; updateCarousel(); startAutoplay(); });
                    dotsContainer.appendChild(dot);
                }
                updateCarousel();
            }
        });
    }

    // ========== 7. PROJECT DETAIL MODAL ==========
    const projectData = {
        defect: {
            title: 'Real-Time Defect Classification in Manufacturing',
            github: 'https://github.com/Vijayakumar226/Real-Time-Defect-Classification-in-Manufacturing-Using-Machine-Learning-and-Image-Processing',
            description: `
                <p>A production-grade computer vision system that identifies and classifies manufacturing defects in real time on the factory floor. Achieves <strong>92% accuracy</strong> on industrial defect datasets.</p>
                <h4>Key Features</h4>
                <ul>
                    <li>Real-time video stream processing with OpenCV for live defect detection</li>
                    <li>YOLOv8 fine-tuned on custom industrial defect datasets for high-precision classification</li>
                    <li>FastAPI backend serving inference results with sub-200ms latency</li>
                    <li>Interactive dashboard for monitoring defect rates and quality metrics</li>
                    <li>Data augmentation pipeline increasing training data diversity by 3x</li>
                </ul>
                <h4>Tech Stack</h4>
                <div class="modal-tags"><span>YOLOv8</span><span>Python</span><span>OpenCV</span><span>FastAPI</span><span>Deep Learning</span><span>Computer Vision</span></div>
            `
        },
        banking: {
            title: 'Voice-Enabled Intelligent Banking Assistant',
            github: 'https://github.com/Vijayakumar226/Voice-Enabled-Intelligent-Banking-Assistant-using-RAG-and-Large-Language-Models',
            description: `
                <p>An intelligent voice-based AI assistant designed for banking operations. Uses <strong>RAG (Retrieval-Augmented Generation)</strong> and Large Language Models to process secure banking queries with natural speech input.</p>
                <h4>Key Features</h4>
                <ul>
                    <li>Whisper-based speech recognition for natural voice input</li>
                    <li>LLaMA-powered LLM with RAG pipeline for context-aware banking answers</li>
                    <li>FAISS vector store for efficient semantic search over banking knowledge base</li>
                    <li>Secure query handling with compliance checks</li>
                    <li>Multi-turn conversational flow supporting complex banking operations</li>
                </ul>
                <h4>Tech Stack</h4>
                <div class="modal-tags"><span>LLaMA</span><span>FAISS</span><span>Whisper</span><span>RAG</span><span>LangChain</span><span>Python</span></div>
            `
        },
        sdlc: {
            title: 'Generative AI Tools for Automated SDLC',
            github: 'https://github.com/Vijayakumar226/Generative-AI-Tools-for-Automated-SDLC.git',
            description: `
                <p>An AI-powered platform that automates the entire Software Development Life Cycle — from requirements gathering to code generation, testing, and deployment planning — using <strong>Large Language Models</strong>.</p>
                <h4>Key Features</h4>
                <ul>
                    <li>Automated project planning and task breakdown from natural language descriptions</li>
                    <li>Code generation and review assistance using LLM prompts</li>
                    <li>Test case generation and documentation automation</li>
                    <li>Streamlit-based interactive UI for workflow management</li>
                    <li>API integration for CI/CD pipeline orchestration</li>
                </ul>
                <h4>Tech Stack</h4>
                <div class="modal-tags"><span>LLM</span><span>Streamlit</span><span>Python</span><span>API</span><span>Prompt Engineering</span></div>
            `
        },
        hr: {
            title: 'AI-Powered HR Resume Screening Automation',
            github: 'https://github.com/Vijayakumar226/AI-Powered-HR-Resume-Screening-Automation-using-n8n',
            description: `
                <p>AI-driven workflow automation that <strong>reduces manual HR screening effort by 60%</strong>. Uses n8n workflow orchestration with AI-powered resume parsing and candidate scoring.</p>
                <h4>Key Features</h4>
                <ul>
                    <li>Automated resume ingestion from Gmail with n8n workflow triggers</li>
                    <li>AI-powered skill extraction, experience grading, and fit scoring</li>
                    <li>Candidate scorecards with visual grade-o-meter dashboards</li>
                    <li>Google Sheets integration for real-time candidate tracking</li>
                    <li>Recruiter-BERT model for intelligent skill-to-requirement matching</li>
                </ul>
                <h4>Tech Stack</h4>
                <div class="modal-tags"><span>n8n</span><span>Gmail API</span><span>Google Sheets</span><span>AI</span><span>NLP</span><span>Automation</span></div>
            `
        },
        qa: {
            title: 'Q&A AI Agent for Renewable Energy',
            github: 'https://github.com/Vijayakumar226/Q-A-AI-Agent-for-renewable-energy.git',
            description: `
                <p>A domain-specific AI question-answering agent focused on the <strong>renewable energy sector</strong>. Uses RAG and LLMs to provide accurate, context-aware answers from proprietary energy datasets.</p>
                <h4>Key Features</h4>
                <ul>
                    <li>Domain-specific RAG pipeline for renewable energy knowledge retrieval</li>
                    <li>LLM-powered contextual question answering with source citations</li>
                    <li>Vector database for semantic search over energy production data</li>
                    <li>Support for queries about solar yield, maintenance schedules, and compliance</li>
                    <li>Scalable architecture for enterprise-grade energy data processing</li>
                </ul>
                <h4>Tech Stack</h4>
                <div class="modal-tags"><span>LLM</span><span>RAG</span><span>AI Agent</span><span>NLP</span><span>Vector DB</span><span>Python</span></div>
            `
        },
        netflix: {
            title: 'Netflix Data Analysis Dashboard',
            github: '#',
            description: `
                <p>A comprehensive data analysis dashboard built with <strong>Power BI</strong> that visualizes Netflix's global content library. Provides actionable insights on viewership trends, content strategy, and regional audience patterns.</p>
                <h4>Key Features</h4>
                <ul>
                    <li>Interactive Power BI dashboards with drill-down filtering</li>
                    <li>Content trend analysis across genres, regions, and time periods</li>
                    <li>Viewership pattern analysis with regional demographic breakdowns</li>
                    <li>Content popularity scoring and recommendation insights</li>
                    <li>Data cleaning and preprocessing pipeline for raw Netflix datasets</li>
                </ul>
                <h4>Tech Stack</h4>
                <div class="modal-tags"><span>Power BI</span><span>Data Analysis</span><span>Python</span><span>Pandas</span><span>Data Visualization</span></div>
            `
        }
    };

    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalGithub = document.getElementById('modalGithub');
    const modalClose = document.getElementById('modalClose');

    document.querySelectorAll('.explore-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const key = btn.dataset.project;
            const data = projectData[key];
            if (data) {
                modalTitle.textContent = data.title;
                modalBody.innerHTML = data.description;
                modalGithub.href = data.github;
                if (data.github === '#') modalGithub.style.display = 'none';
                else modalGithub.style.display = 'inline-flex';
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    // ========== 8. SCROLL REVEAL ==========
    function setupReveals() {
        document.querySelectorAll('.section-label, .section-heading, .section-subtitle').forEach(el => el.classList.add('reveal'));
        document.querySelectorAll('.skill-card, .exp-card, .achievement-card, .stat-card').forEach(el => el.classList.add('reveal'));
        document.querySelectorAll('.cta-card').forEach(el => el.classList.add('reveal-scale'));

        const heroLeft = document.querySelector('.hero-left');
        const heroRight = document.querySelector('.hero-right');
        const aboutImg = document.querySelector('.about-image-col');
        const aboutText = document.querySelector('.about-text-col');

        if (heroLeft) heroLeft.classList.add('reveal-left');
        if (heroRight) heroRight.classList.add('reveal-right');
        if (aboutImg) aboutImg.classList.add('reveal-left');
        if (aboutText) aboutText.classList.add('reveal-right');
    }

    setupReveals();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const siblings = entry.target.parentElement ? Array.from(entry.target.parentElement.children) : [];
                const idx = siblings.indexOf(entry.target);
                const delay = Math.min(idx * 80, 400);
                setTimeout(() => entry.target.classList.add('active'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));

    // ========== 9. SKILL BAR ANIMATION ==========
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.skill-row').forEach((row, i) => {
                    setTimeout(() => {
                        const bar = row.querySelector('.skill-bar-fill');
                        const pct = row.querySelector('.skill-pct');
                        if (!bar || !pct) return;

                        const targetVal = parseInt(bar.dataset.width);

                        // 1. Animate Width
                        bar.style.width = targetVal + '%';

                        // 2. Animate Counter smoothly over ~1.5s
                        let currentVal = 0;
                        const duration = 1500;
                        const stepTime = Math.max(20, duration / targetVal);

                        const counter = setInterval(() => {
                            currentVal += 1;
                            pct.textContent = currentVal + '%';
                            if (currentVal >= targetVal) {
                                pct.textContent = targetVal + '%';
                                clearInterval(counter);
                            }
                        }, stepTime);
                    }, i * 100);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

});
