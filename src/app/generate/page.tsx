'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { DynamicForm } from '@/components/DynamicForm';
import { TemplatePreview, TemplatePreviewRef } from '@/components/TemplatePreview';
import { AISectionEditor } from '@/components/AISectionEditor';
import { loadTemplate, DocumentTemplate } from '@/lib/templateLoader';

type DocumentType = 'lease' | 'employment' | 'application' | 'complaint' | null;
type Language = 'uzbek' | 'russian';

// Map UI document types to template IDs
const DOCUMENT_TYPE_TO_TEMPLATE: Record<string, string> = {
  'lease': 'ijara_shartnomasi',
  'employment': 'mehnat_shartnomasi',
  'application': 'ariza',
  'complaint': 'shikoyat',
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
    id: 'employment' as DocumentType,
    title: 'Employment Contract',
    description: 'Labor contracts defining work terms, salary, and responsibilities',
    icon: '💼',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'application' as DocumentType,
    title: 'Application/Petition',
    description: 'Formal requests and petitions to organizations or authorities',
    icon: '📄',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    id: 'complaint' as DocumentType,
    title: 'Complaint',
    description: 'Formal complaints about violations or grievances',
    icon: '⚠️',
    gradient: 'from-orange-500 to-red-600',
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
  const [isExporting, setIsExporting] = useState(false);

  // Ref for template preview
  const templatePreviewRef = useRef<TemplatePreviewRef>(null);

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

      console.log('Received data from API:', data);

      // Update AI section content
      const newContent: Record<string, string> = {};
      template.schema.ai_sections.forEach((section) => {
        console.log(`Processing section ${section.id}:`, data.sections?.[section.id]);
        if (data.sections && data.sections[section.id]) {
          newContent[section.id] = data.sections[section.id].content;
          console.log(`Set content for ${section.id}:`, newContent[section.id].substring(0, 100) + '...');
        }
      });

      console.log('Final newContent:', newContent);

      setAiSectionContent(newContent);
      console.log('AI section content updated successfully');
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

      console.log('Regenerate response:', data);

      if (data.sections && data.sections[sectionId]) {
        console.log(`Regenerating section ${sectionId} with content:`, data.sections[sectionId].content.substring(0, 100) + '...');
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
    const merged = {
      ...formData,
      ...aiSectionContent,
    };
    console.log('Merged template data:', merged);
    return merged;
  };

  // Handle PDF export
  const handleExportPDF = async () => {
    if (!templatePreviewRef.current) return;

    setIsExporting(true);
    try {
      await templatePreviewRef.current.exportToPDF();
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const renderForm = () => {
    if (!selectedDoc) return null;

    const selectedDocType = documentTypes.find(d => d.id === selectedDoc);

    // Language selector
    const languageSelector = (
      <div className="mb-6">
        <label className="block text-gray-900 font-bold mb-3 text-lg">Document Language</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setLanguage('uzbek')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
              language === 'uzbek'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            Uzbek
          </button>
          <button
            type="button"
            onClick={() => setLanguage('russian')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
              language === 'russian'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            Russian
          </button>
        </div>
      </div>
    );

    if (isLoadingTemplate) {
      return (
        <div className="space-y-6">
          {languageSelector}
          <div className="text-center py-12 text-gray-600">Loading template...</div>
        </div>
      );
    }

    if (!template) {
      return (
        <div className="space-y-6">
          {languageSelector}
          <div className="text-center py-12 text-gray-600">
            Template not yet available for this document type.
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Document Type Info (Non-editable) */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${selectedDocType?.gradient} rounded-lg flex items-center justify-center`}>
              <span className="text-2xl">{selectedDocType?.icon}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Document Type</p>
              <p className="text-base font-bold text-gray-900">{selectedDocType?.title}</p>
            </div>
          </div>
        </div>

        {languageSelector}

        {/* User Prompt Area */}
        {template.schema.ai_sections && template.schema.ai_sections.length > 0 && (
          <div className="border-2 border-purple-400 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md">
            <label className="block text-gray-900 font-bold mb-3 text-xl">
              ✨ Describe Your Requirements
            </label>
            <p className="text-gray-700 font-medium text-sm mb-4">
              Describe specific details, clauses, or requirements you want in this document.
              AI will generate professional legal content based on your description.
            </p>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-300 text-gray-900 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              rows={4}
              placeholder={language === 'uzbek'
                ? "Masalan: Ijarachi har oyning 5-kunidan kechiktirmay to'lashi kerak. Mulkka zarar yetkazilsa, to'liq o'rnini qoplashi shart..."
                : "Например: Арендатор должен платить не позднее 5 числа каждого месяца. При причинении ущерба имуществу обязан полностью возместить..."}
            />
            <button
              type="button"
              onClick={generateAllSections}
              disabled={isGenerating || !userPrompt.trim()}
              className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold text-sm transition-all shadow-md disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin">⟳</span>
                  Generating...
                </>
              ) : (
                'Generate All Sections'
              )}
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="border-t-2 border-gray-300 my-6"></div>

        {/* Required Fields Section */}
        <div>
          <h4 className="text-gray-900 font-bold mb-4 text-xl">📋 Required Information</h4>
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
            <div className="border-t-2 border-gray-300 my-6"></div>
            <div>
              <h4 className="text-gray-900 font-bold mb-4 text-xl">🤖 AI-Generated Sections</h4>
              <p className="text-gray-700 font-medium text-sm mb-6">
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
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">⚖️</span>
              </div>
              <span className="text-2xl font-bold text-white">Jurix</span>
            </Link>
            <div className="flex items-center gap-6">
              {selectedDoc && (
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="text-white hover:text-purple-300 transition font-semibold"
                >
                  ← Document Types
                </button>
              )}
              <Link href="/workspace" className="text-white hover:text-purple-300 transition font-semibold">
                Workspace
              </Link>
              <Link href="/generate" className="text-white hover:text-purple-300 transition font-semibold">
                Generate
              </Link>
              <Link href="/analyze" className="text-white hover:text-purple-300 transition font-semibold">
                Analyze
              </Link>
              <Link href="/" className="text-white hover:text-purple-300 transition font-semibold">
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16 h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-16">
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
          ) : null}
        </div>
      </main>

      {/* Full-screen Split View for Editor */}
      {selectedDoc && (
        <div className="bg-white border-b border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 64px)', marginTop: '64px', position: 'fixed', top: 0, left: 0, right: 0 }}>
          {/* Aligned Headers */}
          <div className="grid lg:grid-cols-2 border-b border-gray-200">
            <div className="px-8 py-4 border-r border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Document Details</h3>
            </div>
            <div className="px-8 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Live Preview</h3>
              <button
                onClick={handleExportPDF}
                disabled={isExporting || !template}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold text-sm transition-all shadow-md flex items-center gap-2"
              >
                {isExporting ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Exporting...
                  </>
                ) : (
                  <>
                    📄 Export PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Scrollable Content Areas */}
          <div className="grid lg:grid-cols-2" style={{ height: 'calc(100vh - 130px)' }}>
            {/* Left: Form Content */}
            <div className="border-r border-gray-200 overflow-y-auto px-8 py-6">
              <form onSubmit={(e) => { e.preventDefault(); }}>
                {renderForm()}
              </form>
            </div>

            {/* Right: Preview Content */}
            <div className="overflow-hidden flex flex-col">
              <div className="flex-1 bg-gray-300 m-6 rounded-xl shadow-inner overflow-hidden">
                {template ? (
                  <TemplatePreview
                    ref={templatePreviewRef}
                    templateHtml={template.templateHtml}
                    formData={getMergedTemplateData()}
                    language={language}
                  />
                ) : isLoadingTemplate ? (
                  <div className="flex items-center justify-center h-full text-gray-600 font-semibold">
                    Loading template...
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-600 font-semibold">
                    Template not available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
