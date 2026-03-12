import { supabase } from '../lib/supabaseClient';
import type { Participant } from '../types';

export type TableName = 'roulette_items' | 'group_items' | 'duel_items' | 'simple_draw_items';

/**
 * Busca os itens de uma tabela específica no Supabase.
 */
export async function fetchItems(table: TableName): Promise<Participant[]> {
    try {
        const { data, error } = await supabase
            .from(table)
            .select('id, name')
            .order('created_at', { ascending: true });

        if (error) {
            console.error(`Erro ao buscar itens de ${table}:`, error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error(`Exceção ao buscar itens de ${table}:`, err);
        return [];
    }
}

/**
 * Adiciona múltiplos itens ao Supabase.
 */
export async function addItems(table: TableName, items: Participant[]): Promise<Participant[]> {
    try {
        const { data, error } = await supabase
            .from(table)
            .insert(items)
            .select('id, name');

        if (error) {
            console.error(`Erro ao adicionar itens em ${table}:`, error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error(`Exceção ao adicionar itens em ${table}:`, err);
        return [];
    }
}

/**
 * Remove um item específico pelo ID no Supabase.
 */
export async function removeItem(table: TableName, id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);

        if (error) {
            console.error(`Erro ao remover o item ${id} de ${table}:`, error);
            return false;
        }

        return true;
    } catch (err) {
        console.error(`Exceção ao remover o item ${id} de ${table}:`, err);
        return false;
    }
}

/**
 * Limpa todos os itens de uma tabela no Supabase.
 */
export async function clearAllItems(table: TableName): Promise<boolean> {
    try {
        // Sem where clause pra deletar tudo. O RLS precisa estar configurado pra permitir,
        // mas muitas vezes o supabase exige um filtro. Se houver erro, podemos usar um id != nulo ou limpar pelo client e iterar
        const { error } = await supabase
            .from(table)
            .delete()
            .neq('name', 'algum_nome_impossível_para_forçar_deleção'); // workaround para deletar todos os registros sem filtros restritos

        if (error) {
            console.error(`Erro ao limpar a tabela ${table}:`, error);
            // Fallback: buscar tudo e deletar um por um se o bulk delete falhar
            return clearAllItemsFallback(table);
        }

        return true;
    } catch (err) {
        console.error(`Exceção ao limpar a tabela ${table}:`, err);
        return false;
    }
}

async function clearAllItemsFallback(table: TableName): Promise<boolean> {
    try {
        const items = await fetchItems(table);
        if (items.length === 0) return true;
        
        const ids = items.map(item => item.id);
        const { error } = await supabase.from(table).delete().in('id', ids);
        
        return !error;
    } catch (e) {
        return false;
    }
}
