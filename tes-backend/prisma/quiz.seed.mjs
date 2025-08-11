// prisma/seed.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const slug = "elder-scrolls-demo";
  await prisma.quiz.upsert({
    where: { slug },
    create: {
      title: "Lore Elder Scrolls – Démo",
      slug,
      questions: {
        create: [
          {
            order: 0,
            question: "Quelle province abrite la Cité Impériale ?",
            options: ["Skyrim", "Cyrodiil", "Morrowind", "Haute-Roche"],
            correctAnswerIndex: 1,
            explanation:
              "La Cité Impériale se trouve au cœur de Cyrodiil, siège de l’Empire Tamrielien.",
            difficulty: "easy",
          },
        ],
      },
    },
    update: {},
  });
  console.log("✅ Seed quiz elder-scrolls-demo OK");
}

main().finally(() => prisma.$disconnect());
