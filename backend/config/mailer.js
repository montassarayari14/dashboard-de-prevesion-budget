const nodemailer = require("nodemailer")

// ✅ service:"gmail" — évite les erreurs RFC 5322 de domaine
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

// Envoie un email de réinitialisation de mot de passe
async function envoyerEmailReset(destinataire, lien) {
  await transporter.sendMail({
    // ✅ from = adresse Gmail brute — pas de nom personnalisé
    from:    process.env.MAIL_USER,
    to:      destinataire,
    subject: "Réinitialisation de votre mot de passe — Budget Prévisionnel",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0f172a;color:#e2e8f0;border-radius:16px;">
        <h2 style="color:#818cf8;margin-bottom:8px;">Réinitialisation du mot de passe</h2>
        <p style="color:#94a3b8;font-size:14px;margin-bottom:24px;">
          Vous avez demandé la réinitialisation de votre mot de passe.<br>
          Ce lien est valable <strong style="color:#e2e8f0;">1 heure</strong>.
        </p>
        <a href="${lien}"
           style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;
                  padding:12px 28px;border-radius:10px;font-size:14px;font-weight:600;">
          Réinitialiser mon mot de passe
        </a>
        <p style="color:#475569;font-size:12px;margin-top:24px;">
          Si vous n'avez pas fait cette demande, ignorez cet email.<br>
          Votre mot de passe ne changera pas.
        </p>
        <hr style="border:none;border-top:1px solid #1e293b;margin-top:24px;">
        <p style="color:#334155;font-size:11px;">Dashboard Budgétaire Prévisionnel — 2025</p>
      </div>
    `,
  })
}

module.exports = { envoyerEmailReset }