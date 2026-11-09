/* ==========================================================================
   陇原星火 · 甘肃红色文化数字馆
   xilu.js — 西路军魂 · 血战河西：交互线路条
   原生 JS，无依赖，file:// 直接可用，Edge 90+ 兼容
   ========================================================================== */
(function () {
  'use strict';

  var root = document.querySelector('[data-route]');
  if (!root) { return; }

  var stops = Array.prototype.slice.call(root.querySelectorAll('[data-stop]'));
  var detail = root.querySelector('#xr-detail');
  if (!stops.length || !detail) { return; }

  var elTag = root.querySelector('[data-xr-tag]');
  var elCount = root.querySelector('[data-xr-count]');
  var elTitle = root.querySelector('[data-xr-title]');
  var elDate = root.querySelector('[data-xr-date]');
  var elText = root.querySelector('[data-xr-text]');
  var elFacts = root.querySelector('[data-xr-facts]');
  var prevBtn = root.querySelector('[data-xr-prev]');
  var nextBtn = root.querySelector('[data-xr-next]');

  /* 与页面 HTML 首条一致的八站数据；日期与表述以权威史实文本为准 */
  var stages = [
    {
      tag: '渡河',
      title: '虎豹口：2.18 万人渡过黄河',
      date: '1936 年 10 月 24—30 日 · 白银市靖远县',
      text: '10 月 24 日夜，红四方面军主力在靖远虎豹口强渡黄河，至 10 月 30 日共 2.18 万余人渡河。黄河天险被撕开一道口子，河西走廊的大门就此打开。',
      facts: [['地点', '白银市靖远县虎豹口'], ['时间', '1936.10.24—30'], ['数字', '2.18 万余人']]
    },
    {
      tag: '血战',
      title: '古浪：血战四昼夜',
      date: '1936 年 11 月 14—18 日 · 武威市古浪县',
      text: '11 月 14 日拂晓，红 9 军进驻古浪县城，与敌军浴血奋战四昼夜，歼敌 2000 多名，11 月 18 日撤离。古浪三战，红 9 军伤亡 2400 多名，军参谋长陈伯稚等壮烈牺牲。',
      facts: [['地点', '武威市古浪县'], ['时间', '1936.11.14—18'], ['代价', '伤亡 2400 多名']]
    },
    {
      tag: '鏖战',
      title: '永昌：走廊里的鏖战',
      date: '1936 年 11—12 月 · 金昌市永昌县',
      text: '古浪之后，西路军在永昌一带与敌反复鏖战，永昌保卫战是其中重要一役。',
      facts: [['地点', '金昌市永昌县'], ['时间', '1936.11—12'], ['纪念', '红西路军永昌战役纪念馆']]
    },
    {
      tag: '牺牲',
      title: '高台：城陷之日',
      date: '1937 年 1 月 1—20 日 · 张掖市高台县',
      text: '1937 年 1 月 1 日，红 5 军攻克高台县城。1 月 12 日，国民党军集中优势兵力进攻，红军弹尽援绝，以石头、大刀、长矛拼杀。1 月 20 日高台城失陷，军长董振堂、政治部主任杨克明、第 13 师师长叶崇本、师参谋长刘培基及绝大部分指战员壮烈牺牲。',
      facts: [['地点', '张掖市高台县'], ['时间', '1937.01.01—20'], ['牺牲', '董振堂、杨克明等']]
    },
    {
      tag: '血战',
      title: '倪家营子：九天九夜',
      date: '1937 年 1—2 月 · 张掖市临泽县',
      text: '高台失守后，西路军重返倪家营子，与敌血战 9 天 9 夜。1937 年 2 月 27 日突围西进三道柳沟时，部队已不足万人。',
      facts: [['地点', '张掖市临泽县'], ['时间', '1937.01—02'], ['突围', '1937.02.27']]
    },
    {
      tag: '突围',
      title: '梨园口：兵殇山口',
      date: '1937 年 3 月 · 张掖市临泽县',
      text: '突围之后，西路军在临泽梨园口一带遭敌围攻，部队损失惨重，余部向祁连山方向转移。梨园口战役纪念馆，今天仍守着这片山口。',
      facts: [['地点', '张掖市临泽县'], ['时间', '1937.03'], ['纪念', '梨园口战役纪念馆']]
    },
    {
      tag: '分兵',
      title: '肃南石窝：最后一次会议',
      date: '1937 年 3 月 14 日黄昏 · 张掖市肃南县',
      text: '1937 年 3 月 14 日黄昏，西路军总部在肃南石窝山召开最后一次军政委员会扩大会议，决定徐向前、陈昌浩离开部队返回延安向中央汇报，由李卓然、李先念等组成工作委员会，将余部编为三个支队分散游击突围。',
      facts: [['地点', '张掖市肃南县石窝山'], ['时间', '1937.03.14 黄昏'], ['决定', '三个支队分散游击']]
    },
    {
      tag: '抵达',
      title: '星星峡：走出祁连山',
      date: '1937 年 4 月底 · 甘新交界',
      text: '石窝会议后，李先念率左支队穿行海拔四五千米的高山峡谷，经 40 多天转战，1937 年 4 月底，左支队 400 余人到达甘新交界的星星峡，为党保存了一批骨干。',
      facts: [['地点', '甘新交界星星峡'], ['时间', '1937.04 底'], ['人数', '400 余人']]
    }
  ];

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { reduceMotion = false; }

  var current = -1;
  var fadeTimer = null;

  function fillFacts(pairs) {
    if (!elFacts) { return; }
    while (elFacts.firstChild) { elFacts.removeChild(elFacts.firstChild); }
    for (var i = 0; i < pairs.length; i += 1) {
      var li = document.createElement('li');
      var span = document.createElement('span');
      var strong = document.createElement('strong');
      span.textContent = pairs[i][0];
      strong.textContent = pairs[i][1];
      li.appendChild(span);
      li.appendChild(strong);
      elFacts.appendChild(li);
    }
  }

  function fillPanel(index) {
    var item = stages[index];
    if (!item) { return; }
    if (elTag) { elTag.textContent = item.tag; }
    if (elCount) { elCount.textContent = '第 ' + (index + 1) + ' / ' + stages.length + ' 站'; }
    if (elTitle) { elTitle.textContent = item.title; }
    if (elDate) { elDate.textContent = item.date; }
    if (elText) { elText.textContent = item.text; }
    fillFacts(item.facts);
    if (prevBtn) { prevBtn.disabled = index <= 0; }
    if (nextBtn) { nextBtn.disabled = index >= stages.length - 1; }
  }

  function activate(index, moveFocus) {
    if (index < 0 || index >= stages.length || index === current) { return; }
    current = index;
    for (var i = 0; i < stops.length; i += 1) {
      var active = i === index;
      stops[i].classList.toggle('is-active', active);
      stops[i].setAttribute('aria-pressed', active ? 'true' : 'false');
    }
    if (moveFocus) { stops[index].focus(); }

    if (reduceMotion || detail === null) {
      fillPanel(index);
      return;
    }
    detail.classList.add('is-updating');
    if (fadeTimer) { window.clearTimeout(fadeTimer); }
    fadeTimer = window.setTimeout(function () {
      fillPanel(index);
      detail.classList.remove('is-updating');
    }, 130);
  }

  for (var s = 0; s < stops.length; s += 1) {
    (function (btn, index) {
      btn.addEventListener('click', function () { activate(index, false); });
      btn.addEventListener('keydown', function (e) {
        var target = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { target = index + 1; }
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { target = index - 1; }
        else if (e.key === 'Home') { target = 0; }
        else if (e.key === 'End') { target = stages.length - 1; }
        if (target === null) { return; }
        e.preventDefault();
        if (target < 0 || target >= stages.length) { return; }
        activate(target, true);
      });
    })(stops[s], s);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      activate(current - 1, false);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      activate(current + 1, false);
    });
  }

  /* 初始渲染：同步 HTML 首条内容，并校正按钮状态 */
  fillPanel(0);
  current = 0;
  if (prevBtn) { prevBtn.disabled = true; }
  if (nextBtn) { nextBtn.disabled = stages.length <= 1; }
})();
