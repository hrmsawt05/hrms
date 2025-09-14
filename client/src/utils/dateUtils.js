/**
 * Formats a date string or Date object into a more readable format.
 * Example: "2025-09-06T12:00:00.000Z" becomes "Sep 06, 2025"
 * @param {string | Date} dateInput The date to format.
 * @returns {string} The formatted date string.
 */
export const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    
    const date = new Date(dateInput);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    }).format(date);
};

