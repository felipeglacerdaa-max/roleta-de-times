import { useState } from 'react';
import { useSupabaseItems } from '../hooks/useSupabaseItems';
import type { Participant } from '../types';
import { InputList } from './InputList';
import { Trophy, Dices, Shuffle } from 'lucide-react';
import confetti from 'canvas-confetti';

export function SimpleDraw() {
    const { items, setItems } = useSupabaseItems('simple_draw_items');

    const [winner, setWinner] = useState<Participant | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [, setShuffleCount] = useState(0);

    // Local storage sync removido em prol do Supabase

    const triggerConfetti = () => {
        const duration = 2000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#6366f1', '#818cf8', '#a5b4fc']
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#6366f1', '#818cf8', '#a5b4fc']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    };

    const handleDraw = () => {
        if (items.length === 0) return;

        setIsDrawing(true);
        setWinner(null);

        let iterations = 0;
        const maxIterations = 20;

        const interval = setInterval(() => {
            setShuffleCount(c => c + 1);
            iterations++;

            if (iterations >= maxIterations) {
                clearInterval(interval);
                const randomIndex = Math.floor(Math.random() * items.length);
                setWinner(items[randomIndex]);
                setIsDrawing(false);
                triggerConfetti();
            }
        }, 50);
    };

    const handleShuffleList = () => {
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        setItems(shuffled);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 h-full">
                <InputList
                    items={items}
                    onChange={setItems}
                    minItems={1}
                    placeholder="Adicione opções ou nomes..."
                />
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="card text-center flex flex-col items-center justify-center p-8 min-h-[300px] border-t-4 border-t-primary/50 relative overflow-hidden">

                    <div className="absolute top-4 right-4 flex gap-2">
                        <button
                            onClick={handleShuffleList}
                            disabled={items.length < 2 || isDrawing}
                            className="btn-icon"
                            title="Embaralhar Lista"
                        >
                            <Shuffle className="w-5 h-5" />
                        </button>
                    </div>

                    {!winner && !isDrawing ? (
                        <div className="opacity-40 flex flex-col items-center gap-4">
                            <Dices className="w-16 h-16" />
                            <p>Adicione itens e clique em sortear</p>
                        </div>
                    ) : isDrawing ? (
                        <div className="flex flex-col items-center gap-6 pb-4">
                            <div className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                            <div className="text-2xl font-bold animate-pulse text-primary">
                                Sorteando...
                            </div>
                        </div>
                    ) : winner ? (
                        <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-500 pb-4">
                            <div className="bg-primary/10 p-4 rounded-full text-primary ring-8 ring-primary/5 mb-2">
                                <Trophy className="w-12 h-12" />
                            </div>
                            <div>
                                <span className="text-sm font-semibold uppercase tracking-widest opacity-60">Vencedor</span>
                                <h3 className="text-4xl md:text-5xl font-extrabold mt-2 tracking-tight text-foreground bg-clip-text">
                                    {winner.name}
                                </h3>
                            </div>
                        </div>
                    ) : null}

                    <button
                        className="btn-primary w-full max-w-xs mt-8 py-3 text-lg"
                        onClick={handleDraw}
                        disabled={items.length === 0 || isDrawing}
                    >
                        {isDrawing ? 'Aguarde...' : winner ? 'Sortear Novamente' : 'Sortear Agora'}
                    </button>
                </div>
            </div>
        </div>
    );
}
