import { useState, useCallback, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import type { AppState, TodoList, TodoItem } from '../types';
import { loadState, saveState } from '../store/storage';

export const useTodoApp = () => {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setActiveList = useCallback((id: string | null) => {
    setState((s) => ({ ...s, activeListId: id }));
  }, []);

  const createList = useCallback((name: string) => {
    const newList: TodoList = {
      id: uuid(),
      name: name.trim(),
      items: [],
      createdAt: Date.now(),
    };
    setState((s) => ({
      lists: [...s.lists, newList],
      activeListId: newList.id,
    }));
  }, []);

  const renameList = useCallback((id: string, name: string) => {
    setState((s) => ({
      ...s,
      lists: s.lists.map((l) => (l.id === id ? { ...l, name: name.trim() } : l)),
    }));
  }, []);

  const deleteList = useCallback((id: string) => {
    setState((s) => {
      const lists = s.lists.filter((l) => l.id !== id);
      const activeListId =
        s.activeListId === id ? (lists[0]?.id ?? null) : s.activeListId;
      return { lists, activeListId };
    });
  }, []);

  const addItem = useCallback((listId: string, text: string) => {
    const newItem: TodoItem = {
      id: uuid(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setState((s) => ({
      ...s,
      lists: s.lists.map((l) =>
        l.id === listId ? { ...l, items: [...l.items, newItem] } : l,
      ),
    }));
  }, []);

  const toggleItem = useCallback((listId: string, itemId: string) => {
    setState((s) => ({
      ...s,
      lists: s.lists.map((l) =>
        l.id === listId
          ? {
              ...l,
              items: l.items.map((i) =>
                i.id === itemId ? { ...i, completed: !i.completed } : i,
              ),
            }
          : l,
      ),
    }));
  }, []);

  const editItem = useCallback((listId: string, itemId: string, text: string) => {
    setState((s) => ({
      ...s,
      lists: s.lists.map((l) =>
        l.id === listId
          ? {
              ...l,
              items: l.items.map((i) =>
                i.id === itemId ? { ...i, text: text.trim() } : i,
              ),
            }
          : l,
      ),
    }));
  }, []);

  const deleteItem = useCallback((listId: string, itemId: string) => {
    setState((s) => ({
      ...s,
      lists: s.lists.map((l) =>
        l.id === listId
          ? { ...l, items: l.items.filter((i) => i.id !== itemId) }
          : l,
      ),
    }));
  }, []);

  const reorderItems = useCallback((listId: string, dragId: string, targetId: string) => {
    setState((s) => ({
      ...s,
      lists: s.lists.map((l) => {
        if (l.id !== listId) return l;
        const items = [...l.items];
        const fromIdx = items.findIndex((i) => i.id === dragId);
        const toIdx = items.findIndex((i) => i.id === targetId);
        if (fromIdx === -1 || toIdx === -1) return l;
        const [moved] = items.splice(fromIdx, 1);
        items.splice(toIdx, 0, moved);
        return { ...l, items };
      }),
    }));
  }, []);

  const importList = useCallback((list: TodoList) => {
    const imported: TodoList = {
      ...list,
      id: uuid(),
      items: list.items.map((item) => ({ ...item, id: uuid() })),
    };
    setState((s) => ({
      lists: [...s.lists, imported],
      activeListId: imported.id,
    }));
  }, []);

  const activeList = state.lists.find((l) => l.id === state.activeListId) ?? null;

  return {
    lists: state.lists,
    activeList,
    setActiveList,
    createList,
    renameList,
    deleteList,
    importList,
    addItem,
    toggleItem,
    editItem,
    deleteItem,
    reorderItems,
  };
};
