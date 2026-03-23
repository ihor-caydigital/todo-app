# Copilot Instructions

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # ESLint (flat config, v9)
npm run preview   # Serve the production build locally
```

There is no test suite — no test runner is installed.

## Architecture

Single-page app: React 19 + TypeScript + Vite. No routing, no external state library.

**State flow:**
```
useTodoApp (src/hooks/useTodoApp.ts)
  └── App.tsx  [orchestrator — holds no logic, only wires hook → components]
        ├── Sidebar.tsx      [list CRUD + selection]
        └── TodoList.tsx     [items for active list]
              └── TodoItem.tsx  [single item row]
```

All application state (`{ lists: TodoList[], activeListId: string | null }`) lives in a single `useState` inside `useTodoApp`. State is automatically persisted to `localStorage` on every change via a `useEffect`. No Context API, no Redux, no Zustand.

**Types** are defined in `src/types/index.ts` (`TodoItem`, `TodoList`, `AppState`).  
**localStorage** read/write is isolated in `src/store/storage.ts` (key: `todo-app-state`).

## Key Conventions

- **All mutations live in `useTodoApp`** — wrapped in `useCallback`. Components receive only props; they never mutate state directly.
- **Components hold only local UI state** — input field values (`newText`, `newListName`) and transient edit modes (`editing`, `editingId`). Nothing domain-related.
- **Immutable state updates** — all mutations use spread/map/filter; never mutate objects in place.
- **IDs use `uuid` v4** — both lists and items use `uuid()` from the `uuid` package.
- **Styling is one flat CSS file** (`src/App.css`) with CSS custom properties. No CSS modules, no Tailwind. Dark theme with `#ff6b2b` orange accent. Do not introduce scoped/module CSS without migrating the existing styles.
- **Completed items are not filtered out** — `TodoList` splits items into `pending` and `done` arrays and renders them in two sections (pending first, then a "Completed" divider).
- **TypeScript strict mode is fully enabled** — `strict`, `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`. All new code must satisfy these without suppression.
- **ESLint uses flat config** (`eslint.config.js`) targeting `**/*.{ts,tsx}` with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`.
