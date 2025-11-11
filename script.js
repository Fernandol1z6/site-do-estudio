/* ============================================
   ÉDAQUÍ STUDIO - SCRIPT PRINCIPAL
   Mobile-First, Premium, Apple-Inspired
   ============================================ */

(function() {
    'use strict';

    /* ============================================
       DADOS DINÂMICOS
       ============================================ */

    const STORAGE_KEY = 'edaqui_studio_data';

    function getDynamicData() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    /* ============================================
       UTILITÁRIOS
       ============================================ */

    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => context.querySelectorAll(selector);

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    /* ============================================
       HEADER E NAVEGAÇÃO
       ============================================ */

    function initHeader() {
        const header = $('#header');
        const burger = $('.burger');
        const navLinks = $('.nav-links');
        const navLinkItems = $$('.nav-link');

        if (!header || !burger || !navLinks) return;

        // Toggle menu hambúrguer
        burger.addEventListener('click', () => {
            const isActive = burger.classList.contains('active');
            burger.classList.toggle('active');
            burger.setAttribute('aria-expanded', !isActive);
            navLinks.classList.toggle('active');
            document.body.style.overflow = !isActive ? 'hidden' : '';
        });

        // Fechar menu ao clicar num link (mobile)
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    burger.classList.remove('active');
                    burger.setAttribute('aria-expanded', 'false');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Fechar menu ao clicar fora (mobile)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) &&
                !burger.contains(e.target)) {
                burger.classList.remove('active');
                burger.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Header scroll effect
        let lastScroll = 0;
        const scrollThreshold = 80;

        const handleScroll = debounce(() => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScroll > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, 10);

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check on load
    }

    /* ============================================
       ANIMAÇÕES ON SCROLL
       ============================================ */

    function initScrollAnimations() {
        const fadeElements = $$('.fade-in, .work-card, .service-card, .value-card');

        if (!fadeElements.length || !('IntersectionObserver' in window)) {
            // Fallback: mostrar todos os elementos
            fadeElements.forEach(el => el.classList.add('visible'));
            return;
        }

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

        fadeElements.forEach(el => observer.observe(el));
    }

    /* ============================================
       PORTFÓLIO - FILTROS E GALERIA
       ============================================ */

    let portfolioImages = [];
    let currentFilter = 'all';
    let currentImageIndex = 0;

    function initPortfolio() {
        // Carregar fotos do localStorage
        const dynamicData = getDynamicData();
        if (dynamicData && dynamicData.photos && dynamicData.photos.length > 0) {
            portfolioImages = dynamicData.photos.map(photo => ({
                src: photo.url,
                alt: photo.alt || photo.title || 'Foto',
                category: photo.category
            }));
        } else {
            return;
        }
        
        const portfolioGrid = $('#portfolioGrid');
        if (!portfolioGrid) return;

        // Renderizar todas as imagens
        renderPortfolio(portfolioImages);

        // Filtros
        const filterButtons = $$('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Atualizar botões ativos
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filtrar imagens
                currentFilter = filter;
                filterPortfolio(filter);
            });
        });
    }

    function renderPortfolio(images) {
        const portfolioGrid = $('#portfolioGrid');
        if (!portfolioGrid) return;

        portfolioGrid.innerHTML = '';

        images.forEach((image, index) => {
            const item = document.createElement('div');
            item.className = 'portfolio-item';
            item.dataset.category = image.category || 'all';
            item.dataset.index = index;
            
            const img = document.createElement('img');
            img.src = image.src || image.url;
            img.alt = image.alt || `Imagem ${index + 1}`;
            img.loading = 'lazy';
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/400x300?text=Imagem+Não+Encontrada';
            };
            
            item.appendChild(img);
            item.addEventListener('click', () => openLightbox(index));
            
            portfolioGrid.appendChild(item);
        });
    }

    function filterPortfolio(filter) {
        const items = $$('.portfolio-item');
        
        items.forEach(item => {
            const category = item.dataset.category;
            
            if (filter === 'all' || category === filter) {
                item.classList.remove('hidden');
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    item.classList.add('hidden');
                }, 300);
            }
        });
    }

    /* ============================================
       LIGHTBOX COM SWIPE
       ============================================ */

    function initLightbox() {
        const lightbox = $('#lightbox');
        const lightboxImage = $('#lightboxImage');
        const lightboxClose = $('.lightbox-close');
        const lightboxPrev = $('.lightbox-prev');
        const lightboxNext = $('.lightbox-next');
        const lightboxCounter = $('#lightboxCounter');

        if (!lightbox || !lightboxImage) return;

        // Abrir lightbox
        window.openLightbox = (index) => {
            // Verificar se há work-cards (página inicial)
            const workCards = $$('.work-card');
            if (workCards.length > 0 && portfolioImages.length === 0) {
                const workImages = Array.from(workCards).map(card => ({
                    src: card.querySelector('img').src,
                    alt: card.querySelector('img').alt
                }));
                
                currentImageIndex = index >= 0 && index < workImages.length ? index : 0;
                updateLightboxImage(workImages[currentImageIndex], currentImageIndex, workImages.length);
                
                // Armazenar temporariamente para navegação
                portfolioImages = workImages;
            } else if (portfolioImages.length === 0) {
                // Se não há portfolioImages, usar imagens da galeria atual
                const items = $$('.portfolio-item:not(.hidden)');
                if (items.length === 0) return;
                
                const filteredImages = Array.from(items).map(item => ({
                    src: item.querySelector('img').src,
                    alt: item.querySelector('img').alt
                }));
                
                currentImageIndex = index >= 0 && index < filteredImages.length ? index : 0;
                updateLightboxImage(filteredImages[currentImageIndex], currentImageIndex, filteredImages.length);
                
                // Armazenar temporariamente para navegação
                portfolioImages = filteredImages;
            } else {
                // Filtrar imagens baseado no filtro atual
                const filteredImages = currentFilter === 'all' 
                    ? portfolioImages 
                    : portfolioImages.filter(img => img.category === currentFilter);
                
                currentImageIndex = filteredImages.findIndex((img, i) => {
                    const originalIndex = portfolioImages.indexOf(img);
                    return originalIndex === index;
                });
                
                if (currentImageIndex === -1) currentImageIndex = 0;
                
                updateLightboxImage(
                    filteredImages[currentImageIndex], 
                    currentImageIndex, 
                    filteredImages.length
                );
            }
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        // Fechar lightbox
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        lightboxClose?.addEventListener('click', closeLightbox);
        lightbox?.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Navegação anterior/seguinte
        const navigateLightbox = (direction) => {
            let filteredImages;
            
            if (portfolioImages.length > 0) {
                filteredImages = currentFilter === 'all' 
                    ? portfolioImages 
                    : portfolioImages.filter(img => img.category === currentFilter);
            } else {
                const items = $$('.portfolio-item:not(.hidden)');
                filteredImages = Array.from(items).map(item => ({
                    src: item.querySelector('img').src,
                    alt: item.querySelector('img').alt
                }));
            }

            if (direction === 'next') {
                currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
            } else {
                currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
            }

            updateLightboxImage(filteredImages[currentImageIndex], currentImageIndex, filteredImages.length);
        };

        lightboxPrev?.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox('prev');
        });

        lightboxNext?.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox('next');
        });

        // Atualizar imagem do lightbox
        function updateLightboxImage(image, index, total) {
            if (!lightboxImage) return;
            
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt || `Imagem ${index + 1}`;
            
            if (lightboxCounter) {
                lightboxCounter.textContent = `${index + 1} / ${total}`;
            }
        }

        // Swipe para mobile
        let touchStartX = 0;
        let touchEndX = 0;
        const swipeThreshold = 50;

        lightboxImage?.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightboxImage?.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - próxima imagem
                    navigateLightbox('next');
                } else {
                    // Swipe right - imagem anterior
                    navigateLightbox('prev');
                }
            }
        }

        // Teclado (desktop)
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox('prev');
            } else if (e.key === 'ArrowRight') {
                navigateLightbox('next');
            }
        });
    }

    /* ============================================
       VALIDAÇÃO DE FORMULÁRIO
       ============================================ */

    function initFormValidation() {
        const form = $('#contactForm');
        if (!form) return;

        const fields = {
            nome: {
                input: $('#nome'),
                error: $('#nomeError'),
                validate: (value) => {
                    if (!value || value.trim().length < 2) {
                        return 'O nome deve ter pelo menos 2 caracteres';
                    }
                    return '';
                }
            },
            email: {
                input: $('#email'),
                error: $('#emailError'),
                validate: (value) => {
                    if (!value) {
                        return 'O email é obrigatório';
                    }
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        return 'Por favor, insira um email válido';
                    }
                    return '';
                }
            },
            telefone: {
                input: $('#telefone'),
                error: $('#telefoneError'),
                validate: (value) => {
                    if (!value) {
                        return 'O telefone é obrigatório';
                    }
                    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
                    if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 9) {
                        return 'Por favor, insira um telefone válido';
                    }
                    return '';
                }
            },
            servico: {
                input: $('#servico'),
                error: $('#servicoError'),
                validate: (value) => {
                    if (!value) {
                        return 'Por favor, selecione um serviço';
                    }
                    return '';
                }
            },
            mensagem: {
                input: $('#mensagem'),
                error: $('#mensagemError'),
                validate: (value) => {
                    if (!value || value.trim().length < 10) {
                        return 'A mensagem deve ter pelo menos 10 caracteres';
                    }
                    return '';
                }
            }
        };

        // Validação em tempo real
        Object.keys(fields).forEach(key => {
            const field = fields[key];
            if (field.input) {
                field.input.addEventListener('blur', () => validateField(key, fields));
                field.input.addEventListener('input', () => {
                    if (field.input.parentElement.classList.contains('error')) {
                        validateField(key, fields);
                    }
                });
            }
        });

        // Submissão do formulário
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            Object.keys(fields).forEach(key => {
                const fieldValid = validateField(key, fields);
                if (!fieldValid) isValid = false;
            });

            if (isValid) {
                // Simular envio (aqui você integraria com um backend)
                const formSuccess = $('#formSuccess');
                if (formSuccess) {
                    formSuccess.style.display = 'block';
                    form.reset();
                    
                    // Scroll para a mensagem de sucesso
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    // Esconder mensagem após 5 segundos
                    setTimeout(() => {
                        formSuccess.style.display = 'none';
                    }, 5000);
                }

                // Aqui você faria a chamada para o backend
                console.log('Formulário válido, enviando...', {
                    nome: fields.nome.input.value,
                    email: fields.email.input.value,
                    telefone: fields.telefone.input.value,
                    servico: fields.servico.input.value,
                    mensagem: fields.mensagem.input.value
                });
            } else {
                // Scroll para o primeiro erro
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    function validateField(fieldName, fields) {
        const field = fields[fieldName];
        if (!field || !field.input) return true;

        const value = field.input.value.trim();
        const error = field.validate(value);
        const formGroup = field.input.closest('.form-group');

        if (error) {
            formGroup.classList.add('error');
            if (field.error) {
                field.error.textContent = error;
            }
            return false;
        } else {
            formGroup.classList.remove('error');
            if (field.error) {
                field.error.textContent = '';
            }
            return true;
        }
    }

    /* ============================================
       CARDS DE TRABALHO (PÁGINA INICIAL)
       ============================================ */

    function initWorkCards() {
        // Carregar work cards do localStorage
        const dynamicData = getDynamicData();
        
        // Se não houver work cards específicos, usar as primeiras 6 fotos
        if (dynamicData?.photos && dynamicData.photos.length > 0) {
            const firstPhotos = dynamicData.photos.slice(0, 6);
            const workGrid = $('.work-grid');
            if (workGrid) {
                workGrid.innerHTML = '';
                firstPhotos.forEach((photo, index) => {
                    const workCard = document.createElement('div');
                    workCard.className = 'work-card';
                    workCard.dataset.category = photo.category;
                    workCard.innerHTML = `
                        <div class="work-image">
                            <img src="${photo.url}" alt="${photo.alt || photo.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Imagem+Não+Encontrada'">
                            <div class="work-overlay">
                                <h3 class="work-title">${photo.title || photo.alt}</h3>
                                <p class="work-category">${photo.category}</p>
                            </div>
                        </div>
                    `;
                    workCard.addEventListener('click', () => {
                        if (window.openLightbox) {
                            window.openLightbox(index);
                        }
                    });
                    workGrid.appendChild(workCard);
                });
            }
        }
    }

    function loadDynamicContent() {
        // Carregar dados do localStorage (sistema estático)
        const dynamicData = getDynamicData();
        
        if (!dynamicData || !dynamicData.settings) return;

        // Atualizar Hero Section
        const heroTitle = $('.hero-title');
        const heroSubtitle = $('.hero-subtitle');
        const heroBackground = $('.hero-background');
        
        if (heroTitle && dynamicData.settings.heroTitle) {
            heroTitle.innerHTML = dynamicData.settings.heroTitle.replace(/\n/g, '<br>');
        }
        if (heroSubtitle && dynamicData.settings.heroSubtitle) {
            heroSubtitle.textContent = dynamicData.settings.heroSubtitle;
        }
        if (heroBackground && dynamicData.settings.heroImage) {
            heroBackground.style.backgroundImage = `url('${dynamicData.settings.heroImage}')`;
        }

        // Atualizar Footer com contactos
        const footerPhones = $$('.footer-column ul li');
        if (footerPhones.length > 0 && dynamicData.settings.phone1) {
            footerPhones[0].textContent = dynamicData.settings.phone1;
        }
        if (footerPhones.length > 1 && dynamicData.settings.phone2) {
            footerPhones[1].textContent = dynamicData.settings.phone2;
        }
        
        const footerEmail = $('.footer-column a[href^="mailto"]');
        if (footerEmail && dynamicData.settings.email) {
            footerEmail.textContent = dynamicData.settings.email;
            footerEmail.href = `mailto:${dynamicData.settings.email}`;
        }
    }

    /* ============================================
       LAZY LOADING DE IMAGENS
       ============================================ */

    function initLazyLoading() {
        const lazyImages = $$('img[loading="lazy"]');

        if (!('IntersectionObserver' in window)) {
            // Fallback: carregar todas as imagens
            lazyImages.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
            return;
        }

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    /* ============================================
       SMOOTH SCROLL PARA LINKS ÂNCORA
       ============================================ */

    function initSmoothScroll() {
        const anchorLinks = $$('a[href^="#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || href === '') return;

                const target = $(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = $('#header')?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /* ============================================
       THEME TOGGLE (DARK/LIGHT MODE)
       ============================================ */

    function initThemeToggle() {
        const themeToggle = $('#themeToggle');
        const themeIcon = $('#themeIcon');
        if (!themeToggle || !themeIcon) return;

        // Carregar tema salvo ou usar preferência do sistema
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

        document.documentElement.setAttribute('data-theme', currentTheme);
        themeIcon.classList.remove('fa-moon', 'fa-sun');
        themeIcon.classList.add(currentTheme === 'dark' ? 'fa-moon' : 'fa-sun');

        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            themeIcon.classList.remove('fa-moon', 'fa-sun');
            themeIcon.classList.add(newTheme === 'dark' ? 'fa-moon' : 'fa-sun');
            localStorage.setItem('theme', newTheme);
        });
    }

    /* ============================================
       INICIALIZAÇÃO
       ============================================ */

    function init() {
        initHeader();
        initScrollAnimations();
        initLightbox();
        initFormValidation();
        initLazyLoading();
        initSmoothScroll();
        initThemeToggle();
        
        // Carregar conteúdo dinâmico
        loadDynamicContent();
        initWorkCards();

        // Expor função global para portfólio
        window.initPortfolio = initPortfolio;
        
        // Carregar portfólio se estiver na página de portfólio
        if ($('#portfolioGrid')) {
            initPortfolio();
        }
    }

    // Aguardar DOM carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expor para uso externo
    window.openLightbox = window.openLightbox || (() => {});

})();


