import React, { useState } from 'react';
import { Round, Participant } from '../types';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface RoundViewProps {
  round: Round;
  participants: Participant[];
  onScoreChange: (participantId: string, score: number) => void;
  onFinishRound: () => void;
  isEventFinished: boolean;
}

export default function RoundView({
  round,
  participants,
  onScoreChange,
  onFinishRound,
  isEventFinished
}: RoundViewProps) {
  const [localScores, setLocalScores] = useState<Record<string, string>>({});

  const handleScoreInput = (participantId: string, value: string) => {
    if (isEventFinished) return;
    setLocalScores(prev => ({ ...prev, [participantId]: value }));
    const parsed = parseInt(value);
    onScoreChange(participantId, isNaN(parsed) ? 0 : parsed);
  };

  const getParticipantsForTable = (ids: string[]) =>
    ids.map(id => participants.find(p => p.id === id)).filter(Boolean) as Participant[];

  const getTableSum = (ids: string[]) =>
    ids.reduce((total, pid) => {
      const raw = localScores[pid] ?? round.scores[pid] ?? 0;
      const parsed = parseInt(raw as any);
      return total + (isNaN(parsed) ? 0 : parsed);
    }, 0);

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-8 pb-56">
      <div className="grid gap-6">
        {round.tables.map(table => {
          const tablePlayers = getParticipantsForTable(table.participantIds);
          const sum = getTableSum(table.participantIds);

          return (
            <div key={table.id} className="p-6 rounded-[2.5rem] border-4 shadow-md space-y-4 bg-slate-50 border-slate-200">
              <div className="grid gap-2">
                {tablePlayers.map(player => (
                  <div key={player.id} className="bg-white py-2 px-3 rounded-xl flex items-center justify-between border border-slate-100 shadow-sm gap-3">
                    <span className="text-2xl font-black text-slate-800">{player.name}</span>
                    <input
                      type="number"
                      disabled={isEventFinished}
                      value={localScores[player.id] ?? round.scores[player.id] ?? ''}
                      onChange={e => handleScoreInput(player.id, e.target.value)}
                      className="w-20 h-14 text-center text-3xl font-black rounded-xl border-4 border-slate-100 bg-slate-50"
                    />
                  </div>
                ))}
              </div>

              <div className={`p-2 rounded-xl border-2 flex items-center gap-3 ${sum === 0 ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
                <AlertCircle size={22} />
                <span className="text-lg font-black">Totaal tafel = {sum}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-100 to-transparent z-50 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button
            onClick={onFinishRound}
            className="w-full py-6 rounded-[2rem] text-3xl font-black border-b-[10px] shadow-xl uppercase flex items-center justify-center gap-3 bg-green-600 border-green-900 text-white"
          >
            <CheckCircle2 size={32} />
            Volgende
          </button>
        </div>
      </div>
    </div>
  );
}
