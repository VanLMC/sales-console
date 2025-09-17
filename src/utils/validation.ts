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
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
};