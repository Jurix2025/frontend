// Utility to load document templates and schemas

export interface FieldOption {
  value: string;
  label: {
    uzbek: string;
    russian: string;
  };
}

export interface TemplateField {
  id: string;
  label: {
    uzbek: string;
    russian: string;
  };
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'boolean';
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
  options?: FieldOption[];
}

export interface AISection {
  id: string;
  label: {
    uzbek: string;
    russian: string;
  };
  section_number: string;
  description: {
    uzbek: string;
    russian: string;
  };
  prompt_guidance: string;
  required?: boolean;
}

export interface TemplateSchema {
  name: string;
  name_en: string;
  category: string;
  languages: string[];
  fields: TemplateField[];
  ai_sections?: AISection[];
}

export interface DocumentTemplate {
  schema: TemplateSchema;
  templateHtml: string;
  templateCss: string;
  templateId: string;
}

/**
 * Load a document template by its ID (e.g., 'ijara_shartnomasi')
 */
export async function loadTemplate(templateId: string): Promise<DocumentTemplate> {
  try {
    // Load schema
    const schemaResponse = await fetch(`/templates/${templateId}/schema.json`);
    if (!schemaResponse.ok) {
      throw new Error(`Failed to load schema for ${templateId}`);
    }
    const schema: TemplateSchema = await schemaResponse.json();

    // Load template HTML
    const templateResponse = await fetch(`/templates/${templateId}/template.html`);
    if (!templateResponse.ok) {
      throw new Error(`Failed to load template HTML for ${templateId}`);
    }
    let templateHtml = await templateResponse.text();

    // Load CSS
    let templateCss = '';
    try {
      const cssResponse = await fetch(`/templates/${templateId}/styles.css`);
      if (cssResponse.ok) {
        templateCss = await cssResponse.text();
        // Replace the stylesheet link with inline style
        templateHtml = templateHtml.replace(
          /<link rel="stylesheet" href="styles\.css">/g,
          `<style>${templateCss}</style>`
        );
      }
    } catch (error) {
      console.warn('CSS file not found for template, continuing without it');
    }

    return {
      schema,
      templateHtml,
      templateCss,
      templateId,
    };
  } catch (error) {
    console.error('Error loading template:', error);
    throw error;
  }
}

/**
 * Get list of available template IDs
 * For now, we'll use a hardcoded list. In the future, this could come from an API
 */
export function getAvailableTemplates(): { id: string; name: string }[] {
  return [
    { id: 'ijara_shartnomasi', name: 'Lease Agreement' },
    // Add more templates as they become available
  ];
}
