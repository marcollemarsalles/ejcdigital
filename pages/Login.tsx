
import React, { useState } from 'react';
import { AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (userData: any) => void;
}

const MOCK_USER = {
  "id": "u4",
  "email": "mariasilva@ejc.com",
  "password": "123",
  "name": "Maria da Silva",
  "nickname": "Mariazinha",
  "role": "Coordenador",
  "currentTeam": "Coordenação Geral",
  "points": 946,
  "photoUrl": "https://picsum.photos/200/300",
  "relics": [
    { "id": "2", "unlockedAt": "2022-06-15" },
    { "id": "3", "unlockedAt": "2023-02-20" },
    { "id": "5", "unlockedAt": "2023-08-05" },
    { "id": "1", "unlockedAt": "2023-05-15" },
    { "id": "26", "unlockedAt": "2023-11-20" },
    { "id": "51", "unlockedAt": "2024-02-12" },
    { "id": "76", "unlockedAt": "2024-10-09" },
    { "id": "70", "unlockedAt": "2024-10-09" },
    { "id": "49", "unlockedAt": "2024-10-09" }
  ],
  "history": [
    { "team": "Coordenação", "year": 2025 },
    { "team": "Palestra", "year": 2024 },
    { "team": "Bandinha", "year": 2023 },
    { "team": "Encontrista", "year": 2022 }
  ]
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

    // 1. Verificar primeiro o usuário mockado (Fallback de Emergência)
    if (email.toLowerCase() === MOCK_USER.email.toLowerCase() && password === MOCK_USER.password) {
      const { password: _, ...userData } = MOCK_USER;
      localStorage.setItem('ejc_user', JSON.stringify(userData));
      setTimeout(() => {
        onLogin(userData);
      }, 500);
      return;
    }

    try {
      const response = await fetch('users.json');
      
      if (!response.ok) {
        throw new Error(`Erro de servidor: ${response.status}`);
      }

      let users;
      try {
        users = await response.json();
      } catch (parseError) {
        console.error('Erro ao processar JSON:', parseError);
        throw new Error('Banco de dados corrompido.');
      }

      const user = users.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (user) {
        const { password: _, ...userData } = user;
        localStorage.setItem('ejc_user', JSON.stringify(userData));
        setTimeout(() => {
          onLogin(userData);
        }, 800);
      } else {
        setError('E-mail ou senha incorretos.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Erro na autenticação:', err);
      setError('Erro ao conectar. Tente o usuário de teste (mariasilva@ejc.com / 123)');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl mb-4 shadow-lg shadow-emerald-200">
            E
          </div>
          <h1 className="text-2xl font-bold text-slate-800">EJC Digital</h1>
          <p className="text-slate-500 text-sm mt-1">Encontro de Jovens com Cristo</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm font-medium"
              placeholder="exemplo@email.com"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm font-medium"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Validando...
              </>
            ) : (
              'Entrar no Serviço'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-3 items-center">
            <ShieldCheck size={20} className="text-amber-600 shrink-0" />
            <div className="text-[10px] text-amber-800 leading-tight">
              <strong>Acesso de Emergência:</strong><br />
              Se o servidor falhar, use: <em>mariasilva@ejc.com</em> / <em>123</em>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Problemas com o acesso? <button className="text-emerald-600 font-semibold" onClick={() => window.location.reload()}>Atualizar Página</button>
          </p>
        </div>
      </div>
      
      <p className="mt-8 text-slate-400 text-xs text-center max-w-xs leading-relaxed uppercase tracking-widest">
        "EJC é mesmo assim, foi Deus quem quis isso pra mim!"
      </p>
    </div>
  );
};

export default Login;
