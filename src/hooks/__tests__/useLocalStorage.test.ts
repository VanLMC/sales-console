import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

describe('useLocalStorage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        localStorageMock.clear();
    });

    it('returns initial value when localStorage is empty', () => {
        localStorageMock.getItem.mockReturnValue(null);

        const { result } = renderHook(() =>
            useLocalStorage('test-key', 'initial-value')
        );

        expect(result.current[0]).toBe('initial-value');
        expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
    });

    it('returns parsed value from localStorage', () => {
        const storedValue = { name: 'John', age: 30 };
        localStorageMock.getItem.mockReturnValue(JSON.stringify(storedValue));

        const { result } = renderHook(() =>
            useLocalStorage('test-key', { name: '', age: 0 })
        );

        expect(result.current[0]).toEqual(storedValue);
    });

    it('handles invalid JSON in localStorage', () => {
        localStorageMock.getItem.mockReturnValue('invalid-json');
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

        const { result } = renderHook(() =>
            useLocalStorage('test-key', 'default-value')
        );

        expect(result.current[0]).toBe('default-value');
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });

    it('updates localStorage when value changes', () => {
        localStorageMock.getItem.mockReturnValue(null);

        const { result } = renderHook(() =>
            useLocalStorage('test-key', 'initial')
        );

        act(() => {
            result.current[1]('updated-value');
        });

        expect(result.current[0]).toBe('updated-value');
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'test-key',
            JSON.stringify('updated-value')
        );
    });

    it('updates localStorage with function updater', () => {
        localStorageMock.getItem.mockReturnValue(JSON.stringify('initial'));

        const { result } = renderHook(() =>
            useLocalStorage('test-key', 'default')
        );

        act(() => {
            result.current[1]((prev: string) => prev + '-updated');
        });

        expect(result.current[0]).toBe('initial-updated');
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'test-key',
            JSON.stringify('initial-updated')
        );
    });

    it('handles localStorage setItem errors', () => {
        localStorageMock.getItem.mockReturnValue(null);
        localStorageMock.setItem.mockImplementation(() => {
            throw new Error('Storage quota exceeded');
        });
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

        const { result } = renderHook(() =>
            useLocalStorage('test-key', 'initial')
        );

        act(() => {
            result.current[1]('new-value');
        });

        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('works with complex objects', () => {
        const complexObject = {
            user: { name: 'John', preferences: { theme: 'dark' } },
            settings: [1, 2, 3],
            timestamp: new Date().toISOString()
        };

        localStorageMock.getItem.mockReturnValue(null);

        const { result } = renderHook(() =>
            useLocalStorage('complex-key', {})
        );

        act(() => {
            result.current[1](complexObject);
        });

        expect(result.current[0]).toEqual(complexObject);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'complex-key',
            JSON.stringify(complexObject)
        );
    });
});