/**
 * AInvirion — Progressive Enhancement
 *
 * This file enhances the static HTML experience.
 * The site is fully functional without JavaScript.
 * MithrilJS is used for the rotating text component.
 */

(function () {
  'use strict';

  // === Core Setup ===
  document.documentElement.classList.add('js-loaded');

  // === Mobile Navigation Toggle ===
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.hidden = false;

    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navMenu.classList.toggle('is-open', !isOpen);
      document.body.classList.toggle('nav-open', !isOpen);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
        document.body.classList.remove('nav-open');
        navToggle.focus();
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        navMenu.classList.contains('is-open') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
        document.body.classList.remove('nav-open');
      }
    });

    // Close on nav link click (mobile)
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (navMenu.classList.contains('is-open')) {
          navToggle.setAttribute('aria-expanded', 'false');
          navMenu.classList.remove('is-open');
          document.body.classList.remove('nav-open');
        }
      });
    });
  }

  // === Header Scroll Effect ===
  var header = document.querySelector('.site-header');
  var hero = document.querySelector('.hero');

  if (header && hero && 'IntersectionObserver' in window) {
    var headerObserver = new IntersectionObserver(
      function (entries) {
        header.classList.toggle('scrolled', !entries[0].isIntersecting);
      },
      { rootMargin: '-80px 0px 0px 0px' }
    );
    headerObserver.observe(hero);
  }

  // === Scroll Reveal ===
  if ('IntersectionObserver' in window) {
    var reveals = document.querySelectorAll('.reveal');
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // === Active Nav Highlight ===
  if ('IntersectionObserver' in window) {
    var navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    var sections = document.querySelectorAll('section[id]');

    var activeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === '#' + entry.target.id
              );
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
    );

    sections.forEach(function (section) {
      activeObserver.observe(section);
    });
  }

  // === MithrilJS Rotating Text Component ===
  if (typeof m !== 'undefined') {
    var typedMount = document.getElementById('typed-mount');

    if (typedMount) {
      var prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        // Respect user preference — no animation
        return;
      }

      var phrases = [
        'AI Agent Architecture',
        'Autonomous Systems',
        'Production-Grade Tools',
        'Research-Driven Innovation',
      ];

      // Store original text for screen readers
      var srSpan = document.createElement('span');
      srSpan.className = 'visually-hidden';
      srSpan.textContent = 'Pioneering ' + phrases.join(', ');
      typedMount.parentElement.insertBefore(srSpan, typedMount);
      typedMount.setAttribute('aria-hidden', 'true');

      var RotatingText = function () {
        var text = '';
        var phraseIdx = 0;
        var charIdx = 0;
        var deleting = false;
        var timer = null;

        function tick() {
          var phrase = phrases[phraseIdx];

          if (deleting) {
            charIdx--;
            text = phrase.substring(0, charIdx);
            if (charIdx === 0) {
              deleting = false;
              phraseIdx = (phraseIdx + 1) % phrases.length;
            }
            timer = setTimeout(function () {
              m.redraw();
              tick();
            }, 28);
          } else {
            charIdx++;
            text = phrase.substring(0, charIdx);
            if (charIdx === phrase.length) {
              deleting = true;
              timer = setTimeout(function () {
                m.redraw();
                tick();
              }, 2200);
              return;
            }
            timer = setTimeout(function () {
              m.redraw();
              tick();
            }, 70);
          }
        }

        return {
          oncreate: function () {
            text = phrases[0];
            charIdx = phrases[0].length;
            deleting = true;
            timer = setTimeout(function () {
              m.redraw();
              tick();
            }, 2500);
          },

          onremove: function () {
            if (timer) clearTimeout(timer);
          },

          view: function () {
            return m('span', [
              text,
              m('span.typed-cursor', { 'aria-hidden': 'true' }, '|'),
            ]);
          },
        };
      };

      m.mount(typedMount, { view: function () { return m(RotatingText); } });
    }
  }
})();
