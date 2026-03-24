import type { SharePayload } from '../types';

interface Props {
  payload: SharePayload;
  onImport: () => void;
  onDismiss: () => void;
}

export const SharedListView = ({ payload, onImport, onDismiss }: Props) => {
  const { list, permission } = payload;
  const pending = list.items.filter((i) => !i.completed);
  const done = list.items.filter((i) => i.completed);

  return (
    <div className="modal-overlay">
      <div className="modal shared-list-modal">
        <div className="modal-header">
          <h3 className="modal-title">Shared list: &ldquo;{list.name}&rdquo;</h3>
        </div>

        <div className="modal-body">
          {list.items.length === 0 ? (
            <p className="shared-empty">This list has no tasks.</p>
          ) : (
            <ul className="shared-item-list">
              {pending.map((item) => (
                <li key={item.id} className="shared-item">
                  <span className="shared-item-check" />
                  <span className="shared-item-text">{item.text}</span>
                </li>
              ))}
              {done.length > 0 && (
                <>
                  <li className="done-divider">Completed</li>
                  {done.map((item) => (
                    <li key={item.id} className="shared-item completed">
                      <span className="shared-item-check checked" />
                      <span className="shared-item-text">{item.text}</span>
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}

          <p className="share-note">
            {permission === 'edit'
              ? 'You can import this list into your Todo app and edit your own copy.'
              : 'This is a view-only snapshot of the shared list.'}
          </p>

          <div className="shared-list-actions">
            {permission === 'edit' && (
              <button className="add-item-btn" onClick={onImport}>
                Import to My Lists
              </button>
            )}
            <button className="icon-btn shared-dismiss-btn" onClick={onDismiss}>
              {permission === 'edit' ? 'Dismiss' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
