/**
 * GS Technology India Pvt Ltd - Main JavaScript
 * Interactive components: Mobile Drawer, Product Filter, Lightbox, WhatsApp Quotes, Forms
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initProductFilter();
  initLightbox();
  initWhatsAppQuote();
  initContactForm();
  initMetricsCounter();
});

/* Mobile Menu & Drawer */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('drawerClose');
  const overlay = document.getElementById('drawerOverlay');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Close when clicking any nav link in drawer
  const drawerLinks = drawer.querySelectorAll('a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* Product Category Filter */
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (!filterBtns.length || !productCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* Lightbox Modal for Spare Part Images */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const zoomTriggers = document.querySelectorAll('.zoomable-img, .product-img-wrapper');

  if (!modal || !modalImg) return;

  zoomTriggers.forEach(wrapper => {
    wrapper.addEventListener('click', () => {
      const img = wrapper.querySelector('img') || wrapper;
      const src = img.getAttribute('src');
      const title = img.getAttribute('alt') || wrapper.closest('.product-card')?.querySelector('.product-title')?.textContent || 'Spare Part Preview';

      modalImg.src = src;
      if (modalCaption) modalCaption.textContent = title;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* Direct WhatsApp Quote Inquiries */
function initWhatsAppQuote() {
  const phoneNumber = '919994211913'; // Official GS Technology WhatsApp

  // Handle WhatsApp buttons on product cards
  const quoteBtns = document.querySelectorAll('.btn-inquire-wa');
  quoteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productTitle = btn.getAttribute('data-product') || 'RO Spare Parts';
      const message = encodeURIComponent(`Hello GS Technology, I am interested in getting a price quote and technical details for: "${productTitle}". Please share availability and specifications.`);
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    });
  });
}

/* Contact Form Validation and Submission */
function initContactForm() {
  const form = document.getElementById('inquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const phone = form.querySelector('[name="phone"]')?.value.trim() || 'Not specified';
    const product = form.querySelector('[name="product"]')?.value || 'General Inquiry';
    const message = form.querySelector('[name="message"]')?.value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all required fields.');
      return;
    }

    // Submit via mailto fallback and optional WhatsApp notification
    const encodedSubject = encodeURIComponent(`Inquiry: ${product} - From ${name}`);
    const encodedBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nProduct Interest: ${product}\n\nMessage:\n${message}`);

    const mailtoUrl = `mailto:gstech81@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

    // Prompt user with instant options
    const confirmWhatsApp = confirm(`Thank you, ${name}!\n\nYour message is ready. Would you also like to send this inquiry directly to GS Technology on WhatsApp (+91 9994211913) for instant response?`);
    
    if (confirmWhatsApp) {
      const waMsg = encodeURIComponent(`Hi GS Technology,\n*New Inquiry from Website*\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Product:* ${product}\n*Message:* ${message}`);
      window.open(`https://wa.me/919994211913?text=${waMsg}`, '_blank');
    }

    window.location.href = mailtoUrl;
    form.reset();
  });
}

/* Numeric Counter for Stats */
function initMetricsCounter() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1500;
          const start = 0;
          const stepTime = Math.abs(Math.floor(duration / (target || 1)));
          let current = 0;

          const timer = setInterval(() => {
            current += Math.ceil(target / 40);
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = current;
            }
          }, 30);
        });
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.querySelector('.hero-highlights, .stats-section');
  if (statsSection) observer.observe(statsSection);
}
