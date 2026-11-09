/* ==========================================================================
   陇原星火 · 甘肃红色文化数字馆
   dizhi.js — 红色地标 · 陇原图谱：地图联动 + 类型/市州/关键词筛选
   原生 JS，无依赖，file:// 直接可用，Edge 90+ 兼容
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { reduceMotion = false; }

  function toArray(list) { return Array.prototype.slice.call(list); }

  /* ==================================================================
     一、可点地图 ↔ 详情面板
     ================================================================== */
  (function mapInteraction() {
    var map = document.querySelector('.dz-map');
    if (!map) { return; }

    var nodes = toArray(map.querySelectorAll('.dz-node'));
    var detail = document.getElementById('dz-detail');
    if (!nodes.length || !detail) { return; }

    var elType = detail.querySelector('[data-dz-type]');
    var elIndex = detail.querySelector('[data-dz-index]');
    var elTitle = detail.querySelector('[data-dz-title]');
    var elMeta = detail.querySelector('[data-dz-meta]');
    var elText = detail.querySelector('[data-dz-text]');
    var elTheme = detail.querySelector('[data-dz-theme]');
    var elLink = detail.querySelector('[data-dz-link]');

    /* 十四个节点：与页面地标卡内容一致 */
    var sites = {
      huining: {
        type: '长征', meta: '白银市会宁县 · 长征', title: '红军会宁会师旧址', theme: '三军会师', card: 'dl-huining',
        text: '1936 年 10 月 9 日，红四方面军指挥部到达会宁，同红一方面军会合。会师楼、会师纪念塔与红军长征胜利纪念馆，都在这座小城里。'
      },
      naliang: {
        type: '根据地', meta: '庆阳市华池县 · 根据地', title: '陕甘边革命根据地南梁革命纪念馆', theme: '陕甘边根据地', card: 'dl-naliang',
        text: '1934 年 11 月，陕甘边区苏维埃政府在南梁荔园堡成立，习仲勋任苏维埃政府主席、刘志丹任军事委员会主席。南梁是陕甘边革命根据地的中心。'
      },
      jieshipu: {
        type: '长征', meta: '平凉市静宁县 · 长征', title: '中国工农红军长征界石铺纪念园', theme: '界石铺宿营', card: 'dl-jieshipu',
        text: '1935 年 10 月 3 日，毛泽东等率中央红军到达静宁界石铺并宿营三天。纪念园由“红军长征纪念馆”更名扩建而来。'
      },
      hadapu: {
        type: '长征', meta: '陇南市宕昌县 · 长征', title: '哈达铺红军长征纪念馆', theme: '长征“加油站”', card: 'dl-hadapu',
        text: '1935 年 9 月，红军在哈达铺获得粮食、给养，并从当地报纸上得知陕北有红军和根据地，这里因此被称为长征路上的“加油站”。'
      },
      liangdang: {
        type: '兵变与起义', meta: '陇南市两当县 · 兵变与起义', title: '两当兵变纪念馆', theme: '两当兵变', card: 'dl-liangdang',
        text: '1932 年 4 月 2 日凌晨，习仲勋等领导发动两当兵变，起义部队改编为中国工农红军陕甘游击队第五支队。'
      },
      lazikou: {
        type: '长征', meta: '甘南州迭部县 · 长征', title: '腊子口战役纪念碑', theme: '天险腊子口', card: 'dl-lazikou',
        text: '1935 年 9 月 16—17 日，红军攻克天险腊子口，打开北上通道。腊子口战役纪念碑就立在这处隘口，守着长征最后的险关。'
      },
      zhuoni: {
        type: '人物故居', meta: '甘南州卓尼县 · 人物故居', title: '杨积庆烈士纪念馆', theme: '让道供粮', card: 'dl-zhuoni',
        text: '卓尼土司杨积庆在红军过境甘南时让道、开仓接济三十万斤粮食。1937 年他遇害，1994 年被追认为革命烈士。'
      },
      bangluo: {
        type: '长征', meta: '定西市通渭县 · 长征', title: '榜罗镇会议纪念馆', theme: '落脚陕北', card: 'dl-bangluo',
        text: '1935 年 9 月 27 日，中共中央政治局常委会议在通渭榜罗镇召开，正式确定把中央和陕甘支队的落脚点放在陕北。'
      },
      lanzhou: {
        type: '纪念设施', meta: '兰州市 · 纪念设施', title: '八路军兰州办事处纪念馆', theme: '抗战后方', card: 'dl-lanzhou',
        text: '1937 年，红军在兰州设立联络处，后改称八路军驻甘肃办事处。谢觉哉任中共中央代表，彭加伦、伍修权先后任处长。'
      },
      gaotai: {
        type: '西路军', meta: '张掖市高台县 · 西路军', title: '中国工农红军西路军纪念馆', theme: '高台战役', card: 'dl-gaotai',
        text: '1937 年 1 月 20 日，高台城失陷，董振堂、杨克明等壮烈牺牲。中国工农红军西路军纪念馆由原高台烈士陵园更名扩建而来。'
      },
      linze: {
        type: '西路军', meta: '张掖市临泽县 · 西路军', title: '梨园口战役纪念馆', theme: '梨园口战斗', card: 'dl-linze',
        text: '1937 年 3 月，西路军在临泽梨园口遭敌围攻。梨园口战役纪念馆之外，倪家营汪家墩等战斗遗址也散落在临泽境内。'
      },
      sunan: {
        type: '西路军', meta: '张掖市肃南县 · 西路军', title: '石窝会议纪念馆', theme: '肃南石窝会议', card: 'dl-sunan',
        text: '1937 年 3 月 14 日黄昏，西路军总部在肃南石窝山召开最后一次军政委员会扩大会议，决定将余部编为三个支队分散游击。'
      },
      yongchang: {
        type: '西路军', meta: '金昌市永昌县 · 西路军', title: '红西路军永昌战役纪念馆', theme: '永昌战役', card: 'dl-yongchang',
        text: '永昌保卫战是西路军在河西走廊内的重要一役。红西路军永昌战役纪念馆由永昌革命烈士陵园发展而来，记录那段寒冬里的坚守。'
      },
      gulang: {
        type: '西路军', meta: '武威市古浪县 · 西路军', title: '红军西路军古浪战役纪念馆', theme: '古浪战役', card: 'dl-gulang',
        text: '1936 年 11 月，红 9 军在古浪与敌血战四昼夜，歼敌 2000 多名，自身伤亡 2400 多名。纪念馆用三个展厅讲述这段战史。'
      }
    };

    var currentNode = null;
    var fadeTimer = null;

    function nodeKey(node) { return node.getAttribute('data-node'); }

    function fillPanel(key, index) {
      var site = sites[key];
      if (!site) { return; }
      if (elType) { elType.textContent = site.type; }
      if (elIndex) { elIndex.textContent = '第 ' + (index + 1) + ' / ' + nodes.length + ' 处'; }
      if (elTitle) { elTitle.textContent = site.title; }
      if (elMeta) { elMeta.textContent = site.meta; }
      if (elText) { elText.textContent = site.text; }
      if (elTheme) { elTheme.textContent = site.theme; }
      if (elLink) { elLink.setAttribute('href', '#' + site.card); }
    }

    function setActive(key, moveFocus, skipFade) {
      var targetNode = null;
      var targetIndex = -1;
      for (var i = 0; i < nodes.length; i += 1) {
        var active = nodeKey(nodes[i]) === key;
        nodes[i].classList.toggle('is-active', active);
        nodes[i].setAttribute('aria-pressed', active ? 'true' : 'false');
        if (active) {
          targetNode = nodes[i];
          targetIndex = i;
        }
      }
      if (!targetNode) { return; }

      currentNode = targetNode;
      if (moveFocus && targetNode.focus) {
        try { targetNode.focus({ preventScroll: true }); } catch (e2) { targetNode.focus(); }
      }

      if (reduceMotion || skipFade) {
        fillPanel(key, targetIndex);
        return;
      }
      detail.classList.add('is-updating');
      if (fadeTimer) { window.clearTimeout(fadeTimer); }
      fadeTimer = window.setTimeout(function () {
        fillPanel(key, targetIndex);
        detail.classList.remove('is-updating');
      }, 130);
    }

    function keyOfEvent(node) { return node ? nodeKey(node) : ''; }

    for (var n = 0; n < nodes.length; n += 1) {
      (function (node) {
        var key = nodeKey(node);

        node.addEventListener('click', function () { setActive(key, false, false); });

        node.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            setActive(key, false, false);
            return;
          }
          var next = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { next = 1; }
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { next = -1; }
          else if (e.key === 'Home') { next = 'first'; }
          else if (e.key === 'End') { next = 'last'; }
          if (next === null) { return; }
          e.preventDefault();
          var currentIndex = 0;
          for (var k = 0; k < nodes.length; k += 1) {
            if (nodes[k] === node) { currentIndex = k; break; }
          }
          var targetIndex = currentIndex;
          if (next === 'first') { targetIndex = 0; }
          else if (next === 'last') { targetIndex = nodes.length - 1; }
          else { targetIndex = currentIndex + next; }
          if (targetIndex < 0 || targetIndex >= nodes.length) { return; }
          setActive(nodeKey(nodes[targetIndex]), true, false);
        });
      })(nodes[n]);
    }

    /* 地标卡 → 地图定位 */
    toArray(document.querySelectorAll('[data-locate]')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-locate');
        if (!sites[key]) { return; }
        setActive(key, false, false);
        var board = document.querySelector('.dz-map-board');
        if (board && board.scrollIntoView) {
          board.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        }
        var focusNode = map.querySelector('.dz-node[data-node="' + key + '"]');
        if (focusNode && focusNode.focus) {
          window.setTimeout(function () {
            try { focusNode.focus({ preventScroll: true }); } catch (e3) { focusNode.focus(); }
          }, reduceMotion ? 0 : 320);
        }
      });
    });

    /* 详情面板 → 地标卡：若目标卡被筛掉，先重置筛选，再高亮 */
    if (elLink) {
      elLink.addEventListener('click', function () {
        var href = elLink.getAttribute('href') || '';
        var id = href.charAt(0) === '#' ? href.slice(1) : '';
        var card = id ? document.getElementById(id) : null;
        if (!card) { return; }
        if (card.hidden) {
          var resetBtn = document.querySelector('[data-reset]');
          if (resetBtn) { resetBtn.click(); }
        }
        if (!reduceMotion) {
          card.classList.add('is-highlight');
          window.setTimeout(function () { card.classList.remove('is-highlight'); }, 1800);
        }
      });
    }

    /* 小屏时把地图滚动到中部，避免默认只看到最西端 */
    function centerMapScroll() {
      var scroll = document.querySelector('.dz-map-scroll');
      if (!scroll) { return; }
      if (scroll.scrollWidth > scroll.clientWidth + 2) {
        scroll.scrollLeft = Math.round((scroll.scrollWidth - scroll.clientWidth) / 2);
      }
    }
    centerMapScroll();
    window.addEventListener('resize', centerMapScroll);

    /* 初始状态：默认选中第一个节点（会宁），不播动画 */
    var firstKey = keyOfEvent(nodes[0]);
    setActive(firstKey, false, true);
  })();

  /* ==================================================================
     二、类型 / 市州 / 关键词筛选
     ================================================================== */
  (function filters() {
    var wrap = document.querySelector('[data-cards]');
    if (!wrap) { return; }

    var cards = toArray(wrap.querySelectorAll('.lc-card'));
    var chips = toArray(document.querySelectorAll('[data-type-filter]'));
    var citySelect = document.querySelector('[data-city-filter]');
    var keywordInput = document.querySelector('[data-keyword]');
    var countEl = document.querySelector('[data-result-count]');
    var summaryEl = document.querySelector('[data-filter-summary]');
    var emptyEl = document.querySelector('[data-empty]');
    var resetBtns = toArray(document.querySelectorAll('[data-reset]'));

    var TYPE_LABEL = {
      changzheng: '长征',
      genjudi: '根据地',
      xilujun: '西路军',
      bingbian: '兵变与起义',
      jinian: '纪念设施',
      renwu: '人物故居'
    };

    var state = { type: 'all', city: 'all', keyword: '' };

    function setChipState(value) {
      chips.forEach(function (chip) {
        var active = chip.getAttribute('data-type-filter') === value;
        chip.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    }

    function summaryText(cityLabel) {
      var parts = [];
      if (state.type !== 'all' && TYPE_LABEL[state.type]) {
        parts.push('类型：' + TYPE_LABEL[state.type]);
      }
      if (state.city !== 'all' && cityLabel) {
        parts.push('市州：' + cityLabel);
      }
      if (state.keyword) {
        parts.push('关键词：' + state.keyword);
      }
      return parts.length ? '（' + parts.join(' · ') + '）' : '';
    }

    function apply() {
      var cityLabel = '';
      if (citySelect) {
        var option = citySelect.options[citySelect.selectedIndex];
        cityLabel = option ? option.text : '';
      }
      var visible = 0;
      cards.forEach(function (card) {
        var typeOk = state.type === 'all' || card.getAttribute('data-type') === state.type;
        var cityOk = state.city === 'all' || card.getAttribute('data-city') === state.city;
        var kwOk = true;
        if (state.keyword) {
          kwOk = card.textContent.toLowerCase().indexOf(state.keyword) !== -1;
        }
        var show = typeOk && cityOk && kwOk;
        if (show) { card.removeAttribute('hidden'); visible += 1; }
        else { card.setAttribute('hidden', 'hidden'); }
      });

      if (countEl) { countEl.textContent = String(visible); }
      if (summaryEl) { summaryEl.textContent = summaryText(cityLabel); }
      if (emptyEl) {
        if (visible === 0) { emptyEl.removeAttribute('hidden'); }
        else { emptyEl.setAttribute('hidden', 'hidden'); }
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var value = chip.getAttribute('data-type-filter');
        if (!value) { return; }
        state.type = value;
        setChipState(value);
        apply();
      });
    });

    if (citySelect) {
      citySelect.addEventListener('change', function () {
        state.city = citySelect.value || 'all';
        apply();
      });
    }

    if (keywordInput) {
      keywordInput.addEventListener('input', function () {
        state.keyword = String(keywordInput.value || '').replace(/^\s+|\s+$/g, '').toLowerCase();
        apply();
      });
    }

    resetBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.type = 'all';
        state.city = 'all';
        state.keyword = '';
        setChipState('all');
        if (citySelect) { citySelect.value = 'all'; }
        if (keywordInput) { keywordInput.value = ''; }
        apply();
      });
    });

    apply();
  })();
})();
