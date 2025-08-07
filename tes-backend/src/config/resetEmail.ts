import nodemailer from "nodemailer";

type ResetEmailConfig = {
  email: string;
  resetUrl: string;
};

async function sendResetEmail({ email, resetUrl }: ResetEmailConfig) {
  // Configure ton transporter avec un vrai service (gmail, mailjet, ovh...)
  let transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 465, // ou 587
    secure: true, // true pour 465, false pour 587
    auth: {
      user: "ton_email@example.com",
      pass: "ton_mot_de_passe",
    },
  });

  await transporter.sendMail({
    from: '"Ton Site" <noreply@tonsite.fr>',
    to: email,
    subject: "Réinitialisation de ton mot de passe",
    html: `
      <p>Tu as demandé à réinitialiser ton mot de passe.</p>
      <p>Clique sur ce lien pour définir un nouveau mot de passe :</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>Ce lien expirera dans 1h.</p>
    `,
  });
}

export default sendResetEmail;
