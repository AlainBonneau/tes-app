type CommentFormProps = {
  reply: string;
  setReply: React.Dispatch<React.SetStateAction<string>>;
  replying: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export default function CommentForm({
  reply,
  setReply,
  replying,
  onSubmit,
}: CommentFormProps) {
  return (
    <div className="max-w-3xl mx-auto mt-10 mb-8 px-4">
      <form
        onSubmit={onSubmit}
        className="bg-parchment border-2 border-gold rounded-xl shadow-lg p-5 flex flex-col gap-4"
      >
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={4}
          className="border rounded-lg p-3 font-serif text-base focus:outline-gold"
          placeholder="Écrire un commentaire..."
          required
          minLength={1}
          maxLength={500}
        />

        <button
          type="submit"
          disabled={replying || !reply.trim()}
          className="bg-gold text-blood px-6 py-2 rounded-xl font-bold border-2 border-[#FFD679] hover:bg-blood hover:text-gold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {replying ? "Envoi en cours..." : "Publier le commentaire"}
        </button>
      </form>
    </div>
  );
}
