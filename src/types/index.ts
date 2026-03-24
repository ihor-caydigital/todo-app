export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface TodoList {
  id: string;
  name: string;
  color?: string;
  items: TodoItem[];
  createdAt: number;
}

export interface AppState {
  lists: TodoList[];
  activeListId: string | null;
}
