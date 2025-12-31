
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowRight, MapPin, Clock, Calendar as CalendarIcon, ChevronRight, ChevronLeft, Loader2, AlertTriangle } from 'lucide-react';
import { getRelicIcon, COLORS } from '../constants';
import { EJCEvent, UserProfile, Relic } from '../types';

interface HomeProps {
  user: UserProfile;
}

const CAROUSEL_ITEMS = [
  {
    id: 1,
    title: "Encontro Anual 2025",
    description: "As inscrições para o maior encontro do ano já estão abertas!",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
    tag: "Destaque"
  },
  {
    id: 2,
    title: "Missa de Envio",
    description: "Neste domingo, às 19h na Matriz. Contamos com sua presença!",
    image: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=800",
    tag: "Aviso"
  }
];

const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EJCEvent[]>([]);
  const [allRelics, setAllRelics] = useState<Relic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, relicsRes] = await Promise.all([
          fetch('./events.json'),
          fetch('./relics.json')
        ]);
        
        if (!eventsRes.ok || !relicsRes.ok) {
          throw new Error(`Falha ao carregar dados (Eventos: ${eventsRes.status}, Relíquias: ${relicsRes.status})`);
        }

        const eventsData = await eventsRes.json();
        const relicsData = await relicsRes.json();
        
        setEvents(eventsData);
        setAllRelics(relicsData);
      } catch (err: any) {
        console.error("Erro Home:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const userUnlockedRelics = useMemo(() => {
    return (user.relics || [])
      .map(ur => {
        const relicBaseData = allRelics.find(r => r.id === ur.id);
        return relicBaseData ? { ...relicBaseData, unlockedAt: ur.unlockedAt } : null;
      })
      .filter((r): r is (Relic & { unlockedAt: string }) => r !== null)
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime());
  }, [allRelics, user.relics]);

  const getEventTagColor = (type: string) => {
    switch (type) {
      case 'Reunião': return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'Formação': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Encontro': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">Paz e Bem, {user?.nickname || user?.name}!</h2>
        <p className="text-slate-500 mt-1">Bem-vindo ao serviço.</p>
      </section>

      {error && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3 text-amber-700 text-xs font-medium">
          <AlertTriangle size={16} />
          Alguns dados não puderam ser carregados. Verifique a conexão.
        </div>
      )}

      {/* Hero Carousel */}
      <section className="relative group overflow-hidden rounded-[2rem] bg-slate-200 aspect-[16/9] md:aspect-[21/9] shadow-sm border border-slate-100">
        {CAROUSEL_ITEMS.map((item, index) => (
          <div key={item.id} className={`absolute inset-0 transition-all duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-0 p-8 text-white">
              <h3 className="text-xl md:text-2xl font-black">{item.title}</h3>
              <p className="text-sm text-slate-200">{item.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Relic Summary */}
      <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><Trophy size={18} className="text-amber-500" /> Relíquias</h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.relics?.length || 0} Coletadas</span>
        </div>
        
        <div className="flex gap-4 mb-6 overflow-x-auto no-scrollbar">
          {loading ? <Loader2 size={16} className="animate-spin text-slate-400" /> : userUnlockedRelics.slice(0, 4).map(relic => (
            <div key={relic.id} className="flex flex-col items-center gap-2 shrink-0">
              <div className={`p-3 rounded-2xl flex items-center justify-center w-16 h-16 border ${COLORS.yellow} shadow-sm`}>
                {getRelicIcon(relic.icon, 32)}
              </div>
              <span className="text-[9px] font-bold text-slate-500 uppercase">{relic.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
        <button onClick={() => navigate('/gamificacao')} className="w-full py-3 bg-slate-50 rounded-xl text-slate-600 text-sm font-semibold flex items-center justify-center gap-2">
          Ver Conquistas <ArrowRight size={14} />
        </button>
      </section>

      {/* Agenda */}
      <section className="space-y-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 px-2"><CalendarIcon size={18} className="text-emerald-500" /> Agenda EJC</h3>
        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 group">
              <div className="bg-slate-50 w-14 h-14 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:bg-emerald-50">
                <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}</span>
                <span className="text-lg font-black text-slate-800">{new Date(event.date + 'T00:00:00').getDate()}</span>
              </div>
              <div className="flex-1">
                <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full border uppercase mb-1 inline-block ${getEventTagColor(event.type)}`}>{event.type}</span>
                <h4 className="font-bold text-slate-800 text-sm">{event.theme}</h4>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
