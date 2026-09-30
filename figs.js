/* ══════════════════════════════════════════════════════════════
   기계수동조립 마스터 — 그림 모음 (그림14 · 2026-09-30)
   공용 그리기 도우미 links/fig.js 를 쓴다. 이 파일은 index.html(배우기) · lesson.js(수업 슬라이드)가 함께 부른다.

   한 칸의 모양
     키: { cap:'캡션 한 줄', cards:['배우기 카드 제목'…], draw:function(){ … } }
       cards — index.html 의 LEARN 카드 제목(t)과 **똑같이**. 그 카드 본문 위에 그림이 붙는다.
     순서 = 화면에 나오는 순서.

   그림 내용의 근거
     · 카드 본문(LEARN) 과 NCS 학습모듈 「자동화설비실무」 05 조립부품준비 · 15 기계구동장치 조립
       (구동 장치 = 몸체 · 축 · 베어링 6003/6004 · 오일 실 · 키 · 풀리 · 기어 — 표 1-3, 1-4)
     · 7~11단원은 카드 본문(2019~2020 수업 자료에서 옮긴 것)을 그대로 그림으로 옮겼다.
     · 카드에 없는 수치는 넣지 않았다. 공차역 · 표면 곡선 · 토크 그래프는 **모양만** 보여 주는 개념 그림이다.
   ⚠ air · oil 두 그림은 index.html 의 SYM(공유압 기호 53종)을 그대로 끼워 쓴다 — 10단원 기호와 같은 모양.
     SYM 이 없는 화면(그림만 모아 보는 시트 등)에서는 기호 자리가 비고 관로 · 이름표만 보인다.
   ⚠ 수업 슬라이드에서 정답이 되는 글자는 ans:true 로 그렸다 → lesson.js 에서 figLabels:false 로 가린다.
   ══════════════════════════════════════════════════════════════ */
