import React, { useState } from 'react';
import { AlertCircle, Loader2, ShieldCheck, Link as LinkIcon } from 'lucide-react';

interface LoginProps {
  onLogin: (userData: any) => void;
}

const MOCK_USER = {
  id: "u4",
  email: "mariasilva@ejc.com",
  password: "123",
  name: "Maria da Silva",
  nickname: "Mariazinha",
  role: "Coordenador",
  currentTeam: "Coordenação Geral",
  points: 946,
  photoUrl: "https://picsum.photos/200/300",
  relics: [],
  history: []
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // 🔐 Login de emergência
    if (
      email.toLowerCase() === MOCK_USER.email.toLowerCase() &&
      password === MOCK_USER.password
    ) {
      const { password: _, ...userData } = MOCK_USER;
      localStorage.setItem('ejc_user', JSON.stringify(userData));
      setTimeout(() => onLogin(userData), 500);
      return;
    }

    try {
      // ✅ Caminho correto para Vercel
      const response = await fetch("/users.json");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const users = await response.json();

      const user = users.find(
        (u: any) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );

      if (!user) {
        setError("E-mail ou senha incorretos.");
        setIsLoading(false);
        return;
      }

      const { password: _, ...userData } = user;
      localStorage.setItem('ejc_user', JSON.stringify(userData));
      setTimeout(() => onLogin(userData), 800);

    } catch (err) {
      console.error(err);
      setError("Falha técnica ao acessar o banco de dados.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">EJC Digital</h1>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm flex gap-2 items-center">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 text-white"
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 text-white"
            required
          />

          <button
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Entrar"}
          </button>
        </form>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs">
          <ShieldCheck size={16} className="inline mr-1" />
          <strong>Acesso emergência:</strong><br />
          mariasilva@ejc.com / 123
        </div>
      </div>
    </div>
  );
};

export default Login;
