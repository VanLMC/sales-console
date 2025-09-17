import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useLeads } from '../useLeads';

// Mock the leads data
vi.mock('../../data/leads.json', () => ({
    default: [
        {
            id: '1',
            name: 'John Doe',
            company: 'Acme Corp',
            email: 'john@acme.com',
            source: 'Website',
            score: 85,
            status: 'new',
            amount: 5000
        },
        {
            id: '2',
            name: 'Jane Smith',
            company: 'Tech Solutions',
            email: 'jane@tech.com',
            source: 'Referral',
            score: 92,
            status: 'qualified',
            amount: 10000
        }
    ]
}));

describe('useLeads', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('starts with loading state', () => {
        const { result } = renderHook(() => useLeads());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.leads).toEqual([]);
        expect(result.current.error).toBe(null);
    });

    it('loads leads successfully', async () => {
        const { result } = renderHook(() => useLeads());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.leads).toHaveLength(2);
        expect(result.current.leads[0]).toEqual({
            id: '1',
            name: 'John Doe',
            company: 'Acme Corp',
            email: 'john@acme.com',
            source: 'Website',
            score: 85,
            status: 'new',
            amount: 5000
        });
        expect(result.current.error).toBe(null);
    });

    it('updates a lead correctly', async () => {
        const { result } = renderHook(() => useLeads());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        act(() => {
            const updates = { email: 'newemail@acme.com', status: 'qualified' as const };
            result.current.updateLead('1', updates);
        });

        expect(result.current.leads[0]).toEqual({
            id: '1',
            name: 'John Doe',
            company: 'Acme Corp',
            email: 'newemail@acme.com',
            source: 'Website',
            score: 85,
            status: 'qualified',
            amount: 5000
        });
    });

    it('removes a lead correctly', async () => {
        const { result } = renderHook(() => useLeads());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.leads).toHaveLength(2);

        act(() => {
            result.current.removeLead('1');
        });

        expect(result.current.leads).toHaveLength(1);
        expect(result.current.leads[0].id).toBe('2');
    });

    it('does not update non-existent lead', async () => {
        const { result } = renderHook(() => useLeads());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        const originalLeads = [...result.current.leads];

        act(() => {
            result.current.updateLead('non-existent', { email: 'test@test.com' });
        });

        expect(result.current.leads).toEqual(originalLeads);
    });

    it('does not remove non-existent lead', async () => {
        const { result } = renderHook(() => useLeads());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        const originalLeads = [...result.current.leads];

        act(() => {
            result.current.removeLead('non-existent');
        });

        expect(result.current.leads).toEqual(originalLeads);
    });
});