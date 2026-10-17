---
paths:
  - "rapport/**"
---

# Règles LaTeX du rapport

- Moteur **XeLaTeX** uniquement (fontspec, polyglossia). Ne pas ajouter `inputenc`, `fontenc` ni `babel`.
- Les informations personnelles (nom, encadrants, entreprise, dates, titre) viennent **seulement** des macros de
  `config/infos.tex` (`\etudiant`, `\entreprise`, `\nomprojet`, ...). Ne les écrivez jamais en dur ailleurs.
- La mise en page ESPRIT est dans `config/preamble.tex` (Times 12 pt, marges 2,5 cm, interligne 1,15, alinéa
  0,5 cm, « Fig. »/« Tab. », pagination x/N). Ne la contournez pas localement (`\vspace` négatifs, `\small` sur
  des paragraphes entiers, etc.).
- Figures : `\insererfigure[largeur]{chemin depuis figures/}{légende}{fig:label}` ; grand diagramme (classes,
  séquence large) : `\insererfigurepaysage{...}{...}{...}`. Un fichier absent affiche un cadre rouge, ce qui permet
  d'écrire avant d'avoir la figure.
- Diagrammes UML : `figures/uml/NN-nom.png`, copiés par `npm run diagrammes` (ne pas les déposer à la main).
- Captures d'écran : `figures/captures/`, nom en kebab-case, PNG.
- Tableaux : `booktabs` (`\toprule`, `\midrule`, `\bottomrule`), `tabularx` pour les colonnes de texte,
  `longtable` au-delà d'une demi-page. Légende **au-dessus** du tableau.
- Labels : `fig:`, `tab:`, `ch:`, `annexe:` ; chaque label est référencé au moins une fois.
- Marqueurs de travail : `\todo{...}` (rouge). Pour la version finale, `\afficherfalse` dans `config/preamble.tex`
  et plus aucun `\todo` (`grep -rn "\\todo" rapport/`).
- Chaque fichier de chapitre commence par `% !TEX root = ../main.tex`.
- Après chaque modification : `rapport/build.sh` (ou `build.ps1`), puis vérifier `main.log` : aucune ligne `!`,
  aucune `Reference ... undefined`, et regarder les `Overfull \hbox` signalés.