var FIGS = (function () {
  var F = window.FIG;
  if (!F) return {};
  var C = F.C;
  var t = F.t, box = F.box, line = F.line, arrow = F.arrow, callout = F.callout,
      poly = F.poly, path = F.path, circle = F.circle;

  /* ── 작은 도우미 ─────────────────────────────── */
  function dot(x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 3) + '" fill="' + (c || C.ink) + '"/>'; }
  function arcPts(cx, cy, rx, ry, a0, a1, k) {
    var p = [];
    for (var i = 0; i <= k; i++) { var a = a0 + (a1 - a0) * i / k; p.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
    return p;
  }
  function divider(x, y1, y2) { return line(x, y1, x, y2, { c: C.grayM, w: 1.4, dash: '6 5' }); }
  /* 부품 번호 풍선: 가리키는 점(px,py) → 풍선(bx,by) */
  function bal(px, py, bx, by, n, c) {
    c = c || C.ink;
    var ang = Math.atan2(py - by, px - bx);
    return line(px, py, bx + 13 * Math.cos(ang), by + 13 * Math.sin(ang), { c: c, w: 1.2 }) + dot(px, py, 3, c) +
      circle(bx, by, 13, { fill: C.paper, c: c, w: 1.6 }) + t(bx, by + 0.5, String(n), { a: 'm', size: 14, b: 1, halo: false, c: c });
  }
  /* 가운데 작은 흐름 화살촉 */
  function midHead(x1, y1, x2, y2, c) {
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2, a = Math.atan2(y2 - y1, x2 - x1);
    return arrow(mx - 5 * Math.cos(a), my - 5 * Math.sin(a), mx + 6 * Math.cos(a), my + 6 * Math.sin(a), { c: c, w: 1, head: 10 });
  }
  /* index.html 의 공유압 기호(SYM)를 (cx,cy) 에 폭 w 로 끼운다. rot = 도 */
  function sym(name, cx, cy, w, rot) {
    if (typeof SYM === 'undefined' || !SYM[name]) return '';
    var h = w * 92 / 120;
    var s = SYM[name].replace('<svg ', '<svg x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" ')
      .replace(' class="sym"', '').replace('stroke-width="2"', 'stroke-width="3"');
    return '<g transform="translate(' + cx + ' ' + cy + ')' + (rot ? ' rotate(' + rot + ')' : '') + '">' + s + '</g>';
  }
  /* 사다리(래더) 기호 */
  function cA(x, y, c) { c = c || C.ink; return line(x - 6, y - 12, x - 6, y + 12, { c: c, w: 2.4 }) + line(x + 6, y - 12, x + 6, y + 12, { c: c, w: 2.4 }); }
  function cB(x, y, c) { return cA(x, y, c) + line(x - 12, y + 12, x + 12, y - 12, { c: c || C.ink, w: 1.8 }); }
  function coil(x, y, c) { return circle(x, y, 14, { fill: C.paper, c: c || C.ink, w: 2.2 }); }
  function wire(pts, c, w) { return poly(pts, { c: c || C.ink, w: w || 2 }); }

  /* 구동 장치 조립 단면 (NCS 15 기계구동장치 조립의 몸체 · 축 · 베어링 · 오일 실 · 키) — 글자 없이 모양만.
     좌표: x 40~440, y 70~210, 축 중심 y 140 */
  function unit(o) {
    var s = box(60, 124, 360, 32, { fill: o.shaft, r: 2, w: 2 });
    [[150, 70, 36, 30], [186, 70, 108, 48], [294, 70, 36, 30],
     [150, 180, 36, 30], [186, 162, 108, 48], [294, 180, 36, 30]].forEach(function (w) {
      s += box(w[0], w[1], w[2], w[3], { fill: o.house, r: 0, w: 1.6 }) + F.hatch(w[0], w[1], w[2], w[3], { gap: 8, c: C.sub, w: 0.7 });
    });
    [160, 294].forEach(function (bx) {
      s += box(bx, 100, 26, 24, { fill: o.std, r: 1, w: 1.4 }) + circle(bx + 13, 112, 8, { fill: C.paper, w: 1.4 });
      s += box(bx, 156, 26, 24, { fill: o.std, r: 1, w: 1.4 }) + circle(bx + 13, 168, 8, { fill: C.paper, w: 1.4 });
    });
    [150, 320].forEach(function (sx) {
      s += box(sx, 102, 10, 22, { fill: o.std, r: 1, w: 1.2 }) + box(sx, 156, 10, 22, { fill: o.std, r: 1, w: 1.2 });
    });
    s += box(76, 115, 36, 12, { fill: o.std, r: 1, w: 1.4 });
    s += line(40, 140, 440, 140, { c: C.sub, w: 1, dash: 'center' });
    return s;
  }

  return {

  /* ─────────── 1단원 조립 도면 해독 ─────────── */
  drawings: { cards: ['조립도에서 확인하는 것'],
    cap: '조립도는 제품 전체(부품의 종류 · 조립 상태), 부품도는 부품 하나(치수 · 공차 · 거칠기)를 본다',
    draw: function () {
      var s = divider(240, 14, 246);
      s += t(120, 26, '조립도', { a: 'm', b: 1, size: 18, ans: 1 }) + t(360, 26, '부품도', { a: 'm', b: 1, size: 18, ans: 1 });
      /* 왼쪽: 조립 단면을 반으로 줄여서 */
      s += F.g(unit({ house: C.grayL, shaft: C.grayL, std: C.grayL }), { x: -10, y: 30, s: 0.5 });
      s += bal(110, 77, 110, 50, 1) + bal(195, 100, 215, 58, 2) + bal(76, 114, 40, 160, 3);
      s += t(120, 190, '부품의 종류와 명칭', { a: 'm', b: 1, size: 15, ans: 1 }) +
        t(120, 214, '조립 상태 · 크기 · 수량', { a: 'm', size: 14, c: C.sub }) +
        t(120, 238, '→ 제품 전체를 본다', { a: 'm', size: 14, b: 1, c: C.blue });
      /* 오른쪽: 축 하나의 부품도 */
      var seg = [[265, 292, 10], [292, 322, 13], [322, 398, 16], [398, 428, 13], [428, 455, 10]], cy = 110, top = [], bot = [];
      seg.forEach(function (g) { top.push([g[0], cy - g[2]], [g[1], cy - g[2]]); bot.unshift([g[1], cy + g[2]], [g[0], cy + g[2]]); });
      s += poly(top.concat(bot), { close: 1, fill: C.grayL, w: 2.2 });
      [292, 322, 398, 428].forEach(function (x, i) { var h = i === 0 || i === 3 ? 10 : 13; s += line(x, cy - h, x, cy + h, { w: 1.4 }); });
      s += line(255, cy, 465, cy, { c: C.sub, w: 1, dash: 'center' });
      s += path('M371,84 L378,94 L390,72 H404', { c: C.orange, w: 1.8 });
      s += callout(340, 94, 300, 58, '지름 · 치수 공차', { a: 'm' }) + callout(397, 72, 432, 50, '표면 거칠기', { a: 'm' });
      s += F.dim(265, 120, 455, 120, '길이', { off: 24, side: -1 });
      s += t(360, 190, '치수 · 치수 공차 · 표면 거칠기', { a: 'm', b: 1, size: 14, ans: 1 }) +
        t(360, 214, '형상 정밀도 · 가공 방법', { a: 'm', size: 14, c: C.sub }) +
        t(360, 238, '→ 부품 하나를 본다', { a: 'm', size: 14, b: 1, c: C.blue });
      return F.svg(480, 256, s);
    } },

  assy: { cards: ['부품 목록표(부품란) 읽기'],
    cap: '구동 장치 조립도의 부품 번호 — 치수로 적힌 몸체 · 축은 만들고, 규격 번호로 적힌 것은 사 온다',
    draw: function () {
      var s = unit({ house: C.blueL, shaft: C.blueL, std: C.greenL });
      s += bal(240, 94, 240, 40, 1) + t(258, 40, '몸체', { a: 's', size: 15 });
      s += bal(405, 140, 440, 86, 2) + t(440, 60, '축', { a: 'm', size: 15 });
      s += bal(94, 119, 70, 60, 8) + t(88, 60, '평행 키', { a: 's', size: 15 });
      s += bal(307, 168, 330, 250, 6) + t(348, 250, '베어링', { a: 's', size: 15 });
      s += bal(155, 170, 130, 250, 7) + t(148, 250, '오일 실', { a: 's', size: 15 });
      s += box(40, 276, 22, 16, { fill: C.blueL, c: C.blue, r: 3 }) + t(70, 284, '외주품 — 만들어 온다', { a: 's', size: 14 });
      s += box(260, 276, 22, 16, { fill: C.greenL, c: C.green, r: 3 }) + t(290, 284, '표준품 — 사 온다', { a: 's', size: 14 });
      return F.svg(480, 304, s);
    } },

  locate: { cards: ['조립 계획을 세울 때 도면에서 뽑는 자료'],
    cap: '위치 결정면(어디를 기준으로 놓나)과 고정면(어디를 눌러 잡나) — 고정구는 미리 만들어 둔다',
    draw: function () {
      var s = box(50, 190, 380, 26, { fill: C.grayM, label: '조립용 고정구', size: 14, ans: 1 });
      s += box(90, 110, 40, 80, { fill: C.grayM, r: 2 });
      s += box(130, 120, 190, 70, { fill: C.blueL, c: C.blue, r: 2, label: '부품', size: 16 });
      s += line(130, 122, 130, 190, { c: C.green, w: 5 }) + line(132, 190, 318, 190, { c: C.green, w: 5 });
      s += line(140, 120, 318, 120, { c: C.red, w: 5 });
      /* 누름쇠(클램프) */
      s += box(370, 80, 26, 110, { fill: C.grayM, r: 2 }) + box(250, 80, 146, 18, { fill: C.grayM, r: 2 }) +
        box(262, 98, 24, 22, { fill: C.grayM, r: 2 });
      s += arrow(274, 36, 274, 76, { c: C.red, w: 2.6, head: 12 }) + t(286, 46, '누르는 힘', { a: 's', size: 14, c: C.red });
      s += callout(130, 150, 64, 72, '위치 결정면', { a: 'm', c: C.green, tc: C.green, b: 1, ans: 1 });
      s += callout(200, 120, 180, 62, '고정면', { a: 'm', c: C.red, tc: C.red, b: 1, ans: 1 });
      s += t(240, 244, '초록 = 기준으로 놓는 면 · 빨강 = 눌러 잡는 면', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 260, s);
    } },

  rough: { cards: ['표면 거칠기 표시'],
    cap: '표면을 확대한 단면 — 중심선에서 벗어난 높이의 평균이 Ra, 가장 높은 산~가장 깊은 골이 Rmax (모양만 보인 개념 그림)',
    draw: function () {
      var v = [0, -18, -6, 14, 4, -22, -10, 8, 20, 2, -14, -4, 12, -8, -26, -6, 16, 6, -12, 10, 24, 4, -16, -2, 14, 0, -10, 8, -20, -4, 12, 18, 0, -12, 6, 0, -8];
      var pts = v.map(function (d, i) { return [40 + i * 10, 120 + d]; }), last = pts[pts.length - 1];
      var prof = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ',' + p[1]; }).join(' ');
      var s = path(prof + ' L' + last[0] + ',190 L40,190 Z', { fill: C.grayL, c: 'none', w: 0 });
      s += path('M40,120 L' + prof.slice(1) + ' L' + last[0] + ',120 Z', { fill: C.blueL, c: 'none', w: 0 });
      s += path(prof, { w: 2.2 });
      s += line(30, 120, 410, 120, { c: C.blue, w: 1.4, dash: 'center' });
      s += line(30, 94, 440, 94, { c: C.red, w: 1, dash: '4 3' }) + line(30, 144, 440, 144, { c: C.red, w: 1, dash: '4 3' });
      s += arrow(425, 96, 425, 142, { c: C.red, w: 1.4, head: 9, both: 1 }) + t(431, 119, 'Rmax', { a: 's', size: 14, b: 1, c: C.red });
      s += callout(33, 120, 40, 62, '중심선', { a: 's', c: C.blue, tc: C.blue, b: 1, ans: 1 });
      s += callout(180, 107, 200, 50, '색칠한 높이의 평균 = Ra', { a: 's', c: C.blue, ans: 1 });
      s += t(240, 214, '다듬질 기호가 없는 면 = 가공하지 않은 면', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 234, s);
    } },

  /* ─────────── 2단원 조립용 수공구 ─────────── */
  pull: { cards: ['스패너·렌치를 안전하게 쓰는 법'],
    cap: '스패너는 몸쪽으로 당긴다 — 밀다가 빠지면 손이 앞으로 튀어 나간다',
    draw: function () {
      function wrench(nx, ny) {
        var hx = [];
        for (var i = 0; i < 6; i++) { var a = Math.PI / 6 + i * Math.PI / 3; hx.push([nx + 13 * Math.cos(a), ny + 13 * Math.sin(a)]); }
        return box(nx + 18, ny - 7, 140, 14, { fill: C.grayM, r: 7, w: 1.4 }) +
          circle(nx, ny, 25, { fill: C.grayM, w: 1.6 }) +
          '<rect x="' + (nx - 27) + '" y="' + (ny - 9) + '" width="16" height="18" fill="' + C.paper + '"/>' +
          poly(hx, { close: 1, fill: C.grayL, w: 1.6 });
      }
      function person(px, py) {
        return circle(px, py - 18, 10, { fill: C.grayL, w: 1.6 }) +
          path('M' + (px - 20) + ',' + (py + 16) + ' Q' + px + ',' + (py - 10) + ' ' + (px + 20) + ',' + (py + 16), { fill: C.grayL, w: 1.6 });
      }
      var s = divider(240, 14, 272);
      s += t(120, 26, '○ 몸쪽으로 당긴다', { a: 'm', b: 1, size: 17, c: C.green }) + t(360, 26, '✕ 밖으로 민다', { a: 'm', b: 1, size: 17, c: C.red });
      s += wrench(50, 110) + person(190, 215) + arrow(190, 124, 190, 178, { c: C.green, w: 3, head: 14 });
      s += wrench(290, 110) + person(430, 215) + arrow(430, 96, 430, 50, { c: C.red, w: 3, head: 14 });
      s += t(120, 262, '빠져도 손이 몸쪽으로 온다', { a: 'm', size: 14 }) + t(360, 262, '빠지면 손이 앞으로 튀어 다친다', { a: 'm', size: 14, c: C.red });
      return F.svg(480, 280, s);
    } },

  bolt: { cards: ['볼트를 조이는 순서'],
    cap: '대각선 순서로 돌아가며, 같은 순서로 2~3회 나누어 조금씩 조인다',
    draw: function () {
      var s = box(25, 45, 180, 150, { fill: C.grayL, r: 10 });
      s += arrow(72, 92, 158, 148, { c: C.orange, w: 2, dash: '6 5' }) + arrow(72, 148, 158, 92, { c: C.orange, w: 2, dash: '6 5' });
      s += F.num(60, 80, 1, { r: 16, size: 17 }) + F.num(170, 160, 2, { r: 16, size: 17 }) +
        F.num(60, 160, 3, { r: 16, size: 17 }) + F.num(170, 80, 4, { r: 16, size: 17 });
      s += t(115, 222, '대각선 순서', { a: 'm', b: 1, size: 16, ans: 1 });
      s += t(351, 34, '2~3회에 나누어 조금씩', { a: 'm', b: 1, size: 16 });
      s += line(278, 65, 424, 65, { c: C.green, w: 1.4, dash: 'hidden' }) + t(274, 65, '규정 토크', { a: 'e', size: 13, c: C.green });
      [[300, 35], [352, 75], [404, 115]].forEach(function (b, i) {
        s += box(b[0] - 17, 180 - b[1], 34, b[1], { fill: i === 2 ? C.greenL : C.blueL, c: i === 2 ? C.green : C.blue, r: 3 }) +
          t(b[0], 198, (i + 1) + '회', { a: 'm', size: 14 });
      });
      s += t(351, 228, '마지막에 토크 렌치로 확인', { a: 'm', b: 1, size: 14, c: C.green });
      return F.svg(480, 246, s);
    } },

  /* ─────────── 3단원 측정기 ─────────── */
  mic: { cards: ['마이크로미터 — 어떻게 읽는가', '측정할 때 지켜야 할 것'],
    cap: '외측 마이크로미터의 각부 — 엔빌과 스핀들 사이에 물리고, 래칫 스톱으로 일정한 측정압을 준다',
    draw: function () {
      var s = path('M48,74 H78 V160 Q78,172 90,172 H170 Q182,172 182,160 V74 H210 V178 Q210,204 184,204 H74 Q48,204 48,178 Z', { fill: C.grayL, w: 1.8 });
      s += box(186, 58, 18, 16, { fill: C.grayM, r: 3, w: 1.2 });
      s += box(78, 84, 18, 16, { fill: C.grayM, r: 1, w: 1.4 });
      s += box(132, 85, 50, 14, { fill: C.grayM, r: 1, w: 1.4 });
      s += box(210, 78, 86, 28, { fill: C.grayL, r: 2, w: 1.6 }) + line(210, 92, 296, 92, { w: 1.2 });
      for (var i = 0; i < 8; i++) {
        var x = 216 + i * 9;
        s += line(x, 92, x, 84, { w: 1 });
        if (x + 4.5 < 282) s += line(x + 4.5, 92, x + 4.5, 99, { w: 1 });
      }
      s += path('M282,80 L292,70 H372 V114 H292 L282,104 Z', { fill: C.grayM, w: 1.6 });
      for (var k = 0; k < 5; k++) s += line(284, 84 + k * 4, 291, 84 + k * 4, { w: 0.9 });
      for (var m = 0; m < 7; m++) s += line(330 + m * 6, 74, 330 + m * 6, 110, { c: C.sub, w: 0.8 });
      s += box(372, 80, 40, 24, { fill: C.grayL, r: 5, w: 1.6 });
      s += callout(88, 86, 70, 40, '엔빌', { a: 'm' }) + callout(150, 88, 150, 40, '스핀들', { a: 'm' }) +
        callout(230, 92, 252, 40, '기준선', { a: 'm' }) + callout(250, 106, 245, 150, '슬리브', { a: 'm' }) +
        callout(330, 114, 330, 150, '딤블', { a: 'm' }) + callout(400, 104, 425, 150, '래칫 스톱', { a: 'm', ans: 1 }) +
        callout(130, 204, 130, 232, '프레임', { a: 'm' });
      s += t(335, 196, '나사 피치 0.5 mm · 딤블 50등분', { a: 'm', size: 13, c: C.sub }) +
        t(335, 218, '→ 한 눈금 0.01 mm', { a: 'm', size: 14, b: 1, c: C.blue });
      return F.svg(480, 248, s);
    } },

  micrange: { cards: ['마이크로미터의 종류와 측정 범위'],
    cap: '마이크로미터 하나가 재는 범위는 25 mm — 그래서 0~25, 25~50, 50~75 mm 처럼 여러 개를 갖춘다',
    draw: function () {
      function X(mm) { return 70 + mm * 4.4; }
      var s = '';
      [0, 25, 50, 75].forEach(function (mm) {
        s += line(X(mm), 30, X(mm), 200, { c: C.grayM, w: 1, dash: '4 4' }) + line(X(mm), 200, X(mm), 210, { w: 1.4 }) +
          t(X(mm), 224, String(mm), { a: 'm', size: 14 });
      });
      s += line(X(0), 205, X(75) + 30, 205, { w: 1.6 }) + t(X(75) + 30, 224, 'mm', { a: 'm', size: 13, c: C.sub });
      [55, 110, 165].forEach(function (y, i) {
        var a = X(25 * i), b = X(25 * i + 25), R = b + 24;
        s += poly([[62, y - 10], [62, y + 22], [R, y + 22], [R, y - 10]], { c: C.sub, w: 4 });
        s += box(62, y - 6, 8, 12, { fill: C.grayM, r: 1, w: 1 });
        s += box(b, y - 5, R - b, 10, { fill: C.grayM, r: 1, w: 1 });
        s += box(a, y - 4, b - a, 8, { fill: C.blue, c: C.blue, r: 4, w: 1 });
        s += t((a + b) / 2, y - 17, (25 * i) + '~' + (25 * i + 25) + ' mm', { a: 'm', b: 1, size: 15, c: C.blue });
      });
      return F.svg(480, 240, s);
    } },

  bore: { cards: ['안지름을 재는 측정기 세 가지'],
    cap: '안지름 — 2점으로 재면 중심 맞추기가 어렵고, 3점(정삼각형)으로 재면 저절로 맞는다. 홈 폭은 3점식으로 못 잰다',
    draw: function () {
      var s = divider(162, 14, 236) + divider(318, 14, 236), cs = [84, 240, 396];
      s += t(84, 32, '내측 마이크로미터\n· 실린더 게이지', { a: 'm', b: 1, size: 14, ans: 1 }) +
        t(240, 32, '3점식 마이크로미터\n(홀 테스터)', { a: 'm', b: 1, size: 14, ans: 1 }) +
        t(396, 32, '홈 폭 재기', { a: 'm', b: 1, size: 14 });
      /* ① 2점 */
      var c = cs[0];
      s += box(c - 62, 62, 124, 118, { fill: C.grayL, r: 4 }) + circle(c, 121, 48, { fill: C.paper, w: 2.2 });
      s += line(c - 48, 121, c + 48, 121, { c: C.blue, w: 3 }) + dot(c - 48, 121, 5, C.blue) + dot(c + 48, 121, 5, C.blue);
      /* ② 3점 */
      c = cs[1];
      s += box(c - 62, 62, 124, 118, { fill: C.grayL, r: 4 }) + circle(c, 121, 48, { fill: C.paper, w: 2.2 });
      var p3 = [-90, 30, 150].map(function (d) { var r = d * Math.PI / 180; return [c + 48 * Math.cos(r), 121 + 48 * Math.sin(r)]; });
      s += poly(p3, { close: 1, c: C.blue, w: 1, dash: '4 3' });
      p3.forEach(function (p) { s += line(c, 121, p[0], p[1], { c: C.blue, w: 3 }) + dot(p[0], p[1], 5, C.blue); });
      s += dot(c, 121, 4, C.blue);
      /* ③ 홈 폭 */
      c = cs[2];
      s += box(c - 62, 62, 124, 118, { fill: C.grayL, r: 4 }) + box(c - 28, 62, 56, 118, { fill: C.paper, r: 0, w: 2 });
      s += line(c - 28, 100, c + 28, 100, { c: C.green, w: 3 }) + dot(c - 28, 100, 5, C.green) + dot(c + 28, 100, 5, C.green) +
        t(c, 86, '2점 ○', { a: 'm', size: 14, b: 1, c: C.green });
      s += t(c, 148, '3점 ✕', { a: 'm', size: 15, b: 1, c: C.red, ans: 1 });
      s += t(84, 204, '2점 측정', { a: 'm', b: 1, size: 15 }) + t(84, 226, '중심 맞추기 어렵다', { a: 'm', size: 13, c: C.sub });
      s += t(240, 204, '3점 — 정삼각형', { a: 'm', b: 1, size: 15 }) + t(240, 226, '중심이 저절로 맞는다', { a: 'm', size: 13, c: C.sub });
      s += t(396, 204, '홈 폭', { a: 'm', b: 1, size: 15 }) + t(396, 226, '2점식만 잴 수 있다', { a: 'm', size: 13, c: C.sub, ans: 1 });
      return F.svg(480, 244, s);
    } },

  /* ─────────── 4단원 공차와 끼워맞춤 ─────────── */
  itband: { cards: ['IT 기본 공차'],
    cap: 'IT 등급을 어디에 쓰는가 — 구멍은 축보다 한 등급 위, 숫자가 클수록 공차가 크다',
    draw: function () {
      function X(i) { return 92 + i * 19; }       /* i: 0=IT01, 1=IT0, k+1=ITk */
      function bar(a, b, y, fill, c, txt) {
        var x1 = X(a + 1) - 9, x2 = X(b + 1) + 9;
        return box(x1, y, x2 - x1, 38, { fill: fill, c: c, r: 4 }) + t((x1 + x2) / 2, y + 19, txt, { a: 'm', size: 13, b: 1, halo: false });
      }
      var s = t(240, 22, '구멍은 축보다 한 등급 위 (축 IT5 → 구멍 IT6)', { a: 'm', size: 14, b: 1, c: C.orange });
      s += t(46, 67, '구멍', { a: 'm', b: 1 }) + t(46, 121, '축', { a: 'm', b: 1 });
      s += bar(1, 5, 48, C.purpleL, C.purple, '게이지\nIT1~5') + bar(6, 10, 48, C.blueL, C.blue, '끼워맞춤\nIT6~10') + bar(11, 18, 48, C.grayL, C.sub, '끼워맞춤 이외\nIT11~18');
      s += bar(1, 4, 102, C.purpleL, C.purple, '게이지\nIT1~4') + bar(5, 9, 102, C.blueL, C.blue, '끼워맞춤\nIT5~9') + bar(10, 18, 102, C.grayL, C.sub, '끼워맞춤 이외\nIT10~18');
      s += arrow(X(6) - 9, 94, X(7) - 9, 94, { c: C.orange, w: 1.6, head: 8 });
      s += line(X(0) - 9, 160, X(19) + 9, 160, { w: 1.4 });
      for (var i = 0; i < 20; i++) s += line(X(i), 156, X(i), 164, { w: 1 });
      [[0, 'IT01'], [2, 'IT1'], [6, 'IT5'], [11, 'IT10'], [19, 'IT18']].forEach(function (p) {
        s += t(X(p[0]), 178, p[1], { a: 'm', size: 13, c: C.sub });
      });
      s += t(272, 204, '등급 숫자가 클수록 공차가 크다 · 모두 20개 등급', { a: 'm', size: 14 }) +
        arrow(X(0), 222, X(19), 222, { c: C.sub, w: 1.6 });
      return F.svg(480, 238, s);
    } },

  fit: { cards: ['끼워맞춤 세 가지'],
    cap: '구멍(파랑)과 축(주황)의 공차역 — 축이 늘 작으면 헐거운, 겹치면 중간, 늘 크면 억지 끼워맞춤 (모양만 보인 개념 그림)',
    draw: function () {
      var s = line(60, 150, 470, 150, { w: 1.2, dash: '6 4' }) + t(8, 150, '기준선', { a: 's', size: 13, c: C.sub });
      var col = [[105, '헐거운', 165, 200, '항상 틈새', '상대운동 · 쉬운 조립'],
                 [250, '중간', 128, 172, '틈새 또는 죔새', '베어링 · 선택 조립'],
                 [395, '억지', 70, 100, '항상 죔새', '영구 조립 · 동력 전달']];
      col.forEach(function (k) {
        var c = k[0];
        s += t(c, 28, k[1] + ' 끼워맞춤', { a: 'm', b: 1, size: 17, ans: 1 });
        s += box(c - 40, 116, 34, 34, { fill: C.blueL, c: C.blue, r: 2 });
        s += box(c + 6, k[2], 34, k[3] - k[2], { fill: C.orangeL, c: C.orange, r: 2 });
        s += t(c, 232, k[4], { a: 'm', b: 1, size: 15, ans: 1 }) + t(c, 254, k[5], { a: 'm', size: 13, c: C.sub });
      });
      s += arrow(128, 152, 128, 163, { both: 1, w: 1, head: 6 }) + t(150, 158, '틈새', { a: 's', size: 13, b: 1, ans: 1 });
      s += arrow(418, 102, 418, 114, { both: 1, w: 1, head: 6 }) + t(440, 108, '죔새', { a: 's', size: 13, b: 1, ans: 1 });
      s += box(150, 272, 22, 16, { fill: C.blueL, c: C.blue, r: 3 }) + t(180, 280, '구멍', { a: 's', size: 14 }) +
        box(270, 272, 22, 16, { fill: C.orangeL, c: C.orange, r: 3 }) + t(300, 280, '축', { a: 's', size: 14 });
      return F.svg(480, 298, s);
    } },

  fitmark: { cards: ['끼워맞춤 표기 읽기'],
    cap: '50H7/g6 — 기준 치수 → 구멍의 종류 · 등급 → 축의 종류 · 등급 (대문자는 구멍, 소문자는 축)',
    draw: function () {
      var s = '', big = { a: 'm', b: 1, size: 46, halo: false };
      s += t(100, 100, '50', big) + t(176, 100, 'H', Object.assign({}, big, { c: C.blue })) + t(212, 100, '7', Object.assign({}, big, { c: C.blue })) +
        t(248, 100, '/', Object.assign({}, big, { c: C.sub })) + t(284, 100, 'g', Object.assign({}, big, { c: C.orange })) + t(320, 100, '6', Object.assign({}, big, { c: C.orange }));
      s += poly([[160, 70], [160, 62], [228, 62], [228, 70]], { c: C.blue, w: 1.6 }) + t(194, 48, '구멍', { a: 'm', b: 1, c: C.blue });
      s += poly([[268, 70], [268, 62], [336, 62], [336, 70]], { c: C.orange, w: 1.6 }) + t(302, 48, '축', { a: 'm', b: 1, c: C.orange });
      s += line(100, 126, 100, 150, { c: C.sub, w: 1.2 }) + t(100, 162, '기준 치수', { a: 'm', size: 14, b: 1 });
      s += line(176, 126, 160, 200, { c: C.blue, w: 1.2 }) + t(160, 212, '구멍 종류(대문자)', { a: 'm', size: 14, c: C.blue });
      s += line(212, 126, 240, 150, { c: C.blue, w: 1.2 }) + t(240, 162, '구멍 IT 등급', { a: 'm', size: 14, c: C.blue });
      s += line(284, 126, 310, 200, { c: C.orange, w: 1.2 }) + t(310, 212, '축 종류(소문자)', { a: 'm', size: 14, c: C.orange });
      s += line(320, 126, 390, 150, { c: C.orange, w: 1.2 }) + t(390, 162, '축 IT 등급', { a: 'm', size: 14, c: C.orange });
      s += t(240, 246, '50H7g6 처럼 빗금 없이 붙여 쓰기도 한다', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 264, s);
    } },

  /* ─────────── 5단원 축 · 베어링 ─────────── */
  shaft: { cards: ['축의 종류'],
    cap: '하중으로 가른 축 — 차축은 굽힘, 스핀들은 비틀림, 전동축은 둘 다 받는다. 베어링에 받쳐진 부분이 저널',
    draw: function () {
      function row(y, bend, twist) {
        var s = box(150, y - 8, 290, 16, { fill: C.grayL, r: 3 }) + box(185, y - 15, 24, 30, { fill: C.grayM, r: 3 }) + box(385, y - 15, 24, 30, { fill: C.grayM, r: 3 });
        if (bend) {
          s += arrow(160, y - 44, 160, y - 11, { c: C.red, w: 2.4, head: 11 }) + arrow(430, y - 44, 430, y - 11, { c: C.red, w: 2.4, head: 11 });
          s += path('M150,' + (y + 16) + ' Q297,' + (y - 12) + ' 440,' + (y + 16), { c: C.red, w: 1.2, dash: '5 4' });
        }
        if (twist) {
          s += F.route(arcPts(166, y, 10, 20, -1.7, 2.7, 10), { c: C.purple, w: 2.2, head: 10 });
          s += F.route(arcPts(424, y, 10, 20, 2.7, -1.7, 10), { c: C.purple, w: 2.2, head: 10 });
        }
        return s;
      }
      var s = row(75, 1, 0) + row(160, 0, 1) + row(245, 1, 1);
      s += t(20, 65, '차축', { b: 1, size: 17 }) + t(20, 89, '굽힘 모멘트', { size: 14, c: C.red });
      s += t(20, 150, '스핀들', { b: 1, size: 17 }) + t(20, 174, '비틀림 모멘트', { size: 14, c: C.purple });
      s += t(20, 235, '전동축', { b: 1, size: 17 }) + t(20, 259, '굽힘 + 비틀림', { size: 14, c: C.ink });
      s += callout(197, 62, 225, 32, '저널 (베어링에 받쳐진 부분)', { a: 's', size: 14 });
      return F.svg(480, 284, s);
    } },

  brg: { cards: ['베어링의 종류와 구조'],
    cap: '구름 베어링의 구조 — 내륜과 외륜 사이에 전동체(볼), 전동체의 간격은 리테이너가 일정하게 잡는다',
    draw: function () {
      var cx = 140, cy = 135, s = '';
      s += circle(cx, cy, 100, { fill: C.grayL, w: 2.2 }) + circle(cx, cy, 80, { fill: C.paper, w: 2 });
      s += circle(cx, cy, 65, { fill: 'none', c: C.purple, w: 4 });
      s += circle(cx, cy, 50, { fill: C.grayL, w: 2 }) + circle(cx, cy, 32, { fill: C.paper, w: 2.2 });
      for (var i = 0; i < 8; i++) {
        var a = i * Math.PI / 4;
        s += circle(cx + 65 * Math.cos(a), cy + 65 * Math.sin(a), 13, { fill: C.blueL, c: C.blue, w: 1.8 });
      }
      s += t(cx, cy, '축', { a: 'm', size: 15, c: C.sub });
      var pt = function (deg, r) { var a = deg * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
      var p1 = pt(-35, 90), p2 = pt(0, 65), p3 = pt(22.5, 65), p4 = pt(112.5, 41);
      s += callout(p1[0], p1[1], 270, 50, '외륜', { a: 's', b: 1 });
      s += callout(p2[0] + 13, p2[1], 270, 110, '전동체(볼)', { a: 's', b: 1, c: C.blue, tc: C.blue });
      s += callout(p3[0], p3[1], 270, 170, '리테이너 — 간격 유지', { a: 's', b: 1, c: C.purple, tc: C.purple, ans: 1 });
      s += callout(p4[0], p4[1], 115, 256, '내륜', { a: 'm', b: 1 });
      return F.svg(480, 272, s);
    } },

  roller: { cards: ['베어링의 종류와 구조'],
    cap: '롤러 베어링 셋(위쪽 반 단면) — 원통은 레디얼만, 원뿔은 레디얼과 스러스트를 동시에 받는다',
    draw: function () {
      var s = divider(162, 14, 240) + divider(318, 14, 240);
      function radial(c, top) { return arrow(c, top - 36, c, top - 4, { c: C.red, w: 2.4, head: 11 }); }
      /* 원통 */
      var c = 84;
      s += t(c, 26, '원통 롤러', { a: 'm', b: 1, size: 16, ans: 1 });
      s += box(c - 42, 96, 84, 16, { fill: C.grayL, r: 1 }) + box(c - 26, 112, 52, 34, { fill: C.blueL, c: C.blue, r: 2 }) + box(c - 42, 146, 84, 16, { fill: C.grayL, r: 1 });
      s += radial(c, 96) + arrow(c + 72, 154, c + 46, 154, { c: C.sub, w: 2, head: 10 }) + t(c + 60, 138, '✕', { a: 'm', b: 1, size: 16, c: C.red });
      s += line(c - 50, 184, c + 50, 184, { c: C.sub, w: 1, dash: 'center' });
      s += t(c, 208, '레디얼 하중 크다', { a: 'm', size: 13, b: 1 }) + t(c, 228, '스러스트 ✕', { a: 'm', size: 13, c: C.red });
      /* 니들 */
      c = 240;
      s += t(c, 26, '니들 롤러', { a: 'm', b: 1, size: 16, ans: 1 });
      s += box(c - 42, 110, 84, 16, { fill: C.grayL, r: 1 }) + box(c - 36, 126, 72, 12, { fill: C.blueL, c: C.blue, r: 2 }) + box(c - 42, 138, 84, 16, { fill: C.grayL, r: 1 });
      s += radial(c, 110) + line(c - 50, 184, c + 50, 184, { c: C.sub, w: 1, dash: 'center' });
      s += t(c, 208, '가늘고 긴 롤러', { a: 'm', size: 13, b: 1 }) + t(c, 228, '좁은 곳 · 피스톤 핀', { a: 'm', size: 13, c: C.sub });
      /* 원뿔 */
      c = 396;
      s += t(c, 26, '원뿔 롤러', { a: 'm', b: 1, size: 16, ans: 1 });
      s += poly([[c - 42, 132], [c + 42, 108], [c + 42, 96], [c - 42, 96]], { close: 1, fill: C.grayL, w: 1.6 });
      s += poly([[c - 25, 157.8], [c + 25, 150.3], [c + 25, 112.5], [c - 25, 127.5]], { close: 1, fill: C.blueL, c: C.blue, w: 1.6 });
      s += poly([[c - 42, 160], [c + 42, 148], [c + 42, 172], [c - 42, 172]], { close: 1, fill: C.grayL, w: 1.6 });
      s += radial(c, 96) + arrow(c + 74, 160, c + 46, 160, { c: C.orange, w: 2.4, head: 11 });
      s += line(c - 50, 184, c + 50, 184, { c: C.sub, w: 1, dash: 'center' });
      s += t(c, 208, '레디얼 + 스러스트', { a: 'm', size: 13, b: 1 }) + t(c, 228, '동시에 받는다', { a: 'm', size: 13, c: C.orange });
      /* 범례 */
      s += arrow(30, 254, 30, 272, { c: C.red, w: 2, head: 8 }) + t(40, 264, '레디얼 하중 (반지름 방향)', { a: 's', size: 13 });
      s += arrow(268, 264, 244, 264, { c: C.orange, w: 2, head: 8 }) + t(276, 264, '스러스트 하중 (축 방향)', { a: 's', size: 13 });
      return F.svg(480, 282, s);
    } },

  clr: { cards: ['베어링의 내부 클리어런스'],
    cap: '내부 클리어런스 — 외력이 없을 때 내륜과 외륜이 서로 움직일 수 있는 양 (반경 방향 · 축 방향)',
    draw: function () {
      function sec(c) {
        return box(c - 32, 48, 64, 18, { fill: C.grayL, r: 1 }) + circle(c, 78, 11, { fill: C.blueL, c: C.blue }) + box(c - 32, 92, 64, 14, { fill: C.grayL, r: 1 }) +
          box(c - 32, 134, 64, 14, { fill: C.grayL, r: 1 }) + circle(c, 162, 11, { fill: C.blueL, c: C.blue }) + box(c - 32, 174, 64, 18, { fill: C.grayL, r: 1 }) +
          line(c - 50, 120, c + 50, 120, { c: C.sub, w: 1, dash: 'center' });
      }
      var s = divider(240, 14, 200);
      s += t(120, 26, '반경 방향', { a: 'm', b: 1, size: 17 }) + t(360, 26, '축 방향', { a: 'm', b: 1, size: 17 });
      s += sec(120) + arrow(166, 94, 166, 146, { both: 1, c: C.blue, w: 2.2, head: 10 });
      s += sec(360) + arrow(330, 120, 390, 120, { both: 1, c: C.blue, w: 2.2, head: 10 });
      s += t(120, 212, '내륜이 위아래로 움직이는 양', { a: 'm', size: 14 }) + t(360, 212, '내륜이 축 방향으로 움직이는 양', { a: 'm', size: 14 });
      s += t(240, 240, '초기 클리어런스 > 조립한 뒤의 클리어런스', { a: 'm', size: 14, b: 1, c: C.orange, ans: 1 });
      return F.svg(480, 256, s);
    } },

  keyseal: { cards: ['키(key)와 오일 실'],
    cap: '키는 축과 보스(풀리 · 기어)를 함께 물려 돌린다 · 오일 실은 고무 립이 축에 닿아 이물질을 막는다',
    draw: function () {
      var s = divider(240, 14, 246);
      s += t(120, 22, '키 (축 단면)', { a: 'm', b: 1, size: 16 }) + t(360, 22, '오일 실 (반 단면)', { a: 'm', b: 1, size: 16 });
      /* 키 */
      s += circle(120, 135, 72, { fill: C.grayL, w: 2 }) + circle(120, 135, 42, { fill: C.grayM, w: 2.2 });
      s += poly([[111, 81], [129, 81], [132, 84], [132, 102], [129, 105], [111, 105], [108, 102], [108, 84]], { close: 1, fill: C.orangeL, c: C.orange, w: 1.8 });
      s += t(120, 150, '축', { a: 'm', size: 15, b: 1, halo: false }) + t(120, 190, '보스', { a: 'm', size: 14, halo: false });
      s += callout(112, 92, 60, 48, '키', { a: 'm', b: 1 }) + callout(131, 83, 180, 48, '모따기', { a: 'm', c: C.orange, tc: C.orange });
      s += t(120, 232, '규격품 · 모서리는 모따기', { a: 'm', size: 13, c: C.sub });
      /* 오일 실 */
      s += box(290, 62, 160, 30, { fill: C.grayL, r: 0, w: 1.6 }) + F.hatch(290, 62, 160, 30, { gap: 8, c: C.sub, w: 0.7 });
      s += box(270, 190, 190, 24, { fill: C.grayM, r: 0, w: 1.6 }) + t(310, 202, '축', { a: 'm', size: 14, b: 1, halo: false });
      s += poly([[320, 104], [398, 104], [398, 142], [384, 148], [374, 189], [364, 189], [356, 146], [320, 130]], { close: 1, fill: C.blueL, c: C.blue, w: 1.6 });
      s += box(320, 92, 90, 10, { fill: C.sub, r: 0, w: 1.2 }) + box(400, 92, 10, 50, { fill: C.sub, r: 0, w: 1.2 });
      s += circle(392, 168, 6, { fill: C.orangeL, c: C.orange, w: 1.6 });
      s += callout(368, 187, 300, 162, '립(고무)', { a: 'e', b: 1, c: C.blue, tc: C.blue }) +
        callout(396, 171, 440, 146, '스프링', { a: 'm' }) + callout(405, 96, 440, 46, '금속 케이스', { a: 'm' });
      s += t(360, 232, '조립 직전에 개봉 · 전용 공구로', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 250, s);
    } },

  /* ─────────── 6단원 조립 후 점검 ─────────── */
  torque: { cards: ['조립한 뒤 손으로 먼저 확인하는 것'],
    cap: '축을 손으로 천천히 돌려 본다 — 정상이면 회전 토크가 고르고, 조립 불량이면 도중에 걸린다 (모양만 보인 개념 그림)',
    draw: function () {
      var s = arrow(60, 200, 450, 200, { w: 1.6 }) + arrow(60, 200, 60, 44, { w: 1.6 });
      s += t(70, 40, '손에 걸리는 힘 (회전 토크)', { a: 's', size: 14 }) + t(450, 222, '축을 돌린 각도 →', { a: 'e', size: 14 });
      var ok = [], ng = [], bad = { 6: 70, 7: 82, 12: 64, 13: 90, 17: 76 };
      for (var i = 0; i <= 19; i++) {
        var x = 70 + i * 19;
        ok.push([x, 156 + 2 * Math.sin(i * 1.3)]);
        ng.push([x, bad[i] || (128 + 5 * Math.sin(i * 2.1))]);
      }
      s += poly(ok, { c: C.green, w: 2.6 }) + poly(ng, { c: C.red, w: 2.2 });
      s += t(440, 176, '정상 — 고르다', { a: 'e', size: 15, b: 1, c: C.green });
      s += callout(298, 66, 330, 44, '조립 불량 — 걸린다', { a: 's', size: 14, b: 1, c: C.red, tc: C.red });
      return F.svg(480, 236, s);
    } },

  check: { cards: ['동력을 넣은 뒤 확인하는 것'],
    cap: '동력을 넣은 뒤 — 이상음 · 온도 상승 · 진동 · 윤활유 누설 · 소모 전력을 보고, 결과를 기록표에 남긴다',
    draw: function () {
      var s = box(30, 115, 80, 60, { fill: C.grayL, label: '전동기', size: 15 });
      s += line(110, 145, 128, 145, { w: 3 }) + circle(140, 145, 14, { fill: C.grayM });
      s += line(140, 131, 260, 117, { w: 2.2 }) + line(140, 159, 260, 173, { w: 2.2 });
      s += circle(260, 145, 28, { fill: C.grayM }) + circle(260, 145, 6, { fill: C.paper });
      s += box(260, 139, 195, 12, { fill: C.grayL, r: 2 });
      s += box(300, 110, 110, 70, { fill: C.blueL, c: C.blue, r: 4 }) + F.hatch(300, 110, 110, 70, { gap: 10, c: C.blue, w: 0.6 });
      s += box(292, 136, 8, 18, { fill: C.greenL, c: C.green, r: 1, w: 1.2 }) + box(410, 136, 8, 18, { fill: C.greenL, c: C.green, r: 1, w: 1.2 });
      s += callout(70, 115, 70, 72, '소모 전력', { a: 'm', b: 1 });
      s += callout(330, 110, 310, 62, '이상음', { a: 'm', b: 1, c: C.red, tc: C.red });
      s += callout(385, 110, 405, 62, '온도 상승', { a: 'm', b: 1, c: C.red, tc: C.red });
      s += callout(355, 180, 350, 222, '진동', { a: 'm', b: 1 });
      s += callout(414, 154, 426, 204, '윤활유 누설', { a: 'm', b: 1 });
      s += t(150, 222, '→ 구동 상태 검사 기록표에 기록', { a: 'm', size: 14, b: 1, c: C.blue });
      return F.svg(480, 244, s);
    } },

  /* ─────────── 7단원 공압 · 유압의 특성 ─────────── */
  comp: { cards: ['공압의 특성 — 장점과 단점', '유압의 특성 — 장점과 단점'],
    cap: '같은 힘으로 눌러도 공기는 크게 줄어들고(압축성) 기름은 거의 줄지 않는다 — 공압 단점의 뿌리',
    draw: function () {
      function cyl(c, py, oil) {
        var s = path('M' + (c - 50) + ',70 V215 H' + (c + 50) + ' V70', { w: 2.2 });
        s += line(c - 50, 95, c + 50, 95, { c: C.sub, w: 1.2, dash: '5 4' });
        if (oil) s += box(c - 49, py + 12, 98, 202 - py, { fill: C.orangeL, c: 'none', r: 0, w: 0 });
        else for (var y = 172; y <= 208; y += 9) for (var x = c - 44; x <= c + 44; x += 11) s += dot(x, y, 2, C.sub);
        s += box(c - 48, py, 96, 12, { fill: C.grayM, r: 2 });
        s += arrow(c, py - 48, c, py - 4, { c: C.red, w: 3, head: 13 });
        return s;
      }
      var s = divider(240, 14, 270);
      s += t(125, 30, '공기 (공압)', { a: 'm', b: 1, size: 17 }) + t(355, 30, '기름 (유압)', { a: 'm', b: 1, size: 17 });
      s += cyl(125, 150, 0) + cyl(355, 100, 1);
      s += t(71, 95, '처음', { a: 'e', size: 13, c: C.sub }) + t(136, 116, '누른다', { a: 's', size: 14, c: C.red });
      s += t(125, 240, '눌리면 크게 줄어든다', { a: 'm', b: 1, size: 15 }) + t(355, 240, '거의 줄지 않는다', { a: 'm', b: 1, size: 15 });
      s += t(125, 264, '위치 제어성 · 응답성이 나쁘다', { a: 'm', size: 13, c: C.red }) + t(355, 264, '큰 힘 · 빠른 응답', { a: 'm', size: 13, c: C.green });
      return F.svg(480, 280, s);
    } },

  /* ─────────── 8단원 유체의 물리량과 법칙 ─────────── */
  phys: { cards: ['기본 물리량 다섯 가지'],
    cap: '단위 체적에 든 질량이 밀도, 중량이 비중량 · 압력은 면적에 수직으로 작용하는 힘 ÷ 면적',
    draw: function () {
      var s = divider(340, 14, 240);
      s += poly([[40, 95], [70, 65], [160, 65], [130, 95]], { close: 1, fill: C.blueL, c: C.blue, w: 1.6 }) +
        poly([[130, 95], [160, 65], [160, 155], [130, 185]], { close: 1, fill: C.blueL, c: C.blue, w: 1.6 }) +
        box(40, 95, 90, 90, { fill: C.blueL, c: C.blue, r: 0 }) + t(85, 140, '1 m³', { a: 'm', b: 1, size: 17, halo: false });
      s += t(100, 212, '단위 체적', { a: 'm', b: 1, size: 15 });
      s += arrow(172, 105, 202, 105, { c: C.blue, w: 2 }) + t(208, 105, '질량 → 밀도', { a: 's', b: 1, size: 15 });
      s += arrow(172, 150, 202, 150, { c: C.blue, w: 2 }) + t(208, 150, '중량 → 비중량', { a: 's', b: 1, size: 15 });
      s += t(208, 190, '비체적 = 밀도의 역수', { a: 's', size: 13, c: C.sub });
      /* 압력 */
      s += path('M360,90 V200 H450 V90', { w: 2.2 }) + box(361, 110, 88, 89, { fill: C.orangeL, c: 'none', r: 0, w: 0 });
      s += box(362, 98, 86, 12, { fill: C.grayM, r: 2 });
      s += arrow(405, 40, 405, 94, { c: C.red, w: 3, head: 13 }) + t(416, 54, 'F', { a: 's', b: 1, size: 17, c: C.red });
      s += arrow(386, 160, 364, 160, { c: C.blue, w: 1.6, head: 8 }) + arrow(424, 160, 446, 160, { c: C.blue, w: 1.6, head: 8 }) + arrow(405, 172, 405, 196, { c: C.blue, w: 1.6, head: 8 });
      s += t(405, 222, '압력 = F ÷ 면적', { a: 'm', b: 1, size: 15, c: C.blue });
      return F.svg(480, 240, s);
    } },

  boyle: { cards: ['유체 역학 이론 다섯 가지'],
    cap: '보일의 법칙 — 온도가 일정하면 압력을 5배로 하면 체적은 1/5 이 된다',
    draw: function () {
      function cyl(c, top, rows, step) {
        var s = path('M' + (c - 45) + ',50 V200 H' + (c + 45) + ' V50', { w: 2.2 });
        s += box(c - 43, top - 12, 86, 12, { fill: C.grayM, r: 2 });
        for (var r = 0; r < rows; r++) for (var x = c - 36; x <= c + 36; x += 12) s += dot(x, top + 6 + r * step, 2, C.blue);
        return s;
      }
      var s = cyl(130, 75, 6, 21) + cyl(350, 175, 6, 3.8);
      s += arrow(350, 120, 350, 160, { c: C.red, w: 3, head: 13 });
      s += arrow(195, 130, 285, 130, { c: C.ink, w: 2.2 }) + t(240, 114, '압력 ×5', { a: 'm', b: 1, c: C.red }) + t(240, 148, '체적 ×1/5', { a: 'm', b: 1, c: C.blue });
      s += t(130, 222, '압력 p · 체적 V', { a: 'm', size: 14 }) + t(350, 222, '압력 5p · 체적 V/5', { a: 'm', size: 14 });
      return F.svg(480, 238, s);
    } },

  pascal: { cards: ['유체 역학 이론 다섯 가지'],
    cap: '파스칼의 법칙 — 밀폐된 액체에 준 압력은 어디에나 같은 크기(200 kPa)로 전달된다 → 작은 힘이 큰 힘으로',
    draw: function () {
      var s = poly([[61, 92], [99, 92], [99, 181], [281, 181], [281, 102], [439, 102], [439, 209], [61, 209]], { close: 1, fill: C.orangeL, c: 'none', w: 0 });
      s += path('M60,70 V210 H440 V80 M100,70 V180 H280 V80', { w: 2.2 });
      s += box(61, 80, 38, 12, { fill: C.grayM, r: 2 }) + box(281, 90, 158, 12, { fill: C.grayM, r: 2 });
      s += arrow(80, 24, 80, 76, { c: C.red, w: 2.2, head: 11 }) + t(92, 34, '작은 힘', { a: 's', size: 14, c: C.red });
      s += arrow(360, 86, 360, 26, { c: C.red, w: 5, head: 18 }) + t(374, 40, '큰 힘', { a: 's', size: 16, b: 1, c: C.red });
      s += callout(86, 136, 116, 136, '200 kPa', { a: 's', size: 14, b: 1 }) + t(190, 196,'200 kPa', { a: 'm', size: 14, b: 1, halo: false }) +
        t(360, 152, '200 kPa', { a: 'm', size: 16, b: 1, halo: false });
      s += t(240, 234, '좁은 쪽을 누른 압력이 넓은 쪽에도 그대로', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 250, s);
    } },

  cont: { cards: ['유체 역학 이론 다섯 가지'],
    cap: '연속의 법칙 — 유량(단면적 × 속도)은 어디서나 같다. 단면적이 절반이면 속도는 2배',
    draw: function () {
      var s = poly([[30, 50], [220, 50], [270, 64.6], [450, 64.6], [450, 135.4], [270, 135.4], [220, 150], [30, 150]], { close: 1, fill: C.blueL, c: 'none', w: 0 });
      s += path('M30,50 H220 L270,64.6 H450', { w: 2.4 }) + path('M30,150 H220 L270,135.4 H450', { w: 2.4 });
      s += arrow(70, 100, 130, 100, { c: C.blue, w: 3, head: 13, flow: 1 }) + t(100, 80, '속도 v', { a: 'm', b: 1, size: 15, halo: false });
      s += arrow(300, 100, 420, 100, { c: C.blue, w: 3, head: 13, flow: 1 }) + t(360, 84, '속도 2v', { a: 'm', b: 1, size: 15, halo: false, c: C.red });
      s += t(125, 130, '단면적 A', { a: 'm', size: 14, halo: false }) + t(360, 120, '단면적 A/2', { a: 'm', size: 14, halo: false });
      s += t(240, 180, '유량 = 단면적 × 속도 → 어디서나 같다', { a: 'm', b: 1, size: 15 });
      return F.svg(480, 200, s);
    } },

  /* ─────────── 9단원 에너지 생성 시스템 ─────────── */
  air: { cards: ['공압에너지 생성 시스템 — 무엇이 어떤 순서로 붙는가'],
    cap: '공압에너지 생성 시스템 — 필터 → 압축기 → 냉각기 → 공기탱크 → 드라이어 → 필터 · 감압 · 윤활 → 차단 → 사용처 (기호는 10단원과 같다)',
    draw: function () {
      var Y1 = 70, Y2 = 185, P = 58 * 52 / 120, B = C.blue, s = '';
      function pipe(x1, y1, x2, y2) { return line(x1, y1, x2, y2, { c: B, w: 2 }) + midHead(x1, y1, x2, y2, B); }
      /* 1줄 (왼쪽 → 오른쪽) */
      s += line(8, Y1, 50 - P, Y1, { c: B, w: 2 }) + sym('필터', 50, Y1, 58);
      s += pipe(50 + P, Y1, 123, Y1);
      s += circle(140, Y1, 17, { fill: C.paper, c: B, w: 2.2 }) + poly([[157, Y1], [147, Y1 - 6], [147, Y1 + 6]], { close: 1, fill: C.paper, c: B, w: 1.8 });
      s += line(137, Y1 + 17, 137, 100, { w: 1.4 }) + line(143, Y1 + 17, 143, 100, { w: 1.4 }) + box(126, 100, 28, 22, { fill: C.grayL, label: 'M', size: 14 });
      s += pipe(157, Y1, 230 - P, Y1) + sym('냉각기', 230, Y1, 58);
      s += pipe(230 + P, Y1, 320 - P, Y1) + sym('공기 탱크', 320, Y1, 58) + sym('릴리프 밸브', 320, 49.6, 40);
      s += pipe(320 + P, Y1, 410 - P, Y1) + sym('공기 드라이어', 410, Y1, 58);
      /* 꺾어 내려 2줄 (오른쪽 → 왼쪽) */
      s += line(410 + P, Y1, 462, Y1, { c: B, w: 2 }) + pipe(462, Y1, 462, Y2) + line(462, Y2, 410 + P, Y2, { c: B, w: 2 });
      s += sym('드레인 부착 필터', 410, Y2, 58);
      s += pipe(410 - P, Y2, 334.6, Y2) + sym('감압 밸브', 320, Y2, 46, -90);
      s += line(303.9, Y2, 255.1, Y2, { c: B, w: 2 }) + midHead(292, Y2, 262, Y2, B) + sym('압력계', 280, 171.2, 46);
      s += sym('루브리케이터', 230, Y2, 58);
      s += pipe(230 - P, Y2, 167, Y2) + sym('스톱 밸브', 140, Y2, 58);
      s += F.route([[113, Y2], [90, Y2], [90, 205], [40.3, 205], [40.3, 183]], { c: B, w: 2, head: 9 }) + sym('편로드형 복동 실린더', 50, 165, 58);
      /* 이름표 */
      var L = { a: 'm', size: 13 };
      s += t(50, 108, '필터', L) + t(140, 38, '압축기', { a: 'm', size: 15, b: 1, c: B }) + t(140, 138, '전동기', L) +
        t(230, 108, '냉각기', L) + t(320, 108, '공기탱크', L) + t(345, 40, '릴리프밸브', { a: 's', size: 13 }) + t(410, 110, '에어\n드라이어', L);
      s += t(410, 234, '필터\n수동배수기', L) + t(314, 234, '감압밸브\n(압력게이지)', L) + t(230, 226, '윤활기', L) + t(140, 234, '셧오프\n밸브', L) + t(50, 230, '사용처', { a: 'm', size: 14, b: 1 });
      return F.svg(480, 252, s);
    } },

  oil: { cards: ['유압에너지 생성 시스템 — 무엇이 어떤 순서로 붙는가'],
    cap: '유압에너지 생성 시스템 — 기름은 일을 마치면 냉각기 · 복귀관 필터를 거쳐 탱크로 되돌아온다 (기호는 10단원과 같다)',
    draw: function () {
      var B = C.blue, G = C.green, s = '';
      /* 탱크 */
      s += box(131.5, 240, 197, 43.5, { fill: C.orangeL, c: 'none', r: 0, w: 0 }) + path('M130,225 V285 H330 V225 Z', { w: 2.4 });
      s += t(250, 270, '오일탱크', { a: 'm', size: 14, b: 1, halo: false });
      s += sym('필터', 170, 262, 40, 90) + line(128, 262, 152, 262, { c: C.sub, w: 1.2 }) + t(124, 262, '스트레이너', { a: 'e', size: 13, b: 1, ans: 1 });
      s += sym('필터', 250, 212, 34, 90) + t(266, 204, '에어브리더', { a: 's', size: 13 });
      /* 흡입 → 펌프 */
      s += F.route([[170, 244.7], [170, 212], [80, 212], [80, 203]], { w: 2, head: 9 });
      s += circle(80, 185, 17, { fill: C.paper, w: 2.2 }) + poly([[80, 168], [73, 180], [87, 180]], { close: 1, fill: C.ink, c: C.ink, w: 1 });
      s += box(22, 176, 30, 20, { fill: C.grayL, label: 'M', size: 14 }) + line(52, 182, 63, 182, { w: 1.4 }) + line(52, 190, 63, 190, { w: 1.4 });
      s += t(100, 190, '유압펌프', { a: 's', size: 13, b: 1 });
      /* 보내는 쪽 (파랑) */
      s += line(80, 168, 80, 70, { c: B, w: 2.2 }) + midHead(80, 150, 80, 130, B) + line(80, 70, 270.3, 70, { c: B, w: 2.2 }) + midHead(200, 70, 230, 70, B) + line(270.3, 70, 270.3, 55.4, { c: B, w: 2.2 });
      s += sym('압력계', 50, 125, 46, -90) + line(63.8, 125, 80, 125, { c: B, w: 2 }) + t(46, 150, '압력계', { a: 'm', size: 13 });
      s += line(80, 90, 190, 90, { c: B, w: 2 }) + line(190, 90, 190, 105.4, { c: B, w: 2 }) + sym('릴리프 밸브', 190, 120, 46, 180);
      s += line(190, 136.1, 190, 245, { c: G, w: 2 }) + midHead(190, 170, 190, 200, G) + t(212, 120, '릴리프밸브', { a: 's', size: 13 });
      s += sym('어큐뮬레이터', 150, 55.4, 46) + t(128, 44, '어큐뮬레이터', { a: 'e', size: 13 });
      s += sym('편로드형 복동 실린더', 280, 38, 58) + t(312, 34, '사용처', { a: 's', size: 14, b: 1 });
      /* 돌아오는 쪽 (초록) */
      s += poly([[287.7, 55.4], [287.7, 88], [420, 88], [420, 115.1]], { c: G, w: 2.2 }) + midHead(340, 88, 380, 88, G);
      s += sym('냉각기', 420, 135, 46, 90) + t(398, 135, '오일냉각기', { a: 'e', size: 13 });
      s += line(420, 154.9, 420, 170.1, { c: G, w: 2.2 }) + sym('필터', 420, 190, 46, 90) + t(398, 190, '복귀관 필터', { a: 'e', size: 13, b: 1, ans: 1 });
      s += poly([[420, 209.9], [420, 250], [331, 250]], { c: G, w: 2.2 }) + midHead(400, 250, 360, 250, G);
      /* 범례 */
      s += line(40, 306, 70, 306, { c: B, w: 2.4 }) + t(76, 306, '보내는 기름', { a: 's', size: 13 }) +
        line(200, 306, 230, 306, { c: G, w: 2.4 }) + t(236, 306, '돌아오는 기름', { a: 's', size: 13 });
      return F.svg(480, 322, s);
    } },

  /* ─────────── 10단원 공유압 기호 ─────────── */
  symrule: { cards: ['기호를 읽는 두 가지 약속'],
    cap: '두 가지 약속 — 까만 삼각형은 유압, 빈 삼각형은 공기압 · 삼각형이 밖을 향하면 펌프, 안을 향하면 모터',
    draw: function () {
      var s = divider(240, 14, 262) + line(14, 140, 466, 140, { c: C.grayM, w: 1.4, dash: '6 5' });
      s += poly([[80, 45], [80, 95], [126, 70]], { close: 1, fill: C.ink, c: C.ink, w: 2 }) + line(126, 70, 170, 70, { w: 2.2 });
      s += poly([[320, 45], [320, 95], [366, 70]], { close: 1, fill: C.paper, w: 2.2 }) + line(366, 70, 410, 70, { w: 2.2 });
      s += t(120, 120, '까만 삼각형 = 유압', { a: 'm', b: 1, size: 16 }) + t(360, 120, '빈 삼각형 = 공기압', { a: 'm', b: 1, size: 16 });
      s += line(90, 155, 90, 183, { w: 2.2 }) + circle(90, 215, 32, { fill: C.paper, w: 2.2 }) + poly([[90, 183], [80, 200], [100, 200]], { close: 1, fill: C.ink, c: C.ink, w: 1 });
      s += line(330, 155, 330, 183, { w: 2.2 }) + circle(330, 215, 32, { fill: C.paper, w: 2.2 }) + poly([[320, 186], [340, 186], [330, 203]], { close: 1, fill: C.ink, c: C.ink, w: 1 });
      s += t(134, 202, '밖을 향함', { a: 's', size: 14 }) + t(134, 228, '= 펌프', { a: 's', b: 1, size: 17, c: C.blue });
      s += t(374, 202, '안을 향함', { a: 's', size: 14 }) + t(374, 228, '= 모터', { a: 's', b: 1, size: 17, c: C.blue });
      return F.svg(480, 262, s);
    } },

  /* ─────────── 11단원 시퀀스 제어 ─────────── */
  seq: { cards: ['시퀀스 제어란 · 구성 요소'],
    cap: '시퀀스 제어의 구성 요소 — 조작부 · 검출부의 신호를 제어부가 받아 구동부와 표시부를 움직인다',
    draw: function () {
      function blk(x, y, name, sub, main) {
        return box(x, y, 120, 54, { fill: main ? C.blueL : C.grayL, c: main ? C.blue : C.ink }) +
          t(x + 60, y + 18, name, { a: 'm', b: 1, size: 16, halo: false, c: main ? C.blue : C.ink }) + t(x + 60, y + 39, sub, { a: 'm', size: 13, halo: false, c: C.sub });
      }
      var s = blk(20, 30, '조작부', '푸시버튼 · 스위치') + blk(20, 150, '검출부', '센서 · 리밋 스위치') +
        blk(180, 90, '제어부', '릴레이 · PLC', 1) + blk(340, 30, '구동부', '모터 · 실린더') + blk(340, 150, '표시부', '램프 · 부저');
      s += arrow(140, 57, 180, 105, { w: 2 }) + arrow(140, 177, 180, 129, { w: 2 }) + arrow(300, 105, 340, 57, { w: 2 }) + arrow(300, 129, 340, 177, { w: 2 });
      s += t(240, 228, '정해진 순서에 따라 단계를 차례로 진행한다', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 244, s);
    } },

  loop: { cards: ['시퀀스 제어란 · 구성 요소'],
    cap: '개방회로와 폐회로 — 둘을 가르는 것은 되먹임(피드백)이 있는가 하나뿐',
    draw: function () {
      var s = t(16, 28, '개방회로', { b: 1, size: 16 }) + t(16, 136, '폐회로', { b: 1, size: 16 });
      s += arrow(30, 70, 140, 70, { w: 2 }) + t(60, 56, '입력', { a: 'm', size: 13, c: C.sub });
      s += box(140, 48, 100, 44, { fill: C.grayL, label: '제어기', size: 15 }) + arrow(240, 70, 290, 70, { w: 2 });
      s += box(290, 48, 110, 44, { fill: C.grayL, label: '제어 대상', size: 15 }) + arrow(400, 70, 462, 70, { w: 2 }) + t(440, 56, '출력', { a: 'm', size: 13, c: C.sub });
      s += arrow(30, 180, 92, 180, { w: 2 }) + t(56, 166, '입력', { a: 'm', size: 13, c: C.sub });
      s += circle(105, 180, 13, { fill: C.paper, w: 2 }) + t(105, 158, '비교', { a: 'm', size: 13, c: C.sub }) + arrow(118, 180, 150, 180, { w: 2 });
      s += box(150, 158, 90, 44, { fill: C.grayL, label: '제어기', size: 15 }) + arrow(240, 180, 290, 180, { w: 2 });
      s += box(290, 158, 110, 44, { fill: C.grayL, label: '제어 대상', size: 15 }) + arrow(400, 180, 462, 180, { w: 2 }) + t(440, 166, '출력', { a: 'm', size: 13, c: C.sub });
      s += F.route([[428, 180], [428, 228], [105, 228], [105, 195]], { c: C.green, w: 2.6, head: 11 }) + t(266, 216, '되먹임(피드백)', { a: 'm', b: 1, size: 15, c: C.green });
      return F.svg(480, 244, s);
    } },

  abc: { cards: ['스위치 — 유접점 스위치와 검출 스위치'],
    cap: '푸시버튼의 a접점 · b접점 · c접점 — 누르기 전과 누른 뒤 (초록 = 전기가 통한다)',
    draw: function () {
      function sw(c, y, type, pressed) {
        var P = [c - 38, y], s = line(c - 56, y, c - 38, y, { w: 2 }), on = false, end;
        if (type === 'a') { end = pressed ? [c + 30, y] : [c + 28, y - 22]; on = pressed; }
        if (type === 'b') { end = pressed ? [c + 28, y + 22] : [c + 30, y]; on = !pressed; }
        if (type === 'c') { end = pressed ? [c + 30, y - 16] : [c + 30, y + 16]; on = true; }
        if (type === 'c') {
          s += line(c + 30, y - 16, c + 52, y - 16, { w: 2, c: pressed ? C.green : C.ink }) + line(c + 30, y + 16, c + 52, y + 16, { w: 2, c: pressed ? C.ink : C.green }) +
            circle(c + 30, y - 16, 4, { fill: C.paper, w: 1.6 }) + circle(c + 30, y + 16, 4, { fill: C.paper, w: 1.6 }) +
            t(c + 58, y - 16, 'a', { a: 's', size: 13, c: C.sub }) + t(c + 58, y + 16, 'b', { a: 's', size: 13, c: C.sub });
        } else {
          s += line(c + 30, y, c + 52, y, { w: 2, c: on ? C.green : C.ink }) + circle(c + 30, y, 4, { fill: C.paper, w: 1.6 });
        }
        s += line(P[0], P[1], end[0], end[1], { c: on ? C.green : C.sub, w: 3.4 }) + circle(P[0], P[1], 4, { fill: C.ink, c: C.ink, w: 1 });
        return s;
      }
      var s = line(12, 145, 468, 145, { c: C.grayM, w: 1.4, dash: '6 5' });
      s += t(12, 100, '누르기 전', { a: 's', size: 14, b: 1 }) + t(12, 190, '누른 뒤', { a: 's', size: 14, b: 1 });
      [[140, 'a', 'a접점', '평소 열림'], [270, 'b', 'b접점', '평소 닫힘'], [395, 'c', 'c접점', 'a와 b를 바꿔 잡음']].forEach(function (k) {
        s += t(k[0], 34, k[2], { a: 'm', b: 1, size: 17 }) + t(k[0], 56, k[3], { a: 'm', size: 13, c: C.sub });
        s += sw(k[0], 100, k[1], false) + sw(k[0], 190, k[1], true);
      });
      s += line(170, 246, 200, 246, { c: C.green, w: 3.4 }) + t(208, 246, '= 전기가 통한다', { a: 's', size: 14 });
      return F.svg(480, 264, s);
    } },

  detect: { cards: ['스위치 — 유접점 스위치와 검출 스위치'],
    cap: '검출 스위치 — 물체에 닿아야 검출하면 접촉형, 닿지 않아도 검출하면 비접촉형',
    draw: function () {
      var s = divider(235, 14, 236);
      s += t(120, 26, '접촉형', { a: 'm', b: 1, size: 17 }) + t(360, 26, '비접촉형', { a: 'm', b: 1, size: 17 });
      s += box(40, 120, 70, 56, { fill: C.grayL, r: 4 }) + line(95, 120, 128, 86, { w: 3 }) + circle(128, 86, 9, { fill: C.grayM, w: 1.6 });
      s += box(137, 60, 80, 30, { fill: C.orangeL, c: C.orange, label: '물체', size: 14 }) + arrow(206, 48, 156, 48, { c: C.orange, w: 2, head: 10 });
      s += t(75, 196, '리밋 스위치', { a: 'm', size: 14, b: 1, ans: 1 }) + t(120, 224, '닿아야 검출', { a: 'm', size: 15, b: 1, c: C.blue });
      s += box(255, 62, 70, 28, { fill: C.grayL, r: 4 }) + line(325, 64, 325, 88, { c: C.blue, w: 3 });
      s += path('M333,66 Q342,76 333,86', { c: C.blue, w: 1.4, dash: '3 3' }) + path('M342,60 Q356,76 342,92', { c: C.blue, w: 1.4, dash: '3 3' });
      s += box(372, 56, 56, 40, { fill: C.orangeL, c: C.orange, label: '물체', size: 14 });
      s += t(290, 112, '근접 스위치', { a: 'm', size: 14, b: 1, ans: 1 });
      s += box(255, 150, 40, 26, { fill: C.grayL, label: '투광', size: 13 }) + box(420, 150, 40, 26, { fill: C.grayL, label: '수광', size: 13 });
      s += line(295, 163, 345, 163, { c: C.red, w: 2, dash: '6 4' }) + box(345, 142, 40, 42, { fill: C.orangeL, c: C.orange, r: 4 });
      s += t(357, 200, '광전 스위치 (빛을 가리면 검출)', { a: 'm', size: 13, b: 1, ans: 1 }) + t(360, 224, '닿지 않아도 검출', { a: 'm', size: 15, b: 1, c: C.blue });
      return F.svg(480, 240, s);
    } },

  timer: { cards: ['릴레이와 타이머'],
    cap: '타이머의 동작 — 앞말은 전원을 넣을 때, 뒷말은 끊을 때. 한시 = 설정 시간 T 를 기다린다, 순시 = 곧바로',
    draw: function () {
      var s = '', on = 200, off = 350, T = 60;
      s += line(on, 44, on, 250, { c: C.grayM, w: 1.2, dash: '4 4' }) + line(off, 44, off, 250, { c: C.grayM, w: 1.2, dash: '4 4' });
      s += t(on, 30, '전원 넣음', { a: 'm', size: 13, b: 1 }) + t(off, 30, '전원 끊음', { a: 'm', size: 13, b: 1 });
      s += t(12, 70, '전원(코일)', { a: 's', b: 1, size: 15 });
      s += poly([[160, 80], [on, 80], [on, 56], [off, 56], [off, 80], [460, 80]], { w: 2.4 });
      s += t(12, 150, '한시동작\n순시복귀', { a: 's', b: 1, size: 15, c: C.blue, ans: 1 });
      s += poly([[160, 160], [on + T, 160], [on + T, 136], [off, 136], [off, 160], [460, 160]], { c: C.blue, w: 2.6 });
      s += arrow(on, 172, on + T, 172, { both: 1, w: 1, head: 7 }) + t(on + T / 2, 186, 'T', { a: 'm', size: 14, b: 1 });
      s += t(12, 230, '순시동작\n한시복귀', { a: 's', b: 1, size: 15, c: C.orange, ans: 1 });
      s += poly([[160, 240], [on, 240], [on, 216], [off + T, 216], [off + T, 240], [460, 240]], { c: C.orange, w: 2.6 });
      s += arrow(off, 252, off + T, 252, { both: 1, w: 1, head: 7 }) + t(off + T / 2, 266, 'T', { a: 'm', size: 14, b: 1 });
      return F.svg(480, 280, s);
    } },

  solid: { cards: ['유접점 제어회로와 무접점 제어회로'],
    cap: '유접점은 코일이 쇠 접점을 끌어당겨 닿게 하고, 무접점은 움직이는 부분 없이 반도체가 켠다',
    draw: function () {
      var s = divider(240, 14, 262);
      s += t(120, 26, '유접점 — 릴레이', { a: 'm', b: 1, size: 16 }) + t(360, 26, '무접점 — 반도체', { a: 'm', b: 1, size: 16 });
      /* 릴레이 */
      s += box(40, 120, 56, 72, { fill: C.orangeL, c: C.orange, r: 4 });
      for (var i = 0; i < 6; i++) s += line(40, 127 + i * 11, 96, 133 + i * 11, { c: C.orange, w: 1.2 });
      s += box(56, 112, 24, 8, { fill: C.grayM, r: 1, w: 1.2 }) + line(52, 192, 52, 214, { w: 1.6 }) + line(84, 192, 84, 214, { w: 1.6 });
      s += line(30, 104, 150, 100, { w: 4 }) + circle(30, 104, 4, { fill: C.ink, c: C.ink, w: 1 }) + circle(150, 100, 4, { fill: C.paper, w: 1.6 });
      s += line(150, 120, 190, 120, { w: 2.2 }) + circle(150, 120, 4, { fill: C.paper, w: 1.6 });
      s += arrow(68, 64, 68, 96, { c: C.red, w: 2.4, head: 11 }) + t(78, 70, '당긴다', { a: 's', size: 14, c: C.red });
      s += callout(96, 165, 132, 172, '코일(전자석)', { a: 's' }) + callout(150, 110, 170, 80, '쇠 접점', { a: 's', b: 1 });
      /* 트랜지스터 */
      s += circle(360, 125, 38, { fill: C.paper, w: 2 }) + line(348, 105, 348, 145, { w: 3.4 }) + line(300, 125, 348, 125, { w: 2 });
      s += line(348, 114, 375, 95, { w: 2 }) + line(375, 95, 375, 70, { w: 2 }) + line(348, 136, 375, 155, { w: 2 }) + line(375, 155, 375, 184, { w: 2 });
      s += arrow(356, 142, 372, 153, { w: 1.4, head: 10 });
      s += t(296, 116, 'B', { a: 'e', size: 14 }) + t(384, 76, 'C', { a: 's', size: 14 }) + t(384, 180, 'E', { a: 's', size: 14 });
      s += t(360, 204, '트랜지스터 — 움직이는 부분 없음', { a: 'm', size: 13, c: C.sub });
      s += t(120, 236, '접점이 닳는다 · 느리다', { a: 'm', size: 14 }) + t(120, 256, '노이즈 · 온도에 강하다', { a: 'm', size: 13, c: C.green });
      s += t(360, 236, '빠르다 · 수명이 길다', { a: 'm', size: 14 }) + t(360, 256, '노이즈 · 온도에 약하다', { a: 'm', size: 13, c: C.red });
      return F.svg(480, 272, s);
    } },

  selfhold: { cards: ['각종 회로와 플립플롭'],
    cap: '자기유지회로 — PB1 을 눌렀다 떼도 R 의 a접점(초록)이 전류 길을 붙잡아 R 이 계속 켜져 있다. 끄는 것은 PB2',
    draw: function () {
      var G = C.green, s = line(40, 50, 40, 200, { w: 2.8 }) + line(440, 50, 440, 200, { w: 2.8 });
      s += wire([[40, 90], [114, 90]]) + cA(120, 90) + wire([[126, 90], [224, 90]]) + cB(230, 90) + wire([[236, 90], [356, 90]]) + coil(370, 90) + wire([[384, 90], [440, 90]]);
      s += wire([[80, 90], [80, 160], [114, 160]], G, 2.6) + cA(120, 160, G) + wire([[126, 160], [170, 160], [170, 90]], G, 2.6);
      s += dot(80, 90, 4) + dot(170, 90, 4);
      s += t(120, 60, 'PB1 (시작)', { a: 'm', size: 14, b: 1 }) + t(230, 60, 'PB2 (정지)', { a: 'm', size: 14, b: 1 }) + t(370, 60, 'R (릴레이)', { a: 'm', size: 14, b: 1 });
      s += t(370, 91, 'R', { a: 'm', size: 14, b: 1, halo: false });
      s += t(125, 188, 'R — 자기유지 접점', { a: 'm', size: 14, b: 1, c: G });
      s += t(318, 150, 'PB2 는 b접점 — 누르면 끊겨 R 이 꺼진다', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 216, s);
    } },

  interlock: { cards: ['각종 회로와 플립플롭'],
    cap: '인터록회로 — 한쪽 릴레이가 켜지면 상대 쪽 줄의 b접점(빨강)이 열려, 둘이 동시에 켜지지 못한다',
    draw: function () {
      var R = C.red, s = line(40, 44, 40, 184, { w: 2.8 }) + line(440, 44, 440, 184, { w: 2.8 });
      [[80, 'PB1', 'R2', 'R1'], [160, 'PB2', 'R1', 'R2']].forEach(function (k) {
        var y = k[0];
        s += wire([[40, y], [104, y]]) + cA(110, y) + wire([[116, y], [214, y]]) + cB(220, y, R) + wire([[226, y], [356, y]]) + coil(370, y) + wire([[384, y], [440, y]]);
        s += t(110, y - 26, k[1], { a: 'm', size: 14, b: 1 }) + t(220, y - 26, k[2] + ' b접점', { a: 'm', size: 14, b: 1, c: R }) + t(370, y + 1, k[3], { a: 'm', size: 14, b: 1, halo: false });
      });
      s += line(356, 90, 234, 150, { c: R, w: 1.2, dash: '4 4' }) + line(356, 150, 234, 90, { c: R, w: 1.2, dash: '4 4' });
      s += t(240, 208, '한쪽이 켜지면 상대 쪽 b접점이 열린다 → 동시에 켜지지 못한다', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 224, s);
    } }

  };
})();
