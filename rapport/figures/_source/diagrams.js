// Figures Excalidraw du rapport. Chaque export est une fonction qui renvoie un « squelette »
// (boîtes, zones, flèches, textes). Rendu : npm run figures  (PNG dans figures/, source dans figures/excalidraw/).
// Le style d'un élément : C.<couleur> pour le fond, NEW pour mettre en orange ce que le stage ajoute.
const { C, STROKE, createDiagram } = require('./lib');
const NEW = { stroke: STROKE.orange, sw: 2 };

function architecture() {
  const d = createDiagram();
  d.text(0, 0, 'MediBook — Architecture globale', 28);
  d.text(0, 42, 'SPA React · API REST Spring Boot · PostgreSQL isolé par clinique · rappels asynchrones', 15, { color: STROKE.gray });

  [['pat', 'Patient'], ['sec', 'Secrétaire /\npraticien'], ['adm', 'Administrateur\nclinique'], ['sa', 'Super-\nadministrateur']]
    .forEach(([id, t], i) => d.box(id, i * 250, 100, 210, 60, t, C.yellow, { fs: 15 }));

  d.zone('zp', -20, 200, 1000, 140, 'Présentation');
  d.box('web', 0, 245, 460, 75, 'Application React 18 (TypeScript)\nespace patient · espace clinique · console', C.blue, { fs: 15 });
  d.box('kc', 500, 245, 460, 75, 'Keycloak\nOIDC · rôles · second facteur', C.gray, { fs: 15 });
  ['pat', 'sec', 'adm'].forEach((a) => d.arrow(a, 'web'));
  d.arrow('sa', 'kc');

  d.zone('zapi', -20, 390, 1000, 230, 'API MediBook — Spring Boot 3');
  const mods = [['Cliniques &\npersonnel', C.gray], ['Agendas &\ncréneaux', C.gray], ['Réservation', C.green],
    ['Rappels', C.orange, NEW], ['Tableau de\nbord', C.orange, NEW], ['Abonnements', C.gray]];
  mods.forEach(([t, bg, o = {}], i) => d.box(`m${i}`, (i % 3) * 320, 435 + Math.floor(i / 3) * 85, 300, 65, t, bg, { fs: 15, ...o }));
  d.arrow('web', 'm1', 'HTTPS + JWT', { dir: 'v', sx: 230, ex: 470 });

  d.zone('zdata', -20, 670, 1000, 120, 'Données & messagerie');
  d.box('pg', 0, 705, 460, 65, 'PostgreSQL 16\ncolonne clinic_id + filtre Hibernate', C.blue, { fs: 15 });
  d.box('mq', 500, 705, 460, 65, 'RabbitMQ\nfile des rappels', C.blue, { fs: 15 });
  d.arrow('zapi', 'zdata', 'JDBC · AMQP', { dir: 'v', sx: 480, ex: 480 });

  d.box('sms', 1040, 705, 230, 65, 'Fournisseur SMS\n+ serveur SMTP', C.gray, { fs: 15 });
  d.arrow('mq', 'sms', 'notification');
  d.legend(1040, 245, [[C.orange, 'ajouté pendant le stage', NEW], [C.green, 'cœur du produit'], [C.gray, 'service existant']]);
  return d.els;
}

function pipelineCiCd() {
  const d = createDiagram();
  d.text(0, 0, 'Chaîne CI/CD — GitHub Actions', 28);
  const steps = [['push', 'Pull request\nou push', C.yellow], ['build', 'Compilation\nMaven · Vite', C.blue],
    ['test', 'Tests\nJUnit · Vitest', C.blue], ['qual', 'Qualité\nSonarQube · Trivy', C.violet],
    ['img', 'Images Docker\n→ ghcr.io', C.green], ['dep', 'Déploiement\nkubectl apply', C.orange, NEW]];
  steps.forEach(([id, t, bg, o = {}], i) => d.box(id, i * 230, 90, 190, 80, t, bg, { fs: 15, ...o }));
  steps.slice(1).forEach(([id], i) => d.arrow(steps[i][0], id));
  d.zone('zm', 900, 30, 460, 160, 'branche main uniquement', STROKE.orange);
  d.box('e2e', 920, 230, 420, 65, 'Tests de bout en bout Playwright\nsur l\'environnement de recette', C.teal, { fs: 15 });
  d.arrow('dep', 'e2e', null, { dir: 'v' });
  return d.els;
}

module.exports = { 'architecture-globale': architecture, 'pipeline-ci-cd': pipelineCiCd };
