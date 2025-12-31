import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, BookOpen, Loader2, Info, BookMarked, Flame, Sparkles, RefreshCw, Quote } from 'lucide-react';

const Liturgy: React.FC = () => {
  const getTodayFormatted = () => new Date().toISOString().split('T')[0];

  const [date, setDate] = useState<string>(getTodayFormatted());
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiturgy = useCallback(async (selectedDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const [year, month, day] = selectedDate.split('-');
      const url = `https://liturgia.up.railway.app/v2/?dia=${day}&mes=${month}&ano=${year}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro no servidor (${response.status})`);
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      console.error('Liturgy API Error:', err);
      setError(err.message || 'Não foi possível carregar a liturgia.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiturgy(date);
  }, [date, fetchLiturgy]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleResetDate = () => {
    setDate(getTodayFormatted());
  };

  const getCorStyles = (cor: string) => {
    const normalCor = cor?.toLowerCase() || '';
    if (normalCor.includes('verde')) return 'bg-emerald-600 text-white';
    if (normalCor.includes('roxo')) return 'bg-purple-700 text-white';
    if (normalCor.includes('branco')) return 'bg-white text-slate-800 border-slate-200 shadow-sm';
    if (normalCor.includes('vermelho')) return 'bg-rose-600 text-white';
    if (normalCor.includes('rosa')) return 'bg-pink-400 text-white';
    return 'bg-emerald-600 text-white';
  };

  const ReadingSection = ({
    reading,
    type,
    icon: Icon,
    colorClass,
    isGospel = false
  }: {
    reading: any;
    type: string;
    icon: any;
    colorClass: string;
    isGospel?: boolean;
  }) => {
    if (!reading) return null;

    const text = reading.texto || reading.texto_leitura || '';
    const reference = reading.referencia || reading.referencia_leitura || '';
    const title = reading.titulo || '';

    return (
      <article className={`bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm ${isGospel ? 'ring-2 ring-emerald-100 bg-emerald-50/20' : ''}`}>
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-12 h-12 ${colorClass} rounded-2xl flex items-center justify-center text-white`}>
            <Icon size={24} />
          </div>
          <div>
            <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">{type}</h4>
            <p className={`text-base font-bold ${isGospel ? 'text-emerald-700' : 'text-slate-700'}`}>{reference}</p>
          </div>
        </div>

        {title && (
          <h5 className="text-xl font-black text-slate-800 mb-6 border-l-4 border-emerald-500 pl-4">
            {title}
          </h5>
        )}

        <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line font-medium">
          {text}
        </p>

        <div className="mt-8 pt-6 border-t text-xs font-black text-slate-400 uppercase tracking-widest">
          {isGospel ? '— Palavra da Salvação.' : '— Palavra do Senhor.'}
        </div>
      </article>
    );
  };

  const AntifonSection = ({ text, type }: { text: string; type: string }) => {
    if (!text) return null;
    return (
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 italic relative">
        <Quote className="absolute top-4 right-4 text-slate-200" size={40} />
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">{type}</span>
        <p className="text-slate-600 text-sm">{text}</p>
      </div>
    );
  };

  /* ✅ CORREÇÃO DA API v2 (arrays) */
  const leituras = data?.leituras || {};
  const primeiraLeitura = leituras.primeiraLeitura?.[0] || null;
  const segundaLeitura = leituras.segundaLeitura?.[0] || null;
  const salmo = leituras.salmo?.[0] || null;
  const evangelho = leituras.evangelho?.[0] || null;

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER COM SELETOR DE DATA */}
      <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <BookMarked size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Liturgia Diária</h2>
            <p className="text-slate-500 text-xs">Alimento espiritual e missionário</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDate}
            className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200"
            title="Hoje"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>

          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="pl-11 pr-4 py-3 bg-slate-900 text-white rounded-2xl text-sm font-medium outline-none"
            />
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="animate-spin text-emerald-600" size={56} />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="space-y-8 max-w-4xl mx-auto">
          <section className={`rounded-[2.5rem] p-8 shadow-xl ${getCorStyles(data.cor)}`}>
            <h3 className="text-3xl font-black text-center">{data.liturgia}</h3>
            <p className="text-center text-sm mt-2 uppercase tracking-widest">
              {data.data} • {data.dia}
            </p>
          </section>

          <AntifonSection text={data.antifona_entrada} type="Antífona de Entrada" />

          <ReadingSection reading={primeiraLeitura} type="Primeira Leitura" icon={BookOpen} colorClass="bg-emerald-600" />

          {salmo && (
            <article className="bg-slate-900 text-white rounded-[2.5rem] p-8">
              <p className="text-emerald-400 font-bold mb-4">{salmo.referencia}</p>
              {salmo.refrao && <p className="italic font-black mb-6">{salmo.refrao}</p>}
              <p className="whitespace-pre-line text-slate-300">{salmo.texto}</p>
            </article>
          )}

          <ReadingSection reading={segundaLeitura} type="Segunda Leitura" icon={BookOpen} colorClass="bg-emerald-700" />

          <ReadingSection reading={evangelho} type="Santo Evangelho" icon={Sparkles} colorClass="bg-emerald-600" isGospel />

          <AntifonSection text={data.antifona_comunhao} type="Antífona de Comunhão" />
        </div>
      )}
    </div>
  );
};

export default Liturgy;
