import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../ThemeProvider';

// Mock next-themes
vi.mock('next-themes', () => ({
    ThemeProvider: ({ children, ...props }: any) => (
        <div data-testid="theme-provider" data-props={JSON.stringify(props)}>
            {children}
        </div>
    )
}));

describe('ThemeProvider', () => {
    it('renders children correctly', () => {
        render(
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <div>Test Child</div>
            </ThemeProvider>
        );

        expect(screen.getByText('Test Child')).toBeInTheDocument();
        expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    });

    it('passes props to NextThemesProvider', () => {
        render(
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem={false}
                storageKey="custom-theme"
            >
                <div>Test Child</div>
            </ThemeProvider>
        );

        const provider = screen.getByTestId('theme-provider');
        const propsData = JSON.parse(provider.getAttribute('data-props') || '{}');

        expect(propsData.attribute).toBe('class');
        expect(propsData.defaultTheme).toBe('dark');
        expect(propsData.enableSystem).toBe(false);
        expect(propsData.storageKey).toBe('custom-theme');
    });

    it('renders without props', () => {
        render(
            <ThemeProvider>
                <div>Test Child</div>
            </ThemeProvider>
        );

        expect(screen.getByText('Test Child')).toBeInTheDocument();
        expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    });
});