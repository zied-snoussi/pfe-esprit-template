"""Contenu de la présentation : modifiez UNIQUEMENT ce fichier, puis lancez  python build_deck.py

Types de diapositives (clé "type") :
  titre      : title, subtitle, footer
  plan       : title, items (liste des parties)
  section    : number, title, subtitle
  puces      : title, subtitle, bullets, image (facultative, chemin depuis la racine du dépôt)
  image      : title, subtitle, image, caption
  cartes     : title, subtitle, cards = [(titre, texte), ...]  (2 à 6 cartes)
  chiffres   : title, subtitle, stats = [(valeur, libellé), ...]  (2 à 4)
  frise      : title, subtitle, steps = [(date, titre, texte), ...]  (3 à 6 étapes)
  fin        : title, subtitle
Les données ci-dessous sont FICTIVES (projet d'exemple « MediBook »).
"""

META = {
    "projet": "MediBook",
    "etudiant": "Prénom NOM",
    "pied": "PFE ESPRIT 2026-2027 · Nova Solutions",
    "couleur": "1F6FEB",   # même couleur que \definecolor{principale} du rapport
    "accent": "E8590C",
}

SLIDES = [
    {"type": "titre", "title": "MediBook",
     "subtitle": "Plateforme SaaS de prise de rendez-vous et de suivi des patients",
     "footer": "Prénom NOM · Encadrants : M. Prénom NOM (Nova Solutions), Mme Prénom NOM (ESPRIT)"},

    {"type": "plan", "title": "Plan",
     "items": ["Contexte et problématique", "Solution proposée", "Analyse et conception",
               "Réalisation", "Tests et déploiement", "Conclusion et perspectives"]},

    {"type": "section", "number": "01", "title": "Contexte et problématique",
     "subtitle": "Nova Solutions et ses cliniques partenaires"},

    {"type": "puces", "title": "L'existant", "subtitle": "Des rendez-vous gérés au téléphone",
     "bullets": ["Réservation uniquement aux heures d'ouverture du secrétariat",
                 "Une grande partie de la journée passée au téléphone",
                 "Rendez-vous oubliés, faute de rappel",
                 "Aucun indicateur d'occupation pour la direction"]},

    {"type": "chiffres", "title": "Le problème en chiffres", "subtitle": "Valeurs d'exemple, à remplacer",
     "stats": [("12 %", "de rendez-vous non honorés"), ("3 h", "d'appels par jour et par secrétaire"),
               ("0", "indicateur de suivi")]},

    {"type": "section", "number": "02", "title": "Solution proposée", "subtitle": "Une plateforme, trois espaces"},

    {"type": "image", "title": "Brainstorming", "subtitle": "Dix thèmes recensés avec l'équipe au Sprint 0",
     "image": "design-thinking/png/brainstorming.png", "caption": "Tableau de brainstorming (Excalidraw)"},

    {"type": "cartes", "title": "MediBook", "subtitle": "Trois espaces sur une même plateforme",
     "cards": [("Espace patient", "Rechercher un praticien, réserver, déplacer ou annuler un rendez-vous."),
               ("Espace clinique", "Agendas des praticiens, rendez-vous du jour, rappels automatiques."),
               ("Console", "Création des cliniques, abonnements et supervision de la plateforme.")]},

    {"type": "section", "number": "03", "title": "Analyse et conception", "subtitle": "Besoins, architecture, UML"},

    {"type": "image", "title": "Prototype", "subtitle": "Réserver en quatre écrans, validés avant le développement",
     "image": "design-thinking/png/prototype.png", "caption": "Maquettes basse fidélité (Excalidraw)"},

    {"type": "image", "title": "Cas d'utilisation", "subtitle": "Cinq acteurs, quatre familles de fonctions",
     "image": "diagrammes/png/01-cas-utilisation-global.png", "caption": "Diagramme de cas d'utilisation global"},

    {"type": "image", "title": "Architecture globale", "subtitle": "React, Spring Boot, PostgreSQL, RabbitMQ",
     "image": "rapport/figures/architecture-globale.png", "caption": "Architecture en couches"},

    {"type": "image", "title": "Prise de rendez-vous", "subtitle": "Le verrou optimiste évite la double réservation",
     "image": "diagrammes/png/03-sequence-prise-rdv.png", "caption": "Diagramme de séquence"},

    {"type": "section", "number": "04", "title": "Réalisation", "subtitle": "Trois releases en Scrum"},

    {"type": "puces", "title": "Release 2 : réservation et rappels", "subtitle": "Sprints 5 à 8",
     "bullets": ["Recherche par spécialité et par ville", "Réservation en trois clics",
                 "Rappels SMS et e-mail 24 h avant", "Déplacement par le secrétariat"],
     "image": "rapport/figures/captures/reservation-patient.png"},

    {"type": "section", "number": "05", "title": "Tests et déploiement", "subtitle": "Qualité mesurée à chaque commit"},

    {"type": "chiffres", "title": "Résultats", "subtitle": "Valeurs d'exemple, à remplacer",
     "stats": [("84 %", "de couverture back-end"), ("36/36", "tests E2E réussis"),
               ("310 ms", "temps de réponse p95"), ("0", "vulnérabilité critique")]},

    {"type": "image", "title": "Chaîne CI/CD", "subtitle": "GitHub Actions jusqu'à Kubernetes",
     "image": "rapport/figures/pipeline-ci-cd.png", "caption": "Pipeline d'intégration et de livraison continues"},

    {"type": "frise", "title": "Planning", "subtitle": "26 semaines, jalons ESPRIT",
     "steps": [("S1-2", "Sprint 0", "Étude et cahier des charges"),
               ("S3-10", "Release 1", "Socle et agendas"),
               ("S11-18", "Release 2", "Réservation et rappels"),
               ("S19-24", "Release 3", "Pilotage et production"),
               ("S25-26", "Clôture", "Recette et soutenance")]},

    {"type": "puces", "title": "Conclusion et perspectives", "subtitle": "",
     "bullets": ["Réservation en ligne opérationnelle pour plusieurs cliniques",
                 "Rappels automatiques et tableau de bord",
                 "Perspectives : téléconsultation, application mobile, lien avec le dossier patient"]},

    {"type": "fin", "title": "Merci pour votre attention", "subtitle": "Questions ?"},
]
