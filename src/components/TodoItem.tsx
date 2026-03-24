import { useState, type KeyboardEvent } from 'react';
import type { TodoItem as TodoItemType } from '../types';

interface Props {
  item: TodoItemType;
  listId: string;
  onToggle: (listId: string, itemId: string) => void;
  onEdit: (listId: string, itemId: string, text: string) => void;
  onDelete: (listId: string, itemId: string) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragOver?: () => void;
  onDrop?: () => void;
  isDragOver?: boolean;
  isDragging?: boolean;
}

export const TodoItem = ({ item, listId, onToggle, onEdit, onDelete, onDragStart, onDragEnd, onDragOver, onDrop, isDragOver, isDragging }: Props) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const confirmEdit = () => {
    if (editText.trim()) {
      onEdit(listId, item.id, editText);
    } else {
      setEditText(item.text);
    }
    setEditing(false);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') confirmEdit();
    if (e.key === 'Escape') {
      setEditText(item.text);
      setEditing(false);
    }
  };

  const classNames = [
    'todo-item',
    item.completed ? 'completed' : '',
    isDragOver ? 'drag-over' : '',
    isDragging ? 'dragging' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li
      className={classNames}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={(e) => { e.preventDefault(); onDragOver?.(); }}
      onDrop={onDrop}
    >
      <span className="drag-handle" title="Drag to reorder" aria-label="Drag to reorder">⠿</span>
      <button
        className={`check-btn${item.completed ? ' checked' : ''}`}
        onClick={() => onToggle(listId, item.id)}
        aria-label={item.completed ? 'Mark incomplete' : 'Mark complete'}
      />
      {editing ? (
        <input
          className="todo-edit-input"
          value={editText}
          autoFocus
          onChange={(e) => setEditText(e.target.value)}
          onBlur={confirmEdit}
          onKeyDown={handleKey}
        />
      ) : (
        <span
          className="todo-text"
          onDoubleClick={() => {
            setEditText(item.text);
            setEditing(true);
          }}
        >
          {item.text}
        </span>
      )}
      <button
        className="icon-btn danger delete-item-btn"
        onClick={() => onDelete(listId, item.id)}
        aria-label="Delete item"
      >
        ✕
      </button>
    </li>
  );
};
