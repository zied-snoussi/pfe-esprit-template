// Helpers to describe Excalidraw diagrams as "skeleton" elements
// (converted to full elements in the browser by convertToExcalidrawElements).
const C = {
  blue: '#a5d8ff', green: '#b2f2bb', yellow: '#fff3bf', red: '#ffc9c9',
  violet: '#e5dbff', gray: '#f1f3f5', orange: '#ffd8a8', teal: '#c3fae8',
  white: '#ffffff', pink: '#fcc2d7',
};
const STROKE = { orange: '#e8590c', red: '#e03131', gray: '#868e96', blue: '#1971c2', violet: '#7048e8', green: '#2f9e44' };

function createDiagram() {
  const els = [];
  const boxes = {};
  let n = 0;
  const nid = (p) => `${p}_${++n}`;

  function box(id, x, y, w, h, text, bg = C.gray, o = {}) {
    const el = {
      type: o.shape || 'rectangle', id, x, y, width: w, height: h,
      backgroundColor: bg, fillStyle: 'solid', strokeWidth: o.sw || 1,
      strokeColor: o.stroke || '#1e1e1e', strokeStyle: o.dashed ? 'dashed' : 'solid',
      roughness: 1, roundness: o.shape === 'ellipse' || o.shape === 'diamond' ? null : { type: 3 },
      label: { text, fontSize: o.fs || 16, fontFamily: 2, textAlign: 'center', verticalAlign: 'middle' },
    };
    els.push(el);
    boxes[id] = { x, y, w, h };
    return id;
  }

  // Grouping area: transparent dashed rectangle + title at its top-left.
  function zone(id, x, y, w, h, title, stroke = STROKE.gray, bg = 'transparent', tp = {}) {
    els.push({
      type: 'rectangle', id, x, y, width: w, height: h, backgroundColor: bg,
      fillStyle: 'solid', strokeColor: stroke, strokeStyle: 'dashed', strokeWidth: 2,
      roughness: 1, roundness: { type: 3 }, opacity: 100,
    });
    boxes[id] = { x, y, w, h };
    text(tp.x ?? x + 14, tp.y ?? y + 10, title, 18, { color: stroke, bold: true });
    return id;
  }

  function text(x, y, t, fs = 16, o = {}) {
    els.push({ type: 'text', id: nid('t'), x, y, text: t, fontSize: fs, fontFamily: 2, strokeColor: o.color || '#1e1e1e', textAlign: o.align || 'left' });
  }

  // Arrow between two boxes, attached to the facing edges.
  function arrow(from, to, label, o = {}) {
    const a = boxes[from], b = boxes[to];
    const ac = { x: a.x + a.w / 2, y: a.y + a.h / 2 }, bc = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
    let s, e;
    const vertical = o.dir ? o.dir === 'v' : (b.y >= a.y + a.h || a.y >= b.y + b.h);
    if (vertical) {
      const lo = Math.max(a.x, b.x), hi = Math.min(a.x + a.w, b.x + b.w);
      const sx = o.sx ?? (lo < hi ? (lo + hi) / 2 : ac.x), ex = o.ex ?? (lo < hi ? (lo + hi) / 2 : bc.x);
      if (bc.y > ac.y) { s = { x: sx, y: a.y + a.h }; e = { x: ex, y: b.y }; }
      else { s = { x: sx, y: a.y }; e = { x: ex, y: b.y + b.h }; }
    } else {
      const lo = Math.max(a.y, b.y), hi = Math.min(a.y + a.h, b.y + b.h);
      const sy = o.sy ?? (lo < hi ? (lo + hi) / 2 : ac.y), ey = o.ey ?? (lo < hi ? (lo + hi) / 2 : bc.y);
      if (bc.x > ac.x) { s = { x: a.x + a.w, y: sy }; e = { x: b.x, y: ey }; }
      else { s = { x: a.x, y: sy }; e = { x: b.x + b.w, y: ey }; }
    }
    const el = {
      type: 'arrow', id: nid('a'), x: s.x, y: s.y,
      points: [[0, 0], [e.x - s.x, e.y - s.y]], width: Math.abs(e.x - s.x), height: Math.abs(e.y - s.y),
      strokeColor: o.color || '#1e1e1e', strokeStyle: o.dashed ? 'dashed' : 'solid', strokeWidth: o.sw || 1.5,
      roughness: 1, endArrowhead: o.noHead ? null : 'arrow', startArrowhead: o.both ? 'arrow' : null,
    };
    if (label) el.label = { text: label, fontSize: o.fs || 13, fontFamily: 2 };
    els.push(el);
  }

  function legend(x, y, items) {
    text(x, y, 'Légende', 16, { bold: true });
    items.forEach(([bg, label, o = {}], i) => {
      box(nid('lg'), x, y + 30 + i * 40, 36, 26, '', bg, o);
      text(x + 48, y + 34 + i * 40, label, 15);
    });
  }

  return { els, box, zone, text, arrow, legend };
}

module.exports = { C, STROKE, createDiagram };
