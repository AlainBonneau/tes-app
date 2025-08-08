import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendResetEmail from "../config/resetEmail";

// Fonction pour gérer la demande de réinitialisation de mot de passe
export async function forgetPassword(
  request: FastifyRequest<{ Body: { email: string } }>,
  reply: FastifyReply
) {
  try {
    const { email } = request.body;
    if (!email) {
      return reply.status(400).send({ error: "Email requis" });
    }

    const user = await request.server.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return reply
        .status(200)
        .send({ message: "Si un compte existe, un email a été envoyé." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await request.server.prisma.user.update({
      where: { email },
      data: {
        resetToken: tokenHash,
        resetTokenExpiry: new Date(Date.now() + 3600000), // 1h
      },
    });

    // TODO: Changer l'URL en prod
    const resetUrl = `https://atlas-of-tamriel.vercel.app/reset-password?token=${token}&email=${encodeURIComponent(
      email
    )}`;
    await sendResetEmail({
      email,
      resetUrl,
    });

    return reply
      .status(200)
      .send({ message: "Si un compte existe, un email a été envoyé." });
  } catch (err) {
    return reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}

// Fonction pour gérer la réinitialisation du mot de passe
export async function resetPassword(
  request: FastifyRequest<{
    Body: { email: string; token: string; newPassword: string };
  }>,
  reply: FastifyReply
) {
  try {
    const { email, token, newPassword } = request.body;

    if (!email || !token || !newPassword) {
      return reply.status(400).send({ error: "Données manquantes" });
    }

    const user = await request.server.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return reply.status(400).send({ error: "Lien invalide" });
    }

    if (user.resetTokenExpiry < new Date()) {
      return reply.status(400).send({ error: "Lien expiré" });
    }

    // Vérifie le hash du token reçu
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    if (user.resetToken !== tokenHash) {
      return reply.status(400).send({ error: "Lien invalide" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await request.server.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return reply.status(200).send({ message: "Mot de passe réinitialisé !" });
  } catch (err) {
    return reply.status(500).send({ error: "Erreur interne du serveur" });
  }
}
