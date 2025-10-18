'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';

interface Insight {
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'warning';
  category?: string;
}

interface AnalysisResult {
  summary: string;
  insights: Insight[];
}

export default function AnalyzePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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
      // TODO: Implement actual API call to backend
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock analysis result
      setAnalysisResult({
        summary: 'This is a lease agreement between two parties for a residential property in Tashkent. The contract duration is 12 months with a monthly rent of 5,000,000 UZS. The agreement includes standard clauses for maintenance, utilities, and early termination penalties.',
        insights: [
          {
            text: 'Early termination penalty of 3 months rent is significantly higher than standard market practice',
            sentiment: 'negative',
            category: 'Financial Risk',
          },
          {
            text: 'Maintenance responsibilities are clearly defined between landlord and tenant',
            sentiment: 'positive',
            category: 'Clarity',
          },
          {
            text: 'Contract includes a renewal option with rent increase capped at 10%',
            sentiment: 'positive',
            category: 'Favorable Terms',
          },
          {
            text: 'Missing clause about dispute resolution mechanism',
            sentiment: 'warning',
            category: 'Legal Gap',
          },
          {
            text: 'Landlord reserves right to enter property with only 24 hours notice',
            sentiment: 'warning',
            category: 'Privacy Concern',
          },
          {
            text: 'Security deposit amount (2 months rent) is within legal limits',
            sentiment: 'neutral',
            category: 'Standard Practice',
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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500/10 border-green-500/30 text-green-300';
      case 'negative':
        return 'bg-red-500/10 border-red-500/30 text-red-300';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300';
      case 'neutral':
      default:
        return 'bg-blue-500/10 border-blue-500/30 text-blue-300';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '✅';
      case 'negative':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'neutral':
      default:
        return 'ℹ️';
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
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Analysis Results</h2>

                  {/* Summary */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-3">Summary</h3>
                    <p className="text-gray-300 leading-relaxed">{analysisResult.summary}</p>
                  </div>

                  {/* Key Insights */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Key Insights</h3>
                    <div className="space-y-4">
                      {analysisResult.insights.map((insight, index) => (
                        <div
                          key={index}
                          className={`border rounded-xl p-4 ${getSentimentColor(insight.sentiment)}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">
                              {getSentimentIcon(insight.sentiment)}
                            </span>
                            <div className="flex-1">
                              {insight.category && (
                                <span className="inline-block px-2 py-1 rounded-md bg-white/10 text-xs font-semibold mb-2">
                                  {insight.category}
                                </span>
                              )}
                              <p className="text-sm leading-relaxed">{insight.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={() => {
                        setAnalysisResult(null);
                        setUploadedFile(null);
                      }}
                      className="flex-1 py-3 px-6 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
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
