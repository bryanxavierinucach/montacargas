document.addEventListener('DOMContentLoaded', () => {

  /* --- MOBILE NAVIGATION --- */
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle Mobile Menu
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Close Mobile Menu on Link Click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileToggle && navMenu) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  });

  // Sticky Header on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  /* --- SCROLL SPY (ACTIVE NAVIGATION LINK) --- */
  const sections = document.querySelectorAll('section[id]');

  function scrollActiveSpy() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100; // Offset matching scroll-margin-top
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          navLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', scrollActiveSpy);


  /* --- CATALOG REAL-TIME FILTER --- */
  const searchInput = document.getElementById('catalog-search');
  const catalogCards = document.querySelectorAll('.catalog-card');
  const catalogsGrid = document.getElementById('catalogs-grid');

  // Create "No Results" message element
  const noResultsEl = document.createElement('div');
  noResultsEl.className = 'no-results hidden';
  noResultsEl.style.width = '100%';
  noResultsEl.style.gridColumn = '1 / -1';
  noResultsEl.style.textAlign = 'center';
  noResultsEl.style.padding = '3rem 1.5rem';
  noResultsEl.style.color = 'var(--text-secondary)';
  noResultsEl.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 1rem auto; display: block; color: var(--text-muted);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
    <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.25rem;">No se encontraron catálogos</p>
    <p style="font-size: 0.9rem; color: var(--text-muted);">Prueba buscando con palabras como 'hidráulica', 'motor', 'ruedas' o 'frenos'.</p>
  `;
  if (catalogsGrid) {
    catalogsGrid.appendChild(noResultsEl);
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let visibleCount = 0;

      // Filter catalog cards
      catalogCards.forEach(card => {
        const title = card.getAttribute('data-title') || '';
        if (title.includes(query)) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      // Toggle no results element
      if (visibleCount === 0) {
        noResultsEl.classList.remove('hidden');
      } else {
        noResultsEl.classList.add('hidden');
      }
    });
  }


  /* --- WHATSAPP CONSULTATION LINK BUILDER --- */
  const consultButtons = document.querySelectorAll('.btn-consult');
  const PHONE_NUMBER = '593991223536';

  consultButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const catalogName = e.target.getAttribute('data-catalog');
      const message = `Hola EPS Supplier, quisiera solicitar información sobre la disponibilidad de repuestos relacionados con el catálogo de: *${catalogName}*.`;
      const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    });
  });


  /* --- CONTACT FORM VALIDATION & INTERACTIVE HANDLING --- */
  const contactForm = document.getElementById('contact-form');
  const formFeedbackOverlay = document.getElementById('form-feedback-overlay');
  const btnFeedbackClose = document.getElementById('btn-feedback-close');

  // Helper function to validate fields
  function validateField(inputEl, conditionFn) {
    const formGroup = inputEl.closest('.form-group') || inputEl.closest('.form-group-full');
    if (!formGroup) return true;

    if (conditionFn(inputEl.value)) {
      formGroup.classList.remove('has-error');
      return true;
    } else {
      formGroup.classList.add('has-error');
      return false;
    }
  }

  // Real-time error removal when user types
  const inputsToWatch = contactForm ? contactForm.querySelectorAll('.form-control') : [];
  inputsToWatch.forEach(input => {
    input.addEventListener('input', () => {
      const formGroup = input.closest('.form-group') || input.closest('.form-group-full');
      if (formGroup) {
        formGroup.classList.remove('has-error');
      }
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const lastnameInput = document.getElementById('lastname');
      const emailInput = document.getElementById('email');
      const phoneInput = document.getElementById('phone');
      const messageInput = document.getElementById('message');

      // Validation logic
      const isNameValid = validateField(nameInput, val => val.trim().length > 0);
      const isLastnameValid = validateField(lastnameInput, val => val.trim().length > 0);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmailValid = validateField(emailInput, val => emailRegex.test(val.trim()));

      const isPhoneValid = validateField(phoneInput, val => val.trim().length >= 7);
      const isMessageValid = validateField(messageInput, val => val.trim().length > 0);

      const isFormValid = isNameValid && isLastnameValid && isEmailValid && isPhoneValid && isMessageValid;

      if (isFormValid) {
        // Collect form data
        const formData = {
          name: nameInput.value.trim(),
          lastname: lastnameInput.value.trim(),
          email: emailInput.value.trim(),
          phone: phoneInput.value.trim(),
          message: messageInput.value.trim()
        };

        // Mock API transmission
        console.log('Sending technical request details:', formData);

        // Show success animation panel
        if (formFeedbackOverlay) {
          formFeedbackOverlay.classList.add('active');
        }

        // Trigger WhatsApp window as a dual fallback so the customer gets instant assistance
        setTimeout(() => {
          const userMsg = `Hola EPS Supplier, acabo de enviar una solicitud de contacto.\n\n*Nombre:* ${formData.name} ${formData.lastname}\n*Email:* ${formData.email}\n*Teléfono:* ${formData.phone}\n*Requerimiento:* ${formData.message}`;
          const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(userMsg)}`;
          window.open(waUrl, '_blank');
        }, 1500);
      }
    });
  }

  // Close Success Overlay and reset form
  if (btnFeedbackClose) {
    btnFeedbackClose.addEventListener('click', () => {
      if (formFeedbackOverlay) {
        formFeedbackOverlay.classList.remove('active');
      }
      if (contactForm) {
        contactForm.reset();
      }
    });
  }

});
