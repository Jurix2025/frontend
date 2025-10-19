'use client';

import { useState, useRef, useEffect } from 'react';
import { DocumentType } from '@/types/workspace';

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, documentType: DocumentType) => void;
}

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

export function CreateDocumentModal({ isOpen, onClose, onCreate }: CreateDocumentModalProps) {
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [documentName, setDocumentName] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedType(null);
      setDocumentName('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && selectedType && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen, selectedType]);

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

  const handleCreate = () => {
    if (selectedType && documentName.trim()) {
      onCreate(documentName.trim(), selectedType);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedType ? 'Name Your Document' : 'Choose Document Type'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!selectedType ? (
            <div className="grid md:grid-cols-2 gap-4">
              {documentTypes.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedType(doc.id)}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 text-left hover:border-indigo-500 hover:shadow-lg transition-all group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${doc.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-4xl">{doc.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{doc.title}</h3>
                  <p className="text-gray-600 text-sm">{doc.description}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected Document Type */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${
                      documentTypes.find((d) => d.id === selectedType)?.gradient
                    } rounded-lg flex items-center justify-center`}
                  >
                    <span className="text-2xl">
                      {documentTypes.find((d) => d.id === selectedType)?.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Document Type</p>
                    <p className="text-lg font-bold text-gray-900">
                      {documentTypes.find((d) => d.id === selectedType)?.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedType(null)}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Document Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Document Name
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreate();
                    }
                  }}
                  placeholder="e.g., Office Lease Agreement 2024"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!documentName.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all"
                >
                  Create Document
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
