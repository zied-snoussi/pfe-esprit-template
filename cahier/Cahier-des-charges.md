---
projet: MediBook
version: 0.1
date: 2027-02-12
statut: Brouillon
auteur: Prénom NOM
pied: PFE ESPRIT 2026-2027 · Nova Solutions
---

# Cahier des charges : MediBook

## Plateforme SaaS de prise de rendez-vous et de suivi des patients · version 0.1 · PFE ESPRIT 2026-2027

## 1. Présentation du projet

### 1.1 Contexte

Nova Solutions développe des applications pour des cliniques privées. Ses clients gèrent encore leurs rendez-vous au téléphone, sur papier ou dans un tableur. Ce projet de fin d'études crée **MediBook**, une plateforme SaaS qui leur permet de proposer la prise de rendez-vous en ligne.

### 1.2 Objectifs

- Permettre aux patients de réserver 24 h/24 sans appel téléphonique.
- Réduire d'au moins 30 % les rendez-vous non honorés grâce aux rappels.
- Donner à chaque clinique un tableau de bord de son activité.
- Servir plusieurs cliniques sur une seule plateforme, avec des données isolées.

### 1.3 Périmètre

| Inclus | Exclu |
|---|---|
| Espace patient, espace clinique, console d'administration | Téléconsultation vidéo |
| Rappels SMS et e-mail | Paiement en ligne de la consultation |
| Tableau de bord et export CSV | Dossier médical du patient |
| Abonnements des cliniques | Application mobile native |

## 2. Acteurs

| Acteur | Description |
|---|---|
| Patient | Recherche un praticien, réserve, déplace ou annule un rendez-vous. |
| Secrétaire | Gère les rendez-vous du jour de sa clinique. |
| Praticien | Définit ses horaires et ses absences. |
| Administrateur clinique | Gère le personnel, les motifs de consultation et l'abonnement. |
| Super-administrateur | Crée les cliniques et supervise la plateforme. |
| Service de notification | Système externe qui envoie les SMS et les e-mails. |

## 3. Exigences fonctionnelles

| ID | Exigence | Priorité |
|---|---|---|
| EF-01 | Le patient crée un compte avec son e-mail et son numéro de téléphone. | Must |
| EF-02 | Le personnel se connecte avec un second facteur (TOTP). | Must |
| EF-03 | L'administrateur clinique ajoute, modifie et désactive un praticien. | Must |
| EF-04 | Le praticien définit ses horaires hebdomadaires et ses absences. | Must |
| EF-05 | Le système génère les créneaux à partir des horaires et de la durée du motif. | Must |
| EF-06 | Le patient recherche un praticien par spécialité et par ville. | Must |
| EF-07 | Le patient réserve un créneau libre ; deux patients ne peuvent pas réserver le même créneau. | Must |
| EF-08 | Le patient déplace ou annule un rendez-vous jusqu'à 2 h avant. | Should |
| EF-09 | Le système envoie un rappel 24 h avant le rendez-vous, par SMS et par e-mail. | Should |
| EF-10 | La secrétaire marque un patient absent. | Should |
| EF-11 | L'administrateur clinique consulte le taux d'occupation et le taux d'absence. | Could |
| EF-12 | Le super-administrateur suspend une clinique dont l'abonnement est impayé. | Could |

## 4. Exigences non fonctionnelles

| ID | Catégorie | Exigence |
|---|---|---|
| ENF-01 | Sécurité | Données chiffrées en transit (TLS 1.2+) et au repos. |
| ENF-02 | Isolation | Aucune requête ne renvoie les données d'une autre clinique ; un test automatisé le vérifie. |
| ENF-03 | Performance | Recherche de créneaux en moins de 500 ms pour 95 % des requêtes. |
| ENF-04 | Disponibilité | 99,5 % par mois. |
| ENF-05 | Accessibilité | WCAG 2.2 niveau AA. |
| ENF-06 | Langues | Français, anglais, arabe (droite à gauche). |
| ENF-07 | Conformité | Loi tunisienne sur la protection des données personnelles. |

## 5. Contraintes techniques

| Couche | Choix |
|---|---|
| Back-end | Spring Boot 3, Java 21 |
| Front-end | React 18, TypeScript, Vite |
| Base de données | PostgreSQL 16 |
| Authentification | Keycloak (OIDC) |
| Messagerie | RabbitMQ |
| Déploiement | Docker, Kubernetes, GitHub Actions |

## 6. Diagrammes UML

Les diagrammes ci-dessous sont générés par `diagrammes/_source/build_diagrams.py`.

<!-- diagrammes -->

## 7. Planning et livrables

| Release | Semaines | Contenu |
|---|---|---|
| Sprint 0 | 1–2 | Étude, état de l'art, cahier des charges |
| Release 1 | 3–10 | Authentification, cliniques, praticiens, agendas |
| Release 2 | 11–18 | Réservation, rappels |
| Release 3 | 19–24 | Tableau de bord, abonnements, Kubernetes |
| Clôture | 25–26 | Recette, rapport, soutenance |

### Critères d'acceptation

- [ ] Toutes les exigences « Must » sont livrées et testées.
- [ ] Couverture de tests du back-end supérieure ou égale à 80 %.
- [ ] Aucune vulnérabilité critique détectée par Trivy.
- [ ] Démonstration validée par l'encadrant entreprise.
