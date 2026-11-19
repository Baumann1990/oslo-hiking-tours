/* ── Homepage sticky book CTA ────────────────────────────────── */
(function initHomeStickyBook() {
  const cta  = document.getElementById('homeStickyBook');
  const hero = document.querySelector('.hero');
  if (!cta || !hero) return;

  function update() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const book       = document.getElementById('book');
    const bookRect   = book ? book.getBoundingClientRect() : null;
    const bookOnScreen = bookRect && bookRect.top < window.innerHeight && bookRect.bottom > 0;
    // Show once the hero has scrolled off screen, but not while the form itself is visible
    const visible    = heroBottom <= 0 && !bookOnScreen;
    // Show once the hero has fully scrolled off screen
    cta.style.display = visible ? '' : 'none';
    document.body.classList.toggle('home-sticky-active', visible);
  }

  // Run on scroll and on load; passive for performance
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── Cookie consent ──────────────────────────────────────────── */
(function initCookieConsent() {
  const KEY    = 'cookieConsent';
  const stored = localStorage.getItem(KEY);

  // Apply stored decision to GA consent mode immediately
  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      analytics_storage: stored === 'accepted' ? 'granted' : 'denied'
    });
  }

  // Already decided — no banner needed
  if (stored) return;

  // Build and inject banner
  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.innerHTML =
    '<p class="cookie__text">We use cookies to understand how visitors find and use our tours (Google Analytics). No data is shared for advertising.</p>' +
    '<div class="cookie__actions">' +
      '<button class="cookie__btn cookie__btn--decline" id="cookieDecline">Decline</button>' +
      '<button class="cookie__btn cookie__btn--accept"  id="cookieAccept">Accept</button>' +
    '</div>';
  document.body.appendChild(banner);

  const dismiss = choice => {
    localStorage.setItem(KEY, choice);
    if (choice === 'accepted' && typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    banner.classList.add('cookie--hidden');
    setTimeout(() => banner.remove(), 300);
  };

  document.getElementById('cookieAccept').addEventListener('click', () => dismiss('accepted'));
  document.getElementById('cookieDecline').addEventListener('click', () => dismiss('declined'));
})();

/* ── Gallery rotation ────────────────────────────────────────── */
const GALLERY_POOL = [
  { src: 'images/winter-forest-hike-card-800.webp',    alt: 'Sunlit snow and spruce forest in winter' },
  { src: 'images/winter-forest-hike-1-800.webp',       alt: 'Hikers on snowshoes on a snowy forest trail' },
  { src: 'images/winter-forest-hike-2-800.webp',       alt: 'Winter view over Oslo and the Oslofjord from Holmenkollen' },
  { src: 'images/winter-forest-hike-3-800.webp',       alt: 'Frozen lake surrounded by snowy forest' },
  { src: 'images/campfire-evening-walk-card-800.webp', alt: 'Campfire in the snow at dusk' },
  { src: 'images/campfire-evening-walk-1-800.webp',    alt: 'Headlamp on a snowy forest trail at night' },
  { src: 'images/campfire-evening-walk-2-800.webp',    alt: 'Campfire burning in the snow' },
  { src: 'images/campfire-evening-walk-3-800.webp',    alt: 'Oslo city lights at night' },
  { src: 'images/winter-gallery-1-800.webp',           alt: 'Snow on spruce branches in low winter sun' },
  { src: 'images/winter-gallery-2-800.webp',           alt: 'Snowy forest path in winter' },
  { src: 'images/winter-gallery-3-800.webp',           alt: 'Winter sunset over the Oslofjord' },
];

const GALLERY_COUNT = 8;

(function buildGallery() {
  const track = document.getElementById('galleryTrack');
  if (!track) return;

  const pool = [...GALLERY_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  pool.slice(0, GALLERY_COUNT).forEach(({ src, alt }) => {
    const img = document.createElement('img');
    img.src     = src;
    img.alt     = alt;
    img.loading = 'lazy';
    track.appendChild(img);
  });
})();

/* ── Nav: scroll state ───────────────────────────────────────── */
const nav = document.getElementById('nav');

const updateNav = () => {
  // Pages without a photo hero (e.g. thank-you) keep the solid nav at all times
  nav.classList.toggle('scrolled', nav.classList.contains('nav--solid') || window.scrollY > 40);
};

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── Nav: mobile toggle ──────────────────────────────────────── */
const toggle = document.getElementById('navToggle');
const menu   = document.getElementById('navMenu');

toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});

menu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  });
});

