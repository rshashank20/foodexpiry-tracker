/**
 * Calculate the number of days left until expiry
 * @param {string} expiryDate - The expiry date in YYYY-MM-DD format
 * @returns {number} - Number of days left (negative if expired)
 */
export const calculateDaysLeft = (expiryDate) => {
  if (!expiryDate || expiryDate === 'unknown') {
    return null; // Return null for unknown expiry dates
  }
  
  const today = new Date();
  const expiry = new Date(expiryDate);
  
  // Reset time to start of day for accurate day calculation
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  
  const timeDiff = expiry.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  return daysLeft;
};

/**
 * Get expiry status based on days left
 * @param {number} daysLeft - Number of days left until expiry
 * @returns {string} - Status: 'expired', 'expiring-today', 'expiring-soon', 'fresh'
 */
export const getExpiryStatus = (daysLeft) => {
  if (daysLeft === null) return 'unknown';
  if (daysLeft < 0) return 'expired';
  if (daysLeft === 0) return 'expiring-today';
  if (daysLeft <= 3) return 'expiring-soon';
  return 'fresh';
};

/**
 * Get color class for expiry status
 * @param {number} daysLeft - Number of days left until expiry
 * @returns {string} - CSS class for styling
 */
export const getExpiryColorClass = (daysLeft) => {
  const status = getExpiryStatus(daysLeft);
  
  switch (status) {
    case 'expired':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'expiring-today':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'expiring-soon':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'fresh':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

/**
 * Format expiry date for display
 * @param {string} expiryDate - The expiry date in YYYY-MM-DD format
 * @returns {string} - Formatted date string
 */
export const formatExpiryDate = (expiryDate) => {
  if (!expiryDate || expiryDate === 'unknown') {
    return 'Unknown';
  }
  
  return new Date(expiryDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
