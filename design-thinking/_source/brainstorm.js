// Tableau de brainstorming (style post-it) : idée centrale + groupes de notes.
// Pour l'adapter : changez le titre, l'idée centrale et le tableau `clusters` (titre, couleur, 4 à 6 notes).
const { C, STROKE, createDiagram } = require('./lib');

const NOTE = '#fff9db';                       // couleur des post-it
const NW = 230, NH = 84, GAP = 16, HW = 2 * NW + GAP, HH = 64;
const XS = [0, 620, 1240, 1860];              // colonnes des groupes

function board() {
  const d = createDiagram();
  d.text(0, -170, 'Brainstorming · MediBook', 40);
  d.text(0, -115, 'Prise de rendez-vous en ligne pour cliniques · séance du Sprint 0 avec l\'équipe Nova Solutions (exemple fictif)', 18, { color: STROKE.gray });

  d.box('center', 880, 690, 580, 190, 'MediBook\n« réserver un médecin\naussi vite qu\'un taxi »\n\nSaaS multi-cliniques · rappels · tableau de bord', '#e7f5ff',
    { stroke: STROKE.blue, sw: 3, fs: 22, shape: 'ellipse' });

  const clusters = [
    { id: 'pb', title: '❶ Le problème', x: XS[0], y: 0, bg: C.red, notes: [
      'Réservation seulement\naux heures d\'ouverture', 'Secrétariat saturé\npar le téléphone', 'Patients qui oublient\nleur rendez-vous',
      'Agendas sur papier\nou dans un tableur', 'Aucun chiffre sur\nl\'occupation', 'Données éparpillées,\nsans sauvegarde'] },
    { id: 'us', title: '❷ Qui l\'utilise ?', x: XS[1], y: 0, bg: C.yellow, notes: [
      'Patient pressé,\nsur son téléphone', 'Patient âgé :\ninterface très simple', 'Secrétaire :\nles rendez-vous du jour',
      'Praticien : son planning\net ses absences', 'Directeur de clinique :\nles indicateurs', 'Nova Solutions :\nles abonnements'] },
    { id: 'ok', title: '❸ Objectifs et indicateurs', x: XS[2], y: 0, bg: C.green, notes: [
      '-30 % de rendez-vous\nnon honorés', 'Réserver en\nmoins de 2 minutes', '50 % des réservations\nen ligne après 3 mois',
      'Une clinique installée\nen une journée', 'Recherche de créneaux\n< 500 ms', 'Aucune fuite de données\nentre cliniques'] },
    { id: 'fn', title: '❹ Fonctions clés', x: XS[3], y: 0, bg: C.blue, notes: [
      'Recherche par spécialité\net par ville', 'Créneaux générés depuis\nles horaires', 'Déplacer / annuler\nen un clic',
      'Rappel SMS + e-mail\nla veille', 'Tableau de bord\nde la clinique', 'Abonnement mensuel\npar praticien'] },
    { id: 'tc', title: '❺ Pistes techniques', x: XS[0], y: 560, bg: C.violet, notes: [
      'Spring Boot + React\n(compétences de l\'équipe)', 'PostgreSQL, colonne\nclinic_id + filtre', 'Keycloak pour la\nconnexion et les rôles',
      'RabbitMQ pour\nles rappels', 'Kubernetes + GitHub\nActions', 'Verrou optimiste contre\nla double réservation'] },
    { id: 'ux', title: '❻ Expérience', x: XS[3], y: 560, bg: C.teal, notes: [
      'Mobile d\'abord\npour le patient', 'Français, anglais,\narabe (RTL)', 'Accessibilité\nWCAG 2.2 AA',
      'Confirmer sa présence\ndepuis le SMS', 'Vue « semaine » pour\nla secrétaire', 'Zéro formation\npour le praticien'] },
    { id: 'ri', title: '❼ Risques', x: XS[0], y: 1120, bg: C.red, notes: [
      'Données de santé :\nconfidentialité', 'Coût des SMS', 'Adoption par\nles praticiens',
      'Double réservation\n(concurrence)', 'Périmètre trop large :\nprioriser (MoSCoW)', 'Disponibilité\ndu fournisseur SMS'] },
    { id: 'co', title: '❽ Concurrence', x: XS[1], y: 1120, bg: C.gray, notes: [
      'Plateformes européennes :\nchères, pas d\'arabe', 'Logiciels de cabinet :\nmono-poste', 'Pages Facebook +\ntéléphone',
      'Agendas génériques\n(non médicaux)', 'Notre plus : local,\nmulti-cliniques', 'Notre plus : prix\nadapté au marché'] },
    { id: 'me', title: '❾ Mesurer le succès', x: XS[2], y: 1120, bg: C.green, notes: [
      'Taux d\'absence\navant / après', 'Part des réservations\nen ligne', 'Temps moyen\nde réservation',
      'Satisfaction patient\n(note sur 5)', 'Nombre de cliniques\nabonnées', 'Appels évités\npar semaine'] },
    { id: 'id', title: '❿ Idées bonus', x: XS[3], y: 1120, bg: C.pink, notes: [
      'Liste d\'attente :\ncréneau libéré → SMS', 'Téléconsultation\nvidéo', 'Application\nmobile native',
      'Paiement en ligne\nde l\'acompte', 'Lien avec le dossier\npatient (DPI)', 'Avis des patients'] },
  ];

  const lastLeft = (c) => `${c.id}${(c.notes.length - 1) - ((c.notes.length - 1) % 2)}`;
  for (const c of clusters) {
    d.box(c.id, c.x, c.y, HW, HH, c.title, c.bg, { fs: 22, sw: 2 });
    c.notes.forEach((n, i) => {
      d.box(`${c.id}${i}`, c.x + (i % 2) * (NW + GAP), c.y + HH + GAP + Math.floor(i / 2) * (NH + GAP), NW, NH, n, NOTE,
        { fs: 16, stroke: '#c9a227' });
    });
  }
  const G = { color: STROKE.gray, dashed: true };
  d.arrow('center', lastLeft(clusters[0]), null, { ...G, dir: 'v', sx: 960, ex: 240 });
  d.arrow('center', lastLeft(clusters[3]), null, { ...G, dir: 'v', sx: 1380, ex: 2100 });
  d.arrow('center', lastLeft(clusters[1]), null, { ...G, dir: 'v', sx: 1060, ex: 860 });
  d.arrow('center', lastLeft(clusters[2]), null, { ...G, dir: 'v', sx: 1280, ex: 1480 });
  d.arrow('center', 'tc', null, { ...G, dir: 'h', sy: 760, ey: 592 });
  d.arrow('center', 'ux', null, { ...G, dir: 'h', sy: 760, ey: 592 });
  d.arrow('center', 'ri', null, { ...G, dir: 'v', sx: 960, ex: 240 });
  d.arrow('center', 'co', null, { ...G, dir: 'v', sx: 1100, ex: 860 });
  d.arrow('center', 'me', null, { ...G, dir: 'v', sx: 1240, ex: 1480 });
  d.arrow('center', 'id', null, { ...G, dir: 'v', sx: 1380, ex: 2100 });

  // police manuscrite (Virgil) pour l'effet « atelier »
  for (const e of d.els) {
    if (e.label) e.label.fontFamily = 1;
    if (e.type === 'text') e.fontFamily = 1;
  }
  return d.els;
}

module.exports = { 'brainstorming': board };
