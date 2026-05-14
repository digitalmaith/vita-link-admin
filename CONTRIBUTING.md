# Guide de contribution — Vita-Link Admin

Bienvenue dans l'équipe Vita-Link ! Ce document décrit tout ce que tu dois savoir pour contribuer efficacement.

---

## 🚀 Setup rapide

```bash
git clone https://github.com/[ORG]/vita-link-admin.git
cd vita-link-admin
npm install
cp .env.example .env.local
# → Remplir .env.local
npm run dev
```

---

## 🌿 Workflow Git

### 1. Toujours partir de `develop`

```bash
git checkout develop
git pull origin develop
git checkout -b feat/ma-feature
```

### 2. Développer, committer souvent

```bash
git add .
git commit -m "feat(dashboard): add blood group filter to KPI cards"
```

### 3. Pousser et ouvrir une PR vers `develop`

```bash
git push origin feat/ma-feature
# → Ouvrir une PR sur GitHub
```

---

## 📛 Nommage des branches

```
<type>/<scope>-<description>

feat/dashboard-heatmap
feat/structures-validation-modal
fix/auth-token-refresh
chore/upgrade-nextjs-15
docs/api-integration-guide
refactor/jambaars-table-component
hotfix/critical-auth-bypass
```

**Types autorisés :** `feat`, `fix`, `chore`, `docs`, `refactor`, `hotfix`

---

## 💬 Format des commits

Nous suivons [Conventional Commits](https://www.conventionalcommits.org/) :

```
<type>(<scope>): <description courte en anglais>

[corps optionnel]

[footer optionnel]
```

**Types :** `feat`, `fix`, `docs`, `style`, `refactor`, `chore`, `perf`

**Scopes :** `auth`, `dashboard`, `structures`, `jambaars`, `rewards`, `reports`, `settings`, `api`, `ci`, `deps`

**Exemples :**
```
feat(structures): add document validation modal
fix(auth): handle expired JWT token gracefully
chore(deps): upgrade tanstack-query to v5
refactor(dashboard): extract KPI logic to custom hook
```

---

## 🏗️ Architecture & Conventions de code

### Où placer les fichiers ?

| Ce que tu crées | Où |
|---|---|
| Page/écran | `src/app/(dashboard)/[module]/page.tsx` |
| Composant spécifique à un module | `src/components/[module]/` |
| Composant réutilisable | `src/components/shared/` |
| Appels API | `src/services/[resource].service.ts` |
| Hook custom | `src/lib/hooks/use[Name].ts` |
| Type TypeScript | `src/types/index.ts` |
| Constante métier | `src/lib/constants/index.ts` |
| État global | `src/store/` |

### Règles TypeScript

- ❌ Pas de `any` — utiliser des types précis ou `unknown`
- ✅ Typer toutes les props de composants
- ✅ Utiliser les types définis dans `src/types/`
- ✅ Exporter les types depuis le fichier du composant si locaux

### Règles de composants

- 1 fichier = 1 composant (pas de composants géants)
- Props typées avec une `interface` locale ou importée
- Pas de logique métier dans les composants → l'extraire dans un hook

---

## ✅ Checklist avant d'ouvrir une PR

```bash
npm run lint          # ✅ Zéro erreur
npm run type-check    # ✅ Zéro erreur TypeScript
npm run build         # ✅ Build réussi
```

---

## 🔐 Sécurité

- **Ne jamais** committer de `.env.local` ou de clés API
- Mettre à jour `.env.example` si tu ajoutes une variable d'environnement
- Toute donnée de santé sensible doit passer par l'API sécurisée, jamais stockée en localStorage

---

## ❓ Questions

Ouvrir une issue avec le label `question` ou contacter le lead frontend directement.
