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

  const setupHeaderScrollState = () => {
    const header = document.querySelector('.site-header');
    if (!header) {
      return;
    }

    const updateHeader = () => {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  };

  const setupMobileNav = () => {
    const toggle = document.querySelector('[data-mobile-toggle]');
    const menu = document.querySelector('[data-nav-menu]');
    if (!toggle || !menu) {
      return;
    }

    // Ensure aria-controls points to the menu
    if (!toggle.hasAttribute('aria-controls')) {
      const id = menu.id || `nav-menu-${Math.random().toString(36).slice(2,8)}`;
      menu.id = id;
      toggle.setAttribute('aria-controls', id);
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
      menu.setAttribute('aria-hidden', String(!open));
    });

    // Keyboard support: Enter and Space open/close
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
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

    // Ensure aria-controls for the mega menu
    if (!trigger.hasAttribute('aria-controls')) {
      const id = menu.id || `mega-menu-${Math.random().toString(36).slice(2,8)}`;
      menu.id = id;
      trigger.setAttribute('aria-controls', id);
    }

    const toggleMenu = () => {
      const isOpen = menu.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    };

    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleMenu();
    });

    // Keyboard support for mega menu trigger
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
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

  const setupHeroCarousel = () => {
    document.querySelectorAll('[data-hero-carousel]').forEach((carousel) => {
      const track = carousel.querySelector('.hero-carousel-track');
      const prev = carousel.querySelector('[data-hero-prev]');
      const next = carousel.querySelector('[data-hero-next]');
      const dotsContainer = carousel.querySelector('[data-hero-dots]');

      if (!track || !prev || !next) {
        return;
      }

      const slides = Array.from(track.children);
      if (slides.length < 2) {
        return;
      }

      let index = 0;
      let timerId = null;
      let touchStartX = 0;
      let isTouching = false;
      let isDragging = false;
      const dots = [];

      const setActiveDot = () => {
        if (!dots.length) {
          return;
        }

        dots.forEach((dot, dotIndex) => {
          const active = dotIndex === index;
          dot.classList.toggle('active', active);
          dot.setAttribute('aria-current', active ? 'true' : 'false');
        });
      };

      const update = () => {
        slides.forEach((slide, slideIndex) => {
          slide.classList.toggle('active', slideIndex === index);
        });
        setActiveDot();
      };

      const clearTimer = () => {
        if (timerId) {
          window.clearInterval(timerId);
          timerId = null;
        }
      };

      const startTimer = () => {
        clearTimer();
        timerId = window.setInterval(() => {
          index = (index + 1) % slides.length;
          update();
        }, 5000);
      };

      const goToPrevious = () => {
        index = (index - 1 + slides.length) % slides.length;
        update();
        startTimer();
      };

      const goToNext = () => {
        index = (index + 1) % slides.length;
        update();
        startTimer();
      };

      if (dotsContainer) {
        slides.forEach((_, dotIndex) => {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'hero-carousel-dot';
          dot.setAttribute('aria-label', `Go to hero slide ${dotIndex + 1}`);
          dot.addEventListener('click', () => {
            index = dotIndex;
            update();
            startTimer();
          });
          dotsContainer.appendChild(dot);
          dots.push(dot);
        });
      }

      prev.addEventListener('click', () => {
        goToPrevious();
      });

      next.addEventListener('click', () => {
        goToNext();
      });

      track.addEventListener('touchstart', (event) => {
        if (event.touches.length !== 1) {
          return;
        }

        isTouching = true;
        touchStartX = event.touches[0].clientX;
      }, { passive: true });

      track.addEventListener('touchend', (event) => {
        if (!isTouching) {
          return;
        }

        isTouching = false;

        const touch = event.changedTouches[0];
        if (!touch) {
          return;
        }

        const deltaX = touch.clientX - touchStartX;
        if (Math.abs(deltaX) < 50) {
          return;
        }

        if (deltaX < 0) {
          goToNext();
        } else {
          goToPrevious();
        }
      });

      track.addEventListener('mousedown', (event) => {
        isDragging = true;
        touchStartX = event.clientX;
      });

      track.addEventListener('mouseup', (event) => {
        if (!isDragging) {
          return;
        }

        const deltaX = event.clientX - touchStartX;
        if (Math.abs(deltaX) > 50) {
          if (deltaX < 0) {
            goToNext();
          } else {
            goToPrevious();
          }
        }

        isDragging = false;
      });

      track.addEventListener('mouseleave', () => {
        isDragging = false;
      });

      if (window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startTimer();
            } else {
              clearTimer();
            }
          });
        }, { threshold: 0.35 });

        observer.observe(carousel);
      } else {
        startTimer();
      }

      update();
    });
  };

  const EMAILJS_CONFIG = {
    serviceId: 'service_qt66bbp',
    companyTemplateId: 'template_96rsnfj',
    autoReplyTemplateId: 'template_wqa6k5t',
    publicKey: 'WwI5nYrI5ZDYRPm4i'
  };

  const initEmailJS = () => {
    if (typeof emailjs !== 'undefined') {
      emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    }
  };

  const sendEmail = (templateId, params) => {
    if (typeof emailjs === 'undefined') {
      return Promise.reject(new Error('EmailJS SDK not loaded.'));
    }
    // Explicitly pass the public key as the 4th argument to bypass scoping/initialization issues
    return emailjs.send(EMAILJS_CONFIG.serviceId, templateId, params, EMAILJS_CONFIG.publicKey);
  };

  const normalizeFormData = (form) => {
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value.trim();
    }

    const isQuoteForm = !!form.querySelector('[name="service"]');

    return {
      from_name: data['full-name'] || '',
      from_phone: data['phone'] || '',
      from_email: data['email'] || '',
      details: data['details'] || '',
      company: data['company'] || 'N/A',
      service: data['service'] || 'N/A',
      location: data['location'] || 'N/A',
      contact_method: data['contact-method'] || 'N/A',
      form_type: isQuoteForm ? 'Request a Quote Form' : 'General Contact Form',
      submitted_at: new Date().toLocaleString(),
      
      // Variable aliases to prevent 422 errors due to template-field configuration differences
      email: data['email'] || '',
      to_email: data['email'] || '',
      name: data['full-name'] || '',
      to_name: data['full-name'] || '',
      message: data['details'] || ''
    };
  };

  const showFormStatus = (form, type, message) => {
    let statusEl = form.querySelector('.form-status-msg');
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.className = 'form-status-msg';
      const submitBtnGroup = form.querySelector('.form-group.full:last-of-type') || form.querySelector('button[type="submit"]').parentElement;
      if (submitBtnGroup) {
        submitBtnGroup.appendChild(statusEl);
      } else {
        form.appendChild(statusEl);
      }
    }
    
    statusEl.textContent = message;
    statusEl.style.marginTop = '15px';
    statusEl.style.padding = '12px 16px';
    statusEl.style.borderRadius = '8px';
    statusEl.style.fontSize = '0.95rem';
    statusEl.style.fontWeight = '600';
    statusEl.style.textAlign = 'center';
    
    if (type === 'success') {
      statusEl.style.backgroundColor = '#d1e7dd';
      statusEl.style.color = '#0f5132';
      statusEl.style.border = '1px solid #badbcc';
    } else if (type === 'error') {
      statusEl.style.backgroundColor = '#f8d7da';
      statusEl.style.color = '#842029';
      statusEl.style.border = '1px solid #f5c2c7';
    } else if (type === 'loading') {
      statusEl.style.backgroundColor = '#cff4fc';
      statusEl.style.color = '#055160';
      statusEl.style.border = '1px solid #b6effb';
    }
  };

  const setSubmitButtonState = (form, isLoading) => {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
    } else {
      submitBtn.disabled = false;
      if (submitBtn.dataset.originalText) {
        submitBtn.textContent = submitBtn.dataset.originalText;
      }
    }
  };

  const setupForms = () => {
    initEmailJS();

    document.querySelectorAll('[data-validate-form]').forEach((form) => {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();

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
          return;
        }

        setSubmitButtonState(form, true);
        showFormStatus(form, 'loading', 'Sending your request...');

        const normalizedData = normalizeFormData(form);

        try {
          await Promise.all([
            sendEmail(EMAILJS_CONFIG.companyTemplateId, normalizedData),
            sendEmail(EMAILJS_CONFIG.autoReplyTemplateId, {
              to_name: normalizedData.from_name,
              from_name: normalizedData.from_name,
              name: normalizedData.from_name,
              to_email: normalizedData.from_email,
              from_email: normalizedData.from_email,
              email: normalizedData.from_email,
              form_type: normalizedData.form_type
            })
          ]);

          showFormStatus(form, 'success', 'Thank you! Your request has been sent successfully.');
          form.reset();
        } catch (error) {
          console.error('EmailJS submission error:', error);
          if (error && typeof error === 'object') {
            console.error('EmailJS Error Status:', error.status);
            console.error('EmailJS Error Message:', error.text);
          }
          showFormStatus(form, 'error', 'Something went wrong. Please try again later or contact us directly.');
        } finally {
          setSubmitButtonState(form, false);
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

      tick();
      syncRotationState();
    });
  };

  onReady(() => {
    showPreloader();
    setupHeaderScrollState();
    setupMobileNav();
    setupMegaMenu();
    setupReveal();
    setupCounters();
    setupFaq();
    setupPortfolioFilter();
    setupSearch();
    setupSlider();
    setupHeroCarousel();
    setupForms();
    setupRotatingText();
  });
})();
