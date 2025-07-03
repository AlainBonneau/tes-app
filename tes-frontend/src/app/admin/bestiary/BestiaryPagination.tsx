type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};
export default function BestiaryPagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="flex justify-center gap-4 pt-8 pb-8">
      <button
        disabled={page === 1}
        className={`px-6 py-2 rounded font-cinzel bg-blood border text-gold border-gold hover:bg-blood/80 transition cursor-pointer ${
          page === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => onPageChange(page - 1)}
      >
        Précédent
      </button>
      <span className="font-bold">
        {page} / {totalPages || 1}
      </span>
      <button
        disabled={page === totalPages || totalPages === 0}
        className={`px-6 py-2 rounded font-cinzel bg-blood text-gold border border-gold hover:bg-blood/80 transition cursor-pointer  ${
          page === totalPages || totalPages === 0
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
        onClick={() => onPageChange(page + 1)}
      >
        Suivant
      </button>
    </div>
  );
}
