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

  const label = section.label[language];
  const description = section.description[language];

  return (
    <div className="border border-white/20 rounded-xl p-6 bg-white/5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-white mb-1">
            {section.section_number}. {label}
          </h4>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => onRegenerate(section.id)}
          disabled={isGenerating}
          className="ml-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-all text-sm flex items-center gap-2"
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
          <div className="text-center py-8 text-gray-400 border-2 border-dashed border-white/20 rounded-lg">
            <p className="mb-2">📝 No content generated yet</p>
            <p className="text-sm">
              Click "Generate All Sections" or "Regenerate" to create content
            </p>
          </div>
        )}

        {isGenerating && (
          <div className="text-center py-8 text-gray-400">
            <div className="animate-pulse">Generating content...</div>
          </div>
        )}

        {content && !isGenerating && (
          <>
            {isEditing ? (
              <div>
                <textarea
                  value={content}
                  onChange={(e) => onContentChange(section.id, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                  rows={12}
                  placeholder="Enter section content (HTML supported)"
                />
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all text-sm"
                >
                  ✓ Done Editing
                </button>
              </div>
            ) : (
              <div>
                <div
                  className="prose prose-invert max-w-none p-4 bg-white/5 rounded-lg border border-white/10"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all text-sm"
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
