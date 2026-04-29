const express  = require("express")
const mongoose = require("mongoose")
const cors     = require("cors")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth",       require("./routes/auth"))
app.use("/api/users",      require("./routes/users"))
app.use("/api/directions", require("./routes/directions"))
app.use("/api/logs",       require("./routes/logs"))

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.log("Erreur MongoDB:", err))

app.listen(process.env.PORT || 5000, () => {
  console.log(`Serveur lancé sur http://localhost:${process.env.PORT || 5000}`)
})