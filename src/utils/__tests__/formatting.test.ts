import { describe, it, expect } from 'vitest';
import { formatCurrency, formatSimpleCurrency } from '../formatting';

describe('formatCurrency', () => {
    it('should format positive numbers as USD currency', () => {
        expect(formatCurrency(100)).toBe('$100.00');
        expect(formatCurrency(1234.56)).toBe('$1,234.56');
        expect(formatCurrency(1000000)).toBe('$1,000,000.00');
        expect(formatCurrency(0.99)).toBe('$0.99');
    });

    it('should handle zero', () => {
        expect(formatCurrency(0)).toBe('-'); // Zero is falsy, so returns '-'
    });

    it('should return "-" for undefined or null', () => {
        expect(formatCurrency(undefined)).toBe('-');
        expect(formatCurrency()).toBe('-');
    });

    it('should handle decimal precision', () => {
        expect(formatCurrency(123.456)).toBe('$123.46'); // Rounds to 2 decimal places
        expect(formatCurrency(123.454)).toBe('$123.45'); // Rounds down
        expect(formatCurrency(123.1)).toBe('$123.10'); // Adds trailing zero
    });

    it('should handle large numbers', () => {
        expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
        expect(formatCurrency(999999999.99)).toBe('$999,999,999.99');
    });
});

describe('formatSimpleCurrency', () => {
    it('should format positive numbers with $ prefix and commas', () => {
        expect(formatSimpleCurrency(100)).toBe('$100');
        expect(formatSimpleCurrency(1234)).toBe('$1,234');
        expect(formatSimpleCurrency(1000000)).toBe('$1,000,000');
        expect(formatSimpleCurrency(1234.56)).toBe('$1,234.56');
    });

    it('should handle zero', () => {
        expect(formatSimpleCurrency(0)).toBe('Not specified'); // Zero is falsy
    });

    it('should return "Not specified" for undefined or null', () => {
        expect(formatSimpleCurrency(undefined)).toBe('Not specified');
        expect(formatSimpleCurrency()).toBe('Not specified');
    });

    it('should preserve decimal places as provided by toLocaleString', () => {
        expect(formatSimpleCurrency(123.45)).toBe('$123.45');
        expect(formatSimpleCurrency(123.1)).toBe('$123.1'); // No trailing zero
        expect(formatSimpleCurrency(123.0)).toBe('$123'); // No decimal for whole numbers
    });

    it('should handle large numbers', () => {
        expect(formatSimpleCurrency(1234567.89)).toBe('$1,234,567.89');
        expect(formatSimpleCurrency(999999999)).toBe('$999,999,999');
    });
});