/* ==========================================================================
   陇原星火 · 甘肃红色文化数字馆
   changzheng.js — 长征征程 · 陇原印记：交互式路线图
   原生 JS，无依赖，file:// 可用，Edge 90+ 兼容
   ========================================================================== */
(function () {
  'use strict';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  /* ------------------------------------------------------------------
     交互式长征路线图：8 个站点 tab 切换详情面板
     - 鼠标 / 触屏点击切换
     - 方向键、Home / End 切换（roving tabindex）
     - 上一站 / 下一站按钮
     - 同步地图上 SVG 圆点的高亮
     ------------------------------------------------------------------ */
  (function routeMap() {
    var map = $('[data-route-map]');
    if (!map) { return; }

    var tabs = $$('[role="tab"]', map);
    var panels = $$('[role="tabpanel"]', map);
    var dots = $$('[data-dot]', map);
    var count = $('[data-route-count]', map);
    var prevBtn = $('[data-route-prev]', map);
    var nextBtn = $('[data-route-next]', map);
    if (!tabs.length || !panels.length) { return; }

    var current = 0;

    function pad(n) {
      return n < 10 ? '0' + n : String(n);
    }

    function activate(index, focusTab) {
      current = (index + tabs.length) % tabs.length;

      tabs.forEach(function (tab, i) {
        var selected = i === current;
        tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        tab.setAttribute('tabindex', selected ? '0' : '-1');
        tab.classList.toggle('is-active', selected);
      });

      panels.forEach(function (panel, i) {
        panel.classList.toggle('is-active', i === current);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });

      if (count) { count.textContent = pad(current + 1); }
      if (focusTab) { tabs[current].focus(); }
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { activate(i, false); });
      tab.addEventListener('keydown', function (e) {
        var target = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { target = i + 1; }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { target = i - 1; }
        else if (e.key === 'Home') { target = 0; }
        else if (e.key === 'End') { target = tabs.length - 1; }
        if (target !== null) {
          e.preventDefault();
          activate(target, true);
        }
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', function () { activate(current - 1, false); });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () { activate(current + 1, false); });
    }

    /* 初始选中：读取 HTML 中 aria-selected="true" 的站点 */
    var initial = 0;
    tabs.forEach(function (tab, i) {
      if (tab.getAttribute('aria-selected') === 'true') { initial = i; }
    });
    activate(initial, false);
  })();
})();
