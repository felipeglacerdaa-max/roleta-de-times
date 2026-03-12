import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ResultDisplayProps {
    title: string;
    resultAsText: string;
    children: React.ReactNode;
    onClear?: () => void;
}

export function ResultDisplay({ title, resultAsText, children, onClear }: ResultDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(resultAsText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="card flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-400">
            <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="font-bold text-lg text-primary">{title}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="btn-secondary text-sm py-1.5 px-3"
                        title="Copiar resultado em texto"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copiado!' : 'Copiar'}
                    </button>

                    {onClear && (
                        <button
                            onClick={onClear}
                            className="btn-secondary text-sm py-1.5 px-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                            Limpar
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-muted/30 rounded-xl p-4 md:p-6 border border-border/50">
                {children}
            </div>
        </div>
    );
}
