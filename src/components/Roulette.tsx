import { useState, useEffect, useRef } from 'react';
import { useSupabaseItems } from '../hooks/useSupabaseItems';
import type { Participant } from '../types';
import { InputList } from './InputList';
import { Play } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Roulette() {
    const { items, setItems } = useSupabaseItems('roulette_items');
    const [winner, setWinner] = useState<Participant | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Animation refs
    const requestRef = useRef<number>(0);
    const rotationRef = useRef<number>(0);
    const velocityRef = useRef<number>(0);
    const isSpinningRef = useRef<boolean>(false);

    useEffect(() => {
        drawWheel();
    }, [items]);

    const drawWheel = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - 10; // 10px padding

        ctx.clearRect(0, 0, width, height);

        if (items.length === 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fillStyle = '#f3f4f6'; // muted
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#e5e7eb'; // border
            ctx.stroke();

            ctx.fillStyle = '#9ca3af';
            ctx.font = '16px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Adicione itens', centerX, centerY);
            return;
        }

        const sliceAngle = (2 * Math.PI) / items.length;
        let currentAngle = rotationRef.current;

        // Colors matching our minimalist theme
        const colors = ['#ffffff', '#f9fafb', '#f3f4f6'];

        for (let i = 0; i < items.length; i++) {
            // Background slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();

            // Use primary color occasionally (e.g. index 0 or modulo for slight accent) or stick to neutrals
            ctx.fillStyle = i % 2 === 0 ? colors[0] : colors[1];
            ctx.fill();
            ctx.lineWidth = 2; // Linha mais grossa para destacar a separação
            ctx.strokeStyle = '#111827'; // Cor bem escura (text-foreground) para focar na separação
            ctx.stroke();

            // Text
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(currentAngle + sliceAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#111827'; // foreground
            ctx.font = '500 14px Inter, sans-serif';

            const text = items[i].name;
            // Truncate text if too long
            const maxTextRadius = radius - 30;
            let displayText = text;
            if (ctx.measureText(text).width > maxTextRadius) {
                displayText = text.substring(0, 15) + '...';
            }

            ctx.fillText(displayText, radius - 20, 5);
            ctx.restore();

            currentAngle += sliceAngle;
        }

        // Draw center dot
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#111827';
        ctx.fill();

        // Draw the pointer (triangle at the top)
        ctx.beginPath();
        ctx.moveTo(centerX - 15, 0);
        ctx.lineTo(centerX + 15, 0);
        ctx.lineTo(centerX, 25);
        ctx.closePath();
        ctx.fillStyle = '#6366f1'; // primary color
        ctx.fill();
    };

    const animate = () => {
        if (!isSpinningRef.current) return;

        rotationRef.current += velocityRef.current;

        // Apply friction
        velocityRef.current *= 0.985;

        // Check if stopped
        if (velocityRef.current < 0.002) {
            isSpinningRef.current = false;
            setIsSpinning(false);
            velocityRef.current = 0;

            // Calculate winner
            // Subtracted from 2.5 PI because pointer is at top (-PI/2) and wheel spins clockwise
            const sliceAngle = (2 * Math.PI) / items.length;
            // Normalize rotation (0 to 2PI)
            const normalizedRotation = rotationRef.current % (2 * Math.PI);

            // The pointer is at Math.PI / 2 relative to start (top) if we consider 0 is right.
            // Top is 3*PI/2. We need to find which slice overlaps 3*PI/2 - rotation
            let winningAngle = (3 * Math.PI / 2) - normalizedRotation;
            if (winningAngle < 0) winningAngle += 2 * Math.PI;

            const winningIndex = Math.floor(winningAngle / sliceAngle);

            if (items[winningIndex]) {
                setWinner(items[winningIndex]);
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#6366f1', '#818cf8', '#a5b4fc']
                });
            }
        }

        drawWheel();

        if (isSpinningRef.current) {
            requestRef.current = requestAnimationFrame(animate);
        }
    };

    const spin = () => {
        if (items.length < 2 || isSpinning) return;

        setWinner(null);
        setIsSpinning(true);
        isSpinningRef.current = true;

        // Random spin velocity (min 0.3, max 0.6)
        velocityRef.current = Math.random() * 0.3 + 0.3;

        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 h-full">
                <InputList
                    items={items}
                    onChange={setItems}
                    minItems={2}
                    placeholder="Adicione opções para a roleta..."
                />
            </div>

            <div className="lg:col-span-8 flex flex-col items-center">
                <div className="card w-full flex flex-col items-center justify-center p-8 min-h-[500px] relative overflow-hidden">

                    <div className="relative flex flex-col items-center my-4">
                        <canvas
                            ref={canvasRef}
                            width={400}
                            height={400}
                            className="max-w-full h-auto drop-shadow-xl z-10"
                        />

                        {winner && !isSpinning && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background/95 backdrop-blur-sm border border-border shadow-lg p-6 rounded-2xl z-20 animate-in zoom-in duration-300 text-center min-w-[250px]">
                                <p className="text-sm text-foreground/60 font-medium uppercase tracking-wider mb-2">Vencedor</p>
                                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
                                    {winner.name}
                                </h3>
                                <button
                                    onClick={() => setWinner(null)}
                                    className="mt-4 text-sm text-foreground/50 hover:text-foreground transition-colors"
                                >
                                    Fechar
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        className="btn-primary w-full max-w-xs mt-8 py-3 text-lg z-10"
                        onClick={spin}
                        disabled={items.length < 2 || isSpinning}
                    >
                        {isSpinning ? 'Girando...' : (
                            <>
                                <Play className="w-5 h-5 mr-1" />
                                Girar Roleta
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
