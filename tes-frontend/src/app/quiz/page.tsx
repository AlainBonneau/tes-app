"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  imageUrl?: string;
  difficulty?: "easy" | "medium" | "hard";
};

type QuizProps = {
  title?: string;
  questions?: Question[];
  perQuestionSeconds?: number;
};

const fallbackQuestions: Question[] = [
  {
    id: 1,
    question: "Quelle province abrite la Cité Impériale ?",
    options: ["Skyrim", "Cyrodiil", "Morrowind", "Haute-Roche"],
    correctAnswerIndex: 1,
    explanation:
      "La Cité Impériale se trouve au cœur de Cyrodiil, siège de l’Empire Tamrielien.",
    difficulty: "easy",
  },
];

export default function ElderScrollsQuiz({
  title = "Bestiaire • Quiz du Lore",
  questions = fallbackQuestions,
  perQuestionSeconds = 20,
}: QuizProps) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(perQuestionSeconds);
  const [showResult, setShowResult] = useState(false);

  const total = questions.length;
  const current = questions[index];

  useEffect(() => {
    if (!started || showResult) return;
    setSecondsLeft(perQuestionSeconds);
  }, [index, started, showResult, perQuestionSeconds]);

  useEffect(() => {
    if (!started || showResult) return;
    const t = setInterval(
      () => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)),
      1000
    );
    return () => clearInterval(t);
  }, [started, showResult]);

  function start() {
    setStarted(true);
  }

  function handleValidate() {
    if (locked) return;
    if (selected === current.correctAnswerIndex) {
      setScore((s) => s + 1);
    }
    setLocked(true);
  }

  function nextQuestion() {
    if (!locked) return;
    if (index + 1 < total) {
      setIndex((i) => i + 1);
      setSelected(null);
      setLocked(false);
    } else {
      setShowResult(true);
    }
  }

  const progress = ((index + (locked ? 1 : 0)) / total) * 100;

  return (
    <div className="min-h-screen bg-gold text-[#3A2E1E] font-sans flex flex-col">
      {/* Header comme le Bestiary */}
      <div className="bg-blood h-[20vh] w-full flex items-center justify-center mb-8 shadow">
        <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
          Bestiaire - Quiz
        </h1>
      </div>

      {/* Contenu */}
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 pb-12 flex-1">
        {/* Barre de progression */}
        <div className="w-full h-2 bg-stone rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gold transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Carte principale */}
        {!started && !showResult && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 md:p-8 bg-parchment text-[#3A2E1E] border-2 border-gold shadow"
          >
            <h2 className="text-2xl md:text-3xl font-cinzel mb-2 text-book">
              {title}
            </h2>
            <p className="mb-6 font-uncial opacity-90">
              Réponds aux questions dans le temps imparti. Utilise{" "}
              <span className="font-bold">1–4</span> pour choisir et{" "}
              <span className="font-bold">Entrée</span> pour valider.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={start}
                className="px-6 py-3 rounded border border-gold bg-blood text-gold font-cinzel hover:bg-gold/80 hover:text-blood transition shadow"
              >
                Commencer le quiz
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {started && !showResult && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="rounded-2xl p-6 md:p-8 bg-parchment text-[#3A2E1E] border-2 border-gold shadow"
            >
              {/* Question */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-cinzel">
                  Question {index + 1}/{total}
                </div>
                <div
                  className={`text-sm font-mono px-3 py-1 rounded-full border ${
                    secondsLeft <= 5
                      ? "border-rune text-rune"
                      : "border-gold text-book"
                  }`}
                >
                  {secondsLeft}s
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-cinzel mb-4 text-book">
                {current.question}
              </h2>

              <div className="grid gap-3">
                {current.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrect = locked && i === current.correctAnswerIndex;
                  const isWrong = locked && isSelected && !isCorrect;
                  return (
                    <button
                      key={i}
                      disabled={locked}
                      onClick={() => setSelected(i)}
                      className={`text-left px-4 py-3 rounded-lg border transition select-none font-uncial ${
                        isCorrect
                          ? "border-green-600 bg-green-600/10"
                          : isWrong
                          ? "border-rune bg-rune/10"
                          : isSelected
                          ? "border-gold bg-gold/10"
                          : "border-gold/50 hover:border-gold"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="text-sm font-cinzel">
                  {!locked ? (
                    <span className="opacity-70">Sélectionne puis valide.</span>
                  ) : selected === current.correctAnswerIndex ? (
                    <span className="text-green-700">Correct !</span>
                  ) : (
                    <span className="text-rune">Mauvaise réponse.</span>
                  )}
                </div>

                {!locked ? (
                  <button
                    onClick={handleValidate}
                    disabled={selected === null}
                    className="px-6 py-2 rounded bg-blood text-gold border border-gold font-cinzel disabled:opacity-50 hover:bg-gold/80 hover:text-blood transition"
                  >
                    Valider
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="px-6 py-2 rounded bg-blood text-gold border border-gold font-cinzel hover:bg-gold/80 hover:text-blood transition"
                  >
                    {index + 1 < total
                      ? "Question suivante"
                      : "Voir les résultats"}
                  </button>
                )}
              </div>

              {locked && current.explanation && (
                <div className="mt-4 text-sm bg-sandstone/20 p-4 rounded-lg border border-gold">
                  <span className="font-bold text-book">Explication : </span>
                  {current.explanation}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 md:p-8 bg-parchment text-[#3A2E1E] border-2 border-gold shadow"
          >
            <h2 className="text-2xl md:text-3xl font-cinzel mb-2 text-book">
              Résultats
            </h2>
            <p className="mb-6 font-uncial">
              {score}/{total} corrects
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStarted(false);
                  setIndex(0);
                  setSelected(null);
                  setLocked(false);
                  setScore(0);
                  setSecondsLeft(perQuestionSeconds);
                  setShowResult(false);
                }}
                className="px-6 py-2 rounded bg-blood text-gold border border-gold font-cinzel hover:bg-gold/80 hover:text-blood transition"
              >
                Rejouer
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
