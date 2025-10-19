'use client';

import { useState, useRef, useEffect } from 'react';
import { FolderItem } from '@/types/workspace';
import { useWorkspaceStore } from '@/store/workspaceStore';

interface BreadcrumbProps {
  itemId: string | null;
}

export function Breadcrumb({ itemId }: BreadcrumbProps) {
  const { getPath, setCurrentFolder, renameItem } = useWorkspaceStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const path = itemId ? getPath(itemId) : [];

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleStartEdit = (item: FolderItem) => {
    if (item.parentId === null) return; // Don't allow editing root
    setEditingId(item.id);
    setEditValue(item.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editValue.trim()) {
      renameItem(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  if (path.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>No item selected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm overflow-x-auto">
      {path.map((item, index) => {
        const isLast = index === path.length - 1;
        const isEditing = editingId === item.id;
        const canEdit = item.parentId !== null; // Can't edit root

        return (
          <div key={item.id} className="flex items-center gap-2">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={handleKeyDown}
                className="px-2 py-1 border border-indigo-500 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <button
                onClick={() => {
                  if (item.type === 'folder') {
                    setCurrentFolder(item.id);
                  }
                }}
                onDoubleClick={() => canEdit && handleStartEdit(item)}
                className={`px-2 py-1 rounded transition-colors ${
                  isLast
                    ? 'text-gray-900 font-semibold bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium'
                }`}
                title={canEdit ? 'Double-click to rename' : ''}
              >
                {item.name}
              </button>
            )}

            {!isLast && <span className="text-gray-400">/</span>}
          </div>
        );
      })}
    </div>
  );
}
