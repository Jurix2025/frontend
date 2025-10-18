'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DynamicForm } from '@/components/DynamicForm';
import { TemplatePreview } from '@/components/TemplatePreview';
import { AISectionEditor } from '@/components/AISectionEditor';
import { loadTemplate, DocumentTemplate } from '@/lib/templateLoader';

type DocumentType = 'lease' | 'nda' | 'contract' | 'will' | 'petition' | null;
type Language = 'uzbek' | 'russian';

// Map UI document types to template IDs
const DOCUMENT_TYPE_TO_TEMPLATE: Record<string, string> = {
  'lease': 'ijara_shartnomasi',
  // Add more mappings as templates become available
};

const documentTypes = [
  {
    id: 'lease' as DocumentType,
    title: 'Lease Agreement',
    description: 'Rental contracts for property with terms, rent, and obligations',
    icon: '🏠',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'nda' as DocumentType,
    title: 'Non-Disclosure Agreement',
    description: 'Protect confidential information with comprehensive NDAs',
    icon: '🔒',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 'contract' as DocumentType,
    title: 'Service Contract',
    description: 'General contracts for services, employment, or agreements',
    icon: '📝',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'will' as DocumentType,
    title: 'Last Will & Testament',
    description: 'Declare how assets should be distributed and appoint executors',
    icon: '⚖️',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    id: 'petition' as DocumentType,
    title: 'Court Petition',
    description: 'Applications and petitions for court proceedings',
    icon: '🏛️',
    gradient: 'from-green-500 to-emerald-600',
  },
];

