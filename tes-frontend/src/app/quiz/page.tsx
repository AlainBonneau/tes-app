"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "../api/axiosConfig";
import ElderScrollsQuiz from "./ElderScrollsQuiz";
import type { Question, QuizProps } from "../types/question";

export default function QuizPage({
  title,
  questions: questionsProp,
  perQuestionSeconds = 20,
  slug: slugProp,
}: QuizProps) {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(!questionsProp);
  const [error, setError] = useState<string | null>(null);
  const [quizTitle, setQuizTitle] = useState<string>(
    title ?? "Quiz – Elder Scrolls"
  );
  const [questions, setQuestions] = useState<Question[]>(questionsProp ?? []);

  const resolvedSlug = useMemo(() => {
    return slugProp || searchParams?.get("slug") || "elder-scrolls-demo";
  }, [slugProp, searchParams]);

    // Charge les questions si elles ne sont pas passées en props
  useEffect(() => {
    if (questionsProp && questionsProp.length) return;

    let cancel = false;
    async function fetchQuestions() {
      try {
        setLoading(true);
        setError(null);

        try {
          const res = await api.get(`/quizzes/${resolvedSlug}`);
          if (cancel) return;
          setQuizTitle(res.data.title || title || "Quiz – Elder Scrolls");
          setQuestions(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (res.data.questions || []).map((q: any) => ({
              id: q.id,
              question: q.question,
              options: q.options,
              correctAnswerIndex: q.correctAnswerIndex,
              explanation: q.explanation ?? undefined,
              difficulty: q.difficulty ?? "easy",
              imageUrl: q.imageUrl ?? undefined,
            })) as Question[]
          );
          return;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          console.error(e);
        }

        // 2) Fallback : prendre le premier quiz disponible
        const list = await api.get("/quizzes");
        if (cancel) return;

        const first =
          Array.isArray(list.data) && list.data.length ? list.data[0] : null;
        if (!first) {
          setError("Aucun quiz disponible.");
          setQuestions([]);
          return;
        }

        const res2 = await api.get(`/quizzes/${first.slug}`);
        if (cancel) return;

        setQuizTitle(res2.data.title || title || "Quiz – Elder Scrolls");
        setQuestions(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (res2.data.questions || []).map((q: any) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctAnswerIndex: q.correctAnswerIndex,
            explanation: q.explanation ?? undefined,
            difficulty: q.difficulty ?? "easy",
            imageUrl: q.imageUrl ?? undefined,
          })) as Question[]
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
        setError("Impossible de charger le quiz. Réessaie plus tard.");
        setQuestions([]);
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    fetchQuestions();
    return () => {
      cancel = true;
    };
  }, [questionsProp, resolvedSlug, title]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gold text-[#3A2E1E] flex items-center justify-center">
        <div className="font-uncial bg-parchment border-2 border-gold px-6 py-4 rounded shadow">
          Chargement du quiz…
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gold text-[#3A2E1E] flex items-center justify-center">
        <div className="font-uncial bg-parchment border-2 border-gold px-6 py-4 rounded shadow">
          {error || "Aucune question trouvée."}
        </div>
      </div>
    );
  }

  return (
    <ElderScrollsQuiz
      title={quizTitle}
      questions={questions}
      perQuestionSeconds={perQuestionSeconds}
    />
  );
}
