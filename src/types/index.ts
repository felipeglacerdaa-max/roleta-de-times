export type AppMode = 'roulette' | 'groups' | 'duels' | 'simple';

export interface Participant {
    id: string;
    name: string;
}

export interface Group {
    id: string;
    name: string;
    members: Participant[];
}

export interface Duel {
    id: string;
    player1: Participant;
    player2: Participant | null; // null if bye
}
