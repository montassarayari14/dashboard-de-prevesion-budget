# PFE — Dashboard Budgétaire Prévisionnel · Fichier maître

> Lire ce fichier suffit pour reprendre le projet depuis zéro dans une nouvelle session.

---

## Stack & lancement

```
Frontend : React + Vite + Tailwind · src/ dans dashboard/
Backend  : Node.js + Express + MongoDB (Mongoose) · backend/
Auth     : JWT (24h) · Bearer token via interceptor Axios
```

```bash
# Terminal 1
cd backend && node seed.js && npm run dev   # → localhost:5000

# Terminal 2
cd dashboard && npm run dev                 # → localhost:5173
```

---

## 6 Directions fixes (codes immuables)

| Code | Nom complet | Budget 2025 | Budget 2024 |
|------|-------------|-------------|-------------|
| AI | Direction Audit Interne | 80 000 DT | 72 000 DT |
| AJ | Direction Affaires Juridiques | 60 000 DT | 55 000 DT |
| CG | Direction Contrôle de Gestion | 90 000 DT | 82 000 DT |
| DI | Direction Informatique | 120 000 DT | 100 000 DT |
| RH | Direction Ressources Humaines | 150 000 DT | 130 000 DT |
| SP | Direction Stratégie & Planification | 70 000 DT | 65 000 DT |

> Créées automatiquement par `seed.js`. Codes et noms **fixes et immuables**.
> Le code est la clé de liaison entre un compte Directeur et sa direction en MongoDB.

```js
// Correspondance code → nom court (DirecteurSidebar + AddUser)
const NOMS_DIRECTIONS = {
  AI: "Audit Interne",
  AJ: "Affaires Juridiques",
  CG: "Contrôle de Gestion",
  DI: "Direction Informatique",
  RH: "Ressources Humaines",
  SP: "Stratégie & Planification",
}
```

