'use client';

import { useState, useRef, useEffect } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Comment } from '@/types/workspace';

interface CommentPanelProps {
  documentId: string;
  focusedCommentId?: string | null;
  selectedText?: string | null;
  onCommentAdded?: () => void;
}

export function CommentPanel({ documentId, focusedCommentId, selectedText, onCommentAdded }: CommentPanelProps) {
  const { getDocument, addComment, resolveComment, deleteComment } = useWorkspaceStore();
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const document = getDocument(documentId);

  if (!document) return null;

  const unresolvedComments = document.comments.filter((c) => !c.resolved);
  const resolvedComments = document.comments.filter((c) => c.resolved);

  // Auto-scroll to focused comment
  useEffect(() => {
    if (focusedCommentId && commentRefs.current[focusedCommentId]) {
      commentRefs.current[focusedCommentId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [focusedCommentId]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Generate anchor ID if selected text exists
      const anchorId = selectedText ? `highlight-${Date.now()}` : undefined;

      addComment(
        documentId,
        newComment.trim(),
        'Current User',
        undefined,
        selectedText || undefined,
        anchorId
      );
      setNewComment('');
      onCommentAdded?.();
    }
  };

  const CommentItem = ({ comment }: { comment: Comment }) => {
    const formattedDate = new Date(comment.createdAt).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const isFocused = focusedCommentId === comment.id;

    return (
      <div
        ref={(el) => {
          commentRefs.current[comment.id] = el;
        }}
        className={`p-4 rounded-lg border-2 transition-all ${
          comment.resolved
            ? 'bg-green-50 border-green-200'
            : isFocused
            ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-300 shadow-lg'
            : 'bg-white border-gray-200 hover:border-indigo-300'
        }`}
      >
        {/* Selected Text Quote */}
        {comment.selectedText && (
          <div className="mb-3 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-xs text-yellow-800 font-semibold mb-1">📌 Referenced text:</p>
            <p className="text-xs text-gray-700 italic">"{comment.selectedText}"</p>
          </div>
        )}

        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-900">{comment.author}</p>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>

          <div className="flex items-center gap-1">
            {!comment.resolved && (
              <button
                onClick={() => resolveComment(comment.id)}
                className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 rounded transition-colors"
                title="Mark as resolved"
              >
                ✓ Resolve
              </button>
            )}
            <button
              onClick={() => {
                if (confirm('Delete this comment?')) {
                  deleteComment(comment.id);
                }
              }}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete comment"
            >
              🗑️
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>

        {comment.resolved && (
          <div className="mt-2 flex items-center gap-1 text-xs text-green-700 font-semibold">
            <span>✓</span>
            <span>Resolved</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <h3 className="font-bold text-gray-900">Comments</h3>
          {unresolvedComments.length > 0 && (
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
              {unresolvedComments.length} unresolved
            </span>
          )}
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {document.comments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-4xl mb-3">💬</p>
                <p className="text-sm font-medium">No comments yet</p>
                <p className="text-xs mt-1">
                  {selectedText ? 'Add a comment about the selected text' : 'Select text in the preview to comment on it'}
                </p>
              </div>
            ) : (
              <>
                {/* Unresolved Comments */}
                {unresolvedComments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Active Comments
                    </h4>
                    {unresolvedComments.map((comment) => (
                      <CommentItem key={comment.id} comment={comment} />
                    ))}
                  </div>
                )}

                {/* Resolved Comments */}
                {resolvedComments.length > 0 && (
                  <div className="space-y-3 mt-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Resolved Comments ({resolvedComments.length})
                    </h4>
                    {resolvedComments.map((comment) => (
                      <CommentItem key={comment.id} comment={comment} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Add Comment Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            {/* Show selected text preview */}
            {selectedText && (
              <div className="mb-3 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-xs text-yellow-800 font-semibold mb-1">📌 Commenting on:</p>
                <p className="text-xs text-gray-700 italic">"{selectedText}"</p>
              </div>
            )}

            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleAddComment();
                }
              }}
              placeholder={selectedText ? "Comment on the selected text... (Cmd/Ctrl + Enter)" : "Add a comment... (Cmd/Ctrl + Enter)"}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
              rows={3}
            />
            <div className="mt-2 flex justify-between items-center">
              <p className="text-xs text-gray-500">Cmd/Ctrl + Enter to send</p>
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Add Comment
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
