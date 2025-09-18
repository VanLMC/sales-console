import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Input } from '../input';

describe('Input', () => {
    it('renders with default props', () => {
        render(<Input />);

        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('data-slot', 'input');
    });

    it('renders with different input types', () => {
        const { rerender } = render(<Input type="email" />);

        let input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('type', 'email');

        rerender(<Input type="password" />);
        input = screen.getByDisplayValue('') || document.querySelector('input[type="password"]')!;
        expect(input).toHaveAttribute('type', 'password');

        rerender(<Input type="number" />);
        input = screen.getByRole('spinbutton');
        expect(input).toHaveAttribute('type', 'number');
    });

    it('handles value and onChange', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();

        render(<Input value="" onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        await user.type(input, 'test input');

        expect(handleChange).toHaveBeenCalled();
    });

    it('supports placeholder text', () => {
        render(<Input placeholder="Enter your name" />);

        const input = screen.getByPlaceholderText('Enter your name');
        expect(input).toBeInTheDocument();
    });

    it('can be disabled', () => {
        render(<Input disabled />);

        const input = screen.getByRole('textbox');
        expect(input).toBeDisabled();
        expect(input).toHaveClass('disabled:pointer-events-none');
    });

    it('applies custom className', () => {
        render(<Input className="custom-input" />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('custom-input');
    });

    it('forwards other props correctly', () => {
        render(<Input aria-label="Custom input" maxLength={10} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('aria-label', 'Custom input');
        expect(input).toHaveAttribute('maxLength', '10');
    });

    it('has proper focus styles', () => {
        render(<Input />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('focus-visible:border-ring');
        expect(input).toHaveClass('focus-visible:ring-ring/50');
    });

    it('has proper validation styles', () => {
        render(<Input aria-invalid="true" />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('aria-invalid:ring-destructive/20');
        expect(input).toHaveClass('aria-invalid:border-destructive');
    });

    it('supports controlled input', async () => {
        const TestComponent = () => {
            const [value, setValue] = useState('');
            return (
                <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    data-testid="controlled-input"
                />
            );
        };

        const user = userEvent.setup();
        render(<TestComponent />);

        const input = screen.getByTestId('controlled-input');
        await user.type(input, 'controlled');

        expect(input).toHaveValue('controlled');
    });

    it('supports uncontrolled input', async () => {
        const user = userEvent.setup();
        render(<Input defaultValue="default" />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('default');

        await user.clear(input);
        await user.type(input, 'new value');

        expect(input).toHaveValue('new value');
    });

    it('handles file input type correctly', () => {
        render(<Input type="file" />);

        const input = document.querySelector('input[type="file"]');
        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('file:text-foreground');
    });
});