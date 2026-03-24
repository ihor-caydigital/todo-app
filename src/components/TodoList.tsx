import { useState, type KeyboardEvent } from 'react';
import type { TodoList as TodoListType } from '../types';
import { TodoItem } from './TodoItem';

interface Props {
  list: TodoListType;
  onAddItem: (listId: string, text: string) => void;
  onToggleItem: (listId: string, itemId: string) => void;
  onEditItem: (listId: string, itemId: string, text: string) => void;
  onDeleteItem: (listId: string, itemId: string) => void;
  onReorderItems: (listId: string, dragId: string, targetId: string) => void;
}

export const TodoList = ({
  list,
  onAddItem,
  onToggleItem,
  onEditItem,
  onDeleteItem,
  onReorderItems,
}: Props) => {
  const [newText, setNewText] = useState('');
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleAdd = () => {
    const text = newText.trim();
    if (!text) return;
    onAddItem(list.id, text);
    setNewText('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
  };

  const handleDragStart = (id: string) => {
    setDragId(id);
  };

  const handleDragEnd = () => {
    setDragId(null);
    setDragOverId(null);
  };

  const handleDragOver = (id: string) => {
    if (dragId !== id) setDragOverId(id);
  };

  const handleDrop = (targetId: string) => {
    if (dragId && dragId !== targetId) {
      onReorderItems(list.id, dragId, targetId);
    }
    setDragId(null);
    setDragOverId(null);
  };

  const pending = list.items.filter((i) => !i.completed);
  const done = list.items.filter((i) => i.completed);

  const dragHandlersFor = (id: string) => ({
    onDragStart: () => handleDragStart(id),
    onDragEnd: handleDragEnd,
    onDragOver: () => handleDragOver(id),
    onDrop: () => handleDrop(id),
  });

  return (
    <main className="todo-main">
      <header className="todo-header">
        <h2 className="list-title" style={list.color ? { color: list.color } : undefined}>{list.name}</h2>
        <span className="item-count">
          {pending.length} remaining · {done.length} done
        </span>
      </header>

      <div className="add-item-row">
        <input
          className="add-item-input"
          placeholder="Add a task…"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className="add-item-btn" onClick={handleAdd}>
          Add
        </button>
      </div>

      <ul className="todo-list">
        {pending.map((item) => (
          <TodoItem
            key={item.id}
            item={item}
            listId={list.id}
            onToggle={onToggleItem}
            onEdit={onEditItem}
            onDelete={onDeleteItem}
            {...dragHandlersFor(item.id)}
            isDragOver={dragOverId === item.id}
            isDragging={dragId === item.id}
          />
        ))}
        {done.length > 0 && (
          <>
            <li className="done-divider">Completed</li>
            {done.map((item) => (
              <TodoItem
                key={item.id}
                item={item}
                listId={list.id}
                onToggle={onToggleItem}
                onEdit={onEditItem}
                onDelete={onDeleteItem}
                {...dragHandlersFor(item.id)}
                isDragOver={dragOverId === item.id}
                isDragging={dragId === item.id}
              />
            ))}
          </>
        )}
        {list.items.length === 0 && (
          <li className="empty-state">No tasks yet. Add one above!</li>
        )}
      </ul>
    </main>
  );
};
