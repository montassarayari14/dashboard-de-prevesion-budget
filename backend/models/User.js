const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  nom:        { type: String, required: true },
  prenom:     { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  
  role: {
    type: String,
    enum: ["Admin", "Directeur", "Directeur Generale", "DG"],
    default: "Directeur"
  },
  direction: { type: String, default: "-" },
  status:    { type: String, enum: ["actif", "inactif"], default: "actif" },
}, { timestamps: true })

module.exports = mongoose.model("User", UserSchema)