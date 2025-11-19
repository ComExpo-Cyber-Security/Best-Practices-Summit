/**
 * 3D Animations & Scroll Effects
 * Purple Theme Enhancement
 */

(function() {
    'use strict';

    // Scroll-triggered animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    entry.target.style.opacity = '1';
                }
            });
        }, observerOptions);

        // Observe sections
        document.querySelectorAll('.section').forEach(section => {
            section.style.opacity = '0';
            observer.observe(section);
        });

        // Observe cards
        document.querySelectorAll('.card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    }

    // Parallax effect for hero shapes
    function initParallax() {
        const shapes = document.querySelectorAll('.geometric-shape');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                const yPos = -(scrolled * speed / 100);
                shape.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Animated counter for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stats-block .number');
        
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.textContent);
                    let currentValue = 0;
                    const increment = finalValue / 50;
                    const duration = 2000;
                    const stepTime = duration / 50;

                    const timer = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= finalValue) {
                            target.textContent = finalValue + (target.textContent.includes('+') ? '+' : '');
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.floor(currentValue) + (target.textContent.includes('+') ? '+' : '');
                        }
                    }, stepTime);

                    observer.unobserve(target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    // Add ripple effect to buttons
    function initRippleEffect() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple-effect');

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Mouse move parallax effect on cards
    function initCardTilt() {
        document.querySelectorAll('.hover-3d').forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }

    // Add glow effect to sections on scroll
    function initGlowEffect() {
        const sections = document.querySelectorAll('.section');
        
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + window.innerHeight / 2;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos <= sectionTop + sectionHeight) {
                    section.style.boxShadow = '0 0 50px rgba(124, 58, 237, 0.15)';
                } else {
                    section.style.boxShadow = 'none';
                }
            });
        });
    }

    // Countdown timer animation
    function initCountdown() {
        const countdownElement = document.getElementById('countdown-box');
        if (!countdownElement) return;

        const eventDate = new Date('2025-01-15T09:00:00').getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                countdownElement.innerHTML = '<span class="number">Event Started!</span>';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.innerHTML = `
                <span class="pulse-3d"><span class="number">${days}</span><span class="unit d-block">Days</span></span>
                <span class="pulse-3d delay-1"><span class="number">${hours}</span><span class="unit d-block">Hours</span></span>
                <span class="pulse-3d delay-2"><span class="number">${minutes}</span><span class="unit d-block">Minutes</span></span>
                <span class="pulse-3d delay-3"><span class="number">${seconds}</span><span class="unit d-block">Seconds</span></span>
            `;
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Initialize all effects when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initScrollAnimations();
        initParallax();
        animateCounters();
        initRippleEffect();
        initCardTilt();
        initGlowEffect();
        initCountdown();

        // Add stagger animation to speaker cards
        const speakerCards = document.querySelectorAll('.speakers-section .card');
        speakerCards.forEach((card, index) => {
            card.classList.add(`stagger-${(index % 6) + 1}`);
        });

        // Add smooth scroll behavior
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    });

    // Add CSS for ripple effect dynamically
    const style = document.createElement('style');
    style.textContent = `
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

})();
