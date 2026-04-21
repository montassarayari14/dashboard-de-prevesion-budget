# Guide d'utilisation — Dashboard Budgétaire Prévisionnel

---

## Démarrage du projet

```bash
# Terminal 1 — Backend
cd backend
npm install
node seed.js        ← crée les 3 comptes de test
npm run dev         ← démarre sur http://localhost:5000

# Terminal 2 — Frontend
cd dashboard
npm install
npm run dev         ← démarre sur http://localhost:5173
```

### Comptes de test

| Rôle | Email | Mot de passe | Page d'accueil |
|---|---|---|---|
| Administrateur | admin@budget.tn | admin123 | /dashboard |
| Directeur Général | dg@budget.tn | admin123 | /dg/dashboard |
| Directeur DSI | dsi@budget.tn | admin123 | /direction/dashboard |

> Le mot de passe par défaut de tout nouveau compte créé par l'Admin est **123456**.

---

## Axe 1 — Espace Administrateur

L'administrateur gère les comptes et les directions. Il ne fait pas de budget lui-même.

---

### Page 1 : Tableau de bord Admin (`/dashboard`)

**Ce qu'elle affiche :**
- Nombre total d'utilisateurs dans le système
- Nombre d'utilisateurs actifs vs inactifs
- Nombre de directions enregistrées
- Répartition des rôles (camembert ou liste)

**Ce qu'elle fait :** Vue de synthèse rapide. Aucune action ici.

---

### Page 2 : Gestion des comptes (`/admin/comptes`)

**Ce qu'elle affiche :**
- Tableau de tous les utilisateurs (nom, prénom, email, rôle, direction, statut)
- Barre de recherche par nom

**Actions disponibles :**

| Bouton | Ce qu'il fait |
|---|---|
| **Nouvel utilisateur** | Ouvre la modale de création |
| **Activer / Désactiver** | Bloque ou réactive l'accès au compte |
| **Supprimer** | Efface définitivement le compte |

**Comment créer un Directeur :**
1. Cliquer sur "Nouvel utilisateur"
2. Remplir : Nom, Prénom, Email
3. Choisir le rôle **Directeur**
4. Saisir le **code de direction** → il doit correspondre exactement au code d'une direction existante (ex : `DSI`, `RH`, `FIN`)
5. Cliquer sur "Créer le compte"

> ⚠️ **Erreur fréquente** : Si le code de direction ne correspond à aucune direction créée dans la page Directions, le directeur ne verra rien dans son interface. Toujours créer la direction d'abord.

---

### Page 3 : Gestion des directions (`/admin/directions`)

**Ce qu'elle affiche :**
- Tableau des directions avec leur code, nom, directeur assigné, budget alloué, statut

**Actions disponibles :**

| Bouton | Ce qu'il fait |
|---|---|
| **Nouvelle direction** | Crée une direction avec code, nom et budget alloué |
| **Modifier** | Change le budget, le nom ou le directeur |
| **Supprimer** | Supprime la direction |

**Comment créer une direction :**
1. Cliquer sur "Nouvelle direction"
2. Saisir un **code unique** (ex : `DSI`, `RH`, `FIN`) — en majuscules
3. Saisir le nom complet (ex : "Direction des Systèmes d'Information")
4. Saisir le **budget alloué 2025** en DT (ex : 120000)
5. Saisir le **budget 2024** (N-1) pour les comparaisons
6. Saisir le nom du directeur (optionnel)
7. Cliquer sur "Enregistrer"

> Le code de direction est la clé de liaison entre un Directeur et sa direction. Ils doivent être identiques.

---

### Page 4 : Journaux d'audit (`/admin/logs`)

**Ce qu'elle affiche :**
- Historique de toutes les actions effectuées dans le système
- Type d'action : Création, Modification, Suppression, Info (connexion)
- Utilisateur concerné et date/heure

**Ce qu'elle fait :** Lecture seule. Permet à l'admin de tracer qui a fait quoi et quand.

---

## Axe 2 — Espace Directeur de Direction

Le directeur prépare le budget de sa direction et le soumet à la Direction Générale.

