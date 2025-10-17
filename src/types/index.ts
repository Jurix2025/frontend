// Type definitions for Jurix

export type DocumentType = 'lease' | 'nda' | 'contract' | 'will' | 'petition' | null;

export type Language = 'uzbek' | 'russian';

export interface DocumentTypeInfo {
  id: DocumentType;
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

export interface FormData {
  [key: string]: string;
}

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  pdfUrl: string | null;
}
