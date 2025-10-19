'use client';

import { useState } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { FolderItem } from '@/types/workspace';
import { Folder, FolderOpen, FileText, ChevronDown, ChevronRight } from 'lucide-react';

interface FolderTreeItemProps {
  item: FolderItem;
  level: number;
  onContextMenu: (e: React.MouseEvent, item: FolderItem) => void;
}

function FolderTreeItem({ item, level, onContextMenu }: FolderTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { getChildren, currentDocumentId, currentFolderId, setCurrentDocument, setCurrentFolder } = useWorkspaceStore();

  const children = item.type === 'folder' ? getChildren(item.id) : [];
  const isSelected = item.type === 'document' ? item.id === currentDocumentId : item.id === currentFolderId;

  const handleClick = () => {
    if (item.type === 'document') {
      setCurrentDocument(item.id);
    } else {
      setCurrentFolder(item.id);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const getIcon = () => {
    if (item.type === 'folder') {
      const Icon = isExpanded ? FolderOpen : Folder;
      return <Icon className="w-4 h-4 text-indigo-500" />;
    }

    // File format icon (PDF documents)
    return <FileText className="w-4 h-4 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (item.type !== 'document') return null;

    const statusColors = {
      draft: 'bg-gray-400',
      created: 'bg-blue-500',
      reviewed: 'bg-amber-500',
      resolved: 'bg-green-500',
      signed: 'bg-purple-500',
    };

    const statusLabels = {
      draft: 'Draft',
      created: 'New',
      reviewed: 'Review',
      resolved: 'Done',
      signed: 'Signed',
    };

    return (
      <span className={`ml-1 px-1.5 py-0.5 text-[10px] font-bold text-white rounded ${statusColors[item.status]}`}>
        {statusLabels[item.status]}
      </span>
    );
  };

  return (
    <div>
      <div
        onClick={handleClick}
        onContextMenu={(e) => onContextMenu(e, item)}
        className={`flex items-center gap-1.5 px-2 py-1.5 cursor-pointer hover:bg-indigo-50 transition-colors ${
          isSelected ? 'bg-indigo-100 border-l-2 border-indigo-600' : ''
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {item.type === 'folder' && children.length > 0 && (
          <button onClick={handleToggle} className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors">
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        )}
        {item.type === 'folder' && children.length === 0 && <div className="w-3" />}

        {getIcon()}
        <span className="flex-1 text-xs font-medium text-gray-900 truncate">{item.name}</span>
        {getStatusBadge()}

        {item.type === 'document' && item.comments.filter((c) => !c.resolved).length > 0 && (
          <span className="text-[10px] text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded-full font-bold">
            {item.comments.filter((c) => !c.resolved).length}
          </span>
        )}
      </div>

      {item.type === 'folder' && isExpanded && children.length > 0 && (
        <div>
          {children.map((child) => (
            <FolderTreeItem key={child.id} item={child} level={level + 1} onContextMenu={onContextMenu} />
          ))}
        </div>
      )}
    </div>
  );
}

interface FolderTreeProps {
  onContextMenu: (e: React.MouseEvent, item: FolderItem) => void;
}

export function FolderTree({ onContextMenu }: FolderTreeProps) {
  const { items, rootFolderId } = useWorkspaceStore();
  const rootFolder = items[rootFolderId];

  if (!rootFolder) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No workspace found</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white">
      <FolderTreeItem item={rootFolder} level={0} onContextMenu={onContextMenu} />
    </div>
  );
}
