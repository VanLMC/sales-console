/**
 * Formats a number as USD currency
 * @param amount - The amount to format (optional)
 * @returns Formatted currency string or '-' if no amount
 */
export const formatCurrency = (amount?: number): string => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

/**
 * Formats a number as a simple currency display with $ prefix
 * @param amount - The amount to format (optional)
 * @returns Formatted currency string or 'Not specified' if no amount
 */
export const formatSimpleCurrency = (amount?: number): string => {
    if (!amount) return 'Not specified';
    return `$${amount.toLocaleString()}`;
};