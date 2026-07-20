document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const header = document.getElementById('header');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      header.classList.toggle('active-menu');
    });
    
    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        header.classList.remove('active-menu');
      });
    });
  }
  // 2. Scroll Sticky Header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  // 3. Typing Effect for Roles
  const typingEl = document.getElementById('role-typing');
  if (typingEl) {
    const rolesStr = typingEl.getAttribute('data-roles') || '';
    const roles = rolesStr.split(',').map(role => role.trim());
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
      const currentRole = roles[currentRoleIndex];
      
      if (isDeleting) {
        typingEl.textContent = currentRole.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typingSpeed = 50; // Delete faster
      } else {
        typingEl.textContent = currentRole.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typingSpeed = 100; // Normal typing speed
      }
      
      if (!isDeleting && currentCharIndex === currentRole.length) {
        typingSpeed = 2000; // Pause at full word
        isDeleting = true;
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentRoleIndex = (currentRoleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before typing next word
      }
      
      setTimeout(type, typingSpeed);
    }
    
    // Start typing
    setTimeout(type, 1000);
  }
  // 4. Intersection Observer for Scroll Reveals
  const revealElements = document.querySelectorAll('.reveal');
  const skillSection = document.querySelector('.skills');
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        
        // If it's the skills section, animate the progress bars
        if (entry.target.classList.contains('skills') || entry.target.contains(skillSection)) {
          animateSkillBars();
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  revealElements.forEach(el => revealObserver.observe(el));
  if (skillSection) revealObserver.observe(skillSection);
  function animateSkillBars() {
    skillBars.forEach(bar => {
      const targetWidth = bar.getAttribute('data-width') || '0%';
      bar.style.width = targetWidth;
    });
  }
  // 5. Project Filters (Fading transition)
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button style
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          // Small timeout to allow browser display change before transition
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          // Hide completely after opacity transition finishes
          setTimeout(() => {
            card.style.display = 'none';
          }, 400);
        }
      });
    });
  });
  // 6. Certificate Lightbox Modal
  const certCards = document.querySelectorAll('.cert-card');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  
  if (lightbox && lightboxImg && lightboxClose) {
    certCards.forEach(card => {
      card.addEventListener('click', () => {
        const imgSrc = card.getAttribute('data-img');
        const caption = card.getAttribute('data-caption');
        
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
      });
    });
    
    // Close lightbox functions
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto'; // Re-enable background scroll
      setTimeout(() => {
        lightboxImg.src = '';
        lightboxCaption.textContent = '';
      }, 200); // Clear content after transition
    };
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close when clicking background mask
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
  // 7. Contact Form Handling (with visual feedback)
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  
  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const originalContent = submitBtn.innerHTML;
      
      // Get form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      // Loading State
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.style.backgroundColor = '#64748b';
      
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, message })
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Success State
          submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
          submitBtn.style.backgroundColor = '#10b981';
          contactForm.reset();
        } else {
          // Error from API
          submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed to send';
          submitBtn.style.backgroundColor = '#ef4444'; // Red
          console.error(data.error);
        }
      } catch (error) {
        // Network Error
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Network Error';
        submitBtn.style.backgroundColor = '#ef4444'; // Red
        console.error(error);
      } finally {
        // Reset button after 3.5 seconds
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalContent;
          submitBtn.style.backgroundColor = '';
        }, 3500);
      }
    });
  }
});

