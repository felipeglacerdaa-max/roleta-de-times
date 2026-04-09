import React from 'react';
import type { AppMode } from '../types';
import { LayoutGrid, Users, Swords, Dices } from 'lucide-react';

interface NavbarProps {
    currentMode: AppMode;
    onModeChange: (mode: AppMode) => void;
}

export function Navbar({ currentMode, onModeChange }: NavbarProps) {
    const tabs: { id: AppMode; label: string; icon: React.ReactNode }[] = [
        { id: 'roulette', label: 'Roleta', icon: <LayoutGrid className="w-4 h-4" /> },
        { id: 'duels', label: 'Confrontos', icon: <Swords className="w-4 h-4" /> },
        { id: 'simple', label: 'Sorteio Simples', icon: <Dices className="w-4 h-4" /> },
    ];

    return (
        <nav className="w-full flex-col md:flex-row flex items-center justify-between py-6 px-4 md:px-8 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Dices className="w-6 h-6" />
                </div>
                <h1 className="font-semibold text-xl tracking-tight">Sorteador<span className="text-primary font-bold">.</span></h1>
            </div>

            <div className="flex items-center gap-1 md:gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onModeChange(tab.id)}
                        className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${currentMode === tab.id
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
        </nav>
    );
}
