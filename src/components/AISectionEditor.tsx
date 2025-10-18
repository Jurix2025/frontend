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
    <div className="border-2 border-purple-300 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-xl font-bold text-gray-900 mb-2">
            {section.section_number}. {label}
          </h4>
          <p className="text-base text-gray-700 font-medium">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => onRegenerate(section.id)}
          disabled={isGenerating}
          className="ml-4 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-bold transition-all text-sm flex items-center gap-2 shadow-lg"
        >
          {isGenerating ? (
            <>
              <span className="animate-spin">⟳</span>
              Generating...
            </>
          ) : (
            <>
              ⟳ Regenerate
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        {!content && !isGenerating && (
          <div className="text-center py-8 text-gray-600 border-2 border-dashed border-purple-300 rounded-lg bg-white/50">
            <p className="mb-2 font-bold text-lg">📝 No content generated yet</p>
            <p className="text-base font-medium">
              Click &ldquo;Generate All Sections&rdquo; or &ldquo;Regenerate&rdquo; to create content
            </p>
          </div>
        )}

        {isGenerating && (
          <div className="text-center py-8 text-gray-700 font-semibold text-lg">
            <div className="animate-pulse">Generating content...</div>
          </div>
        )}

        {content && !isGenerating && (
          <>
            {isEditing ? (
              <div>
                <textarea
                  value={editableText}
                  onChange={(e) => setEditableText(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-300 text-gray-900 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
                  rows={12}
                  placeholder="Enter section content (plain text, line breaks preserved)"
                />
                <div className="flex gap-3 mt-3">
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold transition-all text-base shadow-lg"
                  >
                    ✓ Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold transition-all text-base shadow-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div
                  className="prose prose-lg max-w-none p-6 bg-white rounded-lg border-2 border-gray-300 shadow-sm"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="mt-3 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold transition-all text-base shadow-lg"
                >
                  ✏️ Edit Content
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
