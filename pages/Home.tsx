
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowRight, MapPin, Clock, Calendar as CalendarIcon, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
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
  },
  {
    id: 3,
    title: "Campanha do Agasalho",
    description: "Estamos arrecadando doações no salão paroquial. Participe!",
    image: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?auto=format&fit=crop&q=80&w=800",
    tag: "Social"
  }
];

const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EJCEvent[]>([]);
  const [allRelics, setAllRelics] = useState<Relic[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, relicsRes] = await Promise.all([
          fetch('/events.json'),
          fetch('/relics.json')
        ]);
        
        const eventsData = await eventsRes.json();
        const relicsData = await relicsRes.json();
        
        setEvents(eventsData);
        setAllRelics(relicsData);
      } catch (error) {
        console.error("Erro ao carregar dados da Home:", error);
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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length);

  // Ordena as relíquias conquistadas: as mais recentes primeiro
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
      {/* Greeting */}
      <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Paz e Bem, {user?.nickname || user?.name || 'Jovem'}!</h2>
            <p className="text-slate-500 mt-1">Bem-vindo ao serviço.</p>
          </div>
        </div>
      </section>

      {/* Hero Carousel */}
      <section className="relative group overflow-hidden rounded-[2rem] bg-slate-200 aspect-[16/9] md:aspect-[21/9] shadow-xl shadow-slate-200/50 border border-slate-100">
        {CAROUSEL_ITEMS.map((item, index) => (
          <div 
            key={item.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img 
              src={item.image} 
              className="w-full h-full object-cover" 
              alt={item.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500 text-[10px] font-black uppercase tracking-widest mb-3">
                {item.tag}
              </span>
              <h3 className="text-xl md:text-3xl font-black mb-2 leading-tight">{item.title}</h3>
              <p className="text-sm md:text-base text-slate-200 max-w-lg line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}

        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100">
          <ChevronRight size={24} />
        </button>
      </section>

      {/* Relic Summary */}
      <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" /> Suas Relíquias
          </h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user?.relics?.length || 0}/{allRelics.length || '--'} Coletadas</span>
        </div>
        
        <div className="flex gap-4 mb-6 overflow-x-auto no-scrollbar pb-2">
          {loading ? (
            <div className="flex items-center gap-2 text-slate-400 italic text-sm">
              <Loader2 size={16} className="animate-spin" /> Carregando...
            </div>
          ) : userUnlockedRelics.length > 0 ? userUnlockedRelics.slice(0, 4).map(relic => {
            if (!relic) return null;
            const isCustomImage = relic.icon.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || relic.icon.startsWith('http');
            return (
              <div key={relic.id} className="flex flex-col items-center gap-2 flex-shrink-0 animate-in zoom-in-50 duration-300">
                <div className={`p-3 rounded-2xl flex items-center justify-center ${isCustomImage ? 'bg-white border-slate-100' : COLORS.yellow} shadow-sm w-16 h-16 border`}>
                  {getRelicIcon(relic.icon, 36)}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase text-center w-16 truncate">{relic.name.split(' ')[0]}</span>
              </div>
            );
          }) : (
            <p className="text-xs text-slate-400 italic py-4">Inicie sua jornada para coletar relíquias!</p>
          )}
        </div>

        <button 
          onClick={() => navigate('/gamificacao')}
          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 text-sm font-semibold transition-colors"
        >
          Ver Conquistas <ArrowRight size={14} />
        </button>
      </section>

      {/* Agenda Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon size={18} className="text-emerald-500" /> Agenda EJC
          </h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{events.length} Próximos</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-slate-100">
               <p className="text-slate-400 animate-pulse italic text-sm">Atualizando calendário...</p>
            </div>
          ) : events.map((event) => {
            const dateObj = new Date(event.date + 'T00:00:00');
            const day = dateObj.getDate();
            const month = dateObj.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');

            return (
              <div key={event.id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 hover:border-emerald-200 transition-all group">
                <div className="bg-slate-50 w-14 h-14 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:bg-emerald-50 transition-colors">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{month}</span>
                  <span className="text-lg font-black text-slate-800 leading-none">{day}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wider mb-1 inline-block ${getEventTagColor(event.type)}`}>
                    {event.type}
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm truncate group-hover:text-emerald-700 transition-colors">{event.theme}</h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      <Clock size={10} /> {event.time}
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">
                      <MapPin size={10} /> {event.location}
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
