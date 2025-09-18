import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button', () => {
    it('renders with default variant and size', () => {
        render(<Button>Click me</Button>);

        const button = screen.getByRole('button', { name: 'Click me' });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('data-slot', 'button');
    });

    it('renders different variants correctly', () => {
        const { rerender } = render(<Button variant="destructive">Delete</Button>);

        let button = screen.getByRole('button');
        expect(button).toHaveClass('bg-destructive');

        rerender(<Button variant="outline">Outline</Button>);
        button = screen.getByRole('button');
        expect(button).toHaveClass('border');

        rerender(<Button variant="secondary">Secondary</Button>);
        button = screen.getByRole('button');
        expect(button).toHaveClass('bg-secondary');

        rerender(<Button variant="ghost">Ghost</Button>);
        button = screen.getByRole('button');
        expect(button).toHaveClass('hover:bg-accent');

        rerender(<Button variant="link">Link</Button>);
        button = screen.getByRole('button');
        expect(button).toHaveClass('underline-offset-4');
    });

    it('renders different sizes correctly', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);

        let button = screen.getByRole('button');
        expect(button).toHaveClass('h-8');

        rerender(<Button size="lg">Large</Button>);
        button = screen.getByRole('button');
        expect(button).toHaveClass('h-10');

        rerender(<Button size="icon">Icon</Button>);
        button = screen.getByRole('button');
        expect(button).toHaveClass('size-9');
    });

    it('handles click events', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Button onClick={handleClick}>Click me</Button>);

        const button = screen.getByRole('button');
        await user.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveClass('disabled:pointer-events-none');
    });

    it('applies custom className', () => {
        render(<Button className="custom-class">Custom</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });

    it('forwards other props correctly', () => {
        render(<Button type="submit" aria-label="Submit form">Submit</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'submit');
        expect(button).toHaveAttribute('aria-label', 'Submit form');
    });

    it('renders as child component when asChild is true', () => {
        render(
            <Button asChild>
                <a href="/test">Link Button</a>
            </Button>
        );

        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/test');
        expect(link).toHaveAttribute('data-slot', 'button');
    });

    it('has proper accessibility attributes', () => {
        render(<Button>Accessible Button</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('focus-visible:ring-ring/50');
        expect(button).toHaveClass('aria-invalid:ring-destructive/20');
    });

    it('supports keyboard navigation', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Button onClick={handleClick}>Keyboard Button</Button>);

        const button = screen.getByRole('button');
        button.focus();

        await user.keyboard('{Enter}');
        expect(handleClick).toHaveBeenCalledTimes(1);

        await user.keyboard(' ');
        expect(handleClick).toHaveBeenCalledTimes(2);
    });
});