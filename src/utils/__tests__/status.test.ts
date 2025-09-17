import { describe, it, expect } from 'vitest';
import {
    leadStatusOptions,
    leadStatusFilterOptions,
    getStatusBadgeVariant,
    getStatusLabel
} from '../status';
import { LeadStatus } from '../../types';

describe('leadStatusOptions', () => {
    it('should contain all lead status options without "all"', () => {
        expect(leadStatusOptions).toHaveLength(4);
        expect(leadStatusOptions).toEqual([
            { value: 'new', label: 'New' },
            { value: 'contacted', label: 'Contacted' },
            { value: 'qualified', label: 'Qualified' },
            { value: 'unqualified', label: 'Unqualified' },
        ]);
    });

    it('should have consistent value and label structure', () => {
        leadStatusOptions.forEach(option => {
            expect(option).toHaveProperty('value');
            expect(option).toHaveProperty('label');
            expect(typeof option.value).toBe('string');
            expect(typeof option.label).toBe('string');
        });
    });
});

describe('leadStatusFilterOptions', () => {
    it('should contain all lead status options plus "all"', () => {
        expect(leadStatusFilterOptions).toHaveLength(5);
        expect(leadStatusFilterOptions[0]).toEqual({ value: 'all', label: 'All Statuses' });
    });

    it('should include all leadStatusOptions after "all"', () => {
        const withoutAll = leadStatusFilterOptions.slice(1);
        expect(withoutAll).toEqual(leadStatusOptions);
    });
});

describe('getStatusBadgeVariant', () => {
    it('should return correct badge variants for each status', () => {
        expect(getStatusBadgeVariant('new')).toBe('secondary');
        expect(getStatusBadgeVariant('contacted')).toBe('outline');
        expect(getStatusBadgeVariant('qualified')).toBe('default');
        expect(getStatusBadgeVariant('unqualified')).toBe('destructive');
    });

    it('should return secondary for invalid status', () => {
        // TypeScript would prevent this, but testing runtime behavior
        expect(getStatusBadgeVariant('invalid' as LeadStatus)).toBe('secondary');
    });

    it('should handle all defined lead statuses', () => {
        leadStatusOptions.forEach(option => {
            const variant = getStatusBadgeVariant(option.value);
            expect(['default', 'secondary', 'outline', 'destructive']).toContain(variant);
        });
    });
});

describe('getStatusLabel', () => {
    it('should return correct labels for each status', () => {
        expect(getStatusLabel('new')).toBe('New');
        expect(getStatusLabel('contacted')).toBe('Contacted');
        expect(getStatusLabel('qualified')).toBe('Qualified');
        expect(getStatusLabel('unqualified')).toBe('Unqualified');
    });

    it('should return the status itself if not found in options', () => {
        expect(getStatusLabel('invalid' as LeadStatus)).toBe('invalid');
    });

    it('should handle all defined lead statuses', () => {
        leadStatusOptions.forEach(option => {
            const label = getStatusLabel(option.value);
            expect(label).toBe(option.label);
        });
    });

    it('should be consistent with leadStatusOptions', () => {
        leadStatusOptions.forEach(option => {
            expect(getStatusLabel(option.value)).toBe(option.label);
        });
    });
});