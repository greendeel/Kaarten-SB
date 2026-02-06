import React from 'react';
import { Round, Participant } from '../types';

interface Props {
  round: Round;
  participants: Participant[];
  onScoreChange: (participantId: string, score: number) => void;
  onFinishRound: () => void;
  onResetTables: () => void;
  onUpdateParticipantTable: (participantId: string, tableId: string) => void;
  isScoring: boolean;
  setIsScoring: (value: boolean) => void;
  isEventFinished: boolean;
}

const RoundView: React.FC<Props> = ({
  round,
  participants,
  onScoreChange,
  onFinishRound,
  onResetTables,
  isScoring,
  setIsScoring,
}) => {

  const getName = (id: string) =>
    participants.find(p => p.id === id)?.name || 'Onbekend';

  return (
    <div className="p-4 space-y-6">

      {/* ================= TAFELS (ORIGINELE WEERGAVE) ================= */}
      {!isScoring && (
        <>
          <h2 className="text-2xl font-bold">Tafelindeling</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {round.tables.map((table, index) => (
              <div key={index} className="bg-white rounded-xl shadow p-4">
                <h3 className="font-bold mb-2">Tafel {index + 1}</h3>
                <ul className="space-y-1">
                  {(table.participants || []).map((pid: string) => (
                    <li key={pid}>{getName(pid)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setIsScoring(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-lg"
            >
              Scores invullen
            </button>

            <button
              onClick={onResetTables}
              className="text-slate-600 underline"
            >
              Tafels opnieuw indelen
            </button>
          </div>
        </>
      )}

      {/* ================= SCORE INVOER (ORIGINELE UI) ================= */}
      {isScoring && (
        <>
          <h2 className="text-2xl font-bold">Scores invoeren</h2>

          <div className="grid gap-3">
            {participants.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                <span className="text-lg">{p.name}</span>
                <input
                  type="number"
                  className="border rounded px-3 py-2 w-24 text-right text-lg"
                  value={round.scores?.[p.id] ?? ''}
                  onChange={(e) => onScoreChange(p.id, Number(e.target.value))}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setIsScoring(false)}
              className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-xl"
            >
              Terug naar tafels
            </button>

            <button
              onClick={onFinishRound}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl"
            >
              Ronde afronden
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RoundView;
