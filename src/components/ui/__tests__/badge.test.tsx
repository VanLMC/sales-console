import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../badge';

describe('Badge', () => {
    it('renders with default variant', () => {
        render(<Badge>Default Badge</Badge>);

        const badge = screen.getByText('Default Badge');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveAttribute('data-slot', 'badge');
        expect(badge).toHaveClass('bg-primary');
    });

    it('renders different variants correctly', () => {
        const { rerender } = render(<Badge variant="secondary">Secondary</Badge>);

        let badge = screen.getByText('Secondary');
        expect(badge).toHaveClass('bg-secondary');

        rerender(<Badge variant="destructive">Destructive</Badge>);
        badge = screen.getByText('Destructive');
        expect(badge).toHaveClass('bg-destructive');

        rerender(<Badge variant="outline">Outline</Badge>);
        badge = screen.getByText('Outline');
        expect(badge).toHaveClass('text-foreground');
    });

    it('applies custom className', () => {
        render(<Badge className="custom-badge">Custom</Badge>);

        const badge = screen.getByText('Custom');
        expect(badge).toHaveClass('custom-badge');
    });

    it('forwards other props correctly', () => {
        render(<Badge aria-label="Status badge" title="Badge title">Status</Badge>);

        const badge = screen.getByText('Status');
        expect(badge).toHaveAttribute('aria-label', 'Status badge');
        expect(badge).toHaveAttribute('title', 'Badge title');
    });

    it('renders as child component when asChild is true', () => {
        render(
            <Badge asChild>
                <a href="/status">Link Badge</a>
            </Badge>
        );

        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/status');
        expect(link).toHaveAttribute('data-slot', 'badge');
    });

    it('has proper accessibility attributes', () => {
        render(<Badge>Accessible Badge</Badge>);

        const badge = screen.getByText('Accessible Badge');
        expect(badge).toHaveClass('focus-visible:border-ring');
        expect(badge).toHaveClass('aria-invalid:ring-destructive/20');
    });

    it('renders with icons correctly', () => {
        const IconComponent = () => <span data-testid="icon">★</span>;

        render(
            <Badge>
                <IconComponent />
                Badge with Icon
            </Badge>
        );

        const badge = screen.getByText('Badge with Icon');
        const icon = screen.getByTestId('icon');

        expect(badge).toBeInTheDocument();
        expect(icon).toBeInTheDocument();
        expect(badge).toHaveClass('[&>svg]:size-3');
    });

    it('has proper styling classes', () => {
        render(<Badge>Styled Badge</Badge>);

        const badge = screen.getByText('Styled Badge');
        expect(badge).toHaveClass('inline-flex');
        expect(badge).toHaveClass('items-center');
        expect(badge).toHaveClass('justify-center');
        expect(badge).toHaveClass('rounded-md');
        expect(badge).toHaveClass('border');
        expect(badge).toHaveClass('px-2');
        expect(badge).toHaveClass('py-0.5');
        expect(badge).toHaveClass('text-xs');
        expect(badge).toHaveClass('font-medium');
    });

    it('supports hover states for links', () => {
        render(
            <Badge asChild>
                <a href="/test">Hoverable Badge</a>
            </Badge>
        );

        const link = screen.getByRole('link');
        expect(link).toHaveClass('[a&]:hover:bg-primary/90');
    });

    it('handles empty content', () => {
        render(<Badge></Badge>);

        const badge = document.querySelector('[data-slot="badge"]');
        expect(badge).toBeInTheDocument();
        expect(badge).toBeEmptyDOMElement();
    });

    it('maintains proper width constraints', () => {
        render(<Badge>Very Long Badge Text That Should Not Wrap</Badge>);

        const badge = screen.getByText('Very Long Badge Text That Should Not Wrap');
        expect(badge).toHaveClass('w-fit');
        expect(badge).toHaveClass('whitespace-nowrap');
        expect(badge).toHaveClass('shrink-0');
    });
});