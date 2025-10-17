// API configuration and utility functions for Jurix

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface GenerateDocumentRequest {
  documentType: string;
  language: string;
  formData: Record<string, string>;
}

export interface GenerateDocumentResponse {
  success: boolean;
  documentUrl?: string;
  pdfData?: Blob;
  error?: string;
}

/**
 * Generate a legal document via the Django backend
 */
export async function generateDocument(
  request: GenerateDocumentRequest
): Promise<GenerateDocumentResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Check if response is PDF (direct download) or JSON (with URL)
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/pdf')) {
      // Direct PDF response
      const pdfBlob = await response.blob();
      return {
        success: true,
        pdfData: pdfBlob,
      };
    } else {
      // JSON response with URL
      const data = await response.json();
      return {
        success: true,
        documentUrl: data.url,
      };
    }
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Download a PDF blob as a file
 */
export function downloadPDF(pdfBlob: Blob, filename: string = 'document.pdf') {
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format document type for API
 */
export function formatDocumentType(type: string): string {
  const typeMap: Record<string, string> = {
    lease: 'lease_agreement',
    nda: 'nda',
    contract: 'service_contract',
    will: 'will_testament',
    petition: 'court_petition',
  };
  return typeMap[type] || type;
}

// Document Analysis Types
export interface Insight {
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'warning';
  category?: string;
}

export interface AnalysisResult {
  summary: string;
  insights: Insight[];
}

export interface AnalyzeDocumentResponse {
  success: boolean;
  result?: AnalysisResult;
  error?: string;
}

/**
 * Analyze a legal document via the backend (OpenAI API)
 */
export async function analyzeDocument(file: File): Promise<AnalyzeDocumentResponse> {
  try {
    const formData = new FormData();
    formData.append('document', file);

    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      result: data,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
