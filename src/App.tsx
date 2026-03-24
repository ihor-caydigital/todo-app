import './App.css';
import './themes/dark.css';
import './themes/light.css';
import { useState, useEffect, useCallback } from 'react';
import { useTodoApp } from './hooks/useTodoApp';
import { useTheme } from './hooks/useTheme';
import { Sidebar } from './components/Sidebar';
import { TodoList } from './components/TodoList';
import { ShareModal } from './components/ShareModal';
import { SharedListView } from './components/SharedListView';
import { getSharePayloadFromUrl, clearShareParam } from './store/shareUtils';
import type { SharePayload } from './types';

function App() {
  const {
    lists,
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
  } = useTodoApp();

  const { theme, toggleTheme } = useTheme();

  // Share modal (owner generating a link)
  const [sharingListId, setSharingListId] = useState<string | null>(null);
  const sharingList = lists.find((l) => l.id === sharingListId) ?? null;

  // Incoming shared list (visitor opening a share URL) — read once from URL on mount
  const [incomingShare, setIncomingShare] = useState<SharePayload | null>(
    getSharePayloadFromUrl,
  );

  useEffect(() => {
    if (incomingShare) clearShareParam();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleImportSharedList = useCallback(() => {
    if (!incomingShare) return;
    importList(incomingShare.list);
    setIncomingShare(null);
  }, [incomingShare, importList]);

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
        onShareList={setSharingListId}
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

      {sharingList && (
        <ShareModal
          list={sharingList}
          onClose={() => setSharingListId(null)}
        />
      )}

      {incomingShare && (
        <SharedListView
          payload={incomingShare}
          onImport={handleImportSharedList}
          onDismiss={() => setIncomingShare(null)}
        />
      )}
    </div>
  );
}

export default App;
