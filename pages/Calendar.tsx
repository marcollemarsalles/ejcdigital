
import React from 'react';
import { MOCK_EVENTS } from '../constants';
import { MapPin, Clock, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';

const Calendar: React.FC = () => {
  // Fixed: Updated cases to match Portuguese types
  const getEventTagColor = (type: string) => {
    switch (type) {
      case 'Reunião': return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'Formação': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Encontro': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const formatType = (type: string) => {
    return type; // Types are already in Portuguese
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Próximos Compromissos</h2>
        <div className="bg-emerald-50 text-emerald-700 p-2 rounded-xl">
          <CalendarIcon size={20} />
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_EVENTS.map((event) => {
          // Fixed: Updated date and time handling to match new mock structure
          const date = new Date(event.date + 'T00:00:00');
          const day = date.getDate();
          const month = date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
          const time = event.time;

          return (
            <div key={event.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-5 hover:border-emerald-200 transition-all group">
              <div className="bg-slate-50 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border border-slate-100 shadow-sm group-hover:bg-emerald-50 transition-colors">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{month}</span>
                <span className="text-xl font-black text-slate-800 leading-none">{day}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getEventTagColor(event.type)}`}>
                    {formatType(event.type)}
                  </span>
                </div>
                {/* Fixed: changed title to theme */}
                <h4 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{event.theme}</h4>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Clock size={12} /> {time}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <MapPin size={12} /> {event.location}
                  </div>
                </div>
              </div>

              <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </div>
          );
        })}
      </div>

      <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center">
        <p className="text-slate-400 text-sm font-medium">Não há mais eventos agendados para este mês.</p>
        <button className="mt-4 text-emerald-600 text-xs font-bold uppercase tracking-widest hover:underline">Sugerir atividade</button>
      </div>
    </div>
  );
};

export default Calendar;