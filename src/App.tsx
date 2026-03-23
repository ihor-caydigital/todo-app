import './App.css';
import { useTodoApp } from './hooks/useTodoApp';
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
    addItem,
    toggleItem,
    editItem,
    deleteItem,
  } = useTodoApp();

  return (
    <div className="app-layout">
      <Sidebar
        lists={lists}
        activeListId={activeList?.id ?? null}
        onSelect={setActiveList}
        onCreateList={createList}
        onRenameList={renameList}
        onDeleteList={deleteList}
      />
      {activeList ? (
        <TodoList
          list={activeList}
          onAddItem={addItem}
          onToggleItem={toggleItem}
          onEditItem={editItem}
          onDeleteItem={deleteItem}
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
