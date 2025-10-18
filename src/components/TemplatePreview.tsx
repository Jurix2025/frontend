'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import Handlebars from 'handlebars';

interface TemplatePreviewProps {
  templateHtml: string;
  formData: Record<string, string | boolean>;
  language: 'uzbek' | 'russian';
}

export interface TemplatePreviewRef {
  exportToPDF: () => Promise<void>;
}

export const TemplatePreview = forwardRef<TemplatePreviewRef, TemplatePreviewProps>(
  function TemplatePreview({ templateHtml, formData, language }, ref) {
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

    // Expose export method to parent component
    useImperativeHandle(ref, () => ({
      exportToPDF: async () => {
        if (!iframeRef.current) return;

        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc || !iframeDoc.body) return;

        // Dynamically import libraries
        const html2canvas = (await import('html2canvas')).default;
        const jsPDF = (await import('jspdf')).default;

        // Get the document element from iframe
        const element = iframeDoc.body;

        // Create canvas from HTML
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');

        // A4 dimensions in mm
        const pdfWidth = 210;
        const pdfHeight = 297;

        // Calculate dimensions
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Add additional pages if needed
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        // Generate filename
        const docType = formData.contract_type || formData.application_subject || formData.complaint_subject || 'document';
        const date = new Date().toISOString().split('T')[0];
        const filename = `${docType}_${date}.pdf`;

        // Download PDF
        pdf.save(filename);
      },
    }));

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
);
