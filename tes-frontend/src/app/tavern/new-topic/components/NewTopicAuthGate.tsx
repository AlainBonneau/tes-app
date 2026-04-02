type NewTopicAuthGateProps = {
  onLogin: () => void;
};

export default function NewTopicAuthGate({ onLogin }: NewTopicAuthGateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gold font-serif">
      <div className="bg-parchment border-2 border-blood shadow rounded-xl px-8 py-12 text-center">
        <div className="font-uncial text-blood text-2xl mb-2">
          Connexion requise
        </div>

        <div className="text-blood mb-4">
          Veuillez vous connecter pour créer un sujet.
        </div>

        <button
          type="button"
          className="bg-gold border border-blood rounded-lg px-5 py-2 text-blood font-bold hover:bg-blood hover:text-gold transition cursor-pointer"
          onClick={onLogin}
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}
