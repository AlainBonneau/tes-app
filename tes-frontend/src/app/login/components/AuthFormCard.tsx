import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type LoginFormProps = {
  email: string;
  password: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

type RegisterFormProps = {
  regEmail: string;
  regPassword: string;
  regUsername: string;
  birthdate: string;
  firstName: string;
  lastName: string;
  description: string;
  setRegEmail: React.Dispatch<React.SetStateAction<string>>;
  setRegPassword: React.Dispatch<React.SetStateAction<string>>;
  setRegUsername: React.Dispatch<React.SetStateAction<string>>;
  setBirthdate: React.Dispatch<React.SetStateAction<string>>;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

type AuthFormCardProps = {
  isLogin: boolean;
  loading: boolean;
  error: string;
  router: AppRouterInstance;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  loginForm: LoginFormProps;
  registerForm: RegisterFormProps;
};

export default function AuthFormCard({
  isLogin,
  loading,
  error,
  router,
  setIsLogin,
  setError,
  loginForm,
  registerForm,
}: AuthFormCardProps) {
  return (
    <div className="bg-blood w-full max-w-md p-8 rounded-2xl shadow-lg">
      {error && <div className="mb-4 text-center text-red-500">{error}</div>}

      {isLogin ? (
        <form className="flex flex-col gap-6" onSubmit={loginForm.onSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded border border-gold bg-white text-dark"
            value={loginForm.email}
            onChange={(e) => loginForm.setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            className="p-3 rounded border border-gold bg-white text-dark"
            value={loginForm.password}
            onChange={(e) => loginForm.setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button
            type="submit"
            className="bg-gold text-blood font-cinzel font-bold rounded py-3 px-6 hover:bg-gold/80 transition disabled:opacity-60 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <div className="flex justify-between text-xs text-parchment">
            <span
              className="underline hover:text-gold cursor-pointer"
              onClick={() => router.push("/forgot-password")}
            >
              Mot de passe oublié ?
            </span>

            <span>
              Pas de compte ?{" "}
              <span
                className="underline hover:text-gold cursor-pointer"
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                }}
              >
                Inscrivez-vous
              </span>
            </span>
          </div>
        </form>
      ) : (
        <form className="flex flex-col gap-5" onSubmit={registerForm.onSubmit}>
          <input
            type="email"
            placeholder="Email *"
            className="p-3 rounded border border-gold bg-white text-dark"
            value={registerForm.regEmail}
            onChange={(e) => registerForm.setRegEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Mot de passe *"
            className="p-3 rounded border border-gold bg-white text-dark"
            value={registerForm.regPassword}
            onChange={(e) => registerForm.setRegPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <input
            type="text"
            placeholder="Pseudo *"
            className="p-3 rounded border border-gold bg-white text-dark"
            value={registerForm.regUsername}
            onChange={(e) => registerForm.setRegUsername(e.target.value)}
            required
          />

          <input
            type="date"
            placeholder="Date de naissance"
            className="p-3 rounded border border-gold bg-white text-dark"
            value={registerForm.birthdate}
            onChange={(e) => registerForm.setBirthdate(e.target.value)}
          />

          <input
            type="text"
            placeholder="Prénom"
            className="p-3 rounded border border-gold bg-white text-dark"
            value={registerForm.firstName}
            onChange={(e) => registerForm.setFirstName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Nom"
            className="p-3 rounded border border-gold bg-white text-dark"
            value={registerForm.lastName}
            onChange={(e) => registerForm.setLastName(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="p-3 rounded border border-gold bg-white text-dark"
            rows={3}
            value={registerForm.description}
            onChange={(e) => registerForm.setDescription(e.target.value)}
          />

          <button
            type="submit"
            className="bg-gold text-blood font-cinzel font-bold rounded py-3 px-6 hover:bg-gold/80 transition disabled:opacity-60 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>

          <div className="flex justify-center text-xs text-parchment mt-2">
            <span>
              Déjà un compte ?{" "}
              <span
                className="underline hover:text-gold cursor-pointer"
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                }}
              >
                Se connecter
              </span>
            </span>
          </div>
        </form>
      )}
    </div>
  );
}
