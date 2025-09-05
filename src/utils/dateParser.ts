/**
 * Parse various date formats and convert to YYYY-MM-DD
 * Handles DD/MM/YYYY, MM/DD/YYYY, DD-MM-YYYY, and other common formats
 */
export const parseDate = (dateString: string): string => {
  if (!dateString || dateString.toLowerCase() === 'unknown') {
    return 'unknown';
  }

  // Clean the date string
  let cleanDate = dateString.trim().replace(/[^\d\/\-\.]/g, '');
  
  // Handle different separators
  const separators = ['/', '-', '.'];
  let parts: string[] = [];
  
  for (const sep of separators) {
    if (cleanDate.includes(sep)) {
      parts = cleanDate.split(sep);
      break;
    }
  }
  
  if (parts.length !== 3) {
    return 'unknown';
  }
  
  let day: number, month: number, year: number;
  
  // Try to determine format based on values
  const first = parseInt(parts[0]);
  const second = parseInt(parts[1]);
  const third = parseInt(parts[2]);
  
  // Handle 2-digit years
  let fullYear = third;
  if (third < 100) {
    if (third >= 0 && third <= 29) {
      fullYear = 2000 + third;
    } else {
      fullYear = 1900 + third;
    }
  }
  
  // Determine format based on values
  if (first > 12 && second <= 12) {
    // DD/MM/YYYY format (day > 12, month <= 12)
    day = first;
    month = second;
    year = fullYear;
  } else if (first <= 12 && second > 12) {
    // MM/DD/YYYY format (month <= 12, day > 12)
    day = second;
    month = first;
    year = fullYear;
  } else if (first <= 12 && second <= 12) {
    // Ambiguous case - try to determine based on context
    // For food items, DD/MM/YYYY is more common internationally
    // But we'll default to MM/DD/YYYY for US format
    if (first > second) {
      // Likely DD/MM/YYYY
      day = first;
      month = second;
      year = fullYear;
    } else {
      // Likely MM/DD/YYYY
      day = second;
      month = first;
      year = fullYear;
    }
  } else {
    // Default to DD/MM/YYYY for international format
    day = first;
    month = second;
    year = fullYear;
  }
  
  // Validate the date
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return 'unknown';
  }
  
  // Check if the date is valid
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return 'unknown';
  }
  
  // Format as YYYY-MM-DD
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

/**
 * Parse date with context clues to determine format
 * Looks for keywords that might indicate the format
 */
export const parseDateWithContext = (dateString: string, context: string = ''): string => {
  if (!dateString || dateString.toLowerCase() === 'unknown') {
    return 'unknown';
  }
  
  const lowerContext = context.toLowerCase();
  
  // If context contains "USE BY" or similar, it's likely DD/MM/YYYY (international)
  if (lowerContext.includes('use by') || lowerContext.includes('expires') || 
      lowerContext.includes('best before') || lowerContext.includes('exp date')) {
    // Force DD/MM/YYYY interpretation
    return parseDate(dateString);
  }
  
  // Default parsing
  return parseDate(dateString);
};

/**
 * Format date for display
 */
export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString || dateString === 'unknown') {
    return 'Unknown';
  }
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};