---

### Page 1 : Tableau de bord Directeur (`/direction/dashboard`)

**Ce qu'elle affiche :**
- **Budget alloué** : enveloppe fixée par l'Admin
- **Total estimé** : somme de tous les postes saisis
- **Reste disponible** : budget alloué − total estimé (rouge si dépassement)
- **vs 2024** : variation globale par rapport à l'année précédente
- **Répartition par catégorie** : barres de progression par type de dépense
- **Jauge d'utilisation** : pourcentage de l'enveloppe utilisée
- **Statut de la demande** : Brouillon / Soumis / Approuvé / Rejeté
- **Commentaire DG** : visible si la demande a été rejetée avec un commentaire

**Actions disponibles :**
- **Soumettre à la DG** : envoie la demande (uniquement en statut Brouillon)
- **Réviser et resoumettre** : visible uniquement si la demande a été rejetée

---

### Page 2 : Mon budget (`/direction/budget`)

**Ce qu'elle affiche :**
- Tableau de tous les postes de dépenses avec : nom, catégorie, montant 2025, montant 2024, écart %, justification
- Total estimé vs budget alloué en bas du tableau

**Comment ajouter un poste :**
1. Cliquer sur **"+ Ajouter un poste"**
2. Saisir l'intitulé du poste (ex : "Licences logiciels")
3. Choisir la catégorie : Informatique / RH-Formation / Infrastructure / Général / Autre
4. Saisir le montant estimé 2025 (obligatoire)
5. Saisir le montant 2024 (optionnel, pour le calcul de l'écart)
6. Saisir une justification (optionnel)
7. Cliquer sur "Enregistrer" → le poste est sauvegardé automatiquement en base

**Comment modifier un poste :**
- Cliquer sur **"Modifier"** sur la ligne du poste → la modale s'ouvre pré-remplie
- Modifier les champs souhaités → "Enregistrer"

**Comment supprimer un poste :**
- Cliquer sur **"✕"** → confirmation → poste supprimé

**Comment soumettre à la DG :**
1. Vérifier que tous les postes sont corrects
2. Cliquer sur **"Soumettre à la DG"**
3. Confirmer dans la boîte de dialogue
4. Le statut passe à **"Soumis à la DG"** → plus modifiable

> ⚠️ Une fois soumise, la demande ne peut plus être modifiée sauf si la DG la rejette.

---

### Page 3 : Statistiques (`/direction/statistiques`)

**Ce qu'elle affiche :**
- KPIs : budget alloué, total 2025, total 2024, variation globale
- **Comparaison poste par poste** : double barre pour chaque poste (2024 en gris, 2025 en couleur)
- **Répartition par catégorie** : part de chaque catégorie dans le total
- **Résumé des variations** : taux d'utilisation, plus forte hausse, plus forte baisse, variation nette

**Ce qu'elle fait :** Lecture seule. Aide le directeur à analyser et justifier ses choix budgétaires.

---

### Page 4 : Historique (`/direction/historique`)

**Ce qu'elle affiche :**
- Toutes les campagnes précédentes de **cette direction uniquement**
- Pour chaque campagne : année, total demandé, budget alloué, écart, statut, dates, commentaire DG

**Ce qu'elle fait :** Lecture seule. Permet de suivre l'évolution du budget direction sur plusieurs années.

---

## Axe 3 — Espace Directeur Général

Le DG supervise toutes les directions, consulte les demandes et prend les décisions d'approbation.

---

### Page 1 : Tableau de bord DG (`/dg/dashboard`)

**Ce qu'elle affiche :**
- **Budget total alloué** : somme de toutes les enveloppes de toutes les directions
- **Total demandé** : somme de toutes les demandes soumises
- **En attente** : nombre de demandes qui nécessitent une décision
- **Traitées** : nombre d'approbations + rejets
- **Barres budget par direction** : visualisation de la demande de chaque direction vs son enveloppe
- **État des demandes** : répartition par statut
- **Alertes** : liste des directions en attente de décision

**Ce qu'elle fait :** Vue de synthèse globale. Aucune action directe ici.

---

### Page 2 : Toutes les demandes (`/dg/demandes`)

**Ce qu'elle affiche :**
- Tableau de toutes les directions avec : code, directeur, budget alloué, total demandé, écart, statut, date de soumission
- Barre de recherche par code ou nom de direction

**Ce qu'elle fait :**
- Voir d'un coup d'œil l'état de chaque direction
- Cliquer sur **"Détail"** pour aller à la page de décision

> Les sous-pages `/dg/en-attente`, `/dg/approuvees`, `/dg/rejetees` affichent le même tableau avec un filtre automatique.

---

### Page 3 : Détail d'une demande (`/dg/demandes/:id`)

**Ce qu'elle affiche :**
- Infos de la direction (nom, directeur, date de soumission)
- KPIs : budget alloué, total demandé, marge disponible
- Tableau de tous les postes budgétaires soumis par le directeur
- Commentaire DG si décision déjà prise

**Comment prendre une décision :**
1. La direction doit être en statut **"Soumis à la DG"** (bouton visible uniquement dans ce cas)
2. Cliquer sur **"Prendre une décision"**
3. Choisir **Approuver** ou **Rejeter**
4. Ajouter un commentaire (optionnel mais recommandé en cas de rejet)
5. Cliquer sur **"Confirmer"**
6. Le statut change immédiatement et la décision est archivée dans l'historique

> En cas de rejet, le directeur voit le commentaire du DG dans son tableau de bord et peut corriger et resoumettre.

---

### Page 4 : Statistiques DG (`/dg/statistiques`)

**Ce qu'elle affiche :**
- KPIs globaux : enveloppe totale, total demandé, taux d'utilisation global, évolution vs 2024
- **Budget 2025 vs 2024 par direction** : double barre pour chaque direction avec badge d'écart
- **Répartition de l'enveloppe** : part de chaque direction dans le budget total
- **Taux d'utilisation par direction** : quel % de son enveloppe chaque direction a demandé

**Ce qu'elle fait :** Lecture seule. Aide le DG à arbitrer les budgets.

---

### Page 5 : Historique (`/dg/historique`)

**Ce qu'elle affiche :**
- Toutes les décisions prises sur toutes les campagnes et toutes les directions
- Filtres par année et par direction
- Pour chaque ligne : campagne, direction, directeur, montant demandé, alloué, statut, date décision, commentaire

**Ce qu'elle fait :** Lecture seule. Mémoire institutionnelle de toutes les décisions budgétaires.

---

## Workflow complet — Qui fait quoi et dans quel ordre

```
1. ADMIN crée les directions (avec code et budget)
        ↓
2. ADMIN crée les comptes Directeurs (avec le même code de direction)
        ↓
3. DIRECTEUR se connecte → voit son tableau de bord
        ↓
4. DIRECTEUR saisit ses postes de dépenses (Mon budget)
        ↓
5. DIRECTEUR soumet sa demande à la DG
        ↓
6. DG consulte la demande dans l'espace Demandes
        ↓
7. DG approuve ou rejette avec un commentaire
        ↓
  ┌─ Si approuvé → statut "Approuvé" définitif ─────────────────────┐
  └─ Si rejeté   → Directeur reçoit le commentaire et peut corriger ─┘
        ↓
8. Tout est archivé dans l'historique (visible Admin + DG + Directeur)
```

---

## Causes fréquentes d'erreurs et solutions

| Problème | Cause | Solution |
|---|---|---|
| "Aucune direction assignée" | Code direction du compte ≠ code de la direction en base | Vérifier que le code est identique (majuscules) |
| "Email déjà utilisé" | Un compte avec cet email existe déjà | Utiliser un autre email |
| "Token invalide" | Session expirée (24h) | Se reconnecter |
| Bouton "Soumettre" grisé | Aucun poste n'a été ajouté | Ajouter au moins un poste avant de soumettre |
| Directeur voit page blanche | Direction non créée par l'Admin | L'Admin doit d'abord créer la direction |
| Bouton "Prendre une décision" absent | La demande n'est pas en statut "en_attente" | Attendre que le directeur soumette |
