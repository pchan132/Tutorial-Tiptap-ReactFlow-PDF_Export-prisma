import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Page {
  id: string;
  content: any;
}

interface Document {
  id: string;
  title: string;
  pages: Page[];
  metadata: any;
}

/**
 * Export document to PDF using jsPDF and html2canvas
 */
export async function exportDocumentToPDF(
  document: Document,
  editorElement: HTMLElement
): Promise<void> {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      throw new Error('PDF export can only be performed in a browser environment');
    }

    console.log("Starting PDF export for document:", document.title);

    // Create a new jsPDF instance
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20; // 20mm margin
    const contentWidth = pageWidth - 2 * margin;
    const contentHeight = pageHeight - 2 * margin;

    // Add title page
    pdf.setFontSize(24);
    pdf.text(document.title, pageWidth / 2, 50, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text(`Created: ${new Date().toLocaleDateString()}`, pageWidth / 2, 60, { align: 'center' });
    pdf.text(`Pages: ${document.pages.length}`, pageWidth / 2, 70, { align: 'center' });

    // Add a new page for content
    pdf.addPage();

    // For each page in the document
    for (let pageIndex = 0; pageIndex < document.pages.length; pageIndex++) {
      const page = document.pages[pageIndex];
      
      // Create a temporary container for the current page content
      const tempContainer = (document as any).createElement('div');
      tempContainer.style.width = `${contentWidth}mm`;
      tempContainer.style.padding = '20px';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px'; // Hide off-screen
      tempContainer.style.top = '-9999px';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '12px';
      tempContainer.style.lineHeight = '1.5';
      
      // Convert Tiptap JSON to HTML
      const htmlContent = convertTiptapToHTML(page.content);
      tempContainer.innerHTML = htmlContent;
      
      (document as any).body.appendChild(tempContainer);

      try {
        // Convert the HTML content to canvas
        const canvas = await html2canvas(tempContainer, {
          scale: 2, // Higher quality
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add page header (except for first page after title)
        if (pageIndex > 0) {
          pdf.addPage();
        }

        // Add page number
        pdf.setFontSize(10);
        pdf.text(
          `Page ${pageIndex + 1} of ${document.pages.length}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );

        // Add the content image
        let remainingHeight = imgHeight;
        let currentY = margin + 10; // Start after page number

        while (remainingHeight > 0) {
          const availableHeight = contentHeight - 20; // Leave space for page number
          const heightToAdd = Math.min(remainingHeight, availableHeight);

          pdf.addImage(
            imgData,
            'PNG',
            margin,
            currentY,
            imgWidth,
            heightToAdd
          );

          remainingHeight -= heightToAdd;
          currentY = margin;

          if (remainingHeight > 0) {
            pdf.addPage();
            // Add page number to new page
            pdf.setFontSize(10);
            pdf.text(
              `Page ${pageIndex + 1} of ${document.pages.length} (continued)`,
              pageWidth / 2,
              pageHeight - 10,
              { align: 'center' }
            );
          }
        }
      } finally {
        // Clean up temporary container
        (document as any).body.removeChild(tempContainer);
      }
    }

    // Save the PDF
    const fileName = `${document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    pdf.save(fileName);

    console.log("PDF export completed successfully:", fileName);
  } catch (error) {
    console.error("Error exporting PDF:", error);
    throw new Error("Failed to export PDF");
  }
}

/**
 * Alternative export method using direct HTML rendering
 */
export async function exportDocumentToPDFAlternative(
  document: Document
): Promise<void> {
  try {
    console.log("Starting alternative PDF export for document:", document.title);

    // Create a new jsPDF instance
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 7;
    let currentY = margin + 30; // Start after title

    // Add title page
    pdf.setFontSize(24);
    pdf.text(document.title, pageWidth / 2, 50, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text(`Created: ${new Date().toLocaleDateString()}`, pageWidth / 2, 60, { align: 'center' });
    pdf.text(`Pages: ${document.pages.length}`, pageWidth / 2, 70, { align: 'center' });

    // Add content pages
    for (let pageIndex = 0; pageIndex < document.pages.length; pageIndex++) {
      if (pageIndex > 0) {
        pdf.addPage();
        currentY = margin;
      }

      const page = document.pages[pageIndex];
      const textContent = convertTiptapToText(page.content);

      // Add page header
      pdf.setFontSize(14);
      pdf.text(`Page ${pageIndex + 1}`, margin, currentY);
      currentY += lineHeight * 2;

      // Add content
      pdf.setFontSize(12);
      const lines = textContent.split('\n');

      for (const line of lines) {
        if (currentY > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }

        // Handle long lines by wrapping text
        const textLines = pdf.splitTextToSize(line, pageWidth - 2 * margin);
        
        for (const textLine of textLines) {
          if (currentY > pageHeight - margin) {
            pdf.addPage();
            currentY = margin;
          }
          
          pdf.text(textLine, margin, currentY);
          currentY += lineHeight;
        }
      }

      // Add page number
      pdf.setFontSize(10);
      pdf.text(
        `Page ${pageIndex + 1} of ${document.pages.length}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Save the PDF
    const fileName = `${document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    pdf.save(fileName);

    console.log("Alternative PDF export completed successfully:", fileName);
  } catch (error) {
    console.error("Error in alternative PDF export:", error);
    throw new Error("Failed to export PDF");
  }
}

/**
 * Convert Tiptap JSON content to HTML
 */
function convertTiptapToHTML(content: any): string {
  if (!content || !content.content) {
    return '';
  }

  return content.content.map((node: any) => convertNodeToHTML(node)).join('');
}

/**
 * Convert a single Tiptap node to HTML
 */
function convertNodeToHTML(node: any): string {
  switch (node.type) {
    case 'paragraph':
      return `<p>${node.content ? node.content.map((n: any) => convertNodeToHTML(n)).join('') : ''}</p>`;
    
    case 'heading':
      const level = node.attrs?.level || 1;
      return `<h${level}>${node.content ? node.content.map((n: any) => convertNodeToHTML(n)).join('') : ''}</h${level}>`;
    
    case 'text':
      let text = node.text || '';
      if (node.marks) {
        for (const mark of node.marks) {
          switch (mark.type) {
            case 'bold':
              text = `<strong>${text}</strong>`;
              break;
            case 'italic':
              text = `<em>${text}</em>`;
              break;
            case 'underline':
              text = `<u>${text}</u>`;
              break;
            case 'link':
              text = `<a href="${mark.attrs?.href || '#'}">${text}</a>`;
              break;
          }
        }
      }
      return text;
    
    case 'bulletList':
      return `<ul>${node.content ? node.content.map((n: any) => convertNodeToHTML(n)).join('') : ''}</ul>`;
    
    case 'orderedList':
      return `<ol>${node.content ? node.content.map((n: any) => convertNodeToHTML(n)).join('') : ''}</ol>`;
    
    case 'listItem':
      return `<li>${node.content ? node.content.map((n: any) => convertNodeToHTML(n)).join('') : ''}</li>`;
    
    case 'blockquote':
      return `<blockquote>${node.content ? node.content.map((n: any) => convertNodeToHTML(n)).join('') : ''}</blockquote>`;
    
    case 'table':
      return `<table border="1" style="border-collapse: collapse; width: 100%;">${node.content ? node.content.map((n: any) => convertNodeToHTML(n)).join('') : ''}</table>`;
    
    case 'tableRow':
      return `<tr>${node.content ? node.content.map((n: any) => convertNodeToHTML(n)).join('') : ''}</tr>`;
    
    case 'tableCell':
      return `<td style="padding: 8px; border: 1px solid #ddd;">${node.content ? node.content.map((n: any) => convertNodeToHTML(n)).join('') : ''}</td>`;
    
    case 'tableHeader':
      return `<th style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5;">${node.content ? node.content.map((n: any) => convertNodeToHTML(n)).join('') : ''}</th>`;
    
    case 'image':
      return `<img src="${node.attrs?.src || ''}" style="max-width: 100%; height: auto;" />`;
    
    case 'hardBreak':
      return '<br>';
    
    default:
      return node.content ? node.content.map((n: any) => convertNodeToHTML(n)).join('') : '';
  }
}

/**
 * Convert Tiptap JSON content to plain text
 */
function convertTiptapToText(content: any): string {
  if (!content || !content.content) {
    return '';
  }

  return content.content.map((node: any) => convertNodeToText(node)).join('');
}

/**
 * Convert a single Tiptap node to plain text
 */
function convertNodeToText(node: any): string {
  switch (node.type) {
    case 'paragraph':
      return `${node.content ? node.content.map((n: any) => convertNodeToText(n)).join('') : ''}\n\n`;
    
    case 'heading':
      return `${node.content ? node.content.map((n: any) => convertNodeToText(n)).join('') : ''}\n\n`;
    
    case 'text':
      return node.text || '';
    
    case 'bulletList':
      return node.content ? node.content.map((n: any) => `• ${convertNodeToText(n)}`).join('') : '';
    
    case 'orderedList':
      return node.content ? node.content.map((n: any, index: number) => `${index + 1}. ${convertNodeToText(n)}`).join('') : '';
    
    case 'listItem':
      return `${node.content ? node.content.map((n: any) => convertNodeToText(n)).join('') : ''}\n`;
    
    case 'blockquote':
      return `"${node.content ? node.content.map((n: any) => convertNodeToText(n)).join('') : ''}"\n\n`;
    
    case 'table':
      return node.content ? node.content.map((n: any) => convertNodeToText(n)).join('') : '';
    
    case 'tableRow':
      return node.content ? node.content.map((n: any) => convertNodeToText(n)).join('\t') + '\n' : '';
    
    case 'tableCell':
    case 'tableHeader':
      return node.content ? node.content.map((n: any) => convertNodeToText(n)).join('') : '\t';
    
    case 'image':
      return `[Image: ${node.attrs?.src || ''}]\n\n`;
    
    case 'hardBreak':
      return '\n';
    
    default:
      return node.content ? node.content.map((n: any) => convertNodeToText(n)).join('') : '';
  }
}