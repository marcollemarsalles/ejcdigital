
import React, { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (userData: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('./users.json');
      const users = await response.json();

      const user = users.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (user) {
        // Removemos a senha antes de salvar por segurança
        const { password, ...userData } = user;
        localStorage.setItem('ejc_user', JSON.stringify(userData));
        
        setTimeout(() => {
          onLogin(userData);
        }, 800);
      } else {
        setError('E-mail ou senha incorretos. Tente novamente.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Erro ao autenticar:', err);
      setError('Erro ao conectar com o servidor de autenticação.');
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
            <AlertCircle size={18} />
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

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Problemas com o acesso? <button className="text-emerald-600 font-semibold">Falar com TI</button>
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
