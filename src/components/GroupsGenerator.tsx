import { useState, useEffect } from 'react';
import { useSupabaseItems } from '../hooks/useSupabaseItems';
import type { Group } from '../types';
import { InputList } from './InputList';
import { ResultDisplay } from './ResultDisplay';
import { Users } from 'lucide-react';

const GROUPS_COUNT_KEY = 'sorteador_groups_count';

export function GroupsGenerator() {
    const { items, setItems } = useSupabaseItems('group_items');

    const [groupCount, setGroupCount] = useState<number>(() => {
        const saved = localStorage.getItem(GROUPS_COUNT_KEY);
        return saved ? parseInt(saved, 10) : 2;
    });

    const [groups, setGroups] = useState<Group[] | null>(null);

    // Removido o useEffect do STORAGE_KEY pois agora usamos Supabase

    useEffect(() => {
        localStorage.setItem(GROUPS_COUNT_KEY, groupCount.toString());
    }, [groupCount]);

    const handleGenerate = () => {
        if (items.length < groupCount) return;

        // Shuffle array
        const shuffled = [...items].sort(() => Math.random() - 0.5);

        // Create groups
        const newGroups: Group[] = Array.from({ length: groupCount }, (_, i) => ({
            id: crypto.randomUUID(),
            name: `Time ${i + 1}`,
            members: []
        }));

        // Distribute evenly
        shuffled.forEach((participant, index) => {
            newGroups[index % groupCount].members.push(participant);
        });

        setGroups(newGroups);
    };

    const getResultAsText = () => {
        if (!groups) return '';
        return groups.map(g =>
            `${g.name}:\n${g.members.map(m => `- ${m.name}`).join('\n')}`
        ).join('\n\n');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 h-full flex flex-col gap-4">
                <InputList
                    items={items}
                    onChange={setItems}
                    minItems={groupCount}
                    placeholder="Nomes dos alunos/jogadores..."
                />

                <div className="card flex flex-col gap-4 p-5">
                    <label className="text-sm font-semibold flex items-center justify-between">
                        Quantidade de Times/Grupos
                        <span className="text-primary font-bold text-lg">{groupCount}</span>
                    </label>
                    <input
                        type="range"
                        min="2"
                        max="10"
                        value={groupCount}
                        onChange={(e) => setGroupCount(parseInt(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-foreground/40 mt-[-8px]">
                        <span>2</span>
                        <span>10</span>
                    </div>

                    <button
                        className="btn-primary w-full mt-2"
                        onClick={handleGenerate}
                        disabled={items.length < groupCount}
                    >
                        <Users className="w-4 h-4 mr-2" />
                        Gerar Times
                    </button>
                </div>
            </div>

            <div className="lg:col-span-8">
                {!groups ? (
                    <div className="card h-full min-h-[300px] flex flex-col items-center justify-center opacity-40">
                        <Users className="w-16 h-16 mb-4" />
                        <p>Adicione os participantes e gere os times para ver o resultado</p>
                    </div>
                ) : (
                    <ResultDisplay
                        title="Times Sorteados"
                        resultAsText={getResultAsText()}
                        onClear={() => setGroups(null)}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {groups.map(group => (
                                <div key={group.id} className="bg-background border border-border rounded-lg p-4 shadow-sm hover:border-primary/30 transition-colors">
                                    <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-3">
                                        <h4 className="font-bold text-foreground">{group.name}</h4>
                                        <span className="text-xs bg-muted px-2 py-1 rounded-md font-medium">
                                            {group.members.length} {group.members.length === 1 ? 'membro' : 'membros'}
                                        </span>
                                    </div>
                                    <ul className="space-y-1.5 pl-1">
                                        {group.members.map(member => (
                                            <li key={member.id} className="text-sm flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                {member.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </ResultDisplay>
                )}
            </div>
        </div>
    );
}
