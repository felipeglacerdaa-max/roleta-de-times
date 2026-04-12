import { useState, useEffect } from 'react';
import { useSupabaseItems } from '../hooks/useSupabaseItems';
import type { Group } from '../types';
import { InputList } from './InputList';
import { ResultDisplay } from './ResultDisplay';
import { Users, Loader2 } from 'lucide-react';

const GROUPS_COUNT_KEY = 'sorteador_groups_count';

export function GroupsGenerator() {
    const { items, setItems } = useSupabaseItems('group_items');

    const [groupCount, setGroupCount] = useState<number>(() => {
        const saved = localStorage.getItem(GROUPS_COUNT_KEY);
        const parsed = parseInt(saved || '2', 10);
        return isNaN(parsed) || parsed < 2 ? 2 : parsed;
    });

    const [groups, setGroups] = useState<Group[] | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentDrawn, setCurrentDrawn] = useState<string | null>(null);

    // Removido o useEffect do STORAGE_KEY pois agora usamos Supabase

    useEffect(() => {
        localStorage.setItem(GROUPS_COUNT_KEY, groupCount.toString());
    }, [groupCount]);

    const handleGenerate = () => {
        if (items.length < groupCount || isDrawing) return;

        setIsDrawing(true);
        setCurrentDrawn("Iniciando sorteio...");

        // Shuffle array
        let shuffled = [...items].sort(() => Math.random() - 0.5);

        // Rig logic: force specific teams to alternate groups (Group A -> index 0, Group B -> index 1)
        if (groupCount === 2) {
            const RIG_A = ["tropical", "tyt", "tyc", "celeste", "tayuan"];
            const RIG_B = ["históricos", "historicos", "ponto certo", "ponto certyo", "avalanche", "eagles"];

            const isRigA = (name?: string) => typeof name === 'string' && RIG_A.includes(name.trim().toLowerCase());
            const isRigB = (name?: string) => typeof name === 'string' && RIG_B.includes(name.trim().toLowerCase());

            const poolA = shuffled.filter(p => p && isRigA(p.name));
            const poolB = shuffled.filter(p => p && isRigB(p.name));
            const others = shuffled.filter(p => p && !isRigA(p.name) && !isRigB(p.name));

            const riggedArray: typeof items = [];
            let aIndex = 0;
            let bIndex = 0;
            let othersIndex = 0;

            for (let i = 0; i < items.length; i++) {
                if (i % 2 === 0) {
                    if (aIndex < poolA.length) riggedArray.push(poolA[aIndex++]);
                    else if (othersIndex < others.length) riggedArray.push(others[othersIndex++]);
                    else if (bIndex < poolB.length) riggedArray.push(poolB[bIndex++]);
                } else {
                    if (bIndex < poolB.length) riggedArray.push(poolB[bIndex++]);
                    else if (othersIndex < others.length) riggedArray.push(others[othersIndex++]);
                    else if (aIndex < poolA.length) riggedArray.push(poolA[aIndex++]);
                }
            }
            shuffled = riggedArray;
        }

        // Setup base groups with names "Grupo A", "Grupo B", etc.
        const initialGroups: Group[] = Array.from({ length: groupCount }, (_, i) => ({
            id: Math.random().toString(36).substring(2, 10),
            name: `Grupo ${String.fromCharCode(65 + i)}`,
            members: []
        }));

        setGroups(initialGroups);

        let currentIndex = 0;

        const drawNext = () => {
            if (currentIndex >= shuffled.length) {
                setCurrentDrawn(null);
                setIsDrawing(false);
                return;
            }

            const participant = shuffled[currentIndex];
            const targetGroupIndex = isNaN(groupCount) || groupCount < 2 ? 0 : (currentIndex % groupCount);
            const targetGroup = initialGroups[targetGroupIndex];

            setCurrentDrawn(`Sorteando para o ${targetGroup?.name || 'Próximo Grupo'}...`);

            setTimeout(() => {
                setCurrentDrawn(`${participant?.name || 'Participante'} foi para o ${targetGroup?.name || 'Próximo Grupo'}!`);

                setGroups(prev => {
                    if (!prev) return prev;
                    const newStats = [...prev];
                    const updatedGroup = { ...newStats[targetGroupIndex] };
                    if (participant) {
                        updatedGroup.members = [...updatedGroup.members, participant];
                    }
                    newStats[targetGroupIndex] = updatedGroup;
                    return newStats;
                });

                currentIndex++;
                setTimeout(drawNext, 1200);
            }, 800);
        };

        drawNext();
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
                        onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setGroupCount(isNaN(val) || val < 2 ? 2 : val);
                        }}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-foreground/40 mt-[-8px]">
                        <span>2</span>
                        <span>10</span>
                    </div>

                    <button
                        className="btn-primary w-full mt-2"
                        onClick={handleGenerate}
                        disabled={items.length < groupCount || isDrawing}
                    >
                        {isDrawing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Sorteando...
                            </>
                        ) : (
                            <>
                                <Users className="w-4 h-4 mr-2" />
                                Gerar Times
                            </>
                        )}
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
                    <div className="flex flex-col gap-6">
                        {isDrawing && currentDrawn && (
                            <div className="card p-6 text-center animate-in fade-in zoom-in slide-in-from-top-4 bg-primary/5 border-primary/20 shadow-md">
                                <div className="text-xl md:text-2xl font-bold text-primary">
                                    {currentDrawn}
                                </div>
                            </div>
                        )}
                        <ResultDisplay
                            title="Times Sorteados"
                            resultAsText={getResultAsText()}
                            onClear={isDrawing ? undefined : () => setGroups(null)}
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
                                                <li key={member.id} className="text-sm flex items-center gap-2 animate-in slide-in-from-left-2 fade-in duration-300">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                    {member.name}
                                                </li>
                                            ))}
                                            {isDrawing && group.members.length < Math.ceil(items.length / groupCount) && (
                                                <li className="text-sm flex items-center gap-2 opacity-30">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse" />
                                                    Aguardando...
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </ResultDisplay>
                    </div>
                )}
            </div>
        </div>
    );
}
