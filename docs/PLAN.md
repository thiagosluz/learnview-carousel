# Plano de Correção de Lint

Este plano detalha as correções para os 34 problemas de lint encontrados (24 erros e 10 avisos).

## Categorização dos Problemas

### 1. Pureza e Hooks (Crítico)
- **`SidebarMenuSkeleton`**: `Math.random()` sendo usado no `useMemo`. Vamos substituir por uma largura fixa ou baseada em índice para garantir idempotência.
- **`useClassGroups`**: Estado derivado (`classGroups`) sendo definido via `useEffect`. Vamos converter para um `useMemo` simples.
- **`ProfessorDetails` & `useClassGroups`**: Chamadas síncronas de `setState` dentro de `useEffect`.

### 2. Tipagem TypeScript
- **`no-explicit-any`**: Substituir múltiplos usos de `any` por tipos reais (`Professor`, `Class`, `News`, etc.) ou `unknown`.
- **`no-empty-object-type`**: Corrigir interfaces vazias em `command.tsx` e `textarea.tsx`.

### 3. Estruturas de Código
- **`no-useless-catch`**: Remover blocos try/catch desnecessários em `services/news/storage.ts`.
- **`react-refresh/only-export-components`**: Ajustar exportações em componentes de UI para garantir que apenas componentes sejam exportados (mover constantes para arquivos separados ou prefixar com `_` se o linter permitir).

---

## Orquestração da Implementação

1. **@frontend-specialist**: Corrigirá os problemas de Pureza, Hooks e componentes de UI.
2. **@backend-specialist**: Corrigirá os problemas em `services` e `hooks` (tipagem e lógica).
3. **@test-engineer**: Validará as correções rodando `npm run lint` novamente.

## Plano de Verificação

### Automatizado
- Executar `npm run lint` e garantir que o número de problemas caia para 0.
- Executar `npm run build` para garantir que as mudanças de tipo não quebraram a compilação.
