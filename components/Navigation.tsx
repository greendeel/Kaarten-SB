import React from 'react';
import { EventStatus } from '../types';

interface Props {
  currentStatus: EventStatus;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onExit: () => void;
  title: string;
  onRename: (newTitle: string) => void; // 🆕
}

const Navigation: React.FC<Props> = ({
  currentStatus,
  activeTab,
  onTabChange,
  onExit,
  title,
  onRename
}) => {

  const handleRename = () => {
    const newTitle = prompt('Nieuwe naam voor deze kaartmiddag:', title);
    if (newTitle && newTitle.trim() !== '' && newTitle !== title) {
      onRename(newTitle.trim());
    }
  };

  return (
    <div className="bg-white shadow p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={handleRename}
          title="Klik om naam te wijzigen"
        >
          {title}
        </h1>
        <button onClick={onExit} className="text-sm text-blue-600">
          Terug naar overzicht
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => onTabChange('REGISTRATION')} className={activeTab==='REGISTRATION'?'font-bold':''}>Registratie</button>
        {currentStatus !== EventStatus.REGISTRATION && (
          <>
            <button onClick={() => onTabChange('ROUND1')} className={activeTab==='ROUND1'?'font-bold':''}>Ronde 1</button>
            <button onClick={() => onTabChange('ROUND2')} className={activeTab==='ROUND2'?'font-bold':''}>Ronde 2</button>
            <button onClick={() => onTabChange('RESULTS')} className={activeTab==='RESULTS'?'font-bold':''}>Uitslag</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navigation;
