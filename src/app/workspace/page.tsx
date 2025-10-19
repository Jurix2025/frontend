'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { FolderTree } from '@/components/FolderTree';
import { ContextMenu } from '@/components/ContextMenu';
import { Breadcrumb } from '@/components/Breadcrumb';
import { CreateDocumentModal } from '@/components/CreateDocumentModal';
import { UploadModal } from '@/components/UploadModal';
import { DocumentStatusBar } from '@/components/DocumentStatusBar';
import { CommentPanel } from '@/components/CommentPanel';
import { CommentPopup } from '@/components/CommentPopup';
import { AnalysisModal } from '@/components/AnalysisModal';
import { DynamicForm } from '@/components/DynamicForm';
import { TemplatePreview, TemplatePreviewRef } from '@/components/TemplatePreview';
import { AISectionEditor } from '@/components/AISectionEditor';
import { loadTemplate, DocumentTemplate } from '@/lib/templateLoader';
import { FolderItem, DocumentType, Language, Comment } from '@/types/workspace';

export default function WorkspacePage() {
  const {
    items,
    currentDocumentId,
    currentFolderId,
    getDocument,
    createFolder,
    createDocument,
    deleteItem,
    updateDocumentFormData,
    updateDocumentAiContent,
    updateDocument,
  } = useWorkspaceStore();

  // Hydration state - prevents SSR mismatch
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Panel visibility states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    item: FolderItem;
    position: { x: number; y: number };
  } | null>(null);

  // Modal states
  const [isCreateDocModalOpen, setIsCreateDocModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [createInFolderId, setCreateInFolderId] = useState<string | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string;
    insights: Array<{
      text: string;
      sentiment: 'positive' | 'neutral' | 'negative' | 'warning';
      category?: string;
    }>;
  } | null>(null);

  // Template state
  const [template, setTemplate] = useState<DocumentTemplate | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  // AI generation state
  const [userPrompt, setUserPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingSection, setGeneratingSection] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Comment popup state
  const [commentPopup, setCommentPopup] = useState<{
    position: { x: number; y: number };
    selectedText: string | null;
    existingComment: Comment | null;
  } | null>(null);

  const templatePreviewRef = useRef<TemplatePreviewRef>(null);

  const currentDocument = currentDocumentId ? getDocument(currentDocumentId) : null;

  // Load template when document changes
  useEffect(() => {
    if (currentDocument) {
      setIsLoadingTemplate(true);
      loadTemplate(currentDocument.templateId)
        .then(setTemplate)
        .catch((error) => {
          console.error('Failed to load template:', error);
          alert('Failed to load template. Please try again.');
        })
        .finally(() => setIsLoadingTemplate(false));
    } else {
      setTemplate(null);
    }
  }, [currentDocument]);

  // Context menu handlers
  const handleContextMenu = (e: React.MouseEvent, item: FolderItem) => {
    e.preventDefault();
    setContextMenu({
      item,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  const handleCreateDocument = () => {
    setCreateInFolderId(contextMenu?.item.type === 'folder' ? contextMenu.item.id : currentFolderId);
    setIsCreateDocModalOpen(true);
  };

  const handleCreateFolder = () => {
    if (!contextMenu) return;
    const parentId = contextMenu.item.type === 'folder' ? contextMenu.item.id : currentFolderId;
    const name = prompt('Enter folder name:');
    if (name?.trim()) {
      createFolder(name.trim(), parentId);
    }
  };

  const handleUpload = () => {
    setCreateInFolderId(contextMenu?.item.type === 'folder' ? contextMenu.item.id : currentFolderId);
    setIsUploadModalOpen(true);
  };

  const handleFileUpload = (file: File) => {
    alert(`File "${file.name}" uploaded successfully! (Implementation pending)`);
  };

  const handleRename = () => {
    if (!contextMenu) return;
    const newName = prompt('Enter new name:', contextMenu.item.name);
    if (newName?.trim() && newName !== contextMenu.item.name) {
      useWorkspaceStore.getState().renameItem(contextMenu.item.id, newName.trim());
    }
  };

  const handleDelete = () => {
    if (!contextMenu) return;
    if (confirm(`Are you sure you want to delete "${contextMenu.item.name}"?`)) {
      deleteItem(contextMenu.item.id);
    }
  };

  // Document form handlers
  const handleFieldChange = (fieldId: string, value: string | boolean) => {
    if (!currentDocument) return;
    updateDocumentFormData(currentDocument.id, {
      ...currentDocument.formData,
      [fieldId]: value,
    });
  };

  const handleAISectionChange = (sectionId: string, content: string) => {
    if (!currentDocument) return;
    updateDocumentAiContent(currentDocument.id, {
      ...currentDocument.aiContent,
      [sectionId]: content,
    });
  };

  const handleLanguageChange = (language: Language) => {
    if (!currentDocument) return;
    updateDocument(currentDocument.id, { language });
  };

  // AI generation handlers
  const generateAllSections = async () => {
    if (!template?.schema.ai_sections || !userPrompt.trim() || !currentDocument) {
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
          language: currentDocument.language,
          documentType: currentDocument.documentType,
          formData: currentDocument.formData,
          aiSections: template.schema.ai_sections,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();

      const newContent: Record<string, string> = {};
      template.schema.ai_sections.forEach((section) => {
        if (data.sections && data.sections[section.id]) {
          newContent[section.id] = data.sections[section.id].content;
        }
      });

      updateDocumentAiContent(currentDocument.id, newContent);
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateSection = async (sectionId: string) => {
    if (!template?.schema.ai_sections || !currentDocument) return;

    const section = template.schema.ai_sections.find((s) => s.id === sectionId);
    if (!section) return;

    setGeneratingSection(sectionId);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: userPrompt || section.prompt_guidance,
          language: currentDocument.language,
          documentType: currentDocument.documentType,
          formData: currentDocument.formData,
          aiSections: [section],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate section');
      }

      const data = await response.json();

      if (data.sections && data.sections[sectionId]) {
        handleAISectionChange(sectionId, data.sections[sectionId].content);
      }
    } catch (error) {
      console.error('Error regenerating section:', error);
      alert('Failed to regenerate section. Please try again.');
    } finally {
      setGeneratingSection(null);
    }
  };

  // PDF export handler
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

  // Analysis handlers
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setIsAnalysisModalOpen(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      setAnalysisResult({
        summary: 'This document appears to be well-structured and includes all necessary legal clauses. The terms are clearly defined and responsibilities are appropriately allocated between parties.',
        insights: [
          {
            text: 'All required fields are properly filled out',
            sentiment: 'positive',
            category: 'Completeness',
          },
          {
            text: 'Legal language is clear and unambiguous',
            sentiment: 'positive',
            category: 'Clarity',
          },
          {
            text: 'Consider adding a dispute resolution clause',
            sentiment: 'warning',
            category: 'Legal Gap',
          },
          {
            text: 'Document structure follows standard legal format',
            sentiment: 'neutral',
            category: 'Format',
          },
        ],
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Merge AI content with form data for preview
  const getMergedTemplateData = () => {
    if (!currentDocument) return {};
    return {
      ...currentDocument.formData,
      ...currentDocument.aiContent,
    };
  };

  // Search functionality
  const filteredItems = Object.values(items).filter((item) => {
    if (!searchQuery.trim()) return false;
    return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Show loading state during hydration
  if (!isHydrated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin text-6xl mb-4">⚖️</div>
          <p className="text-xl font-bold text-gray-700">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl z-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-full px-6 relative z-10">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">⚖️</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">Jurix</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/workspace" className="hover:text-purple-200 transition font-semibold relative group">
                Workspace
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/generate" className="hover:text-purple-200 transition font-semibold relative group">
                Generate
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/analyze" className="hover:text-purple-200 transition font-semibold relative group">
                Analyze
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/" className="hover:text-purple-200 transition font-semibold relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Resizable Panels */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          {/* Left Panel: Folder Tree */}
          {!isSidebarCollapsed && (
            <>
              <Panel defaultSize={20} minSize={15} maxSize={35} className="relative">
                <div className="h-full bg-white border-r border-gray-300 flex flex-col shadow-lg">
                  {/* Sidebar Header */}
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-indigo-700 px-3 py-2 flex items-center justify-between">
                    <h2 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <span>My Organization</span>
                    </h2>
                    <button
                      onClick={() => setIsSidebarCollapsed(true)}
                      className="text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded p-0.5"
                      title="Collapse sidebar"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="p-2 border-b border-gray-200 bg-gray-50">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full px-2.5 py-1.5 pl-7 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs transition-all"
                      />
                      <svg className="w-3.5 h-3.5 absolute left-2 top-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>

                    {/* Search Results */}
                    {searchQuery && (
                      <div className="mt-2 max-h-40 overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-lg">
                        {filteredItems.length > 0 ? (
                          <div className="divide-y divide-gray-100">
                            {filteredItems.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => {
                                  if (item.type === 'document') {
                                    useWorkspaceStore.getState().setCurrentDocument(item.id);
                                  } else {
                                    useWorkspaceStore.getState().setCurrentFolder(item.id);
                                  }
                                  setSearchQuery('');
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-indigo-50 transition-colors flex items-center gap-2"
                              >
                                <span className="text-lg">{item.type === 'folder' ? '📁' : '📄'}</span>
                                <span className="text-sm font-medium text-gray-700 truncate">{item.name}</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="px-3 py-4 text-center text-sm text-gray-500">
                            No results found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Folder Tree */}
                  <div className="flex-1 overflow-hidden">
                    <FolderTree onContextMenu={handleContextMenu} />
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="w-1 bg-gray-300 hover:bg-indigo-500 transition-colors cursor-col-resize" />
            </>
          )}

          {/* Collapse Button (when sidebar is hidden) */}
          {isSidebarCollapsed && (
            <div className="absolute left-0 top-20 z-10">
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="bg-indigo-600 text-white p-2 rounded-r-lg shadow-lg hover:bg-indigo-700 transition-all hover:px-3"
                title="Expand sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Middle Panel: Editor */}
          <Panel defaultSize={40} minSize={30}>
            <div className="h-full flex flex-col bg-white">
              {currentDocument ? (
                <>
                  {/* Document Status Bar */}
                  <DocumentStatusBar documentId={currentDocument.id} />

                  {/* Breadcrumb & Controls */}
                  <div className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">
                    <Breadcrumb itemId={currentDocument.id} />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowComments(!showComments)}
                        className="px-2.5 py-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-md font-semibold text-xs transition-all shadow-sm hover:shadow"
                      >
                        {showComments ? '👁️ Hide' : '👁️‍🗨️ Show'}
                      </button>
                    </div>
                  </div>

                  {/* Editor Content */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 bg-gradient-to-br from-gray-50 to-white">
                    {isLoadingTemplate ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin text-3xl mb-2">⟳</div>
                        <p className="text-gray-600 text-sm font-semibold">Loading template...</p>
                      </div>
                    ) : template ? (
                      <div className="space-y-4 animate-fadeIn">
                        {/* Language Selector */}
                        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:border-indigo-300 transition-all">
                          <label className="block text-gray-900 font-bold mb-2 text-sm flex items-center gap-1.5">
                            <span className="text-base">🌍</span>
                            <span>Language</span>
                          </label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleLanguageChange('uzbek')}
                              className={`flex-1 py-1.5 px-3 rounded-md font-semibold text-xs transition-all duration-300 transform hover:scale-105 ${
                                currentDocument.language === 'uzbek'
                                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                              }`}
                            >
                              Uzbek
                            </button>
                            <button
                              onClick={() => handleLanguageChange('russian')}
                              className={`flex-1 py-1.5 px-3 rounded-md font-semibold text-xs transition-all duration-300 transform hover:scale-105 ${
                                currentDocument.language === 'russian'
                                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                              }`}
                            >
                              Russian
                            </button>
                          </div>
                        </div>

                        {/* User Prompt Area */}
                        {template.schema.ai_sections && template.schema.ai_sections.length > 0 && (
                          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 border border-purple-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-all">
                            <label className="block text-gray-900 font-bold mb-2 text-sm flex items-center gap-1.5">
                              <span className="text-base">✨</span>
                              <span>AI Generation</span>
                            </label>
                            <p className="text-gray-700 text-xs mb-3">
                              Describe what you want and AI will generate content.
                            </p>
                            <textarea
                              value={userPrompt}
                              onChange={(e) => setUserPrompt(e.target.value)}
                              className="w-full px-3 py-2 rounded-md bg-white border border-purple-300 text-gray-900 text-xs placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                              rows={3}
                              placeholder="Enter your requirements here..."
                            />
                            <button
                              onClick={generateAllSections}
                              disabled={isGenerating || !userPrompt.trim()}
                              className="mt-3 w-full py-1.5 px-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-md font-semibold text-xs transition-all shadow-md disabled:shadow-none flex items-center justify-center gap-1.5 transform hover:scale-105 disabled:scale-100"
                            >
                              {isGenerating ? (
                                <>
                                  <span className="animate-spin text-sm">⟳</span>
                                  <span>Generating...</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-sm">✨</span>
                                  <span>Generate All</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {/* Required Fields */}
                        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:border-indigo-300 transition-all">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-gray-900 font-bold text-sm flex items-center gap-1.5">
                              <span className="text-base">📋</span>
                              <span>Required Information</span>
                            </h4>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                              currentDocument.documentType === 'lease' ? 'bg-blue-100 text-blue-700' :
                              currentDocument.documentType === 'employment' ? 'bg-purple-100 text-purple-700' :
                              currentDocument.documentType === 'application' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {currentDocument.documentType}
                            </span>
                          </div>
                          <DynamicForm
                            fields={template.schema.fields}
                            language={currentDocument.language}
                            formData={currentDocument.formData}
                            onFieldChange={handleFieldChange}
                          />
                        </div>

                        {/* AI Sections */}
                        {template.schema.ai_sections && template.schema.ai_sections.length > 0 && (
                          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:border-indigo-300 transition-all">
                            <h4 className="text-gray-900 font-bold mb-3 text-sm flex items-center gap-1.5">
                              <span className="text-base">🤖</span>
                              <span>AI-Generated Sections</span>
                            </h4>
                            <div className="space-y-3">
                              {template.schema.ai_sections.map((section) => (
                                <AISectionEditor
                                  key={section.id}
                                  section={section}
                                  language={currentDocument.language}
                                  content={currentDocument.aiContent[section.id] || ''}
                                  onContentChange={handleAISectionChange}
                                  onRegenerate={regenerateSection}
                                  isGenerating={generatingSection === section.id}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-600">
                        Template not available
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                  <div className="text-center animate-fadeIn">
                    <div className="text-6xl mb-4 animate-bounce">📄</div>
                    <p className="text-xl font-bold text-gray-700 mb-1">No document selected</p>
                    <p className="text-sm text-gray-500">Select a document from the sidebar or create a new one</p>
                  </div>
                </div>
              )}
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-300 hover:bg-indigo-500 transition-colors cursor-col-resize" />

          {/* Preview Panel */}
          <Panel defaultSize={showComments ? 30 : 40} minSize={25}>
            <div className="h-full flex flex-col bg-gradient-to-br from-gray-100 to-gray-200">
              {currentDocument ? (
                <>
                  {/* Preview Header */}
                  <div className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-300 px-4 py-2 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👁️</span>
                      <Breadcrumb itemId={currentDocument.id} />
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={handleAnalyze}
                        className="px-2.5 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-md font-semibold text-xs transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 transform hover:scale-105"
                      >
                        <span className="text-sm">🔍</span>
                        <span>Analyze</span>
                      </button>
                      {analysisResult && (
                        <button
                          onClick={() => setIsAnalysisModalOpen(true)}
                          className="px-2.5 py-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-md font-semibold text-xs transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 transform hover:scale-105"
                        >
                          <span className="text-sm">📊</span>
                          <span>View</span>
                        </button>
                      )}
                      <button
                        onClick={handleExportPDF}
                        disabled={isExporting || !template}
                        className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-md font-semibold text-xs transition-all shadow-sm hover:shadow-md disabled:shadow-none flex items-center gap-1.5 transform hover:scale-105 disabled:scale-100"
                      >
                        {isExporting ? (
                          <>
                            <span className="animate-spin text-sm">⟳</span>
                            <span>Exporting...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-sm">📄</span>
                            <span>Export</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="flex-1 p-6 overflow-hidden">
                    <div className="bg-white rounded-xl shadow-2xl h-full overflow-hidden border-4 border-gray-300">
                      {template ? (
                        <TemplatePreview
                          ref={templatePreviewRef}
                          templateHtml={template.templateHtml}
                          formData={getMergedTemplateData()}
                          language={currentDocument.language}
                          comments={currentDocument.comments}
                          onHighlightClick={(commentId, position) => {
                            const comment = currentDocument.comments.find(c => c.id === commentId);
                            if (comment) {
                              setCommentPopup({
                                position,
                                selectedText: comment.selectedText || null,
                                existingComment: comment,
                              });
                            }
                          }}
                          onTextSelected={(text, position) => {
                            setCommentPopup({
                              position,
                              selectedText: text,
                              existingComment: null,
                            });
                          }}
                        />
                      ) : isLoadingTemplate ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <div className="inline-block animate-spin text-5xl mb-3">⟳</div>
                            <p className="text-gray-600 font-bold">Loading template...</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-600">
                          Template not available
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center animate-fadeIn">
                    <div className="text-6xl mb-4 animate-pulse">👁️</div>
                    <p className="text-xl font-bold text-gray-700 mb-1">No preview available</p>
                    <p className="text-sm text-gray-500">Select a document to see the preview</p>
                  </div>
                </div>
              )}
            </div>
          </Panel>

        </PanelGroup>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          item={contextMenu.item}
          position={contextMenu.position}
          onClose={() => setContextMenu(null)}
          onCreateDocument={handleCreateDocument}
          onCreateFolder={handleCreateFolder}
          onUpload={handleUpload}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      )}

      {/* Create Document Modal */}
      <CreateDocumentModal
        isOpen={isCreateDocModalOpen}
        onClose={() => setIsCreateDocModalOpen(false)}
        onCreate={(name: string, documentType: DocumentType) => {
          const docId = createDocument(name, createInFolderId, documentType);
          useWorkspaceStore.getState().setCurrentDocument(docId);
          setIsCreateDocModalOpen(false);
        }}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
        folderId={createInFolderId || ''}
      />

      {/* Analysis Modal */}
      <AnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        analysisResult={analysisResult}
        isAnalyzing={isAnalyzing}
      />

      {/* Comment Popup */}
      {commentPopup && currentDocument && (
        <CommentPopup
          documentId={currentDocument.id}
          position={commentPopup.position}
          selectedText={commentPopup.selectedText}
          existingComment={commentPopup.existingComment}
          onClose={() => setCommentPopup(null)}
          onCommentAdded={() => setCommentPopup(null)}
        />
      )}

      {/* Add fade-in animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
