'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import { uploadAndAnalyzeDocument, UploadDocumentResponse } from '@/lib/api';

export default function AnalyzePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<UploadDocumentResponse | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('uz');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
      setAnalysisResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);

    try {
      const response = await uploadAndAnalyzeDocument(uploadedFile, selectedLanguage);

      if (response.success && response.data) {
        setAnalysisResult(response.data);
      } else {
        throw new Error(response.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      alert(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
              <Link href="/generate" className="text-white hover:text-purple-300 transition font-semibold">
                Generate
              </Link>
              <Link href="/analyze" className="text-white font-semibold">
                Analyze
              </Link>
              <Link href="/" className="text-white hover:text-purple-300 transition font-semibold">
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Document <span className="gradient-text">Analysis</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Upload your legal document and get AI-powered analysis with key insights, risks, and recommendations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Upload Area */}
            <div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Upload Document</h2>

                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
                    isDragActive
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/20 hover:border-purple-500/50 hover:bg-white/5'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-4">
                    <svg
                      className="w-20 h-20 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    {isDragActive ? (
                      <p className="text-white font-semibold text-lg">Drop your document here</p>
                    ) : (
                      <>
                        <p className="text-white font-semibold text-lg">
                          Drag & drop your document here
                        </p>
                        <p className="text-gray-400">or click to browse files</p>
                      </>
                    )}
                    <p className="text-gray-500 text-sm">Supports PDF, DOC, DOCX, TXT (max 10MB)</p>
                  </div>
                </div>

                {/* Language Selection */}
                <div className="mt-6 bg-white/10 border border-white/20 rounded-xl p-4">
                  <label className="block text-white font-semibold mb-3">Analysis Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="uz">Uzbek (O&apos;zbek)</option>
                    <option value="ru">Russian (Русский)</option>
                    <option value="en">English</option>
                  </select>
                </div>

                {/* Uploaded File Info */}
                {uploadedFile && (
                  <div className="mt-6 bg-white/10 border border-white/20 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📄</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{uploadedFile.name}</p>
                          <p className="text-gray-400 text-sm">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setUploadedFile(null);
                          setAnalysisResult(null);
                        }}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={!uploadedFile || isAnalyzing}
                  className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Analyzing Document...
                    </span>
                  ) : (
                    'Analyze Document →'
                  )}
                </button>
              </div>

              {/* Info Card */}
              <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">🤖</span>
                  <div>
                    <h4 className="text-blue-300 font-semibold mb-1">AI-Powered Analysis</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Our AI analyzes your document to identify key clauses, potential risks, favorable terms, and legal gaps. Always consult a qualified lawyer for legal advice.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Analysis Results */}
            <div>
              {analysisResult ? (
                <div className="bg-white rounded-2xl p-8 shadow-xl space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
                    <div className="text-xs text-gray-500">
                      ID: {analysisResult.document.id}
                    </div>
                  </div>

                  {/* Document Info */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-semibold">File:</span> {analysisResult.document.file_name}
                      <span className="mx-2">•</span>
                      <span className="font-semibold">Uploaded:</span> {new Date(analysisResult.document.upload_timestamp).toLocaleString()}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span>📋</span> Summary
                    </h3>
                    <p className="text-gray-900 leading-relaxed font-medium">{analysisResult.analysis.summary}</p>
                  </div>

                  {/* Parties */}
                  {analysisResult.analysis.parties.length > 0 && (
                    <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span>👥</span> Parties Involved
                      </h3>
                      <ul className="space-y-2">
                        {analysisResult.analysis.parties.map((party, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold">•</span>
                            <span className="text-gray-900 font-medium">{party}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Key Terms */}
                  {analysisResult.analysis.key_terms.length > 0 && (
                    <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span>✅</span> Key Terms
                      </h3>
                      <ul className="space-y-2">
                        {analysisResult.analysis.key_terms.map((term, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span className="text-gray-900 font-medium">{term}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Risks */}
                  {analysisResult.analysis.risks.length > 0 && (
                    <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span>⚠️</span> Identified Risks
                      </h3>
                      <ul className="space-y-2">
                        {analysisResult.analysis.risks.map((risk, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-600 font-bold">•</span>
                            <span className="text-gray-900 font-medium">{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {analysisResult.analysis.recommendations.length > 0 && (
                    <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span>💡</span> Recommendations
                      </h3>
                      <ul className="space-y-2">
                        {analysisResult.analysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-yellow-600 font-bold">•</span>
                            <span className="text-gray-900 font-medium">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Legal Compliance */}
                  <div className={`rounded-xl p-6 border-2 ${
                    analysisResult.analysis.legal_compliance.status.toLowerCase().includes('ok')
                      ? 'bg-green-50 border-green-200'
                      : 'bg-orange-50 border-orange-200'
                  }`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span>⚖️</span> Legal Compliance
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-900 font-semibold">
                        Status: <span className="font-bold">{analysisResult.analysis.legal_compliance.status}</span>
                      </p>
                      <p className="text-gray-700">{analysisResult.analysis.legal_compliance.details}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={() => {
                        setAnalysisResult(null);
                        setUploadedFile(null);
                      }}
                      className="flex-1 py-3 px-6 bg-gray-200 text-gray-900 rounded-xl font-semibold hover:bg-gray-300 transition-all border-2 border-gray-300"
                    >
                      Analyze Another
                    </button>
                    <button
                      onClick={() => {
                        // TODO: Implement export functionality
                        alert('Export functionality coming soon!');
                      }}
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Export Report
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-24 w-24 text-gray-600 mb-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-gray-400 text-lg font-medium">No analysis yet</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Upload a document and click analyze to see results
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p className="mb-2">🤖 Powered by AI • Made for Uzbekistan</p>
          <p className="text-sm">© 2024 Jurix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
