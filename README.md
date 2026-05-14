# 🩸 Vita-Link Admin — Interface de Contrôle

> Interface d'administration de la plateforme Vita-Link : surveillance en temps réel du réseau de donneurs de sang au Sénégal.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-black)

---

## 📋 Table des matières

- [Aperçu du projet](#aperçu-du-projet)
- [Architecture](#architecture)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Conventions de développement](#conventions-de-développement)
- [Workflow Git](#workflow-git)
- [Modules fonctionnels](#modules-fonctionnels)

---

## Aperçu du projet

Vita-Link Admin est une **"Control Room"** permettant à l'équipe Vita-Link, au CNTS et au Ministère de la Santé de :

- 📊 Superviser le réseau de donneurs ("Jambaars") en temps réel
- 🏥 Certifier et modérer les structures de santé
- 🎖️ Gérer le programme de récompenses "Jambaar Life"
- 📈 Produire des rapports d'impact pour la santé publique

**API Backend** : `https://vita-link-api.onrender.com/api`  
**Docs API** : `https://vita-link-api.onrender.com/api/docs`

---

## Architecture

```
vita-link-admin/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Groupe de routes : authentification
│   │   │   └── login/
│   │   └── (dashboard)/            # Groupe de routes : tableau de bord (protégées)
│   │       ├── dashboard/          # Vue hélicoptère + KPIs
│   │       ├── structures/         # Gestion des structures de santé
│   │       ├── jambaars/           # Modération des donneurs
│   │       ├── rewards/            # Régie Jambaar Life
│   │       ├── reports/            # Rapports & statistiques
│   │       └── settings/           # Paramètres système
│   │
│   ├── components/                 # Composants React
│   │   ├── ui/                     # Composants shadcn/ui (générés)
│   │   ├── layout/                 # Sidebar, Header, Layout wrappers
│   │   ├── dashboard/              # Heatmap, KPICard, AlertsList...
│   │   ├── structures/             # StructureTable, ValidationModal...
│   │   ├── jambaars/               # DonorDirectory, SuspensionModal...
│   │   ├── rewards/                # PartnerCard, PointsEditor...
│   │   ├── reports/                # Charts, ExportButton...
│   │   └── shared/                 # DataTable, FilterBar, StatusBadge...
│   │
│   ├── services/                   # Couche d'appels API (1 fichier = 1 ressource)
│   │   ├── auth.service.ts
│   │   ├── structures.service.ts
│   │   ├── jambaars.service.ts
│   │   ├── rewards.service.ts
│   │   └── reports.service.ts
│   │
│   ├── lib/
│   │   ├── api/                    # Client HTTP (axios/fetch) + interceptors
│   │   ├── hooks/                  # Custom hooks React (useAuth, useFilters...)
│   │   ├── utils/                  # Fonctions pures utilitaires
│   │   ├── validators/             # Schémas Zod
│   │   └── constants/              # Constantes métier (régions, groupes sanguins...)
│   │
│   ├── types/                      # Types TypeScript globaux + types API
│   ├── store/                      # État global (Zustand)
│   └── config/                     # Config Next.js, env helpers
│
├── public/
├── docs/                           # Documentation technique
├── .github/
│   ├── workflows/                  # CI/CD GitHub Actions
│   └── PULL_REQUEST_TEMPLATE/
└── ...
```

### Principes SOLID appliqués

| Principe | Application |
|----------|-------------|
| **S** — Single Responsibility | 1 service = 1 ressource API, 1 composant = 1 responsabilité |
| **O** — Open/Closed | Composants extensibles via props, pas de modification directe |
| **L** — Liskov | Sous-composants interchangeables (ex: différents types de charts) |
| **I** — Interface Segregation | Types TypeScript granulaires, pas de `any` |
| **D** — Dependency Inversion | Les pages dépendent des services, pas de l'implémentation HTTP |

---

## Installation

### Prérequis

- Node.js `>= 20.x`
- npm `>= 10.x` ou pnpm `>= 9.x`

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/[ORG]/vita-link-admin.git
cd vita-link-admin

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# → Remplir les valeurs dans .env.local

# 4. Lancer en développement
npm run dev
```

---

## Variables d'environnement

```env
# .env.local

# API
NEXT_PUBLIC_API_URL=https://vita-link-api.onrender.com/api

# Auth (NextAuth.js)
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Maps (pour la heatmap)
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

---

## Conventions de développement

### Nommage des fichiers

| Type | Convention | Exemple |
|------|-----------|---------|
| Composants React | `PascalCase.tsx` | `KPICard.tsx` |
| Hooks custom | `camelCase.ts` avec préfixe `use` | `useFilters.ts` |
| Services | `camelCase.service.ts` | `structures.service.ts` |
| Types | `camelCase.types.ts` | `jambaar.types.ts` |
| Utils | `camelCase.utils.ts` | `date.utils.ts` |
| Constants | `SCREAMING_SNAKE_CASE` | `BLOOD_GROUPS`, `REGIONS` |

### Nommage des branches

```
<type>/<scope>-<description-courte>

Types :
  feat/     → nouvelle fonctionnalité
  fix/      → correction de bug
  chore/    → tâche technique (deps, config)
  docs/     → documentation
  refactor/ → refactoring sans changement de comportement
  hotfix/   → correction urgente en production

Exemples :
  feat/dashboard-heatmap
  feat/structures-validation-modal
  fix/auth-token-refresh
  chore/setup-ci-pipeline
  docs/api-integration-guide
```

### Messages de commit (Conventional Commits)

```
<type>(<scope>): <description>

feat(dashboard): add real-time KPI cards
fix(auth): handle token expiration correctly
chore(deps): upgrade next to v15.2
docs(readme): add environment variables section
refactor(structures): extract validation logic to service
```

---

## Workflow Git

### Branches principales

| Branche | Rôle | Protection |
|---------|------|-----------|
| `main` | Production | ✅ Push direct interdit, PR obligatoire, 1 review min |
| `develop` | Intégration | ✅ Push direct interdit, PR obligatoire |
| `feat/*` | Développement | ❌ Libre |
| `fix/*` | Correctifs | ❌ Libre |
| `hotfix/*` | Urgences prod | Merge direct dans `main` + `develop` |

### Flux de travail standard

```
main ←── develop ←── feat/ma-feature
                ←── fix/mon-bug
```

```bash
# Démarrer une feature
git checkout develop
git pull origin develop
git checkout -b feat/dashboard-heatmap

# ... développement ...

# Pousser et ouvrir une PR vers develop
git push origin feat/dashboard-heatmap
# → Créer une Pull Request sur GitHub : feat/dashboard-heatmap → develop

# Release : PR develop → main (avec tag de version)
```

### Règles de Pull Request

- ✅ Au moins **1 reviewer** obligatoire
- ✅ Les **checks CI** doivent passer (lint, type-check, build)
- ✅ Pas de merge si des **conflits** existent
- ✅ **Squash merge** préféré pour garder un historique propre
- ❌ Pas de push direct sur `main` ou `develop`

---

## Modules fonctionnels

| Module | Route | Statut |
|--------|-------|--------|
| Dashboard Global | `/dashboard` | 🔲 À faire |
| Structures de Santé | `/structures` | 🔲 À faire |
| Modération Jambaars | `/jambaars` | 🔲 À faire |
| Régie Récompenses | `/rewards` | 🔲 À faire |
| Rapports & Stats | `/reports` | 🔲 À faire |
| Paramètres / 2FA | `/settings` | 🔲 À faire |

---

## Équipe

| Rôle | Responsabilité |
|------|---------------|
| Lead Frontend | Architecture, reviews, merge `main` |
| Développeur(s) | Features, fixes, PRs vers `develop` |

---

*Vita-Link Admin — "Voir l'invisible : le mouvement du sang dans tout le pays en temps réel."*
