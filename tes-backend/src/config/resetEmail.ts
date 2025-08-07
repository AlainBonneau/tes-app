import nodemailer from "nodemailer";

export default async function sendResetEmail({
  email,
  resetUrl,
}: {
  email: string;
  resetUrl: string;
}) {
  // Création d'un compte de test Ethereal à chaque envoi (à changer en prod)
  let testAccount = await nodemailer.createTestAccount();

  // Création du transporteur SMTP Ethereal
  let transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Envoi de l'email
  let info = await transporter.sendMail({
    from: '"The Elder Scrolls" <no-reply@elderscrolls.fr>',
    to: email,
    subject: "Réinitialisation de mot de passe",
    html: `
      <p>Tu as demandé à réinitialiser ton mot de passe.</p>
      <p>
        Clique sur ce lien pour choisir un nouveau mot de passe :<br>
        <a href="${resetUrl}">${resetUrl}</a>
      </p>
      <p>Ce lien est valable 1h.</p>
    `,
  });

  console.log("✉️  Email envoyé (test) :", nodemailer.getTestMessageUrl(info));
}
