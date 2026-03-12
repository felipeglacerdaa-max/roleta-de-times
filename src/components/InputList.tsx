import { useState, type KeyboardEvent } from 'react';
import type { Participant } from '../types';
import { Plus, X, Trash2, Users2 } from 'lucide-react';

interface InputListProps {
    items: Participant[];
    onChange: (items: Participant[]) => void;
    placeholder?: string;
    minItems?: number;
}

export function InputList({ items, onChange, placeholder = 'Adicionar participante...', minItems = 2 }: InputListProps) {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        if (!inputValue.trim()) return;

        // Support comma-separated or multiline inputs
        const newNames = inputValue
            .split(/[\n,]/)
            .map(n => n.trim())
            .filter(n => n.length > 0);

        if (newNames.length === 0) return;

        const newItems: Participant[] = newNames.map(name => ({
            id: crypto.randomUUID(),
            name
        }));

        onChange([...items, ...newItems]);
        setInputValue('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAdd();
        }
    };

    const handleRemove = (id: string) => {
        onChange(items.filter(item => item.id !== id));
    };

    const handleClear = () => {
        if (window.confirm('Tem certeza que deseja limpar a lista?')) {
            onChange([]);
        }
    };

    const isTextarea = inputValue.length > 30 || inputValue.includes('\n');

    return (
        <div className="card h-full flex flex-col gap-4 border-t-4 border-t-primary">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                    <Users2 className="w-5 h-5 text-primary" />
                    Participantes
                    <span className="text-xs font-normal text-foreground/50 bg-muted px-2 py-0.5 rounded-full">
                        {items.length}
                    </span>
                </h3>
                {items.length > 0 && (
                    <button
                        onClick={handleClear}
                        className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Limpar tudo"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Limpar
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-2 relative">
                {isTextarea ? (
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Cole uma lista de nomes..."
                        className="input-base min-h-[100px] resize-y"
                    />
                ) : (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="input-base pr-10"
                    />
                )}
                <button
                    onClick={handleAdd}
                    className="absolute right-2 top-2 p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors"
                    disabled={!inputValue.trim()}
                    title="Adicionar"
                >
                    <Plus className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-foreground/40 self-end">
                    Pressione Enter para adicionar. Use vírgulas para múltiplos.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[400px] pr-1 -mr-1 custom-scrollbar">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-foreground/30 space-y-2 p-8 text-center border-2 border-dashed border-border rounded-lg">
                        <Users2 className="w-8 h-8 opacity-20" />
                        <p className="text-sm">A lista está vazia</p>
                    </div>
                ) : (
                    <ul className="space-y-1.5">
                        {items.map((item, index) => (
                            <li
                                key={item.id}
                                className="flex items-center justify-between group bg-muted/50 hover:bg-muted p-2 rounded-lg transition-colors border border-transparent hover:border-border/50 animate-in slide-in-from-left-2 duration-200"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className="text-xs font-medium text-foreground/40 w-4 text-right">
                                        {index + 1}.
                                    </span>
                                    <span className="truncate font-medium text-sm">
                                        {item.name}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="p-1.5 text-red-500/70 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-all"
                                    title="Remover este item"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {items.length > 0 && items.length < minItems && (
                <div className="text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-900/10 dark:text-yellow-500 p-2 rounded border border-yellow-200 dark:border-yellow-900/50">
                    Mínimo de {minItems} participantes necessários.
                </div>
            )}
        </div>
    );
}
