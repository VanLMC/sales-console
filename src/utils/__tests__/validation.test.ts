import { describe, it, expect } from 'vitest';
import { validateEmail, validateNonNegativeNumber } from '../validation';

describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
        expect(validateEmail('test@example.com')).toBe(true);
        expect(validateEmail('user.name@domain.co.uk')).toBe(true);
        expect(validateEmail('firstname+lastname@company.org')).toBe(true);
        expect(validateEmail('email@subdomain.example.com')).toBe(true);
        expect(validateEmail('firstname-lastname@example.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
        expect(validateEmail('')).toBe(false);
        expect(validateEmail('invalid')).toBe(false);
        expect(validateEmail('invalid@')).toBe(false);
        expect(validateEmail('@invalid.com')).toBe(false);
        expect(validateEmail('invalid@.com')).toBe(false);
        expect(validateEmail('invalid.com')).toBe(false);
        expect(validateEmail('invalid@com')).toBe(false);
        expect(validateEmail('invalid @example.com')).toBe(false);
        expect(validateEmail('invalid@exam ple.com')).toBe(false);
    });

    it('should handle edge cases', () => {
        expect(validateEmail('a@b.co')).toBe(true); // minimal valid email
        expect(validateEmail('test@test')).toBe(false); // no TLD
        expect(validateEmail('test..test@example.com')).toBe(true); // double dots in local part
    });
});

describe('validateNonNegativeNumber', () => {
    it('should return true for empty string (optional field)', () => {
        expect(validateNonNegativeNumber('')).toBe(true);
    });

    it('should return true for valid non-negative numbers', () => {
        expect(validateNonNegativeNumber('0')).toBe(true);
        expect(validateNonNegativeNumber('1')).toBe(true);
        expect(validateNonNegativeNumber('100')).toBe(true);
        expect(validateNonNegativeNumber('0.5')).toBe(true);
        expect(validateNonNegativeNumber('123.45')).toBe(true);
        expect(validateNonNegativeNumber('1000000')).toBe(true);
    });

    it('should return false for negative numbers', () => {
        expect(validateNonNegativeNumber('-1')).toBe(false);
        expect(validateNonNegativeNumber('-0.1')).toBe(false);
        expect(validateNonNegativeNumber('-100')).toBe(false);
        expect(validateNonNegativeNumber('-123.45')).toBe(false);
    });

    it('should return false for invalid number strings', () => {
        expect(validateNonNegativeNumber('abc')).toBe(false);
        expect(validateNonNegativeNumber('12abc')).toBe(false);
        expect(validateNonNegativeNumber('abc123')).toBe(false);
        expect(validateNonNegativeNumber('12.34.56')).toBe(false);
        expect(validateNonNegativeNumber('--1')).toBe(false);
    });

    it('should handle edge cases', () => {
        expect(validateNonNegativeNumber('0.0')).toBe(true);
        expect(validateNonNegativeNumber('00')).toBe(true);
        expect(validateNonNegativeNumber('0000.0000')).toBe(true);
        expect(validateNonNegativeNumber(' ')).toBe(false); // space is not empty
        expect(validateNonNegativeNumber('.')).toBe(false); // just a dot
    });
});