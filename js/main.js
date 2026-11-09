/* ==========================================================================
   陇原星火 · 甘肃红色文化数字馆
   main.js — 全站通用交互（原生 JS，无依赖，Edge 90+ 兼容，file:// 可用）
   甘肃农业大学 第五届红色网页设计大赛 · 原创作品
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { reduceMotion = false; }

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  /* ------------------------------------------------------------------
     1. 页头滚动状态 + 阅读进度条
     ------------------------------------------------------------------ */
  (function headerAndProgress() {
    var header = $('.site-header');
    var bar = $('[data-progress]');
    var ticking = false;

    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (header) {
        if (y > 8) { header.classList.add('is-scrolled'); }
        else { header.classList.remove('is-scrolled'); }
      }
      if (bar) {
        var doc = document.documentElement;
        var max = (doc.scrollHeight - window.innerHeight);
        var pct = max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0;
        bar.style.width = pct.toFixed(2) + '%';
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  })();

  /* ------------------------------------------------------------------
     2. 移动端导航
     ------------------------------------------------------------------ */
  (function mobileNav() {
    var toggle = $('.nav-toggle');
    var nav = $('.nav');
    if (!toggle || !nav) { return; }

    function close() {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    function open() {
      document.body.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
    }

    toggle.addEventListener('click', function () {
      if (document.body.classList.contains('nav-open')) { close(); } else { open(); }
    });

    $$('.nav__link', nav).forEach(function (link) {
      link.addEventListener('click', function () { close(); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        close();
        toggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!document.body.classList.contains('nav-open')) { return; }
      if (nav.contains(e.target) || toggle.contains(e.target)) { return; }
      close();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1080) { close(); }
    });
  })();

  /* ------------------------------------------------------------------
     3. 滚动淡入（IntersectionObserver）
     ------------------------------------------------------------------ */
  (function revealOnScroll() {
    var items = $$('.reveal');
    if (!items.length) { return; }

    function showAll() {
      items.forEach(function (el) { el.classList.add('is-in'); });
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
      showAll();
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });

    /* 兜底：3 秒后若仍未显示则强制显示，避免极端环境下空白 */
    window.setTimeout(function () {
      items.forEach(function (el) {
        if (!el.classList.contains('is-in')) { el.classList.add('is-in'); }
      });
    }, 3000);
  })();

  /* ------------------------------------------------------------------
     4. 数字滚动
     ------------------------------------------------------------------ */
  (function countUp() {
    var nums = $$('[data-count]');
    if (!nums.length) { return; }

    function animate(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      if (isNaN(target)) { return; }
      if (reduceMotion) {
        el.textContent = prefix + target.toFixed(decimals) + suffix;
        return;
      }
      var start = null;
      var duration = 1400;
      function step(ts) {
        if (start === null) { start = ts; }
        var p = Math.min(1, (ts - start) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (p < 1) { window.requestAnimationFrame(step); }
        else { el.textContent = prefix + target.toFixed(decimals) + suffix; }
      }
      window.requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      nums.forEach(animate);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    nums.forEach(function (el) { io.observe(el); });
  })();

  /* ------------------------------------------------------------------
     5. 返回上一页 / 返回顶部
     ------------------------------------------------------------------ */
  (function backAndTop() {
    $$('[data-back]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var fallback = btn.getAttribute('data-back-href') || 'index.html';
        try {
          if (window.history.length > 1) { window.history.back(); }
          else { window.location.href = fallback; }
        } catch (e) {
          window.location.href = fallback;
        }
      });
    });

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'to-top';
    btn.setAttribute('aria-label', '返回页面顶部');
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(btn);

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    function toggleTop() {
      if (window.pageYOffset > 560) { btn.classList.add('is-visible'); }
      else { btn.classList.remove('is-visible'); }
    }
    window.addEventListener('scroll', toggleTop, { passive: true });
    toggleTop();
  })();

  /* ------------------------------------------------------------------
     6. 图片灯箱（[data-lightbox]）
     ------------------------------------------------------------------ */
  (function lightbox() {
    var triggers = $$('[data-lightbox]');
    if (!triggers.length) { return; }

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', '图片放大查看');
    box.innerHTML =
      '<button type="button" class="lightbox__close" aria-label="关闭">×</button>' +
      '<figure class="lightbox__figure">' +
      '<img class="lightbox__img" src="" alt="">' +
      '<figcaption class="lightbox__cap"></figcaption>' +
      '</figure>';
    document.body.appendChild(box);

    var img = $('.lightbox__img', box);
    var cap = $('.lightbox__cap', box);
    var closeBtn = $('.lightbox__close', box);
    var lastFocus = null;

    function open(src, alt, caption) {
      lastFocus = document.activeElement;
      img.setAttribute('src', src);
      img.setAttribute('alt', alt || '');
      cap.textContent = caption || alt || '';
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }
    function close() {
      box.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
    }

    triggers.forEach(function (t) {
      t.addEventListener('click', function (e) {
        e.preventDefault();
        var target = t.getAttribute('data-lightbox') || (t.getAttribute('href') || '');
        var thumb = $('img', t);
        var alt = t.getAttribute('data-alt') || (thumb ? thumb.getAttribute('alt') : '');
        var caption = t.getAttribute('data-caption') || alt;
        if (target) { open(target, alt, caption); }
      });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          t.click();
        }
      });
    });

    closeBtn.addEventListener('click', close);
    box.addEventListener('click', function (e) {
      if (e.target === box) { close(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('is-open')) { close(); }
    });
  })();

  /* ------------------------------------------------------------------
     7. 标签页（[data-tabs]）
     ------------------------------------------------------------------ */
  (function tabs() {
    $$('[data-tabs]').forEach(function (root) {
      var btns = $$('[role="tab"]', root);
      var panels = $$('[role="tabpanel"]', root);
      if (!btns.length) { return; }

      function activate(index) {
        btns.forEach(function (b, i) {
          var selected = i === index;
          b.setAttribute('aria-selected', selected ? 'true' : 'false');
          b.setAttribute('tabindex', selected ? '0' : '-1');
          if (selected) { b.focus(); }
        });
        panels.forEach(function (p, i) {
          if (i === index) { p.removeAttribute('hidden'); }
          else { p.setAttribute('hidden', 'hidden'); }
        });
      }

      btns.forEach(function (btn, i) {
        btn.setAttribute('tabindex', btn.getAttribute('aria-selected') === 'true' ? '0' : '-1');
        btn.addEventListener('click', function () { activate(i); });
        btn.addEventListener('keydown', function (e) {
          var next = null;
          if (e.key === 'ArrowRight') { next = (i + 1) % btns.length; }
          else if (e.key === 'ArrowLeft') { next = (i - 1 + btns.length) % btns.length; }
          else if (e.key === 'Home') { next = 0; }
          else if (e.key === 'End') { next = btns.length - 1; }
          if (next !== null) {
            e.preventDefault();
            activate(next);
          }
        });
      });

      /* 若面板初始都未隐藏，则同步一次 */
      panels.forEach(function (p, i) {
        if (btns[i] && btns[i].getAttribute('aria-selected') !== 'true') {
          p.setAttribute('hidden', 'hidden');
        }
      });
    });
  })();

  /* ------------------------------------------------------------------
     8. 通用折叠（details）互斥组：同一 [data-acc-group] 内只展开一个
     ------------------------------------------------------------------ */
  (function accordionGroups() {
    $$('[data-acc-group]').forEach(function (group) {
      var items = $$('details', group);
      items.forEach(function (item) {
        item.addEventListener('toggle', function () {
          if (!item.open) { return; }
          items.forEach(function (other) {
            if (other !== item) { other.open = false; }
          });
        });
      });
    });
  })();

  /* ------------------------------------------------------------------
     9. 页脚年份
     ------------------------------------------------------------------ */
  (function year() {
    $$('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  })();

  /* ------------------------------------------------------------------
     10. 外部链接可访问性提示（新窗口时补充 sr-only）
     ------------------------------------------------------------------ */
  (function externalLinks() {
    $$('a[target="_blank"]').forEach(function (a) {
      if (!a.getAttribute('rel')) { a.setAttribute('rel', 'noopener noreferrer'); }
      if (a.querySelector('.sr-only')) { return; }
      var hint = document.createElement('span');
      hint.className = 'sr-only';
      hint.textContent = '（在新窗口打开）';
      a.appendChild(hint);
    });
  })();
})();
