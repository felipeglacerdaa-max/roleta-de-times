import { useState } from 'react';
import { Navbar } from './components/Navbar';
import type { AppMode } from './types';
import { SimpleDraw } from './components/SimpleDraw';
import { GroupsGenerator } from './components/GroupsGenerator';
import { DuelsGenerator } from './components/DuelsGenerator';

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('roulette');

    const renderContent = () => {
    switch (currentMode) {
      case 'roulette': return <GroupsGenerator />;
      case 'duels': return <DuelsGenerator />;
      case 'simple': return <SimpleDraw />;
      default: return <GroupsGenerator />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar currentMode={currentMode} onModeChange={setCurrentMode} />

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
        <div className="flex flex-col gap-6">
          <header className="mb-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              {currentMode === 'roulette' && 'Roleta de Times'}
              {currentMode === 'duels' && 'Chaveamento e Confrontos'}
              {currentMode === 'simple' && 'Sorteio Rápido'}
            </h2>
            <p className="text-foreground/60 max-w-2xl">
              {currentMode === 'roulette' && 'Sorteie os participantes e divida-os em times ou grupos equilibrados automaticamente.'}
              {currentMode === 'duels' && 'Crie pares aleatórios para confrontos, ideal para torneios e dinâmicas 1 contra 1.'}
              {currentMode === 'simple' && 'Sorteie um ou mais itens rapidamente a partir da sua lista, sem animações complexas.'}
            </p>
          </header>

          {renderContent()}
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-foreground/40 mt-auto border-t border-border/50">
        <p>Sorteador minimalista. Funciona offline (localStorage).</p>
      </footer>
    </div>
  );
}

export default App;
