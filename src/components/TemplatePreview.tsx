'use client';

import { useEffect, useRef, useState } from 'react';
import Handlebars from 'handlebars';

interface TemplatePreviewProps {
  templateHtml: string;
  formData: Record<string, string | boolean>;
  language: 'uzbek' | 'russian';
}

export function TemplatePreview({ templateHtml, formData, language }: TemplatePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [renderedHtml, setRenderedHtml] = useState('');

  useEffect(() => {
    // Register custom Handlebars helpers for language conditionals
    Handlebars.registerHelper('if_uzbek', function(this: any, options: any) {
      return language === 'uzbek' ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper('if_russian', function(this: any, options: any) {
      return language === 'russian' ? options.fn(this) : options.inverse(this);
    });

    // Compile the template
    try {
      const template = Handlebars.compile(templateHtml);

      // Prepare data for template
      const templateData = {
        ...formData,
        language: language === 'uzbek' ? 'uz' : 'ru',
      };

      // Render the template with form data
      const html = template(templateData);
      setRenderedHtml(html);
    } catch (error) {
      console.error('Error rendering template:', error);
      setRenderedHtml('<p style="color: red; padding: 20px;">Error rendering template. Please check the console for details.</p>');
    }
  }, [templateHtml, formData, language]);

  useEffect(() => {
    // Update iframe content
    if (iframeRef.current && renderedHtml) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(renderedHtml);
        iframeDoc.close();
      }
    }
  }, [renderedHtml]);

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-lg">
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        title="Document Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
}
