document.addEventListener('DOMContentLoaded', function() {
    // Create and add progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressContainer.appendChild(progressBar);
    document.body.prepend(progressContainer);

    // Navigation toggle for mobile
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Toggle mobile navigation
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Handle dropdowns on mobile
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const content = dropdown.querySelector('.dropdown-content');
        
        // Prevent dropdown from closing when clicking inside it
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Toggle dropdown on click for mobile
        if (window.innerWidth <= 768) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-menu')) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });

    // Hide/show navigation on scroll
    let lastScrollTop = 0;
    const navMenu = document.querySelector('.nav-menu');
    const scrollThreshold = 100;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Update progress bar
        const winScroll = scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
        
        if (scrollTop > scrollThreshold) {
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                navMenu.classList.add('hidden');
            } else {
                // Scrolling up
                navMenu.classList.remove('hidden');
            }
        } else {
            navMenu.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
        
        // Trigger animations on scroll
        checkElementsInView();
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            // Skip if the href is just "#" (empty selector)
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking a link
                navLinks.classList.remove('active');
                
                // Close any open dropdowns
                const openDropdowns = document.querySelectorAll('.dropdown-content.show');
                openDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
            }
        });
    });

    // Improved animation system
    const sections = document.querySelectorAll('.section');
    const animatedElements = document.querySelectorAll('.section, .section p, .section ul, .section-image, .hero-content, .hero-image');
    
    // Set initial state for all elements
    animatedElements.forEach(el => {
        el.classList.add('animate-ready');
    });
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Function to check elements in view and animate them
    function checkElementsInView() {
        animatedElements.forEach(el => {
            if (isInViewport(el) && !el.classList.contains('animated')) {
                el.classList.add('animated');
                
                // Add staggered animation for child elements
                if (el.classList.contains('section')) {
                    const childElements = el.querySelectorAll('p, ul, .section-image');
                    childElements.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animated');
                        }, 150 * (index + 1));
                    });
                }
            }
        });
    }
    
    // Initial check for elements in view
    checkElementsInView();

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('.interactive-element');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const heroImage = heroSection.querySelector('.hero-image');
            if (heroImage) {
                heroImage.style.transform = `translateY(${scrollTop * 0.1}px)`;
            }
        });
    }

    // Update current year in the footer
    const currentYearElement = document.querySelector('.current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
        }
        
        /* Base styles for animated elements */
        .animate-ready {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        
        /* Animated state */
        .animated {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Section animations */
        .section.animated {
            animation: pulse 1s ease;
        }
        
        /* Hero image animation */
        .hero-image {
            animation: float 6s ease-in-out infinite;
        }
        
        /* Staggered animations for section children */
        .section p.animated, .section ul.animated, .section-image.animated {
            animation: fadeInUp 0.5s ease-out forwards;
        }
        
        /* Mobile dropdown styles */
        @media (max-width: 768px) {
            .dropdown-content {
                position: static;
                display: none;
                box-shadow: none;
                background-color: #f1f1f1;
                padding-left: 20px;
            }
            
            .dropdown-content.show {
                display: block;
            }
            
            .dropdown-content a {
                padding: 10px 15px;
            }
        }
    `;
    document.head.appendChild(style);

    // Add tooltip functionality
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            
            // Get the position of the tooltip word
            const rect = this.getBoundingClientRect();
            
            // Create a temporary tooltip element to measure its size
            const tempTooltip = document.createElement('div');
            tempTooltip.className = 'temp-tooltip';
            tempTooltip.style.position = 'absolute';
            tempTooltip.style.visibility = 'hidden';
            tempTooltip.style.whiteSpace = 'normal';
            tempTooltip.style.maxWidth = '300px';
            tempTooltip.style.padding = '0.75rem 1rem';
            tempTooltip.style.background = 'var(--gradient-dark)';
            tempTooltip.style.color = 'white';
            tempTooltip.style.borderRadius = '6px';
            tempTooltip.style.fontSize = '0.875rem';
            tempTooltip.style.textAlign = 'center';
            tempTooltip.textContent = tooltipText;
            
            document.body.appendChild(tempTooltip);
            
            // Position the tooltip above the word
            const tooltipHeight = tempTooltip.offsetHeight;
            const tooltipWidth = tempTooltip.offsetWidth;
            
            // Remove the temporary tooltip
            document.body.removeChild(tempTooltip);
            
            // Add a custom style to position the tooltip
            const style = document.createElement('style');
            style.textContent = `
                .tooltip:hover::after {
                    top: ${rect.top - tooltipHeight - 10}px !important;
                    left: ${rect.left + (rect.width / 2)}px !important;
                    width: ${tooltipWidth}px !important;
                }
                .tooltip:hover::before {
                    top: ${rect.top - 10}px !important;
                    left: ${rect.left + (rect.width / 2)}px !important;
                }
            `;
            document.head.appendChild(style);
            
            // Remove the style after the mouse leaves
            this.addEventListener('mouseleave', function() {
                document.head.removeChild(style);
            }, { once: true });
        });
    });
    
    // Fix navigation dropdown issue
    const navDropdowns = document.querySelectorAll('.dropdown');
    navDropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const content = dropdown.querySelector('.dropdown-content');
        let timeout;
        
        // Show dropdown on hover
        dropdown.addEventListener('mouseenter', function() {
            clearTimeout(timeout);
            dropdown.classList.add('active');
        });
        
        // Hide dropdown when mouse leaves both dropdown and content
        dropdown.addEventListener('mouseleave', function(e) {
            // Check if we're moving to the dropdown content
            const toElement = e.relatedTarget;
            if (!dropdown.contains(toElement)) {
                timeout = setTimeout(() => {
                    dropdown.classList.remove('active');
                }, 100);
            }
        });
        
        // Keep dropdown open when hovering over content
        content.addEventListener('mouseenter', function() {
            clearTimeout(timeout);
        });
        
        // Prevent dropdown from closing when clicking inside it
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Toggle dropdown on click for mobile
        if (window.innerWidth <= 768) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });

    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        // Check if we're on the game page
        const gameArea = document.getElementById('game-area');
        if (gameArea) {
            // Hide the scroll indicator completely on the game page
            scrollIndicator.style.display = 'none';
            return; // Exit the function early
        }
        
        // Smooth scroll when clicking the indicator
        scrollIndicator.addEventListener('click', function() {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });

        // Show/hide indicator based on scroll position
        let scrollTimeout;
        let isScrolling = false;
        
        function handleScroll() {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const isNearBottom = currentScroll + windowHeight >= documentHeight - 200;
            
            // Clear any existing timeout
            clearTimeout(scrollTimeout);
            
            // Hide while scrolling
            scrollIndicator.classList.add('hidden');
            isScrolling = true;
            
            // After scrolling stops
            scrollTimeout = setTimeout(function() {
                isScrolling = false;
                // Only show if not near bottom of page
                if (!isNearBottom) {
                    scrollIndicator.classList.remove('hidden');
                }
            }, 150);
        }

        // Add scroll event listeners
        window.addEventListener('scroll', handleScroll);
        
        // Initial check
        handleScroll();
    }
}); 