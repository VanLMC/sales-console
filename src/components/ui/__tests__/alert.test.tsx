import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from '../alert';

describe('Alert Components', () => {
    describe('Alert', () => {
        it('renders with default variant and role', () => {
            render(<Alert>Alert content</Alert>);

            const alert = screen.getByRole('alert');
            expect(alert).toBeInTheDocument();
            expect(alert).toHaveAttribute('data-slot', 'alert');
            expect(alert).toHaveClass('bg-card');
            expect(alert).toHaveClass('text-card-foreground');
        });

        it('renders destructive variant correctly', () => {
            render(<Alert variant="destructive">Error alert</Alert>);

            const alert = screen.getByRole('alert');
            expect(alert).toHaveClass('text-destructive');
            expect(alert).toHaveClass('bg-card');
        });

        it('applies custom className', () => {
            render(<Alert className="custom-alert">Custom Alert</Alert>);

            const alert = screen.getByRole('alert');
            expect(alert).toHaveClass('custom-alert');
        });

        it('forwards other props correctly', () => {
            render(<Alert id="test-alert" aria-live="polite">Alert with props</Alert>);

            const alert = screen.getByRole('alert');
            expect(alert).toHaveAttribute('id', 'test-alert');
            expect(alert).toHaveAttribute('aria-live', 'polite');
        });

        it('has proper base styling', () => {
            render(<Alert>Styled Alert</Alert>);

            const alert = screen.getByRole('alert');
            expect(alert).toHaveClass('relative');
            expect(alert).toHaveClass('w-full');
            expect(alert).toHaveClass('rounded-lg');
            expect(alert).toHaveClass('border');
            expect(alert).toHaveClass('px-4');
            expect(alert).toHaveClass('py-3');
            expect(alert).toHaveClass('text-sm');
        });
    });

    describe('AlertTitle', () => {
        it('renders with proper styling', () => {
            render(<AlertTitle>Alert Title</AlertTitle>);

            const title = screen.getByText('Alert Title');
            expect(title).toBeInTheDocument();
            expect(title).toHaveAttribute('data-slot', 'alert-title');
            expect(title).toHaveClass('col-start-2');
            expect(title).toHaveClass('font-medium');
            expect(title).toHaveClass('tracking-tight');
        });

        it('applies custom className', () => {
            render(<AlertTitle className="custom-title">Custom Title</AlertTitle>);

            const title = screen.getByText('Custom Title');
            expect(title).toHaveClass('custom-title');
        });

        it('handles long text with line clamping', () => {
            render(<AlertTitle>Very long alert title that should be clamped</AlertTitle>);

            const title = screen.getByText('Very long alert title that should be clamped');
            expect(title).toHaveClass('line-clamp-1');
        });
    });

    describe('AlertDescription', () => {
        it('renders with proper styling', () => {
            render(<AlertDescription>Alert description text</AlertDescription>);

            const description = screen.getByText('Alert description text');
            expect(description).toBeInTheDocument();
            expect(description).toHaveAttribute('data-slot', 'alert-description');
            expect(description).toHaveClass('text-muted-foreground');
            expect(description).toHaveClass('col-start-2');
            expect(description).toHaveClass('text-sm');
        });

        it('applies custom className', () => {
            render(<AlertDescription className="custom-desc">Custom Description</AlertDescription>);

            const description = screen.getByText('Custom Description');
            expect(description).toHaveClass('custom-desc');
        });

        it('handles paragraph content correctly', () => {
            render(
                <AlertDescription>
                    <p>First paragraph</p>
                    <p>Second paragraph</p>
                </AlertDescription>
            );

            const description = screen.getByText('First paragraph').parentElement;
            expect(description).toHaveClass('[&_p]:leading-relaxed');
        });
    });

    describe('Complete Alert Structure', () => {
        it('renders a complete alert with all components', () => {
            render(
                <Alert>
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                        This is a warning message with important information.
                    </AlertDescription>
                </Alert>
            );

            const alert = screen.getByRole('alert');
            const title = screen.getByText('Warning');
            const description = screen.getByText('This is a warning message with important information.');

            expect(alert).toBeInTheDocument();
            expect(title).toBeInTheDocument();
            expect(description).toBeInTheDocument();
        });

        it('renders with icon correctly', () => {
            const IconComponent = () => <span data-testid="alert-icon">⚠️</span>;

            render(
                <Alert>
                    <IconComponent />
                    <AlertTitle>Alert with Icon</AlertTitle>
                    <AlertDescription>Description text</AlertDescription>
                </Alert>
            );

            const alert = screen.getByRole('alert');
            const icon = screen.getByTestId('alert-icon');
            const title = screen.getByText('Alert with Icon');

            expect(alert).toBeInTheDocument();
            expect(icon).toBeInTheDocument();
            expect(title).toBeInTheDocument();
            expect(alert).toHaveClass('has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr]');
        });

        it('maintains proper grid layout', () => {
            render(
                <Alert>
                    <AlertTitle>Grid Title</AlertTitle>
                    <AlertDescription>Grid Description</AlertDescription>
                </Alert>
            );

            const alert = screen.getByRole('alert');
            expect(alert).toHaveClass('grid');
            expect(alert).toHaveClass('grid-cols-[0_1fr]');
        });

        it('supports destructive variant with proper styling', () => {
            render(
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Something went wrong</AlertDescription>
                </Alert>
            );

            const alert = screen.getByRole('alert');
            const description = screen.getByText('Something went wrong');

            expect(alert).toHaveClass('text-destructive');
            expect(description.parentElement).toHaveClass('*:data-[slot=alert-description]:text-destructive/90');
        });

        it('maintains accessibility standards', () => {
            render(
                <Alert role="alert" aria-live="assertive">
                    <AlertTitle>Urgent Alert</AlertTitle>
                    <AlertDescription>This requires immediate attention</AlertDescription>
                </Alert>
            );

            const alert = screen.getByRole('alert');
            expect(alert).toHaveAttribute('aria-live', 'assertive');
        });
    });
});