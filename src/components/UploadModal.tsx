'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  folderId: string;
}

export function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUploadedFile(null);
    }
  }, [isOpen]);

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
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

  const handleUpload = () => {
    if (uploadedFile) {
      onUpload(uploadedFile);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📤</span>
            <h2 className="text-2xl font-bold text-white">Upload Document</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`border-4 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-indigo-500 bg-indigo-50'
                : uploadedFile
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'
            }`}
          >
            <input {...getInputProps()} />

            {uploadedFile ? (
              <div className="space-y-4">
                <div className="text-6xl">✓</div>
                <div>
                  <p className="text-xl font-bold text-gray-900 mb-2">File Selected</p>
                  <p className="text-lg text-gray-700 font-semibold">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatFileSize(uploadedFile.size)} • {uploadedFile.type || 'Unknown type'}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Choose a different file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl">{isDragActive ? '📥' : '📄'}</div>
                <div>
                  <p className="text-xl font-bold text-gray-900 mb-2">
                    {isDragActive ? 'Drop file here' : 'Drag & drop a file here'}
                  </p>
                  <p className="text-gray-600">or click to browse</p>
                </div>
                <div className="text-sm text-gray-500">
                  <p>Supported formats: PDF, DOC, DOCX, TXT</p>
                  <p className="mt-1">Maximum file size: 10 MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-6">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!uploadedFile}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all"
            >
              Upload File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
