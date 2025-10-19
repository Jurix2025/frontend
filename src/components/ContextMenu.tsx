'use client';

import { useEffect, useRef } from 'react';
import { FolderItem } from '@/types/workspace';

interface ContextMenuProps {
  item: FolderItem;
  position: { x: number; y: number };
  onClose: () => void;
  onCreateDocument: () => void;
  onCreateFolder: () => void;
  onUpload: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function ContextMenu({
  item,
  position,
  onClose,
  onCreateDocument,
  onCreateFolder,
  onUpload,
  onRename,
  onDelete,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const MenuItem = ({
    icon,
    label,
    onClick,
    danger = false,
  }: {
    icon: string;
    label: string;
    onClick: () => void;
    danger?: boolean;
  }) => (
    <button
      onClick={() => {
        onClick();
        onClose();
      }}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
        danger
          ? 'text-red-700 hover:bg-red-50'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </button>
  );

  const Divider = () => <div className="h-px bg-gray-200 my-1" />;

  const isFolder = item.type === 'folder';
  const isRoot = item.parentId === null;

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[200px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Only show create options for folders */}
      {isFolder && (
        <>
          <MenuItem icon="📄" label="Create Document" onClick={onCreateDocument} />
          <MenuItem icon="📁" label="New Folder" onClick={onCreateFolder} />
          <MenuItem icon="📤" label="Upload File" onClick={onUpload} />
          <Divider />
        </>
      )}

      {!isRoot && (
        <>
          <MenuItem icon="✏️" label="Rename" onClick={onRename} />
          <Divider />
          <MenuItem icon="🗑️" label="Delete" onClick={onDelete} danger />
        </>
      )}
    </div>
  );
}
