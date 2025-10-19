'use client';

import { DocumentStatus } from '@/types/workspace';
import { useWorkspaceStore } from '@/store/workspaceStore';

interface DocumentStatusBarProps {
  documentId: string;
}

const statusFlow: Array<{
  id: DocumentStatus;
  label: string;
  description: string;
  colorFrom: string;
  colorTo: string;
  bgGradient: string;
}> = [
  {
    id: 'draft',
    label: 'Draft',
    description: 'Document is being created',
    colorFrom: '#9CA3AF',
    colorTo: '#6B7280',
    bgGradient: 'from-gray-400 to-gray-500'
  },
  {
    id: 'created',
    label: 'Created',
    description: 'Document is ready for review',
    colorFrom: '#3B82F6',
    colorTo: '#06B6D4',
    bgGradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'reviewed',
    label: 'Reviewed',
    description: 'Document has been reviewed',
    colorFrom: '#F59E0B',
    colorTo: '#F97316',
    bgGradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 'resolved',
    label: 'Resolved',
    description: 'All comments resolved',
    colorFrom: '#10B981',
    colorTo: '#059669',
    bgGradient: 'from-emerald-500 to-green-600'
  },
  {
    id: 'signed',
    label: 'Signed',
    description: 'Document is signed',
    colorFrom: '#8B5CF6',
    colorTo: '#7C3AED',
    bgGradient: 'from-violet-500 to-purple-600'
  },
];

export function DocumentStatusBar({ documentId }: DocumentStatusBarProps) {
  const { getDocument, updateDocumentStatus, canResolveDocument } = useWorkspaceStore();
  const document = getDocument(documentId);

  if (!document) return null;

  const currentStatusIndex = statusFlow.findIndex((s) => s.id === document.status);

  const handleStatusClick = (targetStatus: DocumentStatus) => {
    const targetIndex = statusFlow.findIndex((s) => s.id === targetStatus);
    const currentIndex = statusFlow.findIndex((s) => s.id === document.status);

    // Can only move forward one step at a time
    if (targetIndex !== currentIndex + 1) return;

    // Special validation for 'resolved' status
    if (targetStatus === 'resolved' && !canResolveDocument(documentId)) {
      alert('Cannot mark as resolved: there are unresolved comments');
      return;
    }

    updateDocumentStatus(documentId, targetStatus);
  };

  const progressPercentage = ((currentStatusIndex + 1) / statusFlow.length) * 100;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="max-w-6xl mx-auto">
        {/* Status Pills */}
        <div className="flex items-center gap-2 mb-3">
          {statusFlow.map((status, index) => {
            const isCompleted = index < currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            const isNext = index === currentStatusIndex + 1;
            const canClickResolved = status.id === 'resolved' && isNext && !canResolveDocument(documentId);

            return (
              <div key={status.id} className="flex items-center">
                {/* Status Pill */}
                <button
                  onClick={() => isNext && !canClickResolved && handleStatusClick(status.id)}
                  disabled={!isNext || canClickResolved}
                  title={canClickResolved ? 'Resolve all comments first' : status.description}
                  className={`
                    group relative px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 transform
                    ${isCompleted || isCurrent
                      ? `bg-gradient-to-r ${status.bgGradient} text-white shadow-md scale-105`
                      : isNext && !canClickResolved
                      ? 'bg-gray-100 text-gray-600 hover:bg-gradient-to-r hover:from-indigo-400 hover:to-purple-400 hover:text-white hover:shadow-md hover:scale-105 cursor-pointer border border-dashed border-gray-300'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
                    }
                    ${isCurrent ? 'ring-2 ring-offset-2 ring-indigo-400 animate-pulse' : ''}
                  `}
                >
                  {/* Color indicator dot */}
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${isCompleted || isCurrent ? 'bg-white' : 'bg-gray-400'}`}
                      style={
                        isCompleted || isCurrent
                          ? { background: `linear-gradient(135deg, ${status.colorFrom}, ${status.colorTo})` }
                          : {}
                      }
                    ></span>
                    {status.label}
                  </span>

                  {/* Hover hint */}
                  {isNext && !canClickResolved && (
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Click to advance →
                    </span>
                  )}

                  {/* Warning for unresolved */}
                  {canClickResolved && (
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-red-600 font-bold whitespace-nowrap">
                      ⚠️ Resolve comments
                    </span>
                  )}
                </button>

                {/* Arrow Connector */}
                {index < statusFlow.length - 1 && (
                  <svg
                    className={`w-4 h-4 mx-1 transition-all duration-300 ${
                      index < currentStatusIndex ? 'text-indigo-500' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* Animated Progress Bar */}
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out rounded-full shadow-lg"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
          </div>

          {/* Progress percentage */}
          <div className="absolute right-3 -top-5 text-xs font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>

        {/* Context hint */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            {currentStatusIndex === 0 && "Fill in details, then advance to 'Created'"}
            {currentStatusIndex === 1 && "Review document and add comments, then advance to 'Reviewed'"}
            {currentStatusIndex === 2 && "Resolve all comments to unlock 'Resolved' stage"}
            {currentStatusIndex === 3 && "Mark as signed when document is finalized"}
            {currentStatusIndex === 4 && "Document workflow complete! 🎉"}
          </p>
        </div>
      </div>

      {/* Shimmer Animation */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}