export default function GeneratePage() {
  const [selectedDoc, setSelectedDoc] = useState<DocumentType>(null);
  const [language, setLanguage] = useState<Language>('uzbek');
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [template, setTemplate] = useState<DocumentTemplate | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  // AI-related state
  const [userPrompt, setUserPrompt] = useState('');
  const [aiSectionContent, setAiSectionContent] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingSection, setGeneratingSection] = useState<string | null>(null);

  // Load template when document type is selected
  useEffect(() => {
    if (selectedDoc) {
      const templateId = DOCUMENT_TYPE_TO_TEMPLATE[selectedDoc];

      if (templateId) {
        setIsLoadingTemplate(true);
        loadTemplate(templateId)
          .then(setTemplate)
          .catch((error) => {
            console.error('Failed to load template:', error);
            alert('Failed to load template. Please try again.');
          })
          .finally(() => setIsLoadingTemplate(false));
      } else {
        setTemplate(null);
      }
    } else {
      setTemplate(null);
      setFormData({});
      setAiSectionContent({});
      setUserPrompt('');
    }
  }, [selectedDoc]);

  const handleFieldChange = (fieldId: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleAISectionChange = (sectionId: string, content: string) => {
    setAiSectionContent((prev) => ({
      ...prev,
      [sectionId]: content,
    }));
  };

  const generateAllSections = async () => {
    if (!template?.schema.ai_sections || !userPrompt.trim()) {
      alert('Please enter a description of what you want in the document');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt,
          language,
          documentType: selectedDoc,
          formData,
          aiSections: template.schema.ai_sections,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();

      // Update AI section content
      const newContent: Record<string, string> = {};
      template.schema.ai_sections.forEach((section) => {
        if (data.sections[section.id]) {
          newContent[section.id] = data.sections[section.id].content;
        }
      });

      setAiSectionContent(newContent);
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateSection = async (sectionId: string) => {
    if (!template?.schema.ai_sections) return;

    const section = template.schema.ai_sections.find((s) => s.id === sectionId);
    if (!section) return;

    setGeneratingSection(sectionId);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: userPrompt || section.prompt_guidance,
          language,
          documentType: selectedDoc,
          formData,
          aiSections: [section],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate section');
      }

      const data = await response.json();

      if (data.sections[sectionId]) {
        setAiSectionContent((prev) => ({
          ...prev,
          [sectionId]: data.sections[sectionId].content,
        }));
      }
    } catch (error) {
      console.error('Error regenerating section:', error);
      alert('Failed to regenerate section. Please try again.');
    } finally {
      setGeneratingSection(null);
    }
  };

  // Merge AI content with form data for template preview
  const getMergedTemplateData = () => {
    return {
      ...formData,
      ...aiSectionContent,
    };
  };

  const renderForm = () => {
    if (!selectedDoc) return null;

    // Language selector
    const languageSelector = (
      <div className="mb-6">
        <label className="block text-white font-semibold mb-2">Document Language</label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setLanguage('uzbek')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              language === 'uzbek'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            🇺🇿 Uzbek
          </button>
          <button
            type="button"
            onClick={() => setLanguage('russian')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              language === 'russian'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            🇷🇺 Russian
          </button>
        </div>
      </div>
    );

    if (isLoadingTemplate) {
      return (
        <div className="space-y-6">
          {languageSelector}
          <div className="text-center py-12 text-gray-300">Loading template...</div>
        </div>
      );
    }

    if (!template) {
      return (
        <div className="space-y-6">
          {languageSelector}
          <div className="text-center py-12 text-gray-300">
            Template not yet available for this document type.
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {languageSelector}

        {/* User Prompt Area */}
        {template.schema.ai_sections && template.schema.ai_sections.length > 0 && (
          <div className="border-2 border-purple-500/30 rounded-xl p-6 bg-purple-500/10">
            <label className="block text-white font-semibold mb-3 text-lg">
              ✨ Describe Your Requirements
            </label>
            <p className="text-gray-300 text-sm mb-4">
              Describe specific details, clauses, or requirements you want in this document.
              AI will generate professional legal content based on your description.
            </p>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              placeholder={language === 'uzbek'
                ? "Masalan: Ijarachi har oyning 5-kunidan kechiktirmay to'lashi kerak. Mulkka zarar yetkazilsa, to'liq o'rnini qoplashi shart..."
                : "Например: Арендатор должен платить не позднее 5 числа каждого месяца. При причинении ущерба имуществу обязан полностью возместить..."}
            />
            <button
              type="button"
              onClick={generateAllSections}
              disabled={isGenerating || !userPrompt.trim()}
              className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-semibold transition-all shadow-lg disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin">⟳</span>
                  Generating All Sections...
                </>
              ) : (
                <>
                  ✨ Generate All Sections
                </>
              )}
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-white/20 my-6"></div>

        {/* Required Fields Section */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-lg">📋 Required Information</h4>
          <DynamicForm
            fields={template.schema.fields}
            language={language}
            formData={formData}
            onFieldChange={handleFieldChange}
          />
        </div>

        {/* AI Sections */}
        {template.schema.ai_sections && template.schema.ai_sections.length > 0 && (
          <>
            <div className="border-t border-white/20 my-6"></div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">🤖 AI-Generated Sections</h4>
              <p className="text-gray-400 text-sm mb-6">
                These sections will be generated by AI. You can regenerate or manually edit each section.
              </p>
              <div className="space-y-4">
                {template.schema.ai_sections.map((section) => (
                  <AISectionEditor
                    key={section.id}
                    section={section}
                    language={language}
                    content={aiSectionContent[section.id] || ''}
                    onContentChange={handleAISectionChange}
                    onRegenerate={regenerateSection}
                    isGenerating={generatingSection === section.id}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">⚖️</span>
              </div>
              <span className="text-2xl font-bold text-white">Jurix</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/analyze" className="text-gray-300 hover:text-white transition">
                Analyze
              </Link>
              <Link href="/" className="text-gray-300 hover:text-white transition">
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {!selectedDoc ? (
            <>
              <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Choose Document <span className="gradient-text">Type</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Select the type of legal document you want to generate
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documentTypes.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc.id)}
                    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-left hover:bg-white/10 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 group"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${doc.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <span className="text-4xl">{doc.icon}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{doc.title}</h3>
                    <p className="text-gray-300">{doc.description}</p>
                  </button>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="mt-16 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">⚠️</span>
                  <div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      <span className="text-yellow-300 font-semibold">Legal Disclaimer:</span> This AI service generates draft documents for informational purposes only. Always consult a qualified lawyer before using any generated document legally.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="max-w-[1600px] mx-auto">
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-gray-300 hover:text-white transition mb-8 flex items-center gap-2"
              >
                ← Back to Document Types
              </button>

              {/* Header */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${documentTypes.find(d => d.id === selectedDoc)?.gradient} rounded-2xl flex items-center justify-center`}>
                    <span className="text-3xl">{documentTypes.find(d => d.id === selectedDoc)?.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{documentTypes.find(d => d.id === selectedDoc)?.title}</h2>
                    <p className="text-gray-300 text-sm">{documentTypes.find(d => d.id === selectedDoc)?.description}</p>
                  </div>
                </div>
              </div>

              {/* Split View: Template Preview (Left) + Form (Right) */}
              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Left: Template Preview */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Live Preview</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg" style={{ height: '800px' }}>
                    {template ? (
                      <TemplatePreview
                        templateHtml={template.templateHtml}
                        formData={getMergedTemplateData()}
                        language={language}
                      />
                    ) : isLoadingTemplate ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Loading template...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Template not available
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Form */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Document Details</h3>
                  <form onSubmit={(e) => { e.preventDefault(); }} className="h-[800px] overflow-y-auto pr-2">
                    {renderForm()}
                  </form>
                </div>
              </div>

              {/* AI Notice */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">🤖</span>
                  <div>
                    <h4 className="text-blue-300 font-semibold mb-1">AI-Generated Content</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      This document is generated by AI and must be labeled as such according to Uzbekistan&apos;s AI regulations. It should be reviewed by a legal professional before use.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p className="mb-2">🤖 Generated with AI • Made for Uzbekistan</p>
          <p className="text-sm">© 2024 Jurix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
