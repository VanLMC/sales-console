import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLeadsFilters } from '../useLeadsFilters';

// Mock useLocalStorage
const mockSetFilters = vi.fn();
const mockUseLocalStorage = vi.fn();

vi.mock('../useLocalStorage', () => ({
    useLocalStorage: () => mockUseLocalStorage()
}));

describe('useLeadsFilters', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseLocalStorage.mockReturnValue([
            {
                searchTerm: '',
                statusFilter: 'all',
                sortOrder: 'desc'
            },
            mockSetFilters
        ]);
    });

    it('returns default filters initially', () => {
        const { result } = renderHook(() => useLeadsFilters());

        expect(result.current.searchTerm).toBe('');
        expect(result.current.statusFilter).toBe('all');
        expect(result.current.sortOrder).toBe('desc');
    });

    it('updates search term', () => {
        const { result } = renderHook(() => useLeadsFilters());

        act(() => {
            result.current.updateSearchTerm('test search');
        });

        expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));
    });

    it('updates status filter', () => {
        const { result } = renderHook(() => useLeadsFilters());

        act(() => {
            result.current.updateStatusFilter('qualified');
        });

        expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));
    });

    it('updates sort order', () => {
        const { result } = renderHook(() => useLeadsFilters());

        act(() => {
            result.current.updateSortOrder('asc');
        });

        expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));
    });

    it('resets filters to default', () => {
        const { result } = renderHook(() => useLeadsFilters());

        act(() => {
            result.current.resetFilters();
        });

        expect(mockSetFilters).toHaveBeenCalledWith({
            searchTerm: '',
            statusFilter: 'all',
            sortOrder: 'desc'
        });
    });

    it('works with persisted filters', () => {
        mockUseLocalStorage.mockReturnValue([
            {
                searchTerm: 'existing search',
                statusFilter: 'qualified',
                sortOrder: 'asc'
            },
            mockSetFilters
        ]);

        const { result } = renderHook(() => useLeadsFilters());

        expect(result.current.searchTerm).toBe('existing search');
        expect(result.current.statusFilter).toBe('qualified');
        expect(result.current.sortOrder).toBe('asc');
    });
});