import jsPDF from 'jspdf';

export interface ExportData {
  user: {
    uid: string;
    email: string;
    displayName: string;
    exportDate: string;
  };
  inventory: Array<{
    id: string;
    item_name: string;
    quantity: string;
    expiry_date: string;
    category: string;
    daysLeft: number;
    added_at?: string;
  }>;
  settings: {
    notifications: any;
    display: any;
    privacy: any;
    account: any;
  };
}

export const generatePDF = (data: ExportData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // Helper function to add text with word wrapping
  const addText = (text: string, x: number, y: number, maxWidth?: number, fontSize: number = 10) => {
    doc.setFontSize(fontSize);
    if (maxWidth) {
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * fontSize * 0.4);
    } else {
      doc.text(text, x, y);
      return y + fontSize * 0.4;
    }
  };

  // Helper function to add a line
  const addLine = (y: number) => {
    doc.setLineWidth(0.5);
    doc.line(20, y, pageWidth - 20, y);
    return y + 5;
  };

  // Title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('FreshTrack - Food Inventory Report', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Export date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date(data.user.exportDate).toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // User Information
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('User Information', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition = addText(`Name: ${data.user.displayName || 'Not provided'}`, 20, yPosition);
  yPosition = addText(`Email: ${data.user.email}`, 20, yPosition);
  yPosition = addText(`User ID: ${data.user.uid}`, 20, yPosition);
  yPosition += 10;

  // Summary Statistics
  checkPageBreak(30);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Statistics', 20, yPosition);
  yPosition += 10;

  const totalItems = data.inventory.length;
  const expiredItems = data.inventory.filter(item => item.daysLeft < 0).length;
  const expiringItems = data.inventory.filter(item => item.daysLeft >= 0 && item.daysLeft <= 7).length;
  const freshItems = data.inventory.filter(item => item.daysLeft > 7).length;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition = addText(`Total Items: ${totalItems}`, 20, yPosition);
  yPosition = addText(`Fresh Items (>7 days): ${freshItems}`, 20, yPosition);
  yPosition = addText(`Expiring Soon (1-7 days): ${expiringItems}`, 20, yPosition);
  yPosition = addText(`Expired Items: ${expiredItems}`, 20, yPosition);
  yPosition += 15;

  // Inventory Details
  checkPageBreak(20);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Inventory Details', 20, yPosition);
  yPosition += 10;

  if (data.inventory.length === 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('No items in inventory', 20, yPosition);
    yPosition += 10;
  } else {
    // Sort items by expiry date
    const sortedItems = [...data.inventory].sort((a, b) => a.daysLeft - b.daysLeft);

    sortedItems.forEach((item, index) => {
      checkPageBreak(25);

      // Item header
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      yPosition = addText(`${index + 1}. ${item.item_name}`, 20, yPosition);

      // Item details
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const statusColor = item.daysLeft < 0 ? '#dc2626' : item.daysLeft <= 7 ? '#f59e0b' : '#16a34a';
      const statusText = item.daysLeft < 0 
        ? `EXPIRED (${Math.abs(item.daysLeft)} days ago)`
        : item.daysLeft === 0 
        ? 'EXPIRES TODAY'
        : item.daysLeft <= 7 
        ? `Expires in ${item.daysLeft} days`
        : `Fresh (${item.daysLeft} days left)`;

      yPosition = addText(`Status: ${statusText}`, 30, yPosition);
      yPosition = addText(`Quantity: ${item.quantity}`, 30, yPosition);
      yPosition = addText(`Category: ${item.category}`, 30, yPosition);
      yPosition = addText(`Expiry Date: ${new Date(item.expiry_date).toLocaleDateString()}`, 30, yPosition);
      
      if (item.added_at) {
        yPosition = addText(`Added: ${new Date(item.added_at).toLocaleDateString()}`, 30, yPosition);
      }

      yPosition += 5;
      yPosition = addLine(yPosition);
    });
  }

  // Settings Summary
  checkPageBreak(30);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Settings Summary', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  if (data.settings.notifications) {
    yPosition = addText('Notification Settings:', 20, yPosition);
    yPosition = addText(`• Expiring Alerts: ${data.settings.notifications.expiringAlerts ? 'Enabled' : 'Disabled'}`, 30, yPosition);
    yPosition = addText(`• Expired Alerts: ${data.settings.notifications.expiredAlerts ? 'Enabled' : 'Disabled'}`, 30, yPosition);
    yPosition = addText(`• Recipe Suggestions: ${data.settings.notifications.recipeSuggestions ? 'Enabled' : 'Disabled'}`, 30, yPosition);
    yPosition = addText(`• Reminder Days: ${data.settings.notifications.reminderDays}`, 30, yPosition);
    yPosition += 5;
  }

  if (data.settings.display) {
    yPosition = addText('Display Settings:', 20, yPosition);
    yPosition = addText(`• Theme: ${data.settings.display.theme}`, 30, yPosition);
    yPosition = addText(`• Language: ${data.settings.display.language}`, 30, yPosition);
    yPosition = addText(`• Date Format: ${data.settings.display.dateFormat}`, 30, yPosition);
    yPosition += 5;
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text('Generated by FreshTrack - Smart Food Management', pageWidth / 2, pageHeight - 5, { align: 'center' });
  }

  return doc;
};

export const downloadPDF = (data: ExportData, filename?: string) => {
  const doc = generatePDF(data);
  const defaultFilename = `fresh-track-report-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename || defaultFilename);
};
