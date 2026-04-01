import { Suspense } from "react";
import QuizClientPage from "./QuizClientPage";

function QuizPageFallback() {
  return (
    <div className="min-h-screen bg-gold text-[#3A2E1E] flex items-center justify-center">
      <div className="font-uncial bg-parchment border-2 border-gold px-6 py-4 rounded shadow">
        Chargement du quiz…
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<QuizPageFallback />}>
      <QuizClientPage />
    </Suspense>
  );
}
