'use client';

import { PDFViewer } from '@react-pdf/renderer';
import { PDFTemplate } from './PDFTemplate';
import { useEffect, useState } from 'react';

interface PDFPreviewProps {
  documentType: string;
  language: string;
  formData: Record<string, string>;
}

export const PDFPreview = ({ documentType, language, formData }: PDFPreviewProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  const hasData = Object.values(formData).some(value => value && value.trim() !== '');

  if (!hasData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center p-8">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
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
          <p className="text-gray-600 font-medium">Fill out the form to see live preview</p>
          <p className="text-gray-500 text-sm mt-2">Your document will appear here automatically</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
      <PDFViewer width="100%" height="100%" showToolbar={false} className="border-0">
        <PDFTemplate
          documentType={documentType}
          language={language}
          formData={formData}
        />
      </PDFViewer>
    </div>
  );
};
