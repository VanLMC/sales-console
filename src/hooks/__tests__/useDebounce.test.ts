import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

// Mock lodash.debounce
interface MockDebouncedFunction {
    (...args: any[]): void;
    cancel: () => void;
}

const mockDebouncedFunction = vi.fn() as unknown as MockDebouncedFunction;
mockDebouncedFunction.cancel = vi.fn();

vi.mock('lodash.debounce', () => ({
    default: vi.fn(() => mockDebouncedFunction)
}));

import debounce from 'lodash.debounce';
const mockDebounce = vi.mocked(debounce);

describe('useDebounce', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockDebounce.mockReturnValue(mockDebouncedFunction);
    });

    it('creates debounced function with correct delay', () => {
        const mockFunction = vi.fn();
        const delay = 500;

        renderHook(() => useDebounce(mockFunction, delay));

        expect(mockDebounce).toHaveBeenCalledWith(expect.any(Function), delay);
    });

    it('returns memoized debounced function', () => {
        const mockFunction = vi.fn();

        const { result, rerender } = renderHook(
            ({ fn, delay }) => useDebounce(fn, delay),
            { initialProps: { fn: mockFunction, delay: 500 } }
        );

        const firstResult = result.current;

        // Rerender with same props
        rerender({ fn: mockFunction, delay: 500 });

        expect(result.current).toBe(firstResult);
    });

    it('calls debounce again when callback changes', () => {
        const mockFunction1 = vi.fn();
        const mockFunction2 = vi.fn();

        const { rerender } = renderHook(
            ({ fn, delay }) => useDebounce(fn, delay),
            { initialProps: { fn: mockFunction1, delay: 500 } }
        );

        expect(mockDebounce).toHaveBeenCalledTimes(1);

        // Rerender with different function
        rerender({ fn: mockFunction2, delay: 500 });

        expect(mockDebounce).toHaveBeenCalledTimes(2);
    });

    it('calls debounce again when delay changes', () => {
        const mockFunction = vi.fn();

        const { rerender } = renderHook(
            ({ fn, delay }) => useDebounce(fn, delay),
            { initialProps: { fn: mockFunction, delay: 500 } }
        );

        expect(mockDebounce).toHaveBeenCalledTimes(1);

        // Rerender with different delay
        rerender({ fn: mockFunction, delay: 1000 });

        expect(mockDebounce).toHaveBeenCalledTimes(3);
        expect(mockDebounce).toHaveBeenLastCalledWith(expect.any(Function), 1000);
        expect(mockDebouncedFunction.cancel).toHaveBeenCalled();
    });

    it('handles function with arguments', () => {
        const mockFunction = vi.fn();

        const { result } = renderHook(() => useDebounce(mockFunction, 300));

        result.current('arg1', 'arg2', 123);

        expect(mockDebouncedFunction).toHaveBeenCalledWith('arg1', 'arg2', 123);
    });

    it('works with different function types', () => {
        const asyncFunction = async (value: string) => Promise.resolve(value);

        renderHook(() => useDebounce(asyncFunction, 200));

        expect(mockDebounce).toHaveBeenCalledWith(expect.any(Function), 200);
    });
});