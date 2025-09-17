/**
 * Validates an email address using a standard regex pattern
 * @param email - The email string to validate
 * @returns true if the email is valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates that a number string is non-negative
 * @param value - The string value to validate
 * @returns true if the value is empty (optional) or a non-negative number
 */
export const validateNonNegativeNumber = (value: string): boolean => {
    if (value === '') return true; // Optional field

    // Check for whitespace-only strings
    if (value.trim() === '' && value !== '') return false;

    // Use regex to check if the string is a valid number format
    // Allows: digits, optional decimal point with digits, leading zeros
    const numberRegex = /^\d*\.?\d*$/;

    // Check if it's just a dot
    if (value.trim() === '.') return false;

    if (!numberRegex.test(value.trim())) {
        return false;
    }

    const num = Number(value);
    return !isNaN(num) && num >= 0;
};