### Changements v2
- `AddUser.jsx` : direction = **select fixe** (plus de saisie libre, plus d'erreur de code)
- `DirecteurSidebar.jsx` : affiche le **nom complet** via `NOMS_DIRECTIONS[user.direction]`
- `seed.js` : noms avec accents et orthographe exacte

---

## Comptes de test (créés par seed.js)

| Rôle | Email | MDP | Redirection |
|------|-------|-----|-------------|
| Admin | admin@budget.tn | admin123 | /dashboard |
| Directeur Général | dg@budget.tn | admin123 | /dg/dashboard |
| Directeur DI | di@budget.tn | admin123 | /direction/dashboard |

> Mot de passe par défaut de tout nouveau compte créé par l'Admin : **123456**

---

## Structure des fichiers

```
projet-pfe/
├── backend/
│   ├── middleware/auth.js          ← verifyToken, adminOnly, dgOnly, adminOrDG
│   ├── models/
│   │   ├── User.js                 ← roles: Admin | Directeur | DG
│   │   ├── Direction.js            ← postes[], statut, budget, totalDemande…
│   │   ├── Historique.js           ← archive des décisions DG par campagne
│   │   └── Log.js                  ← journal d'audit
│   ├── routes/
│   │   ├── auth.js                 ← POST /login → retourne token + redirect
│   │   ├── users.js                ← CRUD + /email + /password + /toggle
│   │   ├── directions.js           ← toutes les routes (voir tableau ci-dessous)
│   │   └── logs.js                 ← GET /logs
│   ├── seed.js                     ← initialise directions + comptes de test
│   └── server.js
│
└── dashboard/src/
    ├── api/axios.js                 ← baseURL :5000, interceptor Bearer + redirect 401
    ├── component/
    │   ├── SideBar.jsx              ← Admin : 4 liens (dashboard, comptes, logs, paramètres)
    │   ├── PrivateRoute.jsx         ← garde : token + rôle in [Admin, DG, Directeur]
    │   ├── AddUser.jsx              ← modale création compte (direction obligatoire si Directeur)
    │   └── directeur/
    │       ├── DirecteurSidebar.jsx
    │       ├── StatutBadge.jsx      ← brouillon/en_attente/approuve/rejete
    │       ├── EcartPill.jsx        ← % variation N vs N-1
    │       └── ModalePoste.jsx      ← ajout/modif poste budgétaire
    │   └── dg/
    │       ├── DGSidebar.jsx
    │       ├── StatCard.jsx
    │       ├── StatutBadge.jsx
    │       ├── EcartPill.jsx
    │       └── ModaleDecision.jsx   ← approuver/rejeter + commentaire
    ├── Pages/
    │   ├── LoginPage.jsx            ← navigate(res.data.redirect)
    │   ├── Dashboard.jsx            ← stats utilisateurs
    │   ├── Account.jsx              ← gestion comptes
    │   ├── Audit.jsx                ← journaux
    │   ├── Parametres.jsx           ← email + mot de passe + dark mode
    │   ├── directeur/
    │   │   ├── DirecteurDashboard.jsx
    │   │   ├── DirecteurBudget.jsx
    │   │   ├── DirecteurStatistiques.jsx
    │   │   └── DirecteurHistorique.jsx
    │   └── dg/
    │       ├── DGDashboard.jsx
    │       ├── DGDemandes.jsx       ← filtre auto via pathname
    │       ├── DGDetail.jsx
    │       ├── DGStatistiques.jsx
    │       └── DGHistorique.jsx
    └── App.jsx                      ← toutes les routes des 3 axes
```

---

## Modèles Mongoose

### User
```js
{ nom, prenom, email, motDePasse,
  role: "Admin" | "Directeur" | "DG",
  direction: "AI"|"AJ"|"CG"|"DI"|"RH"|"SP"|"-",
  status: "actif"|"inactif" }
```

### Direction
```js
{ code, nom, directeur,
  budget, budgetN1,
  postes: [{ nom, categorie, montant, montantN1, justification }],
  totalDemande, totalDemandeN1,
  statut: "brouillon"|"en_attente"|"approuve"|"rejete",
  soumisLe, commentaireDG, decisionLe }
```

### Historique
```js
{ annee, code, nom, directeur, budget, totalDemande,
  statut, commentaireDG, decisionLe }
```

### Log
```js
{ type: "Création"|"Modification"|"Suppression"|"Info", action, user, createdAt }
```

---

## Toutes les routes backend

### Auth
| Méthode | URL | Accès | Retour |
|---------|-----|-------|--------|
| POST | /api/auth/login | Public | `{ token, user, redirect }` |

`redirect` selon le rôle : Admin→`/dashboard` · Directeur→`/direction/dashboard` · DG→`/dg/dashboard`

### Users
| Méthode | URL | Accès |
|---------|-----|-------|
| GET | /api/users | Admin |
| POST | /api/users | Admin |
| PUT | /api/users/:id/toggle | Admin |
| DELETE | /api/users/:id | Admin |
| PUT | /api/users/:id/email | Soi-même |
| PUT | /api/users/:id/password | Soi-même |

### Directions
| Méthode | URL | Accès | Note |
|---------|-----|-------|------|
| GET | /api/directions/ma-direction | Directeur | Charge sa propre direction via `user.direction` |
| GET | /api/directions/historique?code=XX | Tous auth | `?code=` filtre par direction |
| GET | /api/directions | Admin+DG | Liste toutes |
| GET | /api/directions/:id | Admin+DG | Détail |
| POST | /api/directions | Admin | Créer |
| PUT | /api/directions/:id | Admin | Modifier |
| DELETE | /api/directions/:id | Admin | Supprimer |
| PUT | /api/directions/:id/postes | Directeur | Sauvegarde postes (brouillon/rejeté seulement) |
| PUT | /api/directions/:id/soumettre | Directeur | Soumet → statut="en_attente" |
| PUT | /api/directions/:id/decision | DG | `{ statut:"approuve"|"rejete", commentaire }` → archive dans Historique |

> ⚠️ Dans Express, l'ordre des routes dans directions.js est CRITIQUE :
> `/ma-direction` → `/historique` → `/:id` (dans cet ordre sinon Express capture les mots comme des IDs)

### Logs
| Méthode | URL | Accès |
|---------|-----|-------|
| GET | /api/logs | Admin+DG |

---

## Toutes les routes frontend (App.jsx)

| URL | Composant | Rôle |
|-----|-----------|------|
| /login | LoginPage | — |
| /dashboard | Dashboard | Admin |
| /admin/comptes | Account | Admin |
| /admin/logs | Audit | Admin |
| /admin/parametres | Parametres | Admin |
| /direction/dashboard | DirecteurDashboard | Directeur |
| /direction/budget | DirecteurBudget | Directeur |
| /direction/statistiques | DirecteurStatistiques | Directeur |
| /direction/historique | DirecteurHistorique | Directeur |
| /dg/dashboard | DGDashboard | DG |
| /dg/demandes | DGDemandes | DG |
| /dg/demandes/:id | DGDetail | DG |
| /dg/en-attente | DGDemandes (filtre) | DG |
| /dg/approuvees | DGDemandes (filtre) | DG |
| /dg/rejetees | DGDemandes (filtre) | DG |
| /dg/statistiques | DGStatistiques | DG |
| /dg/historique | DGHistorique | DG |

---

## Workflow complet

```
1. seed.js → crée les 6 directions + 3 comptes
2. Admin crée les comptes Directeurs (code direction = code existant)
3. Directeur saisit ses postes (Mon budget) → sauvegarde auto
4. Directeur soumet → statut "en_attente"
5. DG consulte (Demandes → Détail) → prend une décision
6. Si approuvé → archivé dans Historique
   Si rejeté   → Directeur reçoit commentaire → peut corriger et resoumettre
```

---

## Fichiers créés dans cette session (à intégrer dans le projet)

### Nouveaux fichiers à CRÉER
| Fichier | Destination |
|---------|-------------|
| `Parametres.jsx` | `dashboard/src/Pages/` |
| `DirecteurSidebar.jsx` | `dashboard/src/component/directeur/` |
| `DirecteurDashboard.jsx` | `dashboard/src/Pages/directeur/` |
| `DirecteurBudget.jsx` | `dashboard/src/Pages/directeur/` |
| `DirecteurStatistiques.jsx` | `dashboard/src/Pages/directeur/` |
| `DirecteurHistorique.jsx` | `dashboard/src/Pages/directeur/` |
| `StatutBadge.jsx` (×2) | `component/directeur/` et `component/dg/` |
| `EcartPill.jsx` (×2) | `component/directeur/` et `component/dg/` |
| `ModalePoste.jsx` | `component/directeur/` |
| `DGSidebar.jsx` | `component/dg/` |
| `StatCard.jsx` | `component/dg/` |
| `ModaleDecision.jsx` | `component/dg/` |
| `DGDashboard.jsx` | `Pages/dg/` |
| `DGDemandes.jsx` | `Pages/dg/` |
| `DGDetail.jsx` | `Pages/dg/` |
| `DGStatistiques.jsx` | `Pages/dg/` |
| `DGHistorique.jsx` | `Pages/dg/` |
| `middleware/auth.js` | `backend/middleware/` |
| `models/Direction.js` (remplacer) | `backend/models/` |
| `models/Historique.js` | `backend/models/` |
| `seed.js` | `backend/` |

### Fichiers à REMPLACER
| Fichier | Destination |
|---------|-------------|
| `App.jsx` | `dashboard/src/` |
| `SideBar.jsx` | `dashboard/src/component/` |
| `AddUser.jsx` | `dashboard/src/component/` |
| `PrivateRoute.jsx` | `dashboard/src/component/` |
| `LoginPage.jsx` | `dashboard/src/Pages/` |
| `api/axios.js` | `dashboard/src/api/` |
| `models/User.js` | `backend/models/` |
| `routes/auth.js` | `backend/routes/` |
| `routes/users.js` | `backend/routes/` |
| `routes/directions.js` | `backend/routes/` |
| `routes/logs.js` | `backend/routes/` |

---

## Style (cohérence visuelle entre les 3 interfaces)

Toutes les interfaces partagent les mêmes couleurs :

| Élément | Valeur |
|---------|--------|
| Fond global | `#050b1a` |
| Cartes | `#0f172a` |
| Sidebar | `#0d1117` (Admin) / `#0d1424` (Directeur/DG) |
| Bordures | `#1e293b` |
| Indigo accent | `#6366f1` |
| Amber (attention) | `#fbbf24` |
| Vert (succès) | `#4ade80` |
| Rouge (erreur) | `#f87171` |

Styles : Admin et Directeur utilisent **Tailwind CSS** · Interface DG utilise **inline styles uniquement**

---

## Points d'attention techniques

1. **Ordre des routes Express** dans `directions.js` : `/ma-direction` et `/historique` AVANT `/:id`
2. **Liaison direction↔directeur** : le champ `User.direction` doit être identique au `Direction.code` (ex: `"DI"`)
3. **Token JWT** envoyé via `Authorization: Bearer <token>` (interceptor Axios dans `api/axios.js`)
4. **Statuts valides** : `brouillon` → `en_attente` → `approuve` ou `rejete`
5. **Postes modifiables** uniquement en statut `brouillon` ou `rejete`
6. **Décision DG** : uniquement si statut `en_attente` → archive dans `Historique`
7. **Page Paramètres** : appelle `PUT /users/:id/email` et `PUT /users/:id/password` (routes protégées par identité)
