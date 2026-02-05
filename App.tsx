import React, { useState, useEffect } from 'react';
import { CardEvent, EventStatus } from './types';
import DashboardView from './components/DashboardView';
import LoginView from './components/LoginView';
import Navigation from './components/Navigation';
import RegistrationView from './components/RegistrationView';
import { getEvents, saveEvent, deleteEvent as deleteEventFromDB, generateId } from './services/storage';

const CLUB_CODE = '26091976';

const App: React.FC = () => {
  const [events, setEvents] = useState<CardEvent[]>([]);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('REGISTRATION');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('kajuit_auth') === 'true');

  // 🔄 Laad alle middagen uit Supabase
  const loadEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // 🔄 Opslaan in Supabase
  const updateEvent = async (event: CardEvent) => {
    await saveEvent(event);
    await loadEvents();
  };

  const createEvent = async (title: string) => {
    const newEvent: CardEvent = {
      id: generateId(),
      title,
      date: new Date().toLocaleDateString('nl-NL'),
      status: EventStatus.REGISTRATION,
      participants: [],
      rounds: []
    };
    await updateEvent(newEvent);
    setActiveEventId(newEvent.id);
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Wilt u deze middag definitief verwijderen?')) return;
    await deleteEventFromDB(id);
    await loadEvents();
    if (activeEventId === id) setActiveEventId(null);
  };

  const activeEvent = events.find(e => e.id === activeEventId);

  // 🔐 Login scherm
  if (!isAuthenticated) {
    return (
      <LoginView
        onUnlock={(code) => {
          if (code === CLUB_CODE) {
            setIsAuthenticated(true);
            localStorage.setItem('kajuit_auth', 'true');
          } else {
            alert('Onjuiste clubcode.');
          }
        }}
      />
    );
  }

  // 📋 Dashboard (lijst met middagen)
  if (!activeEventId) {
    return (
      <DashboardView
        events={events}
        onSelectEvent={(id) => {
          const ev = events.find(e => e.id === id);
          if (ev) {
            setActiveEventId(id);
            setActiveTab(ev.status);
          }
        }}
        onCreateEvent={createEvent}
        onDeleteEvent={deleteEvent}
        onExport={() => alert('Export is niet meer nodig met centrale opslag')}
        onImport={() => alert('Import is niet meer nodig met centrale opslag')}
      />
    );
  }

  // 🧭 Binnen een kaartmiddag
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navigation
        currentStatus={activeEvent!.status}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onExit={() => setActiveEventId(null)}
        title={activeEvent!.title}
      />
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'REGISTRATION' && (
          <RegistrationView
            participants={activeEvent!.participants}
            customNames={{ Jokeren: [], Rikken: [] }}
            onAddParticipant={() => {}}
            onRemoveParticipant={() => {}}
            onUpdateParticipantGame={() => {}}
            onStartRound={() => {}}
            isLocked={false}
          />
        )}
      </main>
    </div>
  );
};

export default App;
