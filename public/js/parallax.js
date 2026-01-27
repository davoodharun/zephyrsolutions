/**
 * Parallax Scrolling Implementation
 * Provides smooth parallax effects with performance optimization
 */

(function() {
  'use strict';

  // Configuration
  const parallaxConfig = {
    enabled: true,
    speedRatio: 0.5,
    elements: [
      { selector: '.parallax-bg', speed: 0.3 },
      { selector: '.parallax-mid', speed: 0.6 },
      { selector: '.parallax-fg', speed: 0.9 }
    ],
    performanceThreshold: 30, // FPS threshold
    respectReducedMotion: true,
    mobileEnabled: false,
    debounceDelay: 10
  };

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Check if mobile device
  const isMobile = window.innerWidth < 768;

  // State
  let rafId = null;
  let lastScrollY = window.scrollY;
  let elements = [];
  let isEnabled = parallaxConfig.enabled && 
                  (!prefersReducedMotion || !parallaxConfig.respectReducedMotion) &&
                  (isMobile ? parallaxConfig.mobileEnabled : true);

  // Initialize
  function init() {
    if (!isEnabled) {
      return;
    }

    // Find all parallax elements
    parallaxConfig.elements.forEach(config => {
      const foundElements = document.querySelectorAll(config.selector);
      foundElements.forEach(el => {
        elements.push({
          element: el,
          speed: config.speed || parallaxConfig.speedRatio,
          initialOffset: 0
        });
        
        // Force hardware acceleration
        el.style.willChange = 'transform';
        el.style.transform = 'translateZ(0)';
      });
    });

    if (elements.length === 0) {
      return;
    }

    // Use Intersection Observer for performance
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const parallaxElement = elements.find(e => e.element === entry.target);
          if (parallaxElement) {
            parallaxElement.isVisible = entry.isIntersecting;
          }
        });
      }, {
        rootMargin: '50px'
      });

      elements.forEach(item => {
        observer.observe(item.element);
      });
    }

    // Start scroll handler
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
  }

  // Scroll handler with debouncing
  let ticking = false;
  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Update parallax positions
  function updateParallax() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    elements.forEach(item => {
      // Skip if element not visible (Intersection Observer optimization)
      if (item.isVisible === false && 'IntersectionObserver' in window) {
        return;
      }

      const rect = item.element.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const elementHeight = rect.height;
      
      // Calculate if element is in viewport
      const elementBottom = elementTop + elementHeight;
      const isInViewport = scrollY + viewportHeight >= elementTop && scrollY <= elementBottom;

      if (isInViewport) {
        // Calculate parallax offset based on scroll position relative to element
        const elementCenter = elementTop + (elementHeight / 2);
        const scrollProgress = (scrollY + viewportHeight / 2 - elementCenter) / viewportHeight;
        const offset = scrollProgress * viewportHeight * (1 - item.speed);
        
        // Apply transform with hardware acceleration
        item.element.style.transform = `translate3d(0, ${offset}px, 0)`;
      } else {
        // Reset transform for elements outside viewport
        item.element.style.transform = 'translate3d(0, 0, 0)';
      }
    });
    
    lastScrollY = scrollY;
  }

  // Public API
  window.Parallax = {
    init: init,
    getPerformanceStats: function() {
      return {
        enabled: isEnabled,
        elementCount: elements.length,
        fps: 'N/A' // Would need performance monitoring
      };
    }
  };

  // Smooth scroll for anchor links
  function initSmoothScroll() {
    // Get base path from current location (e.g., "/zephyrsolutions" or "")
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(p => p && p !== 'index.html');
    const basePath = pathParts.length > 0 && pathParts[0] !== '' ? '/' + pathParts[0] : '';
    const isHomePage = currentPath === '/' || currentPath === basePath + '/' || currentPath === basePath + '/index.html' || currentPath.endsWith('/index.html');
    
    // Handle all navigation links
    document.querySelectorAll('.nav-link, a[href^="#"], a[href^="/#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        let href = this.getAttribute('href');
        const originalHref = href;
        
        // Always prevent default for navigation links
        e.preventDefault();
        
        // Extract hash from various formats: "/zephyrsolutions/#about", "/#about", "#about"
        let hash = '';
        if (href.includes('#')) {
          hash = '#' + href.split('#')[1];
        }
        
        // Handle home link
        if (!hash || hash === '#home' || href === '/' || href === basePath + '/' || href === basePath) {
          if (!isHomePage) {
            window.location.href = basePath + '/';
            return;
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        
        // If we're not on the home page, navigate to home with hash
        if (!isHomePage) {
          window.location.href = basePath + '/' + hash;
          return;
        }
        
        // We're on the home page, scroll to section
        const target = document.querySelector(hash);
        if (target) {
          // Get actual header height dynamically
          const header = document.querySelector('header.site-header');
          const headerHeight = header ? header.offsetHeight : 100;
          
          // Try to find the h2 title within the section for better positioning
          const sectionTitle = target.querySelector('h2');
          const scrollTarget = sectionTitle || target;
          
          const elementPosition = scrollTarget.getBoundingClientRect().top;
          // Add extra padding to ensure title is fully visible below header
          const extraPadding = 20;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight - extraPadding;

          window.scrollTo({
            top: Math.max(0, offsetPosition), // Ensure we don't scroll to negative position
            behavior: 'smooth'
          });
        } else {
          // If target not found, try navigating (fallback)
          console.warn('Section not found:', hash);
        }
      });
    });
    
    // Handle hash on page load (if user navigates directly to /#section)
    if (window.location.hash) {
      const hash = window.location.hash;
      setTimeout(() => {
        const target = document.querySelector(hash);
        if (target) {
          // Get actual header height dynamically
          const header = document.querySelector('header.site-header');
          const headerHeight = header ? header.offsetHeight : 100;
          
          // Try to find the h2 title within the section for better positioning
          const sectionTitle = target.querySelector('h2');
          const scrollTarget = sectionTitle || target;
          
          const elementPosition = scrollTarget.getBoundingClientRect().top;
          // Add extra padding to ensure title is fully visible below header
          const extraPadding = 20;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight - extraPadding;
          
          window.scrollTo({
            top: Math.max(0, offsetPosition), // Ensure we don't scroll to negative position
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }

  // Update active nav link based on scroll position
  function updateActiveNav() {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(p => p && p !== 'index.html');
    const basePath = pathParts.length > 0 && pathParts[0] !== '' ? '/' + pathParts[0] : '';
    const isHomePage = currentPath === '/' || currentPath === basePath + '/' || currentPath === basePath + '/index.html' || currentPath.endsWith('/index.html');
    
    // Only update if we're on the home page
    if (!isHomePage) {
      return;
    }
    
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollY = window.pageYOffset;
    const headerHeight = 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          const href = link.getAttribute('href');
          // Extract hash from href (handles /zephyrsolutions/#about, /#about, #about)
          const hash = href.includes('#') ? '#' + href.split('#')[1] : '';
          // Match section ID with hash, or home section with various formats
          if ((hash === `#${sectionId}`) ||
              (sectionId === 'home' && (!hash || hash === '#home' || href.endsWith('/') || href === '/' || href === basePath + '/'))) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Update header on scroll
  function updateHeaderOnScroll() {
    const header = document.querySelector('header.site-header');
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  // Mobile menu toggle
  function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (!menuToggle || !mainNav) return;
    
    menuToggle.addEventListener('click', function() {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('mobile-nav-open');
    });
    
    // Close menu when clicking a nav link on mobile
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          menuToggle.setAttribute('aria-expanded', 'false');
          mainNav.classList.remove('mobile-nav-open');
        }
      });
    });
    
    // Close menu when clicking outside on mobile
    document.addEventListener('click', function(event) {
      if (window.innerWidth <= 768 && 
          !mainNav.contains(event.target) && 
          !menuToggle.contains(event.target) &&
          mainNav.classList.contains('mobile-nav-open')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('mobile-nav-open');
      }
    });
  }

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      init();
      initSmoothScroll();
      initMobileMenu();
      window.addEventListener('scroll', updateActiveNav, { passive: true });
      window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
      updateActiveNav(); // Initial call
      updateHeaderOnScroll(); // Initial call
    });
  } else {
    init();
    initSmoothScroll();
    initMobileMenu();
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
    updateActiveNav(); // Initial call
    updateHeaderOnScroll(); // Initial call
  }
})();
