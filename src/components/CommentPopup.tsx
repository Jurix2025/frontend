'use client';

import { useState, useRef, useEffect } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Comment } from '@/types/workspace';

interface CommentPopupProps {
  documentId: string;
  position: { x: number; y: number } | null;
  selectedText: string | null;
  existingComment: Comment | null;
  onClose: () => void;
  onCommentAdded?: () => void;
}

export function CommentPopup({
  documentId,
  position,
  selectedText,
  existingComment,
  onClose,
  onCommentAdded,
}: CommentPopupProps) {
  const { addComment, resolveComment, deleteComment, getDocument } = useWorkspaceStore();
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentDocument = getDocument(documentId);

  useEffect(() => {
    // Auto-focus textarea when popup opens for new comment
    if (!existingComment && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [existingComment]);

  useEffect(() => {
    // Close popup when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.document.addEventListener('mousedown', handleClickOutside);
    return () => window.document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!position || !currentDocument) return null;

  const handleAddComment = () => {
    if (newComment.trim()) {
      // If replying to existing comment, use same anchor
      const anchorId = existingComment?.anchorId || `highlight-${Date.now()}`;
      const textToSave = existingComment?.selectedText || selectedText;

      addComment(
        documentId,
        newComment.trim(),
        'Current User',
        undefined,
        textToSave || undefined,
        anchorId
      );
      setNewComment('');
      onCommentAdded?.();

      // Only close if it's a new comment, keep open for replies
      if (!existingComment) {
        onClose();
      }
    }
  };

  // Get all comments for the same text selection if viewing existing comment
  const relatedComments = existingComment
    ? currentDocument.comments.filter(c => c.anchorId === existingComment.anchorId)
    : [];

  const displayComments = showAllComments ? relatedComments : relatedComments.slice(0, 1);

  return (
    <div
      ref={popupRef}
      className="fixed z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{
        left: `${Math.min(position.x, window.innerWidth - 350)}px`,
        top: `${Math.min(position.y + 10, window.innerHeight - 400)}px`,
      }}
    >
      <div className="w-72 bg-white rounded-lg shadow-2xl border border-indigo-300 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1.5 flex items-center justify-between">
          <h3 className="font-bold text-white text-xs">
            {existingComment ? 'Thread' : 'Comment'}
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Selected Text Preview */}
        {selectedText && (
          <div className="px-3 py-2 bg-yellow-50 border-b border-yellow-200">
            <p className="text-[10px] text-yellow-800 font-bold mb-0.5">📌 Selected:</p>
            <p className="text-xs text-gray-700 italic line-clamp-2">"{selectedText}"</p>
          </div>
        )}

        {/* Existing Comments */}
        {existingComment && (
          <div className="max-h-52 overflow-y-auto p-2 space-y-2 bg-gray-50">
            {displayComments.map((comment) => {
              const formattedDate = new Date(comment.createdAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={comment.id}
                  className={`p-2 rounded border transition-all ${
                    comment.resolved
                      ? 'bg-green-50 border-green-300'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-gray-900 truncate">
                        {comment.author}
                      </p>
                      <p className="text-[10px] text-gray-500">{formattedDate}</p>
                    </div>

                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {!comment.resolved && (
                        <button
                          onClick={() => {
                            resolveComment(comment.id);
                            onClose();
                          }}
                          className="px-1.5 py-0.5 text-[10px] font-bold text-green-700 bg-green-100 hover:bg-green-200 rounded transition-colors"
                          title="Mark as resolved"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm('Delete this comment?')) {
                            deleteComment(comment.id);
                            if (relatedComments.length === 1) {
                              onClose();
                            }
                          }
                        }}
                        className="p-0.5 text-[10px] text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete comment"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>

                  {comment.resolved && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-green-700 font-bold">
                      <span>✓</span>
                      <span>Resolved</span>
                    </div>
                  )}
                </div>
              );
            })}

            {relatedComments.length > 1 && !showAllComments && (
              <button
                onClick={() => setShowAllComments(true)}
                className="w-full py-1 text-[10px] text-indigo-600 hover:text-indigo-800 font-bold"
              >
                Show {relatedComments.length - 1} more
              </button>
            )}
          </div>
        )}

        {/* Add Comment Input */}
        {!existingComment && (
          <div className="p-3">
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleAddComment();
                }
                if (e.key === 'Escape') {
                  onClose();
                }
              }}
              placeholder="Write comment... (Cmd/Ctrl+Enter)"
              className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs resize-none"
              rows={3}
            />
            <div className="mt-2 flex justify-between items-center gap-2">
              <p className="text-[10px] text-gray-500">Cmd+Enter</p>
              <div className="flex gap-1.5">
                <button
                  onClick={onClose}
                  className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-bold text-[10px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded font-bold text-[10px] transition-all disabled:cursor-not-allowed"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reply section for existing comments */}
        {existingComment && (
          <div className="p-2 border-t border-gray-200 bg-white">
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleAddComment();
                }
                if (e.key === 'Escape') {
                  onClose();
                }
              }}
              placeholder="Reply... (Cmd+Enter)"
              className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs resize-none"
              rows={2}
            />
            <div className="mt-1.5 flex justify-end">
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded font-bold text-[10px] transition-all disabled:cursor-not-allowed"
              >
                Reply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
