# Modèle de PFE ESPRIT : guide pour Claude Code

Ce dépôt contient tous les livrables écrits d'un projet de fin d'études (PFE) ESPRIT. Il est livré avec un
projet d'exemple **fictif** (« MediBook » chez « Nova Solutions ») que l'étudiant remplace par le sien.

## Livrables et sources

| Livrable | Source à modifier | Générer |
|---|---|---|
| Faits du projet (noms, dates, stack, chiffres) | `PROJET.md` | — (source unique) |
| Rapport PDF | `rapport/` (LaTeX, XeLaTeX) | `rapport/build.sh` ou `rapport/build.ps1` |
| Cahier des charges Word/PDF | `cahier/Cahier-des-charges.md` | `python cahier/build_cahier_docx.py` puis `scripts/export-pdf.ps1` |
| Diagrammes UML (draw.io + PNG) | `diagrammes/_source/build_diagrams.py` | `npm run diagrammes` |
| Figures Excalidraw du rapport | `rapport/figures/_source/diagrams.js` | `npm run figures` |
| Brainstorming et prototype (Excalidraw) | `design-thinking/_source/*.js` | `npm run design` |
| Présentation PPTX/PDF | `presentation/contenu.py` | `python presentation/build_deck.py` puis `scripts/export-pdf.ps1` |
| Journal de bord | `journal/AAAA-MM-JJ.md` | — |

Ne modifiez jamais un fichier généré (`*.drawio`, `*.png` des diagrammes, `.docx`, `.pptx`, `.pdf`) à la main :
modifiez sa source puis régénérez, sinon la prochaine génération efface la retouche.

## Règles essentielles

- **Cohérence** : un fait (nom, date, chiffre, techno, acteur, exigence) qui change dans `PROJET.md` doit changer
  partout : rapport, cahier, présentation, diagrammes. Utilisez le skill `/pfe-coherence` après chaque changement.
- **Données fictives** : tant que l'étudiant n'a pas fourni ses informations, gardez des valeurs génériques
  (« Prénom NOM »). N'inventez jamais de faits sur une entreprise réelle ni de résultats « mesurés ».
- **Confidentialité** : ne copiez dans ce dépôt ni code, ni capture, ni document interne de l'entreprise d'accueil
  sans son accord. Si le dépôt est public, rien de confidentiel.
- **Vérifier visuellement** : après une génération, ouvrez le PNG ou le PDF produit (outil Read) et corrigez les
  chevauchements, flèches qui traversent des boîtes, textes coupés.
- **Compilation propre** : le rapport doit compiler sans `!` dans `main.log` ni référence indéfinie
  (`build.sh` renvoie un code d'erreur dans ce cas).
- Les règles détaillées (rédaction, LaTeX, diagrammes, présentation) sont dans `.claude/rules/`.

## Skills disponibles (`.claude/skills/`)

| Skill | Quand |
|---|---|
| `/pfe-init` | Première utilisation : remplacer le projet d'exemple par le vrai projet |
| `/pfe-rapport` | Rédiger ou relire un chapitre du rapport |
| `/pfe-diagrammes` | Ajouter ou modifier un diagramme UML ou une figure |
| `/pfe-design-thinking` | Brainstorming, prototype basse fidélité (maquettes), personas en Excalidraw |
| `/pfe-cahier` | Mettre à jour le cahier des charges et le régénérer |
| `/pfe-presentation` | Préparer les diapositives d'une restitution ou de la soutenance |
| `/pfe-coherence` | Vérifier que tous les livrables disent la même chose |
| `/pfe-journal` | Écrire l'entrée hebdomadaire du journal de bord |

## Environnement

- LaTeX : MiKTeX (Windows) ou TeX Live, moteur **XeLaTeX** ; police Times New Roman, sinon TeX Gyre Termes.
- Python 3.10+ : `pip install -r requirements.txt` (python-docx, python-pptx).
- Node 18+ et Google Chrome : `npm install` (playwright-core pilote Chrome pour le rendu des figures).
  Chemin de Chrome : variables `CHROME` (draw.io) et `CHROME_PATH` (Excalidraw) si l'emplacement n'est pas standard.
- PDF du cahier et des diapositives : Word/PowerPoint (`scripts/export-pdf.ps1`) ou LibreOffice
  (`soffice --headless --convert-to pdf`).
