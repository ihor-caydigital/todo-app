import './App.css';
import './themes/dark.css';
import './themes/light.css';
import { useTodoApp } from './hooks/useTodoApp';
import { useTheme } from './hooks/useTheme';
import { Sidebar } from './components/Sidebar';
import { TodoList } from './components/TodoList';

function App() {
  const {
    lists,
    activeList,
    setActiveList,
    createList,
    renameList,
    deleteList,
    setListColor,
    addItem,
    toggleItem,
    editItem,
    deleteItem,
    reorderItems,
  } = useTodoApp();

  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-layout">
      <Sidebar
        lists={lists}
        activeListId={activeList?.id ?? null}
        theme={theme}
        onSelect={setActiveList}
        onCreateList={createList}
        onRenameList={renameList}
        onDeleteList={deleteList}
        onSetListColor={setListColor}
        onToggleTheme={toggleTheme}
      />
      {activeList ? (
        <TodoList
          list={activeList}
          onAddItem={addItem}
          onToggleItem={toggleItem}
          onEditItem={editItem}
          onDeleteItem={deleteItem}
          onReorderItems={reorderItems}
        />
      ) : (
        <main className="todo-main welcome">
          <div className="welcome-content">
            <h2>Welcome to <span>Todo.</span></h2>
            <p>Create a list to get started.</p>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
