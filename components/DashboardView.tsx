import React, { useState } from 'react';
import { CardEvent } from '../types';
import { PlusCircle, Calendar, Trash2, Play } from 'lucide-react';

interface DashboardViewProps {
  events: CardEvent[];
  onSelectEvent: (id: string) => void;
  onCreateEvent: (name: string) => void;
  onDeleteEvent: (id: string) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  events, 
  onSelectEvent, 
  onCreateEvent, 
  onDeleteEvent
}) => {
  const [newName, setNewName] = useState('');
  
  const handleCreate = () => {
    if (newName.trim()) {
      onCreateEvent(newName.trim());
      setNewName('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10 pb-20">

      <div className="bg-white p-8 rounded-[3rem] border-4 border-blue-200 shadow-xl space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-blue-100 rounded-full text-blue-600">
            <PlusCircle size={48} />
          </div>
          <h2 className="text-4xl font-black text-slate-800 uppercase">Nieuwe Kaartmiddag</h2>
        </div>
        
        <div className="space-y-6 max-w-2xl mx-auto">
          <input 
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Bijv: 15 Februari"
            className="w-full text-4xl p-6 border-4 border-slate-100 rounded-3xl text-center font-black bg-slate-50"
          />
          
          <button
            onClick={handleCreate}
            disabled={!newName.trim()}
            className="w-full py-8 rounded-3xl text-4xl font-black shadow-2xl bg-green-600 text-white border-green-800"
          >
            <Play size={40} fill="currentColor" />
            STARTEN
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-600 uppercase tracking-widest text-center">Eerdere Middagen</h3>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5">
          {events.slice().reverse().map(event => (
            <div key={event.id} className="bg-white border-4 border-slate-200 rounded-[2.5rem] p-6 shadow-lg">
              <button onClick={() => onSelectEvent(event.id)} className="text-left w-full">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="text-blue-500" size={24} />
                  <p className="text-2xl font-black text-slate-800">{event.title || event.date}</p>
                </div>
                <p className="text-lg font-bold text-slate-500">{event.participants.length} spelers</p>
              </button>
              <div className="mt-3 text-right">
                <button onClick={() => onDeleteEvent(event.id)} className="text-red-500">
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
