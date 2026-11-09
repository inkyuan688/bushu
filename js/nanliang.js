/* ==========================================================================
   陇原星火 · 甘肃红色文化数字馆
   nanliang.js — 南梁烽火 · 陕甘根基：创建年表阶段筛选
   原生 JS，无依赖，file:// 可用，Edge 90+ 兼容
   ========================================================================== */
(function () {
  'use strict';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  (function timelineFilter() {
    var root = $('[data-nl-timeline]');
    if (!root) { return; }

    var chips = $$('[data-stage-filter]', root);
    var items = $$('[data-stage]', root);
    var count = $('[data-nl-count]', root);
    if (!chips.length || !items.length) { return; }

    function apply(stage) {
      var shown = 0;

      items.forEach(function (item) {
        if (stage === 'all' || item.getAttribute('data-stage') === stage) {
          item.removeAttribute('hidden');
          shown += 1;
        } else {
          item.setAttribute('hidden', 'hidden');
        }
      });

      chips.forEach(function (chip) {
        var on = chip.getAttribute('data-stage-filter') === stage;
        chip.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      if (count) { count.textContent = String(shown); }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        apply(chip.getAttribute('data-stage-filter'));
      });
    });

    /* 默认展示全部阶段 */
    apply('all');
  })();
})();
