import { useState } from 'react';
import { useSupabaseItems } from '../hooks/useSupabaseItems';
import type { Duel } from '../types';
import { InputList } from './InputList';
import { ResultDisplay } from './ResultDisplay';
import { Swords } from 'lucide-react';

export function DuelsGenerator() {
    const { items, setItems } = useSupabaseItems('duel_items');

    const [duels, setDuels] = useState<Duel[] | null>(null);

    // Local storage removido em prol do Supabase

    const handleGenerate = () => {
        if (items.length < 2) return;

        // Shuffle array
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        const newDuels: Duel[] = [];

        for (let i = 0; i < shuffled.length; i += 2) {
            newDuels.push({
                id: crypto.randomUUID(),
                player1: shuffled[i],
                player2: i + 1 < shuffled.length ? shuffled[i + 1] : null
            });
        }

        setDuels(newDuels);
    };

    const getResultAsText = () => {
        if (!duels) return '';
        return duels.map((d, i) => {
            const p2Name = d.player2 ? d.player2.name : '(Passa Direto / Bye)';
            return `Confronto ${i + 1}: ${d.player1.name} x ${p2Name}`;
        }).join('\n');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 h-full flex flex-col gap-4">
                <InputList
                    items={items}
                    onChange={setItems}
                    minItems={2}
                    placeholder="Nomes para os confrontos..."
                />

                <button
                    className="btn-primary w-full py-3"
                    onClick={handleGenerate}
                    disabled={items.length < 2}
                >
                    <Swords className="w-5 h-5 mr-2" />
                    Gerar Chaveamento
                </button>
            </div>

            <div className="lg:col-span-8">
                {!duels ? (
                    <div className="card h-full min-h-[300px] flex flex-col items-center justify-center opacity-40 p-8 text-center">
                        <Swords className="w-16 h-16 mb-4" />
                        <p>Adicione pelo menos 2 participantes para gerar um chaveamento 1x1.</p>
                    </div>
                ) : (
                    <ResultDisplay
                        title="Chaveamento de Confrontos"
                        resultAsText={getResultAsText()}
                        onClear={() => setDuels(null)}
                    >
                        <div className="flex flex-col gap-3">
                            {duels.map((duel) => (
                                <div
                                    key={duel.id}
                                    className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-background border border-border p-4 rounded-xl shadow-sm relative overflow-hidden group hover:border-primary/30 transition-colors"
                                >
                                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary/20 group-hover:bg-primary/50 transition-colors" />

                                    <div className="flex-1 w-full text-center sm:text-right font-medium text-foreground pr-0 sm:pr-4">
                                        {duel.player1.name}
                                    </div>

                                    <div className="flex items-center justify-center px-4 py-1.5 bg-muted rounded-full">
                                        <span className="text-xs font-bold text-foreground/50 tracking-widest flex items-center gap-1">
                                            <Swords className="w-3 h-3" />
                                            VS
                                        </span>
                                    </div>

                                    <div className={`flex-1 w-full text-center sm:text-left font-medium pl-0 sm:pl-4 ${!duel.player2 ? 'text-foreground/40 italic' : 'text-foreground'}`}>
                                        {duel.player2 ? duel.player2.name : '(Passa Direto / Bye)'}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {items.length % 2 !== 0 && (
                            <div className="mt-6 text-sm text-foreground/50 text-center bg-muted/50 p-3 rounded-lg">
                                Como o número de participantes é ímpar, um deles foi sorteado para passar direto de fase.
                            </div>
                        )}
                    </ResultDisplay>
                )}
            </div>
        </div>
    );
}