/* ── Tour filters ────────────────────────────────────────────── */
const filters   = document.querySelectorAll('.filter');
const tourCards = document.querySelectorAll('.tour-card');

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const f = btn.dataset.filter;

    tourCards.forEach(card => {
      if (f === 'all') {
        card.classList.remove('hidden');
        return;
      }
      const match = card.dataset.surface === f || card.dataset.level === f;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ── Footer filter links ─────────────────────────────────────── */
document.querySelectorAll('a[data-filter]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetFilter = link.dataset.filter;

    document.getElementById('tours').scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      const btn = document.querySelector(`.filter[data-filter="${targetFilter}"]`);
      if (btn) btn.click();
    }, 500);
  });
});

/* ── Scroll fade-in ──────────────────────────────────────────── */
const fadeEls = document.querySelectorAll(
  '.tour-card, .guide-card, .about__grid, .book__grid, .section-header'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);

fadeEls.forEach(el => observer.observe(el));

/* ── Modals ──────────────────────────────────────────────────── */
const openModal = id => {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal__close').focus();
};

const closeModal = modal => {
  modal.hidden = true;
  document.body.style.overflow = '';
};

document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.modal));
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.querySelector('.modal__close').addEventListener('click', () => closeModal(modal));
  modal.querySelector('.modal__backdrop').addEventListener('click', () => closeModal(modal));
  modal.querySelectorAll('.modal__book').forEach(a => {
    a.addEventListener('click', () => closeModal(modal));
  });
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.modal:not([hidden])').forEach(closeModal);
});

/* ── Booking form ────────────────────────────────────────────── */
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

const dateInput = document.getElementById('date');
if (dateInput) {
  dateInput.min = new Date().toISOString().split('T')[0];
}

const form         = document.getElementById('bookForm');
const confirmPanel = document.getElementById('formConfirm');

if (form) {
  const setFieldError = (id, message) => {
    const field = id === 'tour' ? document.getElementById('tourOptions') : document.getElementById(id);
    const span  = document.getElementById('error-' + id);
    if (field) field.classList.add('input--error');
    if (span)  span.textContent = message;
  };

  const clearFieldError = (id) => {
    const field = id === 'tour' ? document.getElementById('tourOptions') : document.getElementById(id);
    const span  = document.getElementById('error-' + id);
    if (field) field.classList.remove('input--error');
    if (span)  span.textContent = '';
  };

  const validateForm = () => {
    let valid = true;
    ['name', 'email', 'tour', 'date'].forEach(id => clearFieldError(id));

    const name = form.querySelector('#name');
    if (!name.value.trim()) {
      setFieldError('name', 'Please enter your name.');
      valid = false;
    }

    const email = form.querySelector('#email');
    if (!email.value.trim()) {
      setFieldError('email', 'Please enter your email address.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      setFieldError('email', 'Please enter a valid email address (e.g. you@example.com).');
      valid = false;
    }

    const tourChecked = form.querySelector('input[name="tour"]:checked');
    if (!tourChecked) {
      setFieldError('tour', 'Please select a tour.');
      valid = false;
    }

    const date = form.querySelector('#date');
    if (!date.value) {
      setFieldError('date', 'Please pick a preferred date.');
      valid = false;
    }

    return valid;
  };

  ['name', 'email', 'date'].forEach(id => {
    const field = document.getElementById(id);
    if (field) field.addEventListener('input', () => clearFieldError(id));
  });

  form.querySelectorAll('input[name="tour"]').forEach(radio => {
    radio.addEventListener('change', () => clearFieldError('tour'));
  });

  // "Ask us" links preselect the custom-request option in the booking form
  document.querySelectorAll('[data-select-tour="custom"]').forEach(link => {
    link.addEventListener('click', () => {
      const custom = form.querySelector('input[name="tour"][value^="Something else"]');
      if (custom) { custom.checked = true; clearFieldError('tour'); }
      const msg = document.getElementById('message');
      if (msg) msg.placeholder = 'What would you like to do? Time of day, group size, occasion…';
    });
  });

  // Guests stepper (+/- around a hidden input, min 1, max 12)
  const guestsStepper = document.getElementById('guestsStepper');
  if (guestsStepper) {
    const valueEl  = document.getElementById('guestsValue');
    const hidden   = document.getElementById('hikers');
    const GUEST_MIN = 1, GUEST_MAX = 12;
    guestsStepper.querySelectorAll('.stepper__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.dataset.step, 10);
        let next = parseInt(hidden.value, 10) + step;
        next = Math.max(GUEST_MIN, Math.min(GUEST_MAX, next));
        hidden.value = next;
        valueEl.textContent = next;
      });
    });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!validateForm()) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled    = true;

    try {
      const res  = await fetch(WEB3FORMS_ENDPOINT, {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    new FormData(form),
      });
      const data = await res.json();

      if (data.success) {
        window.location.href = '/thank-you';
      } else {
        btn.textContent = 'Something went wrong — try again';
        btn.disabled    = false;
      }
    } catch {
      btn.textContent = 'Network error — try again';
      btn.disabled    = false;
    }
  });
}
