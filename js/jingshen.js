/* ==========================================================================
   陇原星火 · 精神谱系页交互（jingshen.js）
   1) 精神长河节点 → 切换到对应 Tab 面板并滚动到解读区（复用 main.js 的 data-tabs）
   2) Tab 切换后同步长河节点的 aria-current
   3) 支持 #sp-panel-xxx 深链接（file:// 同样可用）
   原生 JS、无依赖、无 fetch、无 ES Module
   ========================================================================== */
(function () {
  'use strict';

  var root = document.querySelector('[data-tabs]');
  if (!root) { return; }

  var river = document.querySelector('[data-sp-river]');
  var btns = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  if (!btns.length || !panels.length) { return; }

  var links = river ? Array.prototype.slice.call(river.querySelectorAll('[data-sp-goto]')) : [];

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { reduceMotion = false; }

  function panelIndex(id) {
    var i;
    for (i = 0; i < panels.length; i += 1) {
      if (panels[i].id === id) { return i; }
    }
    return -1;
  }

  function currentIndex() {
    var i;
    for (i = 0; i < btns.length; i += 1) {
      if (btns[i].getAttribute('aria-selected') === 'true') { return i; }
    }
    return 0;
  }

  function syncRiver(index) {
    var activeId = panels[index] ? panels[index].id : '';
    links.forEach(function (link) {
      if (link.getAttribute('data-sp-goto') === activeId) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function scrollToStage() {
    var top;
    try {
      top = root.getBoundingClientRect().top +
        (window.pageYOffset || document.documentElement.scrollTop) - 88;
    } catch (e) { return; }
    if (reduceMotion) {
      window.scrollTo(0, top);
      return;
    }
    try {
      window.scrollTo({ top: top, behavior: 'smooth' });
    } catch (e2) {
      window.scrollTo(0, top);
    }
  }

  function activate(index, doScroll) {
    if (index < 0 || index >= btns.length) { return; }
    btns[index].click();
    syncRiver(index);
    if (doScroll) { window.setTimeout(scrollToStage, 30); }
  }

  /* 长河节点：点一下切换面板并定位到解读区 */
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('data-sp-goto');
      var index = panelIndex(id);
      if (index < 0) { return; }
      e.preventDefault();
      activate(index, true);
      try { window.history.replaceState(null, '', '#' + id); } catch (err) { /* file:// 下可能被拒绝，忽略 */ }
    });
  });

  /* 用户直接点 Tab / 用方向键切换时，反向同步长河 */
  btns.forEach(function (btn, i) {
    btn.addEventListener('click', function () { syncRiver(i); });
    btn.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') { return; }
      window.setTimeout(function () { syncRiver(currentIndex()); }, 0);
    });
  });

  syncRiver(currentIndex());

  /* 深链接：#sp-panel-xxx 打开页面即定位到对应面板 */
  (function fromHash() {
    var hash = '';
    try { hash = String(window.location.hash || '').replace('#', ''); } catch (e) { return; }
    if (!hash) { return; }
    var index = panelIndex(hash);
    if (index < 0) { return; }
    window.setTimeout(function () { activate(index, true); }, 80);
  })();
})();
