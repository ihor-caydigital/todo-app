import { useState, useRef, useEffect } from 'react';
import type { TodoList } from '../types';
import type { SharePermission } from '../types';
import { buildShareUrl } from '../store/shareUtils';

interface Props {
  list: TodoList;
  onClose: () => void;
}

export const ShareModal = ({ list, onClose }: Props) => {
  const [permission, setPermission] = useState<SharePermission>('view');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const shareUrl = buildShareUrl({ list, permission });

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      inputRef.current?.select();
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Share &ldquo;{list.name}&rdquo;</h3>
          <button className="modal-close icon-btn" title="Close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-label">Who can use this link?</p>
          <div className="share-permissions">
            <label className="share-permission-option">
              <input
                type="radio"
                name="share-permission"
                value="view"
                checked={permission === 'view'}
                onChange={() => setPermission('view')}
              />
              <span>
                <strong>View only</strong>
                <span className="permission-desc">Anyone with the link can view a snapshot of this list.</span>
              </span>
            </label>
            <label className="share-permission-option">
              <input
                type="radio"
                name="share-permission"
                value="edit"
                checked={permission === 'edit'}
                onChange={() => setPermission('edit')}
              />
              <span>
                <strong>Can import &amp; edit</strong>
                <span className="permission-desc">Anyone with the link can import this list and edit their own copy.</span>
              </span>
            </label>
          </div>

          <div className="share-link-row">
            <input
              ref={inputRef}
              className="share-link-input"
              readOnly
              value={shareUrl}
              onFocus={(e) => e.currentTarget.select()}
            />
            <button className="share-copy-btn" onClick={handleCopy}>
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>

          <p className="share-note">
            This link contains a snapshot of the list at this moment. To revoke
            access, generate a new link — old links will remain valid but will
            not reflect future changes.
          </p>
        </div>
      </div>
    </div>
  );
};
