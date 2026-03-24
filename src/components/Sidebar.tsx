import { useState, useRef, type KeyboardEvent, type CSSProperties } from 'react';
import type { TodoList } from '../types';
import type { Theme } from '../hooks/useTheme';

interface Props {
  lists: TodoList[];
  activeListId: string | null;
  theme: Theme;
  onSelect: (id: string) => void;
  onCreateList: (name: string) => void;
  onRenameList: (id: string, name: string) => void;
  onDeleteList: (id: string) => void;
  onSetListColor: (id: string, color: string) => void;
  onToggleTheme: () => void;
}

export const Sidebar = ({
  lists,
  activeListId,
  theme,
  onSelect,
  onCreateList,
  onRenameList,
  onDeleteList,
  onSetListColor,
  onToggleTheme,
}: Props) => {
  const [newListName, setNewListName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const colorInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleCreate = () => {
    const name = newListName.trim();
    if (!name) return;
    onCreateList(name);
    setNewListName('');
  };

  const handleCreateKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleCreate();
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const confirmEdit = () => {
    if (editingId && editingName.trim()) {
      onRenameList(editingId, editingName);
    }
    setEditingId(null);
  };

  const handleEditKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') confirmEdit();
    if (e.key === 'Escape') setEditingId(null);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="app-title">Todo<span>.</span></h1>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀' : '☽'}
        </button>
      </div>

      <nav className="list-nav">
        {lists.map((list) => (
          <div
            key={list.id}
            className={`list-item${list.id === activeListId ? ' active' : ''}`}
            style={list.color ? ({ '--list-color': list.color } as CSSProperties) : undefined}
            onClick={() => onSelect(list.id)}
          >
            <button
              className="list-color-btn"
              title="Change list color"
              style={{ background: list.color ?? 'var(--grey)' }}
              onClick={(e) => {
                e.stopPropagation();
                colorInputRefs.current[list.id]?.click();
              }}
            />
            <input
              type="color"
              className="list-color-input"
              value={list.color ?? '#888888'}
              ref={(el) => { colorInputRefs.current[list.id] = el; }}
              onChange={(e) => onSetListColor(list.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {editingId === list.id ? (
              <input
                className="list-rename-input"
                value={editingName}
                autoFocus
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={confirmEdit}
                onKeyDown={handleEditKey}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="list-name">{list.name}</span>
            )}
            <div className="list-actions">
              <button
                className="icon-btn"
                title="Rename"
                onClick={(e) => {
                  e.stopPropagation();
                  startEdit(list.id, list.name);
                }}
              >
                ✎
              </button>
              <button
                className="icon-btn danger"
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteList(list.id);
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </nav>

      <div className="create-list">
        <input
          className="create-list-input"
          placeholder="New list…"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          onKeyDown={handleCreateKey}
        />
        <button className="create-list-btn" onClick={handleCreate}>
          +
        </button>
      </div>
    </aside>
  );
};
