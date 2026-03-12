-- Script para criar as tabelas no Supabase para os 4 tipos de sorteio

-- 1. Tabela para a Roleta
CREATE TABLE public.roulette_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela para os Times/Grupos
CREATE TABLE public.group_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela para os Confrontos (Duels)
CREATE TABLE public.duel_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela para o Sorteio Simples (Simple Draw)
CREATE TABLE public.simple_draw_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS) para todas as tabelas
ALTER TABLE public.roulette_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duel_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simple_draw_items ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir acesso anônimo de leitura e escrita (para facilitar o desenvolvimento/uso sem login obrigatório)
-- ATENÇÃO: Se desejar proteger os dados, você deve alterar as políticas para permitir apenas usuários autenticados.

-- Políticas para roulette_items
CREATE POLICY "Permitir leitura pública roulette" ON public.roulette_items FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública roulette" ON public.roulette_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir remoção pública roulette" ON public.roulette_items FOR DELETE USING (true);
CREATE POLICY "Permitir atualização pública roulette" ON public.roulette_items FOR UPDATE USING (true);

-- Políticas para group_items
CREATE POLICY "Permitir leitura pública group" ON public.group_items FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública group" ON public.group_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir remoção pública group" ON public.group_items FOR DELETE USING (true);
CREATE POLICY "Permitir atualização pública group" ON public.group_items FOR UPDATE USING (true);

-- Políticas para duel_items
CREATE POLICY "Permitir leitura pública duel" ON public.duel_items FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública duel" ON public.duel_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir remoção pública duel" ON public.duel_items FOR DELETE USING (true);
CREATE POLICY "Permitir atualização pública duel" ON public.duel_items FOR UPDATE USING (true);

-- Políticas para simple_draw_items
CREATE POLICY "Permitir leitura pública simple" ON public.simple_draw_items FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública simple" ON public.simple_draw_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir remoção pública simple" ON public.simple_draw_items FOR DELETE USING (true);
CREATE POLICY "Permitir atualização pública simple" ON public.simple_draw_items FOR UPDATE USING (true);
