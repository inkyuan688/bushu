/* ==========================================================================
   陇原星火 · 传承行动页交互（chuancheng.js）
   交互：我的传承行动卡
   - 8 个勾选项 → 实时进度条 + 完成度百分比 + 状态文案
   - 全部完成时给卡片加上 is-complete 状态
   - localStorage 保存（file:// 下可能不可用，统一 try/catch 静默降级）
   - 重置按钮：清空勾选与本地记录
   原生 JS、无依赖、无 fetch、无 ES Module
   ========================================================================== */
(function () {
  'use strict';

  var card = document.querySelector('[data-cc-action]');
  if (!card) { return; }

  var checks = Array.prototype.slice.call(card.querySelectorAll('[data-cc-check]'));
  if (!checks.length) { return; }

  var total = checks.length;
  var fill = card.querySelector('[data-cc-fill]');
  var pctEl = card.querySelector('[data-cc-pct]');
  var bar = card.querySelector('[data-cc-bar]');
  var status = card.querySelector('[data-cc-status]');
  var reset = card.querySelector('[data-cc-reset]');

  var KEY = 'lyxh-chuancheng-action-v1';
  var storage = null;

  /* 探测 localStorage 是否可用：file:// 或隐私模式可能直接抛错 */
  try {
    var probe = '__lyxh_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    storage = window.localStorage;
  } catch (e) {
    storage = null;
  }

  function readState() {
    if (!storage) { return; }
    var raw = null;
    try { raw = storage.getItem(KEY); } catch (e) { return; }
    if (!raw) { return; }
    var list = null;
    try { list = JSON.parse(raw); } catch (e2) { return; }
    if (!list || !list.length) { return; }
    checks.forEach(function (box) {
      if (list.indexOf(box.value) !== -1) { box.checked = true; }
    });
  }

  function saveState() {
    if (!storage) { return; }
    var list = [];
    checks.forEach(function (box) {
      if (box.checked) { list.push(box.value); }
    });
    try {
      storage.setItem(KEY, JSON.stringify(list));
    } catch (e) { /* 存储不可用或已满：静默降级，交互仍可用 */ }
  }

  function doneCount() {
    var n = 0;
    checks.forEach(function (box) {
      if (box.checked) { n += 1; }
    });
    return n;
  }

  function render() {
    var done = doneCount();
    var percent = total > 0 ? Math.round((done / total) * 100) : 0;

    if (fill) { fill.style.width = percent + '%'; }
    if (pctEl) { pctEl.textContent = percent + '%'; }
    if (bar) { bar.setAttribute('aria-valuenow', String(percent)); }

    if (status) {
      var text = '已完成 ' + done + ' / ' + total + ' 项';
      if (total > 0 && done === total) {
        text = '已完成 ' + done + ' / ' + total + ' 项，全部完成，接下来就是兑现。';
      }
      status.textContent = text;
    }

    if (total > 0 && done === total) {
      card.classList.add('is-complete');
    } else {
      card.classList.remove('is-complete');
    }
  }

  checks.forEach(function (box) {
    box.addEventListener('change', function () {
      render();
      saveState();
    });
  });

  if (reset) {
    reset.addEventListener('click', function () {
      checks.forEach(function (box) { box.checked = false; });
      saveState();
      render();
      if (status) {
        status.textContent = '已完成 0 / ' + total + ' 项，行动卡已重置。';
      }
    });
  }

  readState();
  render();
})();
