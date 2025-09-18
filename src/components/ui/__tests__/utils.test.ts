import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn utility function', () => {
    it('combines multiple class names', () => {
        const result = cn('class1', 'class2', 'class3');
        expect(result).toBe('class1 class2 class3');
    });

    it('handles conditional classes', () => {
        const isActive = true;
        const isDisabled = false;

        const result = cn(
            'base-class',
            isActive && 'active-class',
            isDisabled && 'disabled-class'
        );

        expect(result).toBe('base-class active-class');
    });

    it('handles object-style conditional classes', () => {
        const result = cn({
            'base-class': true,
            'active-class': true,
            'disabled-class': false,
            'hidden-class': false
        });

        expect(result).toBe('base-class active-class');
    });

    it('merges conflicting Tailwind classes correctly', () => {
        // twMerge should resolve conflicts by keeping the last one
        const result = cn('px-2 px-4', 'py-1 py-2');
        expect(result).toBe('px-4 py-2');
    });

    it('handles complex Tailwind class conflicts', () => {
        const result = cn(
            'bg-red-500 text-white',
            'bg-blue-500', // Should override bg-red-500
            'text-black'   // Should override text-white
        );

        expect(result).toBe('bg-blue-500 text-black');
    });

    it('handles array inputs', () => {
        const result = cn(['class1', 'class2'], ['class3', 'class4']);
        expect(result).toBe('class1 class2 class3 class4');
    });

    it('handles mixed input types', () => {
        const result = cn(
            'base-class',
            ['array-class1', 'array-class2'],
            {
                'object-class': true,
                'false-class': false
            },
            'final-class'
        );

        expect(result).toBe('base-class array-class1 array-class2 object-class final-class');
    });

    it('handles undefined and null values', () => {
        const result = cn('class1', undefined, null, 'class2');
        expect(result).toBe('class1 class2');
    });

    it('handles empty strings and falsy values', () => {
        const result = cn('class1', '', false, 0, 'class2');
        expect(result).toBe('class1 class2');
    });

    it('handles duplicate classes (clsx behavior)', () => {
        // clsx doesn't deduplicate by default, it just combines
        const result = cn('class1', 'class2', 'class1', 'class3', 'class2');
        expect(result).toBe('class1 class2 class1 class3 class2');
    });

    it('handles responsive and state variants correctly', () => {
        const result = cn(
            'text-sm md:text-base lg:text-lg',
            'hover:text-blue-500 focus:text-blue-600',
            'dark:text-white'
        );

        expect(result).toBe('text-sm md:text-base lg:text-lg hover:text-blue-500 focus:text-blue-600 dark:text-white');
    });

    it('resolves complex Tailwind conflicts with modifiers', () => {
        const result = cn(
            'hover:bg-red-500 hover:bg-blue-500', // Should keep hover:bg-blue-500
            'md:px-2 md:px-4',                    // Should keep md:px-4
            'dark:text-white dark:text-black'     // Should keep dark:text-black
        );

        expect(result).toBe('hover:bg-blue-500 md:px-4 dark:text-black');
    });

    it('handles component variant patterns', () => {
        // Simulating typical component variant usage
        const variant = 'secondary';
        const size = 'lg';
        const disabled = false;

        const result = cn(
            // Base classes
            'inline-flex items-center justify-center rounded-md font-medium transition-colors',
            // Variant classes
            {
                'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
                'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
                'border border-input bg-background hover:bg-accent': variant === 'outline'
            },
            // Size classes
            {
                'h-8 px-3 text-xs': size === 'sm',
                'h-9 px-4 py-2': size === 'default',
                'h-10 px-8': size === 'lg'
            },
            // State classes
            disabled && 'pointer-events-none opacity-50'
        );

        expect(result).toContain('bg-secondary');
        expect(result).toContain('text-secondary-foreground');
        expect(result).toContain('h-10');
        expect(result).toContain('px-8');
        expect(result).not.toContain('opacity-50');
    });

    it('works with no arguments', () => {
        const result = cn();
        expect(result).toBe('');
    });

    it('works with single argument', () => {
        const result = cn('single-class');
        expect(result).toBe('single-class');
    });

    it('handles deeply nested conditional logic', () => {
        const theme = 'dark';
        const size = 'large';
        const isActive = true;
        const hasError = false;

        const result = cn(
            'base-component',
            theme === 'dark' && 'dark-theme',
            theme === 'light' && 'light-theme',
            {
                'size-small': size === 'small',
                'size-medium': size === 'medium',
                'size-large': size === 'large'
            },
            isActive && !hasError && 'active-state',
            hasError && 'error-state'
        );

        expect(result).toBe('base-component dark-theme size-large active-state');
    });

    it('preserves important modifiers', () => {
        const result = cn('text-red-500 !text-blue-500');
        expect(result).toBe('text-red-500 !text-blue-500');
    });

    it('handles arbitrary value classes', () => {
        const result = cn(
            'bg-[#1da1f2]',
            'text-[14px]',
            'w-[calc(100%-2rem)]'
        );

        expect(result).toBe('bg-[#1da1f2] text-[14px] w-[calc(100%-2rem)]');
    });
});