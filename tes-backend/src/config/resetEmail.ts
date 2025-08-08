import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendResetEmail({
  email,
  resetUrl,
}: {
  email: string;
  resetUrl: string;
}) {
  try {
    const data = await resend.emails.send({
      from: "The Elder Scrolls <no-reply@sparcky-dev.fr>", // Idéalement un domaine vérifié chez Resend
      to: email,
      subject: "Réinitialisation de ton mot de passe",
      html: `
        <p>Tu as demandé à réinitialiser ton mot de passe.</p>
        <p>
          Clique sur ce lien pour définir un nouveau mot de passe :<br>
          <a href="${resetUrl}">${resetUrl}</a>
        </p>
        <p>Ce lien expirera dans 1 heure.</p>
      `,
    });

    console.log("✉️ Email envoyé avec Resend :", data);
  } catch (error) {
    console.error("Erreur envoi mail Resend:", error);
    throw error;
  }
}
