(() => {
  const onReady = (fn) => {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  };

  const showPreloader = () => {
    const preloader = document.querySelector('.preloader');
    if (!preloader) {
      return;
    }
    window.addEventListener('load', () => {
      preloader.classList.add('hide');
    });
  };

  const setupMobileNav = () => {
    const toggle = document.querySelector('[data-mobile-toggle]');
    const menu = document.querySelector('[data-nav-menu]');
    if (!toggle || !menu) {
      return;
    }

    const cta = document.querySelector('.nav-cta');
    const ctaDesktopParent = cta ? cta.parentElement : null;
    const ctaDesktopNext = cta ? cta.nextElementSibling : null;

    const syncCtaPosition = () => {
      if (!cta || !ctaDesktopParent) {
        return;
      }

      const isMobile = window.matchMedia('(max-width: 990px)').matches;
      const isInsideMenu = cta.parentElement === menu;

      if (isMobile && !isInsideMenu) {
        menu.appendChild(cta);
      }

      if (!isMobile && isInsideMenu) {
        if (ctaDesktopNext && ctaDesktopNext.parentElement === ctaDesktopParent) {
          ctaDesktopParent.insertBefore(cta, ctaDesktopNext);
        } else {
          ctaDesktopParent.appendChild(cta);
        }
      }
    };

    syncCtaPosition();
    window.addEventListener('resize', syncCtaPosition);

    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    menu.addEventListener('click', (event) => {
      if (!event.target.closest('a')) {
        return;
      }

      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  };

  const setupMegaMenu = () => {
    const trigger = document.querySelector('[data-mega-trigger]');
    const menu = document.querySelector('[data-mega-menu]');
    if (!trigger || !menu) {
      return;
    }

    const toggleMenu = () => {
      const isOpen = menu.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    };

    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleMenu();
    });

    document.addEventListener('click', (event) => {
      if (!menu.contains(event.target) && event.target !== trigger) {
        menu.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  };

  const setupReveal = () => {
    const revealItems = document.querySelectorAll('.reveal');
    if (!revealItems.length) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealItems.forEach((item) => observer.observe(item));
  };

  const setupCounters = () => {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) {
      return;
    }

    const animateCounter = (el) => {
      const target = Number(el.dataset.count || '0');
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 65));

      const tick = () => {
        current += step;
        if (current >= target) {
          current = target;
          el.textContent = `${target}+`;
          return;
        }
        el.textContent = `${current}+`;
        requestAnimationFrame(tick);
      };
      tick();
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach((counter) => observer.observe(counter));
  };

  const setupFaq = () => {
    document.querySelectorAll('.faq-question').forEach((button) => {
      button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        if (item) {
          item.classList.toggle('open');
        }
      });
    });
  };

  const setupPortfolioFilter = () => {
    const container = document.querySelector('[data-portfolio]');
    if (!container) {
      return;
    }

    const buttons = document.querySelectorAll('[data-filter]');
    const cards = container.querySelectorAll('[data-category]');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        buttons.forEach((item) => item.classList.remove('active'));
        btn.classList.add('active');

        cards.forEach((card) => {
          const category = card.dataset.category;
          const show = filter === 'all' || category === filter;
          card.classList.toggle('hide', !show);
        });
      });
    });
  };

  const setupSearch = () => {
    const input = document.querySelector('[data-service-search]');
    const targets = document.querySelectorAll('[data-search-target]');
    if (!input || !targets.length) {
      return;
    }

    input.addEventListener('input', (event) => {
      const query = event.target.value.trim().toLowerCase();
      targets.forEach((item) => {
        const source = item.dataset.searchTarget.toLowerCase();
        item.classList.toggle('hide', !source.includes(query));
      });
    });
  };

  const setupSlider = () => {
    document.querySelectorAll('[data-slider]').forEach((slider) => {
      const track = slider.querySelector('.testimonial-slides');
      const prev = slider.querySelector('[data-prev]');
      const next = slider.querySelector('[data-next]');
      if (!track || !prev || !next) {
        return;
      }

      const slides = Array.from(track.children);
      let index = 0;

      const update = () => {
        track.style.transform = `translateX(-${index * 100}%)`;
      };

      prev.addEventListener('click', () => {
        index = (index - 1 + slides.length) % slides.length;
        update();
      });

      next.addEventListener('click', () => {
        index = (index + 1) % slides.length;
        update();
      });

      setInterval(() => {
        index = (index + 1) % slides.length;
        update();
      }, 6500);
    });
  };

  const setupForms = () => {
    document.querySelectorAll('[data-validate-form]').forEach((form) => {
      form.addEventListener('submit', (event) => {
        let valid = true;
        form.querySelectorAll('[data-required]').forEach((field) => {
          const message = field.closest('.form-group')?.querySelector('.error-msg');
          if (!field.value.trim()) {
            valid = false;
            field.setAttribute('aria-invalid', 'true');
            if (message) {
              message.textContent = 'This field is required.';
            }
          } else {
            field.removeAttribute('aria-invalid');
            if (message) {
              message.textContent = '';
            }
          }
        });

        if (!valid) {
          event.preventDefault();
        }
      });
    });
  };

  const setupRotatingText = () => {
    document.querySelectorAll('[data-rotating-text]').forEach((target) => {
      const words = (target.dataset.words || '')
        .split('|')
        .map((word) => word.trim())
        .filter(Boolean);

      if (!words.length) {
        return;
      }

      let wordIndex = 0;
      let letterIndex = 0;
      let deleting = false;
      let timerId = null;
      let isPaused = false;
      let isHeroVisible = true;
      const smallScreenQuery = window.matchMedia('(max-width: 768px)');

      const clearTick = () => {
        if (timerId) {
          window.clearTimeout(timerId);
          timerId = null;
        }
      };

      const queueTick = (delay) => {
        clearTick();
        timerId = window.setTimeout(tick, delay);
      };

      const pauseRotation = () => {
        isPaused = true;
        clearTick();
      };

      const resumeRotation = () => {
        if (!isPaused) {
          return;
        }

        isPaused = false;
        queueTick(deleting ? 45 : 78);
      };

      const syncRotationState = () => {
        if (!smallScreenQuery.matches) {
          resumeRotation();
          return;
        }

        if (isHeroVisible || document.activeElement === target) {
          resumeRotation();
        } else {
          pauseRotation();
        }
      };

      const tick = () => {
        if (isPaused) {
          return;
        }

        const activeWord = words[wordIndex];
        letterIndex += deleting ? -1 : 1;
        target.textContent = activeWord.slice(0, letterIndex);

        if (!deleting && letterIndex === activeWord.length) {
          deleting = true;
          queueTick(1200);
          return;
        }

        if (deleting && letterIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }

        queueTick(deleting ? 45 : 78);
      };

      if (smallScreenQuery.matches && !target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '0');
      }

      const heroSection = target.closest('.hero');
      if (heroSection && window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            isHeroVisible = entry.isIntersecting;
            syncRotationState();
          });
        }, { threshold: 0.15 });

        observer.observe(heroSection);
      }

      target.addEventListener('focus', () => {
        isHeroVisible = true;
        resumeRotation();
      });

      smallScreenQuery.addEventListener('change', syncRotationState);

      tick();
      syncRotationState();
    });
  };

  onReady(() => {
    showPreloader();
    setupMobileNav();
    setupMegaMenu();
    setupReveal();
    setupCounters();
    setupFaq();
    setupPortfolioFilter();
    setupSearch();
    setupSlider();
    setupForms();
    setupRotatingText();
  });
})();
