import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WorkspaceState, FolderItem, Folder, Document, DocumentType, DocumentStatus } from '@/types/workspace';

const ROOT_FOLDER_ID = 'root';

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      items: {
        [ROOT_FOLDER_ID]: {
          id: ROOT_FOLDER_ID,
          name: 'My Organization',
          type: 'folder',
          parentId: null,
          children: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Folder,
      },
      rootFolderId: ROOT_FOLDER_ID,
      currentFolderId: ROOT_FOLDER_ID,
      currentDocumentId: null,

      // Create folder
      createFolder: (name: string, parentId: string | null) => {
        const id = `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const targetParentId = parentId || ROOT_FOLDER_ID;

        set((state) => {
          const newFolder: Folder = {
            id,
            name,
            type: 'folder',
            parentId: targetParentId,
            children: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const parent = state.items[targetParentId] as Folder;
          if (!parent || parent.type !== 'folder') {
            console.error('Parent is not a folder');
            return state;
          }

          return {
            items: {
              ...state.items,
              [id]: newFolder,
              [targetParentId]: {
                ...parent,
                children: [...parent.children, id],
                updatedAt: new Date(),
              },
            },
          };
        });

        return id;
      },

      // Create document
      createDocument: (name: string, parentId: string | null, documentType: DocumentType) => {
        const id = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const targetParentId = parentId || ROOT_FOLDER_ID;

        // Map document type to template ID
        const templateIdMap: Record<DocumentType, string> = {
          'lease': 'ijara_shartnomasi',
          'employment': 'mehnat_shartnomasi',
          'application': 'ariza',
          'complaint': 'shikoyat',
        };

        set((state) => {
          const newDocument: Document = {
            id,
            name,
            type: 'document',
            parentId: targetParentId,
            documentType,
            language: 'uzbek',
            formData: {},
            aiContent: {},
            status: 'draft',
            comments: [],
            templateId: templateIdMap[documentType],
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const parent = state.items[targetParentId] as Folder;
          if (!parent || parent.type !== 'folder') {
            console.error('Parent is not a folder');
            return state;
          }

          return {
            items: {
              ...state.items,
              [id]: newDocument,
              [targetParentId]: {
                ...parent,
                children: [...parent.children, id],
                updatedAt: new Date(),
              },
            },
          };
        });

        return id;
      },

      // Delete item
      deleteItem: (id: string) => {
        set((state) => {
          const item = state.items[id];
          if (!item || item.id === ROOT_FOLDER_ID) return state;

          const newItems = { ...state.items };

          // Remove from parent's children
          if (item.parentId) {
            const parent = newItems[item.parentId] as Folder;
            if (parent && parent.type === 'folder') {
              parent.children = parent.children.filter((childId) => childId !== id);
              parent.updatedAt = new Date();
            }
          }

          // Recursively delete children if it's a folder
          if (item.type === 'folder') {
            const deleteRecursive = (folderId: string) => {
              const folder = newItems[folderId] as Folder;
              if (!folder || folder.type !== 'folder') return;

              folder.children.forEach((childId) => {
                const child = newItems[childId];
                if (child.type === 'folder') {
                  deleteRecursive(childId);
                }
                delete newItems[childId];
              });
            };

            deleteRecursive(id);
          }

          // Delete the item itself
          delete newItems[id];

          return {
            items: newItems,
            currentDocumentId: state.currentDocumentId === id ? null : state.currentDocumentId,
          };
        });
      },

      // Rename item
      renameItem: (id: string, newName: string) => {
        set((state) => ({
          items: {
            ...state.items,
            [id]: {
              ...state.items[id],
              name: newName,
              updatedAt: new Date(),
            },
          },
        }));
      },

      // Move item
      moveItem: (itemId: string, newParentId: string | null) => {
        const targetParentId = newParentId || ROOT_FOLDER_ID;

        set((state) => {
          const item = state.items[itemId];
          if (!item || item.id === ROOT_FOLDER_ID) return state;

          const oldParentId = item.parentId || ROOT_FOLDER_ID;
          if (oldParentId === targetParentId) return state;

          const newItems = { ...state.items };

          // Remove from old parent
          const oldParent = newItems[oldParentId] as Folder;
          if (oldParent && oldParent.type === 'folder') {
            oldParent.children = oldParent.children.filter((id) => id !== itemId);
            oldParent.updatedAt = new Date();
          }

          // Add to new parent
          const newParent = newItems[targetParentId] as Folder;
          if (!newParent || newParent.type !== 'folder') {
            console.error('New parent is not a folder');
            return state;
          }

          newParent.children = [...newParent.children, itemId];
          newParent.updatedAt = new Date();

          // Update item's parentId
          newItems[itemId] = {
            ...item,
            parentId: targetParentId,
            updatedAt: new Date(),
          };

          return { items: newItems };
        });
      },

      // Navigation
      setCurrentFolder: (folderId: string | null) => {
        set({ currentFolderId: folderId || ROOT_FOLDER_ID });
      },

      setCurrentDocument: (documentId: string | null) => {
        set({ currentDocumentId: documentId });
      },

      // Document operations
      updateDocument: (documentId: string, data: Partial<Document>) => {
        set((state) => {
          const doc = state.items[documentId];
          if (!doc || doc.type !== 'document') return state;

          return {
            items: {
              ...state.items,
              [documentId]: {
                ...doc,
                ...data,
                updatedAt: new Date(),
              },
            },
          };
        });
      },

      updateDocumentFormData: (documentId: string, formData: Record<string, string | boolean>) => {
        set((state) => {
          const doc = state.items[documentId];
          if (!doc || doc.type !== 'document') return state;

          return {
            items: {
              ...state.items,
              [documentId]: {
                ...doc,
                formData,
                updatedAt: new Date(),
              },
            },
          };
        });
      },

      updateDocumentAiContent: (documentId: string, aiContent: Record<string, string>) => {
        set((state) => {
          const doc = state.items[documentId];
          if (!doc || doc.type !== 'document') return state;

          return {
            items: {
              ...state.items,
              [documentId]: {
                ...doc,
                aiContent,
                updatedAt: new Date(),
              },
            },
          };
        });
      },

      updateDocumentStatus: (documentId: string, status: DocumentStatus) => {
        set((state) => {
          const doc = state.items[documentId];
          if (!doc || doc.type !== 'document') return state;

          return {
            items: {
              ...state.items,
              [documentId]: {
                ...doc,
                status,
                updatedAt: new Date(),
              },
            },
          };
        });
      },

      // Comments
      addComment: (documentId: string, content: string, author: string, position?: { x: number; y: number }, selectedText?: string, anchorId?: string) => {
        set((state) => {
          const doc = state.items[documentId];
          if (!doc || doc.type !== 'document') return state;

          const newComment = {
            id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            documentId,
            author,
            content,
            createdAt: new Date(),
            resolved: false,
            position,
            selectedText,
            anchorId,
          };

          return {
            items: {
              ...state.items,
              [documentId]: {
                ...doc,
                comments: [...doc.comments, newComment],
                updatedAt: new Date(),
              },
            },
          };
        });
      },

      resolveComment: (commentId: string) => {
        set((state) => {
          const newItems = { ...state.items };

          // Find the document containing this comment
          for (const item of Object.values(newItems)) {
            if (item.type === 'document') {
              const commentIndex = item.comments.findIndex((c) => c.id === commentId);
              if (commentIndex !== -1) {
                const updatedComments = [...item.comments];
                updatedComments[commentIndex] = {
                  ...updatedComments[commentIndex],
                  resolved: true,
                };

                newItems[item.id] = {
                  ...item,
                  comments: updatedComments,
                  updatedAt: new Date(),
                };

                // Auto-update status to 'resolved' if all comments are resolved
                const allResolved = updatedComments.every((c) => c.resolved);
                if (allResolved && item.status === 'reviewed') {
                  (newItems[item.id] as Document).status = 'resolved';
                }

                break;
              }
            }
          }

          return { items: newItems };
        });
      },

      deleteComment: (commentId: string) => {
        set((state) => {
          const newItems = { ...state.items };

          // Find the document containing this comment
          for (const item of Object.values(newItems)) {
            if (item.type === 'document') {
              const commentIndex = item.comments.findIndex((c) => c.id === commentId);
              if (commentIndex !== -1) {
                const updatedComments = item.comments.filter((c) => c.id !== commentId);

                newItems[item.id] = {
                  ...item,
                  comments: updatedComments,
                  updatedAt: new Date(),
                };

                break;
              }
            }
          }

          return { items: newItems };
        });
      },

      // Helpers
      getItem: (id: string) => {
        return get().items[id];
      },

      getFolder: (id: string) => {
        const item = get().items[id];
        return item?.type === 'folder' ? item : undefined;
      },

      getDocument: (id: string) => {
        const item = get().items[id];
        return item?.type === 'document' ? item : undefined;
      },

      getChildren: (folderId: string) => {
        const folder = get().getFolder(folderId);
        if (!folder) return [];

        return folder.children
          .map((childId) => get().items[childId])
          .filter(Boolean);
      },

      getPath: (itemId: string) => {
        const path: FolderItem[] = [];
        let currentId: string | null = itemId;

        while (currentId) {
          const item: FolderItem | undefined = get().items[currentId];
          if (!item) break;

          path.unshift(item);
          currentId = item.parentId;
        }

        return path;
      },

      canResolveDocument: (documentId: string) => {
        const doc = get().getDocument(documentId);
        if (!doc) return false;

        return doc.comments.every((comment) => comment.resolved);
      },
    }),
    {
      name: 'jurix-workspace-storage',
    }
  )
);
