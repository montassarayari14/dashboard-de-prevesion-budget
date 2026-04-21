// backend/seed.js — initialise la base avec les 6 directions et 3 comptes de test
// Usage : node seed.js

const mongoose = require("mongoose")
const bcrypt   = require("bcryptjs")
require("dotenv").config()

// ── 6 directions fixes du projet ──
const DIRECTIONS = [
  { code: "AI",  nom: "Direction Audit Interne",          budget: 80000,  budgetN1: 72000  },
  { code: "AJ",  nom: "Direction Affaires Juridiques",    budget: 60000,  budgetN1: 55000  },
  { code: "CG",  nom: "Direction Contrôle de Gestion",    budget: 90000,  budgetN1: 82000  },
  { code: "DI",  nom: "Direction Informatique",           budget: 120000, budgetN1: 100000 },
  { code: "RH",  nom: "Direction Ressources Humaines",    budget: 150000, budgetN1: 130000 },
  { code: "SP",  nom: "Direction Stratégie & Planification", budget: 70000, budgetN1: 65000 },
]

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User      = require("./models/User")
  const Direction = require("./models/Direction")

  // ── Créer ou mettre à jour les 6 directions ──
  for (const d of DIRECTIONS) {
    await Direction.findOneAndUpdate(
      { code: d.code },
      { ...d, directeur: null, statut: "brouillon", postes: [] },
      { upsert: true }
    )
    console.log(`✅ Direction ${d.code} — ${d.nom}`)
  }

  // ── Compte Admin ──
  await User.findOneAndUpdate(
    { email: "admin@budget.tn" },
    { nom: "Système", prenom: "Admin", email: "admin@budget.tn",
      motDePasse: await bcrypt.hash("admin123", 10),
      role: "Admin", direction: "-", status: "actif" },
    { upsert: true }
  )
  console.log("✅ Admin        → admin@budget.tn   / admin123  → /dashboard")

  // ── Compte Directeur Général ──
  await User.findOneAndUpdate(
    { email: "dg@budget.tn" },
    { nom: "Belhaj", prenom: "Kamel", email: "dg@budget.tn",
      motDePasse: await bcrypt.hash("admin123", 10),
      role: "DG", direction: "-", status: "actif" },
    { upsert: true }
  )
  console.log("✅ DG           → dg@budget.tn      / admin123  → /dg/dashboard")

  // ── Compte Directeur (Direction Informatique DI) ──
  await User.findOneAndUpdate(
    { email: "di@budget.tn" },
    { nom: "Mekki", prenom: "Sana", email: "di@budget.tn",
      motDePasse: await bcrypt.hash("admin123", 10),
      role: "Directeur", direction: "DI", status: "actif" },
    { upsert: true }
  )
  // Assigner le directeur à la direction DI
  await Direction.findOneAndUpdate({ code: "DI" }, { directeur: "Sana Mekki" })
  console.log("✅ Directeur DI → di@budget.tn      / admin123  → /direction/dashboard")

  console.log("\n📋 Directions disponibles :")
  DIRECTIONS.forEach((d) => console.log(`   ${d.code} — ${d.nom} (budget: ${d.budget.toLocaleString()} DT)`))

  process.exit()
}).catch((err) => {
  console.error("❌ Erreur :", err.message)
  process.exit(1)
})
