---
paths:
  - "presentation/**"
---

# Règles de la présentation

- Le contenu est dans `presentation/contenu.py` (liste `SLIDES`) ; la mise en forme dans `build_deck.py`.
  Pour changer une diapositive, modifiez `contenu.py` ; pour un nouveau type de diapositive, ajoutez une fonction
  `s_<type>` dans `build_deck.py` et déclarez-la dans `BUILDERS`.
- Une idée par diapositive ; titre = message (« Le verrou optimiste évite la double réservation »), pas seulement
  un thème.
- 3 à 5 puces de moins de 12 mots. Pas de paragraphes.
- Durée : environ une diapositive par minute (soutenance ESPRIT : 20 à 25 min → 18 à 25 diapositives, hors démo).
- Mêmes chiffres, mêmes noms et mêmes diagrammes que le rapport (`/pfe-coherence`).
- Après génération : exporter en PDF et **regarder chaque page** (texte qui déborde, image trop petite, cadre
  « Image à produire » oublié).
