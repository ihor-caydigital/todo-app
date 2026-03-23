import { useState, type KeyboardEvent } from 'react';
import type { TodoList as TodoListType } from '../types';
import { TodoItem } from './TodoItem';

interface Props {
  list: TodoListType;
  onAddItem: (listId: string, text: string) => void;
  onToggleItem: (listId: string, itemId: string) => void;
  onEditItem: (listId: string, itemId: string, text: string) => void;
  onDeleteItem: (listId: string, itemId: string) => void;
}

export const TodoList = ({
  list,
  onAddItem,
  onToggleItem,
  onEditItem,
  onDeleteItem,
}: Props) => {
  const [newText, setNewText] = useState('');

  const handleAdd = () => {
    const text = newText.trim();
    if (!text) return;
    onAddItem(list.id, text);
    setNewText('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
  };

  const pending = list.items.filter((i) => !i.completed);
  const done = list.items.filter((i) => i.completed);

  return (
    <main className="todo-main">
      <header className="todo-header">
        <h2 className="list-title">{list.name}</h2>
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
