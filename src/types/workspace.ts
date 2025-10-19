export type DocumentType = 'lease' | 'employment' | 'application' | 'complaint';
export type Language = 'uzbek' | 'russian';

export type DocumentStatus = 'draft' | 'created' | 'reviewed' | 'resolved' | 'signed';

export interface Comment {
  id: string;
  documentId: string;
  author: string;
  content: string;
  createdAt: Date;
  resolved: boolean;
  position?: {
    x: number;
    y: number;
  };
  selectedText?: string; // The text that was highlighted
  anchorId?: string; // Unique ID to identify the highlight in the document
}

export interface BaseItem {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder extends BaseItem {
  type: 'folder';
  children: string[];
}

export interface Document extends BaseItem {
  type: 'document';
  documentType: DocumentType;
  language: Language;
  formData: Record<string, string | boolean>;
  aiContent: Record<string, string>;
  status: DocumentStatus;
  comments: Comment[];
  templateId: string;
}

export type FolderItem = Folder | Document;

export interface WorkspaceState {
  items: Record<string, FolderItem>;
  rootFolderId: string;
  currentFolderId: string | null;
  currentDocumentId: string | null;

  // Actions
  createFolder: (name: string, parentId: string | null) => string;
  createDocument: (name: string, parentId: string | null, documentType: DocumentType) => string;
  deleteItem: (id: string) => void;
  renameItem: (id: string, newName: string) => void;
  moveItem: (itemId: string, newParentId: string | null) => void;

  // Navigation
  setCurrentFolder: (folderId: string | null) => void;
  setCurrentDocument: (documentId: string | null) => void;

  // Document operations
  updateDocument: (documentId: string, data: Partial<Document>) => void;
  updateDocumentFormData: (documentId: string, formData: Record<string, string | boolean>) => void;
  updateDocumentAiContent: (documentId: string, aiContent: Record<string, string>) => void;
  updateDocumentStatus: (documentId: string, status: DocumentStatus) => void;

  // Comments
  addComment: (documentId: string, content: string, author: string, position?: { x: number; y: number }, selectedText?: string, anchorId?: string) => void;
  resolveComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;

  // Helpers
  getItem: (id: string) => FolderItem | undefined;
  getFolder: (id: string) => Folder | undefined;
  getDocument: (id: string) => Document | undefined;
  getChildren: (folderId: string) => FolderItem[];
  getPath: (itemId: string) => FolderItem[];
  canResolveDocument: (documentId: string) => boolean;
}
