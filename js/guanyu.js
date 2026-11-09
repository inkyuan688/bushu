/* ==========================================================================
   陇原星火 · 关于本站页交互
   guanyu.js — 目录树示例的复制/展开不需要脚本，此文件保留站点地图当前页高亮
   ========================================================================== */
(function () {
  'use strict';

  /* 站点地图中标记当前页 */
  (function markCurrent() {
    var links = document.querySelectorAll('.sitemap-list a');
    var here = window.location.pathname.split('/').pop() || 'index.html';
    Array.prototype.slice.call(links).forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) { return; }
      var file = href.split('#')[0];
      if (file === here) {
        a.setAttribute('aria-current', 'page');
        a.style.background = 'var(--paper-3)';
      }
    });
  })();
})();
