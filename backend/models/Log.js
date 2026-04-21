const mongoose = require("mongoose")

const LogSchema = new mongoose.Schema({
  type:   { type: String, enum: ["Création", "Modification", "Suppression", "Info"] },
  action: { type: String, required: true },
  user:   { type: String, required: true },
}, { timestamps: true })

module.exports = mongoose.model("Log", LogSchema)
