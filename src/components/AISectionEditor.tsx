'use client';

import { AISection } from '@/lib/templateLoader';
import { useState } from 'react';

interface AISectionEditorProps {
  section: AISection;
  language: 'uzbek' | 'russian';
  content: string;
  onContentChange: (sectionId: string, content: string) => void;
  onRegenerate: (sectionId: string) => void;
  isGenerating: boolean;
}

export function AISectionEditor({
  section,
  language,
  content,
  onContentChange,
  onRegenerate,
  isGenerating,
}: AISectionEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState('');

  const label = section.label[language];
  const description = section.description[language];

  // Convert HTML to plain text for editing
  const htmlToText = (html: string): string => {
    // Remove HTML tags but preserve line breaks
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n\n+/g, '\n\n')
      .trim();
  };

  // Convert plain text back to HTML
  const textToHtml = (text: string): string => {
    return text
      .split('\n\n')
      .map(para => para.trim())
      .filter(para => para.length > 0)
      .map(para => para.replace(/\n/g, '<br/>'))
      .join('<br/><br/>');
  };

  const handleEditClick = () => {
    setEditableText(htmlToText(content));
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const htmlContent = textToHtml(editableText);
    onContentChange(section.id, htmlContent);
    setIsEditing(false);
  };

  return (
    <div className="border border-purple-300 rounded-lg p-3 bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></span>
            <span>{section.section_number}. {label}</span>
          </h4>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => onRegenerate(section.id)}
          disabled={isGenerating}
          className="ml-2 px-2.5 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-md font-semibold transition-all text-xs flex items-center gap-1 shadow-sm transform hover:scale-105 disabled:scale-100"
        >
          {isGenerating ? (
            <>
              <span className="animate-spin">⟳</span>
              <span>Gen...</span>
            </>
          ) : (
            <>
              <span>⟳</span>
              <span>Regen</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-2">
        {!content && !isGenerating && (
          <div className="text-center py-4 text-gray-600 border border-dashed border-purple-300 rounded-md bg-white/50">
            <p className="mb-1 font-semibold text-sm">📝 Not generated yet</p>
            <p className="text-xs">
              Click &quot;Generate All&quot; or &quot;Regen&quot;
            </p>
          </div>
        )}

        {isGenerating && (
          <div className="text-center py-4 text-gray-700 font-semibold text-sm">
            <div className="animate-pulse flex items-center justify-center gap-1">
              <span className="animate-spin">⟳</span>
              <span>Generating...</span>
            </div>
          </div>
        )}

        {content && !isGenerating && (
          <>
            {isEditing ? (
              <div>
                <textarea
                  value={editableText}
                  onChange={(e) => setEditableText(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none"
                  rows={8}
                  placeholder="Enter section content (plain text, line breaks preserved)"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-md font-semibold transition-all text-sm shadow-sm transform hover:scale-105"
                  >
                    ✓ Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-semibold transition-all text-sm shadow-sm transform hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div
                  className="prose prose-sm max-w-none p-3 bg-white rounded-md border border-gray-300 shadow-sm text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="mt-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-md font-semibold transition-all text-sm shadow-sm transform hover:scale-105 flex items-center gap-1"
                >
                  <span>✏️</span>
                  <span>Edit</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
