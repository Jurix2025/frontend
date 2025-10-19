'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import Handlebars from 'handlebars';
import { Comment } from '@/types/workspace';

interface TemplatePreviewProps {
  templateHtml: string;
  formData: Record<string, string | boolean>;
  language: 'uzbek' | 'russian';
  comments?: Comment[];
  onHighlightClick?: (commentId: string, position: { x: number; y: number }) => void;
  onTextSelected?: (selectedText: string, position: { x: number; y: number }) => void;
}

export interface TemplatePreviewRef {
  exportToPDF: () => Promise<void>;
}

export const TemplatePreview = forwardRef<TemplatePreviewRef, TemplatePreviewProps>(
  function TemplatePreview({ templateHtml, formData, language, comments = [], onHighlightClick, onTextSelected }, ref) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [renderedHtml, setRenderedHtml] = useState('');

    useEffect(() => {
      // Register custom Handlebars helpers for language conditionals
      Handlebars.registerHelper('if_uzbek', function(this: unknown, options: Handlebars.HelperOptions) {
        return language === 'uzbek' ? options.fn(this) : options.inverse(this);
      });

      Handlebars.registerHelper('if_russian', function(this: unknown, options: Handlebars.HelperOptions) {
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
        let html = template(templateData);

        // Group comments by anchor ID to count comments per highlight
        const commentsByAnchor = new Map<string, Comment[]>();
        comments.filter(c => c.selectedText && c.anchorId).forEach(comment => {
          const anchor = comment.anchorId!;
          if (!commentsByAnchor.has(anchor)) {
            commentsByAnchor.set(anchor, []);
          }
          commentsByAnchor.get(anchor)!.push(comment);
        });

        // Add highlights for comments with selected text
        commentsByAnchor.forEach((anchorComments, anchorId) => {
          const firstComment = anchorComments[0];
          if (firstComment.selectedText) {
            // Escape special regex characters in selected text
            const escapedText = firstComment.selectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Determine highlight class based on if all are resolved
            const allResolved = anchorComments.every(c => c.resolved);
            const highlightClass = allResolved ? 'highlight-resolved' : 'highlight-active';

            // Count comments
            const commentCount = anchorComments.length;
            const countBadge = commentCount > 1 ? `<span class="comment-count">${commentCount}</span>` : '';

            // Find and wrap the selected text with a highlight span
            const regex = new RegExp(`(${escapedText})`, 'g');
            const replacement = `<span class="${highlightClass}" data-comment-id="${firstComment.id}" data-anchor-id="${anchorId}">$1${countBadge}</span>`;

            // Only replace the first occurrence to avoid duplicates
            html = html.replace(regex, replacement);
          }
        });

        setRenderedHtml(html);
      } catch (error) {
        console.error('Error rendering template:', error);
        setRenderedHtml('<p style="color: red; padding: 20px;">Error rendering template. Please check the console for details.</p>');
      }
    }, [templateHtml, formData, language, comments]);

    useEffect(() => {
      // Update iframe content
      if (iframeRef.current && renderedHtml) {
        const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(`
            <html>
              <head>
                <style>
                  /* Highlight styles */
                  .highlight-active {
                    background-color: rgba(255, 235, 59, 0.4);
                    border-bottom: 2px solid #FFC107;
                    cursor: pointer;
                    transition: all 0.2s;
                    padding: 2px 0;
                  }
                  .highlight-active:hover {
                    background-color: rgba(255, 235, 59, 0.6);
                    border-bottom-color: #FF9800;
                  }
                  .highlight-resolved {
                    background-color: rgba(76, 175, 80, 0.2);
                    border-bottom: 2px solid #4CAF50;
                    cursor: pointer;
                    transition: all 0.2s;
                    padding: 2px 0;
                    text-decoration: line-through;
                    text-decoration-color: rgba(76, 175, 80, 0.5);
                  }
                  .highlight-resolved:hover {
                    background-color: rgba(76, 175, 80, 0.3);
                  }

                  /* User selection styles */
                  ::selection {
                    background-color: rgba(99, 102, 241, 0.3);
                  }

                  /* Comment count badge */
                  .comment-count {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 18px;
                    height: 18px;
                    padding: 0 4px;
                    margin-left: 4px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 9px;
                    font-size: 10px;
                    font-weight: bold;
                    line-height: 1;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    vertical-align: middle;
                  }

                  .highlight-resolved .comment-count {
                    background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
                  }
                </style>
              </head>
              <body>
                ${renderedHtml}
              </body>
            </html>
          `);
          iframeDoc.close();

          // Get iframe position in viewport
          const iframeRect = iframeRef.current?.getBoundingClientRect();

          // Add event listeners for highlights
          const highlights = iframeDoc.querySelectorAll('.highlight-active, .highlight-resolved');
          highlights.forEach((highlight) => {
            highlight.addEventListener('click', (e: Event) => {
              e.preventDefault();
              e.stopPropagation();
              const mouseEvent = e as MouseEvent;
              const commentId = (highlight as HTMLElement).dataset.commentId;
              if (commentId && onHighlightClick && iframeRect) {
                // Get position relative to iframe content
                const rect = (highlight as HTMLElement).getBoundingClientRect();
                // Convert to viewport coordinates
                const position = {
                  x: iframeRect.left + rect.right + 10,
                  y: iframeRect.top + rect.top
                };
                onHighlightClick(commentId, position);
              }
            });
          });

          // Add event listener for text selection
          if (onTextSelected && iframeRect) {
            iframeDoc.addEventListener('mouseup', (e: Event) => {
              const mouseEvent = e as MouseEvent;
              const selection = iframeDoc.getSelection();
              const selectedText = selection?.toString().trim();
              if (selectedText && selectedText.length > 0) {
                // Get position of selection relative to iframe content
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                // Convert to viewport coordinates
                const position = {
                  x: iframeRect.left + rect.right + 10,
                  y: iframeRect.top + rect.top
                };
                onTextSelected(selectedText, position);
              }
            });
          }
        }
      }
    }, [renderedHtml, onHighlightClick, onTextSelected]);

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
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    );
  }
);
