# 🔧 Guide GitHub — Vita-Link Admin

Ce document explique comment configurer le dépôt GitHub de A à Z après avoir créé le repo.

---

## 1. Initialiser le repo local et pousser

```bash
# Dans le dossier vita-link-admin/
git init
git add .
git commit -m "chore: initial project setup"

# Relier au repo GitHub (remplace [USERNAME] et [REPO])
git remote add origin https://github.com/[USERNAME]/vita-link-admin.git

# Pousser la branche principale
git push -u origin main

# Créer et pousser la branche develop
git checkout -b develop
git push -u origin develop
```

---

## 2. Inviter un collaborateur

1. Aller sur `github.com/[USERNAME]/vita-link-admin`
2. **Settings** → **Collaborators and teams** → **Add people**
3. Saisir le nom d'utilisateur GitHub du collaborateur
4. Choisir le rôle : **Write** (peut push sur les branches de feature) ou **Maintain** (peut merger les PRs)
5. Le collaborateur reçoit un email d'invitation à accepter

---

## 3. Configurer les Branch Protection Rules

### Protéger `main`

1. **Settings** → **Branches** → **Add branch protection rule**
2. Branch name pattern : `main`
3. Cocher :
   - ✅ **Require a pull request before merging**
     - ✅ Require approvals : **1**
     - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ **Require status checks to pass before merging**
     - Chercher et ajouter : `Lint + Type-check + Build` (le job CI)
   - ✅ **Require branches to be up to date before merging**
   - ✅ **Do not allow bypassing the above settings**
   - ✅ **Restrict who can push to matching branches** → ajouter uniquement le lead
4. **Save changes**

### Protéger `develop`

Répéter les mêmes étapes avec `develop` comme pattern.  
Différence : tu peux laisser **"Allow force pushes"** décoché mais ne pas restreindre qui peut merger (les deux développeurs peuvent merger dans develop après review).

---

## 4. Configurer les Secrets GitHub Actions

Pour que le CI puisse builder :

1. **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
2. Ajouter :

| Nom | Valeur |
|-----|--------|
| `NEXT_PUBLIC_API_URL` | `https://vita-link-api.onrender.com/api` |
| `NEXTAUTH_SECRET` | _(générer avec `openssl rand -base64 32`)_ |

---

## 5. Créer les labels d'issues

Aller dans **Issues** → **Labels** → créer :

| Label | Couleur | Usage |
|-------|---------|-------|
| `feat` | `#0075ca` | Nouvelle fonctionnalité |
| `bug` | `#d73a4a` | Bug à corriger |
| `chore` | `#e4e669` | Tâche technique |
| `docs` | `#0075ca` | Documentation |
| `priority: high` | `#b60205` | Urgence |
| `priority: medium` | `#fbca04` | Normal |
| `module: dashboard` | `#c5def5` | Module Dashboard |
| `module: structures` | `#c5def5` | Module Structures |
| `module: jambaars` | `#c5def5` | Module Jambaars |
| `module: rewards` | `#c5def5` | Module Rewards |

---

## 6. Workflow quotidien (rappel)

```bash
# Début de journée
git checkout develop && git pull origin develop

# Nouvelle tâche
git checkout -b feat/mon-module-ma-feature

# Pendant le dev
git add . && git commit -m "feat(module): description"

# Fin de tâche → PR
git push origin feat/mon-module-ma-feature
# Ouvrir PR sur GitHub : feat/... → develop
# Assigner un reviewer
# Merger après approbation + CI vert
```

---

## 7. Checklist de lancement ✅

- [ ] Repo créé sur GitHub
- [ ] `main` et `develop` poussées
- [ ] Collaborateur invité
- [ ] Branch protection sur `main` configurée
- [ ] Branch protection sur `develop` configurée  
- [ ] Secrets GitHub Actions ajoutés
- [ ] `.env.local` rempli localement (jamais committé)
- [ ] `npm install && npm run dev` fonctionne
- [ ] Labels d'issues créés
