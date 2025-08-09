// ===== PREMIUM B2B MATCHMAKING PLATFORM SCRIPTS =====

document.addEventListener('DOMContentLoaded', function() {
  
  // Smooth scroll for navigation links
  const navLinks = document.querySelectorAll('nav ul li a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const headerOffset = 80;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector('header');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      header.style.background = 'rgba(13, 13, 13, 0.98)';
      header.style.backdropFilter = 'blur(20px)';
    } else {
      header.style.background = 'rgba(13, 13, 13, 0.95)';
      header.style.backdropFilter = 'blur(10px)';
    }
    
    lastScrollTop = scrollTop;
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe feature cards and pricing cards
  const animatedElements = document.querySelectorAll('.feature-card, .pricing-card, .stat-item');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Contact form submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Simulate form submission
      const submitBtn = this.querySelector('.contact-btn');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = 'linear-gradient(135deg, var(--gold-primary), var(--bronze-secondary))';
          this.reset();
        }, 2000);
      }, 1500);
    });
  }

  // Pricing card interactions
  const pricingCards = document.querySelectorAll('.pricing-card');
  pricingCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      if (!this.classList.contains('popular')) {
        this.style.transform = 'translateY(0) scale(1)';
      } else {
        this.style.transform = 'translateY(-5px) scale(1)';
      }
    });
  });

  // Dynamic stats counter
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalNumber = target.textContent;
        const isPlus = finalNumber.includes('+');
        const isMoney = finalNumber.includes('$') || finalNumber.includes('₹');
        let numericValue = parseInt(finalNumber.replace(/[^\d]/g, ''));
        
        let current = 0;
        const increment = numericValue / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
          }
          
          let displayValue = Math.floor(current).toLocaleString();
          if (isMoney && finalNumber.includes('$')) {
            displayValue = '$' + displayValue + 'M';
          } else if (isMoney && finalNumber.includes('₹')) {
            displayValue = '₹' + displayValue;
          } else if (isPlus) {
            displayValue = displayValue + '+';
          }
          
          target.textContent = displayValue;
        }, 30);
        
        statsObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });
  
  statNumbers.forEach(stat => {
    statsObserver.observe(stat);
  });

  // Mobile menu toggle (if needed)
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('nav ul');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }

  // Enhanced connection line animations
  const connectionLines = document.querySelectorAll('.connection-line');
  connectionLines.forEach((line, index) => {
    line.style.animationDelay = `${index * 0.5}s`;
  });

  // Parallax effect for hero section
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-visual, .world-map');
    
    parallaxElements.forEach(element => {
      const speed = 0.3;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

});
