// Prototype basse fidélité (maquettes fil de fer) de MediBook, données fictives :
// A · parcours patient sur mobile, B · espace clinique (web), C · pilotage et console (web).
// Pour l'adapter : gardez les aides (phone, webScreen, btn, table...) et réécrivez les écrans.
const { createDiagram } = require('./lib');

const BLUE = '#1f6feb', TINT = '#dbe4ff', GREY = '#868e96', LINE = '#ced4da', INK = '#1e1e1e';
const RED = '#e03131', REDT = '#ffe3e3', GREEN = '#2f9e44', GREENT = '#d3f9d8', ORANGE = '#f08c00', ORANGET = '#fff3bf';
const VIOLET = '#7048e8', VIOLETT = '#e5dbff';
const NAV_CLINIQUE = ['Agenda', 'Rendez-vous', 'Praticiens', 'Horaires', 'Patients', 'Tableau de bord', 'Abonnement', 'Réglages'];
const NAV_CONSOLE = ['Cliniques', 'Offres', 'Factures', 'Supervision', 'Journal d\'audit', 'Réglages'];

function prototype() {
  const d = createDiagram();
  const id = (p) => d.nid(p);
  const T = (x, y, t, fs = 13, color = INK) => d.text(x, y, t, fs, { color });
  const R = (x, y, w, h, bg = '#ffffff', o = {}) => d.box(id('r'), x, y, w, h, o.text || '', bg,
    { stroke: o.stroke || LINE, fs: o.fs || 13, sw: o.sw || 1, shape: o.shape, align: o.align, textColor: o.color, dashed: o.dashed });
  const btn = (x, y, w, t, kind = 'default') => {
    const [bg, st, c] = { primary: [BLUE, BLUE, '#ffffff'], danger: [REDT, RED, RED], ok: [GREENT, GREEN, GREEN], default: ['#f8f9fa', GREY, INK] }[kind];
    R(x, y, w, 30, bg, { stroke: st, text: t, color: c });
  };
  const pill = (x, y, t, bg, c) => R(x, y, t.length * 7 + 16, 22, bg, { stroke: c, text: t, color: c, fs: 12 });
  const line = (x1, y1, x2, y2, color = LINE) => {
    d.path([[x1, y1], [x2, y2]], null, { color, sw: 1 });
    d.els[d.els.length - 1].endArrowhead = null;
  };
  const table = (x, y, widths, rows, rh = 28) => {
    const W = widths.reduce((a, b) => a + b, 0);
    rows.forEach((row, i) => {
      if (i === 0) R(x, y, W, rh, '#f1f3f5');
      let cx = x;
      row.forEach((cell, k) => {
        const [txt, color] = Array.isArray(cell) ? cell : [cell, i === 0 ? GREY : INK];
        T(cx + 6, y + i * rh + 7, txt, 12, color);
        cx += widths[k];
      });
      if (i) line(x, y + i * rh, x + W, y + i * rh);
    });
  };

  // ---------------------------------------------------------------- cadres d'écran
  function phone(code, title, sub, x, y) {
    const w = 300, h = 600;
    T(x, y - 70, `${code}  ${title}`, 22);
    T(x, y - 36, sub, 13, GREY);
    d.box(id('f'), x, y, w, h, '', '#ffffff', { sw: 2.5 });
    T(x + 16, y + 8, '9:41', 11, GREY);
    T(x + w - 70, y + 8, '▮▮▮ 85 %', 11, GREY);
    R(x, y + 28, w, 44, BLUE, { stroke: BLUE });
    T(x + 16, y + 40, '✚ MediBook', 18, '#ffffff');
    R(x + w / 2 - 50, y + h - 14, 100, 5, '#adb5bd', { stroke: '#adb5bd' });
    return { x: x + 16, y: y + 86, w: w - 32, bottom: y + h - 30 };
  }
  function webScreen(code, title, sub, x, y, brand, nav, active, picker = 'Clinique Les Jasmins ▾', w = 680, h = 440) {
    T(x, y - 62, `${code}  ${title}`, 22);
    T(x, y - 30, sub, 13, GREY);
    d.box(id('f'), x, y, w, h, '', '#ffffff', { sw: 2 });
    R(x, y, w, 38, '#f1f3f5');
    T(x + 14, y + 9, brand, 17, BLUE);
    T(x + w - 230, y + 11, picker, 13);
    R(x + w - 34, y + 7, 24, 24, '#e9ecef', { shape: 'ellipse', stroke: GREY });
    R(x, y + 38, 140, h - 38, '#f8f9fa');
    nav.forEach((m, i) => {
      if (m === active) R(x + 6, y + 46 + i * 28, 128, 24, TINT, { stroke: TINT });
      T(x + 14, y + 50 + i * 28, m, 13, m === active ? BLUE : INK);
    });
    return { x: x + 158, y: y + 54, w: w - 176 };
  }
  const flow = (x1, x2, y, label) => d.path([[x1, y], [x2, y]], label, { color: BLUE, sw: 2, fs: 13 });

  // ---------------------------------------------------------------- titres
  d.text(0, -330, 'Prototype · MediBook (maquettes basse fidélité, données fictives)', 36);
  d.text(0, -280, 'A · Parcours patient (mobile)   ·   B · Espace clinique (web)   ·   C · Pilotage et console (web)', 18, { color: GREY });
  const PX = [0, 420, 840, 1260], B0 = 880, C0 = 1540, COL = 790;
  d.text(0, -190, 'A · Parcours patient : réserver en moins de 2 minutes', 28, { color: BLUE });
  d.text(0, B0 - 140, 'B · Espace clinique : secrétariat et praticiens', 28, { color: GREEN });
  d.text(0, C0 - 140, 'C · Pilotage de la clinique et console Nova Solutions', 28, { color: VIOLET });

  // ---------------------------------------------------------------- A1 recherche
  let c = phone('A1', 'Rechercher', 'Spécialité, ville, disponibilité', PX[0], 0);
  R(c.x, c.y, c.w, 34, '#ffffff', { text: '🔍  Cardiologue', align: 'left', color: INK });
  R(c.x, c.y + 42, c.w, 34, '#ffffff', { text: '📍  Tunis', align: 'left', color: INK });
  btn(c.x, c.y + 86, c.w, 'Rechercher', 'primary');
  T(c.x, c.y + 130, '3 praticiens · triés par disponibilité', 12, GREY);
  [['Dr Prénom NOM', 'Cardiologue · Les Jasmins', 'Demain 9:30'], ['Dr Prénom NOM', 'Cardiologue · Clinique du Lac', 'Jeudi 14:00'],
    ['Dr Prénom NOM', 'Cardiologue · Centre Carthage', 'Lundi 8:45']].forEach(([n, s, slot], i) => {
    const y = c.y + 154 + i * 108;
    R(c.x, y, c.w, 98, '#ffffff', { stroke: GREY });
    R(c.x + 10, y + 12, 40, 40, '#e9ecef', { shape: 'ellipse', stroke: GREY });
    T(c.x + 60, y + 12, n, 14);
    T(c.x + 60, y + 32, s, 11, GREY);
    pill(c.x + 60, y + 58, `Prochain : ${slot}`, GREENT, GREEN);
  });

  // ---------------------------------------------------------------- A2 créneau
  c = phone('A2', 'Choisir un créneau', 'Les créneaux viennent des horaires du praticien', PX[1], 0);
  T(c.x, c.y, 'Dr Prénom NOM · Cardiologue', 14);
  R(c.x, c.y + 26, c.w, 32, '#ffffff', { text: 'Motif : Première consultation ▾', align: 'left', fs: 12 });
  ['Lun 15', 'Mar 16', 'Mer 17', 'Jeu 18'].forEach((j, i) => R(c.x + i * 68, c.y + 70, 62, 40, i === 1 ? TINT : '#f8f9fa',
    { stroke: i === 1 ? BLUE : LINE, text: j, color: i === 1 ? BLUE : INK, fs: 12 }));
  const slots = ['8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
  const taken = new Set([0, 3, 4, 8]);
  slots.forEach((s, i) => {
    const x = c.x + (i % 3) * 90, y = c.y + 126 + Math.floor(i / 3) * 44;
    if (i === 2) R(x, y, 82, 34, BLUE, { stroke: BLUE, text: s, color: '#ffffff' });
    else if (taken.has(i)) R(x, y, 82, 34, '#f1f3f5', { stroke: LINE, text: s, color: '#adb5bd' });
    else R(x, y, 82, 34, '#ffffff', { stroke: BLUE, text: s, color: BLUE });
  });
  T(c.x, c.y + 314, 'Gris : déjà réservé', 11, GREY);
  btn(c.x, c.bottom - 60, c.w, 'Continuer · mardi 9:30', 'primary');

  // ---------------------------------------------------------------- A3 confirmation
  c = phone('A3', 'Confirmer', 'Récapitulatif avant réservation', PX[2], 0);
  R(c.x, c.y, c.w, 190, '#f8f9fa');
  [['Date', 'Mardi 16 mars 2027'], ['Heure', '9:30 (30 min)'], ['Praticien', 'Dr Prénom NOM'], ['Motif', 'Première consultation'],
    ['Lieu', 'Clinique Les Jasmins, Tunis']].forEach(([k, v], i) => {
    T(c.x + 12, c.y + 14 + i * 34, k, 11, GREY);
    T(c.x + 96, c.y + 14 + i * 34, v, 13);
  });
  T(c.x, c.y + 210, '☑ Me rappeler la veille par SMS', 13);
  T(c.x, c.y + 236, '☑ et par e-mail', 13);
  T(c.x, c.y + 274, 'Annulation gratuite jusqu\'à 2 h avant.', 12, GREY);
  btn(c.x, c.bottom - 60, c.w, 'Confirmer le rendez-vous', 'primary');
  R(c.x, c.bottom - 140, c.w, 60, ORANGET, { stroke: ORANGE, text: 'Créneau pris entre-temps ?\n→ message + retour à A2', fs: 12, color: ORANGE, dashed: true });

  // ---------------------------------------------------------------- A4 mes rendez-vous
  c = phone('A4', 'Mes rendez-vous', 'Déplacer, annuler, confirmer sa présence', PX[3], 0);
  R(c.x, c.y, c.w / 2, 30, TINT, { stroke: BLUE, text: 'À venir', color: BLUE });
  R(c.x + c.w / 2, c.y, c.w / 2, 30, '#ffffff', { text: 'Passés', color: GREY });
  [['Mar 16 mars · 9:30', 'Dr Prénom NOM · Cardiologie', ['Confirmé', GREENT, GREEN], false],
    ['Lun 22 mars · 15:00', 'Dr Prénom NOM · Dermatologie', ['Présence à confirmer', ORANGET, ORANGE], true]].forEach(([t, p, st, ask], i) => {
    const y = c.y + 46 + i * 170;
    R(c.x, y, c.w, 156, '#ffffff', { stroke: GREY });
    T(c.x + 12, y + 12, t, 14);
    T(c.x + 12, y + 34, p, 11, GREY);
    pill(c.x + 12, y + 58, st[0], st[1], st[2]);
    if (ask) btn(c.x + 12, y + 96, c.w - 24, '✓ Je viendrai', 'ok');
    else {
      btn(c.x + 12, y + 96, 110, 'Déplacer');
      btn(c.x + 130, y + 96, 114, 'Annuler', 'danger');
    }
  });
  line(c.x - 16, c.bottom - 50, c.x + c.w + 16, c.bottom - 50);
  ['🔍 Rechercher', '📅 Rendez-vous', '👤 Profil'].forEach((t, i) => T(c.x + i * 92, c.bottom - 38, t, 11, i === 1 ? BLUE : GREY));

  // SMS de rappel (hors écran)
  R(1610, 120, 250, 120, '#ffffff', { stroke: GREY, text: 'SMS · la veille à 18:00\n\nMediBook : RDV demain 9:30\navec Dr NOM. Répondez 1\npour confirmer, 2 pour annuler.', fs: 12, align: 'left' });
  d.path([[1610, 180], [1568, 300]], null, { color: GREY, sw: 1.5, dashed: true });

  flow(PX[0] + 300, PX[1], 300, 'choisir');
  flow(PX[1] + 300, PX[2], 300, 'continuer');
  flow(PX[2] + 300, PX[3], 300, 'confirmer');

  // ---------------------------------------------------------------- B1 agenda du jour
  c = webScreen('B1', 'Agenda du jour', 'Vue secrétariat : un praticien par colonne', 0, B0, '✚ MediBook · Clinique', NAV_CLINIQUE, 'Agenda');
  T(c.x, c.y, 'Mardi 16 mars 2027   ◀  ▶', 15);
  btn(c.x + c.w - 160, c.y - 6, 76, 'Jour', 'primary');
  btn(c.x + c.w - 80, c.y - 6, 76, 'Semaine');
  const top = c.y + 34, rh = 34;
  ['Dr NOM · Cardio', 'Dr NOM · Dermato', 'Dr NOM · Pédiatrie'].forEach((n, i) => R(c.x + 50 + i * 150, top, 150, 26, '#f1f3f5', { text: n, fs: 12 }));
  ['8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00'].forEach((h, i) => {
    T(c.x, top + 34 + i * rh, h, 11, GREY);
    line(c.x + 46, top + 26 + i * rh, c.x + 500, top + 26 + i * rh);
  });
  const blk = (col, row, span, text, bg, st) => R(c.x + 54 + col * 150, top + 28 + row * rh, 142, span * rh - 4, bg, { stroke: st, text, fs: 11, color: st });
  blk(0, 0, 1, 'Patient A · Contrôle', GREENT, GREEN);
  blk(0, 2, 1, 'Patient B · 1re consult.', GREENT, GREEN);
  blk(0, 4, 2, 'Patient C · Échographie', TINT, BLUE);
  blk(1, 1, 1, 'Patient D · Absent', REDT, RED);
  blk(1, 3, 1, 'Patient E · Contrôle', ORANGET, ORANGE);
  blk(1, 6, 2, '— Absence du praticien —', '#f1f3f5', GREY);
  blk(2, 0, 2, 'Patient F · Vaccin', GREENT, GREEN);
  blk(2, 5, 1, 'Patient G · Contrôle', TINT, BLUE);
  [['Présence confirmée', GREENT, GREEN], ['Réservé', TINT, BLUE], ['À confirmer', ORANGET, ORANGE], ['Absent', REDT, RED]]
    .forEach(([t, bg, col], i) => pill(c.x + [0, 150, 250, 370][i], B0 + 400, t, bg, col));

  // ---------------------------------------------------------------- B2 horaires du praticien
  c = webScreen('B2', 'Horaires du praticien', 'Les créneaux réservables sont générés à partir de ces plages', COL, B0, '✚ MediBook · Clinique', NAV_CLINIQUE, 'Horaires');
  R(c.x, c.y - 4, 240, 30, '#ffffff', { text: 'Dr Prénom NOM · Cardiologie ▾', fs: 12, align: 'left' });
  table(c.x, c.y + 38, [100, 140, 140, 100], [
    ['Jour', 'Matin', 'Après-midi', 'Actif'],
    ['Lundi', '08:30 – 12:30', '14:00 – 18:00', ['● oui', GREEN]],
    ['Mardi', '08:30 – 12:30', '14:00 – 18:00', ['● oui', GREEN]],
    ['Mercredi', '08:30 – 12:30', '—', ['● oui', GREEN]],
    ['Jeudi', '08:30 – 12:30', '14:00 – 18:00', ['● oui', GREEN]],
    ['Vendredi', '—', '—', ['○ non', GREY]],
  ]);
  T(c.x, c.y + 222, 'Durée par motif', 13, GREY);
  table(c.x, c.y + 244, [240, 120], [['Motif', 'Durée'], ['Première consultation', '30 min'], ['Contrôle', '15 min']]);
  T(c.x + 380, c.y + 222, 'Absences', 13, GREY);
  R(c.x + 380, c.y + 244, 124, 52, ORANGET, { stroke: ORANGE, text: 'Congrès\n22 – 24 mars', fs: 12, color: ORANGE });
  btn(c.x + 380, c.y + 304, 124, '+ Absence');
  btn(c.x + c.w - 130, c.y + 340, 130, 'Enregistrer', 'primary');

  // ---------------------------------------------------------------- C1 tableau de bord
  c = webScreen('C1', 'Tableau de bord de la clinique', 'Vue directeur : activité et rendez-vous non honorés', 0, C0, '✚ MediBook · Clinique', NAV_CLINIQUE, 'Tableau de bord');
  [['Rendez-vous (mars)', '412', INK], ['Occupation', '78 %', INK], ['Non honorés', '6 %', GREEN], ['En ligne', '63 %', BLUE]].forEach(([l, v, col], i) => {
    R(c.x + i * 126, c.y, 118, 60, '#f8f9fa');
    T(c.x + i * 126 + 8, c.y + 6, l, 11, GREY);
    T(c.x + i * 126 + 8, c.y + 26, v, 22, col);
  });
  T(c.x, c.y + 78, 'Occupation par praticien', 12, GREY);
  [['Cardio', 0.92], ['Dermato', 0.74], ['Pédiatrie', 0.81], ['ORL', 0.55]].forEach(([n, v], i) => {
    T(c.x, c.y + 104 + i * 32, n, 12);
    R(c.x + 76, c.y + 102 + i * 32, Math.round(160 * v), 20, TINT, { stroke: BLUE });
    T(c.x + 82 + Math.round(160 * v), c.y + 104 + i * 32, `${Math.round(v * 100)} %`, 11, GREY);
  });
  T(c.x + 290, c.y + 78, 'Non honorés par semaine', 12, GREY);
  const base = c.y + 220;
  line(c.x + 290, base, c.x + 500, base, GREY);
  d.path([[c.x + 290, base - 100], [c.x + 330, base - 92], [c.x + 370, base - 60], [c.x + 410, base - 44], [c.x + 450, base - 38], [c.x + 490, base - 30]], null, { color: GREEN, sw: 2 });
  d.els[d.els.length - 1].endArrowhead = null;
  T(c.x + 380, base - 120, '↓ depuis les rappels SMS', 11, GREEN);
  btn(c.x + c.w - 130, c.y + 340, 130, 'Exporter CSV');

  // ---------------------------------------------------------------- C2 console
  c = webScreen('C2', 'Console · cliniques', 'Super-administrateur Nova Solutions : cliniques et abonnements', COL, C0, '◆ Console Nova Solutions', NAV_CONSOLE, 'Cliniques', 'Super-administrateur ▾');
  btn(c.x + c.w - 160, c.y - 6, 160, '+ Nouvelle clinique', 'primary');
  table(c.x, c.y + 38, [150, 80, 80, 90, 104], [
    ['Clinique', 'Ville', 'Praticiens', 'Offre', 'Statut'],
    ['Les Jasmins', 'Tunis', '12', 'Pro', ['● active', GREEN]],
    ['Clinique du Lac', 'Tunis', '8', 'Pro', ['● active', GREEN]],
    ['Centre Carthage', 'Ariana', '4', 'Essentiel', ['● essai (9 j)', BLUE]],
    ['Polyclinique Sud', 'Sfax', '15', 'Pro', ['● suspendue', RED]],
    ['Cabinet Médina', 'Sousse', '2', 'Essentiel', ['● active', GREEN]],
  ]);
  R(c.x, c.y + 230, c.w, 90, VIOLETT, { stroke: VIOLET });
  T(c.x + 12, c.y + 240, 'Polyclinique Sud · facture de mars impayée (J+15)', 13, VIOLET);
  T(c.x + 12, c.y + 262, 'Suspendue automatiquement : les patients ne peuvent plus réserver.', 12);
  btn(c.x + 12, c.y + 284, 150, 'Relancer');
  btn(c.x + 172, c.y + 284, 150, 'Réactiver', 'ok');

  return d.els;
}

module.exports = { 'prototype': prototype };
