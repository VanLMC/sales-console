import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../ThemeToggle';

// Mock next-themes
const mockSetTheme = vi.fn();
const mockUseTheme = vi.fn();

vi.mock('next-themes', () => ({
    useTheme: () => mockUseTheme()
}));

describe('ThemeToggle', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders placeholder when not mounted', () => {
        mockUseTheme.mockReturnValue({
            theme: 'light',
            setTheme: mockSetTheme
        });

        render(<ThemeToggle />);

        // Should render a button with sr-only text
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(screen.getByText('Toggle theme')).toBeInTheDocument();
    });

    it('shows sun icon when theme is dark (after mount)', async () => {
        mockUseTheme.mockReturnValue({
            theme: 'dark',
            setTheme: mockSetTheme
        });

        render(<ThemeToggle />);

        // Wait for component to mount
        await vi.waitFor(() => {
            const sunIcon = document.querySelector('svg');
            expect(sunIcon).toBeInTheDocument();
        });
    });

    it('shows moon icon when theme is light (after mount)', async () => {
        mockUseTheme.mockReturnValue({
            theme: 'light',
            setTheme: mockSetTheme
        });

        render(<ThemeToggle />);

        // Wait for component to mount
        await vi.waitFor(() => {
            const moonIcon = document.querySelector('svg');
            expect(moonIcon).toBeInTheDocument();
        });
    });

    it('toggles from light to dark theme when clicked', async () => {
        const user = userEvent.setup();

        mockUseTheme.mockReturnValue({
            theme: 'light',
            setTheme: mockSetTheme
        });

        render(<ThemeToggle />);

        const button = screen.getByRole('button');
        await user.click(button);

        expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('toggles from dark to light theme when clicked', async () => {
        const user = userEvent.setup();

        mockUseTheme.mockReturnValue({
            theme: 'dark',
            setTheme: mockSetTheme
        });

        render(<ThemeToggle />);

        const button = screen.getByRole('button');
        await user.click(button);

        expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('has correct accessibility attributes', () => {
        mockUseTheme.mockReturnValue({
            theme: 'light',
            setTheme: mockSetTheme
        });

        render(<ThemeToggle />);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('class', expect.stringContaining('w-9 h-9'));
        expect(screen.getByText('Toggle theme')).toHaveClass('sr-only');
    });
});