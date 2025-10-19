'use client';

import { useRef, useEffect } from 'react';

interface Insight {
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'warning';
  category?: string;
}

interface AnalysisResult {
  summary: string;
  insights: Insight[];
}

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
}

export function AnalysisModal({ isOpen, onClose, analysisResult, isAnalyzing }: AnalysisModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'negative':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'neutral':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '✓';
      case 'negative':
        return '✗';
      case 'warning':
        return '⚠';
      case 'neutral':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  };

  const handleDownloadReport = () => {
    if (!analysisResult) return;

    // Create a simple text report
    let reportText = 'DOCUMENT ANALYSIS REPORT\n';
    reportText += '='.repeat(50) + '\n\n';
    reportText += `Generated: ${new Date().toLocaleString()}\n\n`;
    reportText += 'SUMMARY:\n';
    reportText += analysisResult.summary + '\n\n';
    reportText += 'KEY INSIGHTS:\n';
    reportText += '='.repeat(50) + '\n\n';

    analysisResult.insights.forEach((insight, index) => {
      reportText += `${index + 1}. [${insight.sentiment.toUpperCase()}] ${insight.category || 'General'}\n`;
      reportText += `   ${insight.text}\n\n`;
    });

    // Create blob and download
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <h2 className="text-2xl font-bold text-white">Document Analysis</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin text-6xl mb-4">⟳</div>
              <p className="text-xl font-semibold text-gray-700">Analyzing document...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            </div>
          ) : analysisResult ? (
            <div className="space-y-6">
              {/* Summary Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📝</span>
                  Summary
                </h3>
                <p className="text-gray-700 leading-relaxed">{analysisResult.summary}</p>
              </div>

              {/* Insights Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>💡</span>
                  Key Insights ({analysisResult.insights.length})
                </h3>

                <div className="space-y-3">
                  {analysisResult.insights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${getSentimentColor(insight.sentiment)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold">
                          {getSentimentIcon(insight.sentiment)}
                        </div>
                        <div className="flex-1">
                          {insight.category && (
                            <p className="text-xs font-bold uppercase tracking-wide mb-1 opacity-75">
                              {insight.category}
                            </p>
                          )}
                          <p className="text-sm font-medium leading-relaxed">{insight.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                {['positive', 'negative', 'warning', 'neutral'].map((sentiment) => {
                  const count = analysisResult.insights.filter((i) => i.sentiment === sentiment).length;
                  return (
                    <div
                      key={sentiment}
                      className={`p-3 rounded-lg border-2 ${getSentimentColor(sentiment)}`}
                    >
                      <p className="text-xs font-bold uppercase opacity-75">{sentiment}</p>
                      <p className="text-2xl font-bold">{count}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <span className="text-6xl mb-4">📊</span>
              <p className="text-lg font-semibold">No analysis available</p>
              <p className="text-sm mt-2">Click &quot;Analyze&quot; to analyze the current document</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {analysisResult && `Analysis completed at ${new Date().toLocaleString()}`}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadReport}
              disabled={!analysisResult}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
            >
              📥 Download Report
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
