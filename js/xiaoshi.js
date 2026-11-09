/* ==========================================================================
   陇原星火 · 校史印记页交互
   xiaoshi.js — 时间轴节点高亮 + 滚动锚点（原生 JS，无依赖）
   ========================================================================== */
(function () {
  'use strict';

  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  /* 时间轴进入视口时逐条点亮 */
  (function timelineHighlight() {
    var items = $$('.timeline__item');
    if (!items.length) { return; }

    var reduceMotion = false;
    try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { reduceMotion = false; }
    if (reduceMotion || !('IntersectionObserver' in window)) { return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    items.forEach(function (item) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(10px)';
      item.style.transition = 'opacity .6s ease, transform .6s ease';
      io.observe(item);
    });

    /* 兜底 */
    window.setTimeout(function () {
      items.forEach(function (item) {
        item.style.opacity = '1';
        item.style.transform = 'none';
      });
    }, 2500);
  })();
})();
