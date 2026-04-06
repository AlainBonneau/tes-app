type UsersPaginationProps = {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
};

export default function UsersPagination({
  page,
  totalPages,
  onPrevious,
  onNext,
}: UsersPaginationProps) {
  const isPreviousDisabled = page === 1;
  const isNextDisabled = page === totalPages || totalPages === 0;

  return (
    <div className="flex justify-center gap-4 pt-8 pb-8">
      <button
        disabled={isPreviousDisabled}
        className={`px-6 py-2 rounded font-cinzel bg-blood border text-gold border-gold hover:bg-blood/80 transition cursor-pointer ${
          isPreviousDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={onPrevious}
      >
        Précédent
      </button>

      <span className="font-bold">
        {page} / {totalPages || 1}
      </span>

      <button
        disabled={isNextDisabled}
        className={`px-6 py-2 rounded font-cinzel bg-blood text-gold border border-gold hover:bg-blood/80 transition cursor-pointer ${
          isNextDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={onNext}
      >
        Suivant
      </button>
    </div>
  );
}
