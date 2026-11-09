/* ==========================================================================
   陇原星火 · 首页交互
   index.js — 首屏视差 + 史实速读卡切换（原生 JS，无依赖）
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { reduceMotion = false; }

  function $(sel) { return document.querySelector(sel); }

  /* ------------------------------------------------------------------
     1. 首屏轻微视差
     ------------------------------------------------------------------ */
  (function parallax() {
    var bg = $('.hero__bg');
    if (!bg || reduceMotion) { return; }
    var ticking = false;

    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (y < 1200) {
        bg.style.transform = 'translate3d(0,' + (y * 0.12).toFixed(2) + 'px,0) scale(1.04)';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  })();

  /* ------------------------------------------------------------------
     2. 史实速读卡：随机切换
     ------------------------------------------------------------------ */
  (function todayCard() {
    var textEl = $('.today__text');
    var dateEl = $('.today__date');
    var btn = $('.today__btn');
    if (!textEl || !btn) { return; }

    var FACTS = [
      {
        date: '1935.09.12',
        text: '1935 年 9 月 12 日，中共中央政治局扩大会议在迭部县俄界（今达拉乡高吉村）召开，通过《关于张国焘同志的错误的决定》，坚持继续北上，并决定将红 1 军、红 3 军、军委纵队编为中国工农红军陕甘支队。'
      },
      {
        date: '1935.09.17',
        text: '1935 年 9 月 16 日下午，红军向天险腊子口发起攻击；17 日晨攻占腊子口，突破了长征路上最后一道天险，为红军进入陕甘打开了北上通道。'
      },
      {
        date: '1935.09.20',
        text: '中共中央在哈达铺召开政治局常委会议，正式宣布成立中国工农红军陕甘支队，并确定向陕甘革命根据地前进。红军从当地邮政代办所收集的报纸中得知陕北有红军和根据地，哈达铺因此被称为长征路上的“加油站”。'
      },
      {
        date: '1935.09.27',
        text: '中共中央政治局常委会议在通渭县榜罗镇召开，正式确定把中共中央和陕甘支队的落脚点放在陕北。'
      },
      {
        date: '1935.09.29',
        text: '红军进驻通渭县城。当晚，毛泽东在城东文庙街小学接见一纵队一大队先锋连时，朗诵了《七律·长征》。今日校园内仍存长征诗碑。'
      },
      {
        date: '1936.10.09',
        text: '红四方面军指挥部到达甘肃会宁，同红一方面军会合；10 月 22 日，红二方面军指挥部到达将台堡（今宁夏西吉县），同红一方面军会师，红军长征胜利结束。'
      },
      {
        date: '1934.11.07',
        text: '陕甘边区苏维埃政府成立大会在华池县南梁荔园堡举行，习仲勋当选苏维埃政府主席，刘志丹当选陕甘边区革命军事委员会主席。因群众对“南梁”这个名称的热爱，陕甘边区苏维埃政府被称为“南梁政府”。'
      },
      {
        date: '1936.11.11',
        text: '10 月 24 日夜，红四方面军主力在靖远虎豹口强渡黄河，至 30 日共 2.18 万余人渡过黄河；11 月 11 日，中共中央正式命令河西部队组建为西路军，陈昌浩任军政委员会主席，徐向前任副主席。'
      },
      {
        date: '1937.01.20',
        text: '红 5 军于 1 月 1 日攻克高台县城，1 月 12 日国民党军集中优势兵力进攻。1 月 20 日高台城失陷，军长董振堂、政治部主任杨克明等壮烈牺牲。'
      }
    ];

    var last = 0;

    function pick() {
      if (FACTS.length < 2) { return 0; }
      var idx = last;
      while (idx === last) {
        idx = Math.floor(Math.random() * FACTS.length);
      }
      return idx;
    }

    function show(index) {
      var f = FACTS[index];
      if (!f) { return; }
      textEl.classList.add('is-swapping');
      window.setTimeout(function () {
        if (dateEl) { dateEl.textContent = f.date; }
        textEl.textContent = f.text;
        textEl.classList.remove('is-swapping');
      }, reduceMotion ? 0 : 220);
      last = index;
    }

    btn.addEventListener('click', function () {
      show(pick());
    });

    /* 首次点击前，把 HTML 里的静态首条事实登记为当前项 */
    last = 0;
  })();

  /* ------------------------------------------------------------------
     3. 首页锚点平滑滚动（.hero__scroll 点击进入下一屏）
     ------------------------------------------------------------------ */
  (function scrollCue() {
    var cue = $('.hero__scroll');
    if (!cue) { return; }
    cue.style.cursor = 'pointer';
    cue.addEventListener('click', function () {
      var next = $('.intro');
      if (next) {
        next.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  })();
})();
