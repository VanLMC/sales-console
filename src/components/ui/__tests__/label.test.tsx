import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from '../label';

describe('Label', () => {
    it('renders with default styling', () => {
        render(<Label>Test Label</Label>);

        const label = screen.getByText('Test Label');
        expect(label).toBeInTheDocument();
        expect(label).toHaveAttribute('data-slot', 'label');
        expect(label).toHaveClass('flex');
        expect(label).toHaveClass('items-center');
        expect(label).toHaveClass('gap-2');
        expect(label).toHaveClass('text-sm');
        expect(label).toHaveClass('font-medium');
    });

    it('applies custom className', () => {
        render(<Label className="custom-label">Custom Label</Label>);

        const label = screen.getByText('Custom Label');
        expect(label).toHaveClass('custom-label');
    });

    it('forwards props correctly', () => {
        render(<Label htmlFor="input-id" id="label-id">Form Label</Label>);

        const label = screen.getByText('Form Label');
        expect(label).toHaveAttribute('for', 'input-id');
        expect(label).toHaveAttribute('id', 'label-id');
    });

    it('works with form inputs', () => {
        render(
            <div>
                <Label htmlFor="test-input">Email Address</Label>
                <input id="test-input" type="email" />
            </div>
        );

        const label = screen.getByText('Email Address');
        const input = screen.getByRole('textbox');

        expect(label).toHaveAttribute('for', 'test-input');
        expect(input).toHaveAttribute('id', 'test-input');
    });

    it('has proper disabled state styling', () => {
        render(
            <div className="group" data-disabled="true">
                <Label>Disabled Label</Label>
            </div>
        );

        const label = screen.getByText('Disabled Label');
        expect(label).toHaveClass('group-data-[disabled=true]:pointer-events-none');
        expect(label).toHaveClass('group-data-[disabled=true]:opacity-50');
    });

    it('has proper peer disabled styling', () => {
        render(
            <div>
                <input disabled className="peer" />
                <Label>Peer Disabled Label</Label>
            </div>
        );

        const label = screen.getByText('Peer Disabled Label');
        expect(label).toHaveClass('peer-disabled:cursor-not-allowed');
        expect(label).toHaveClass('peer-disabled:opacity-50');
    });

    it('supports select-none for better UX', () => {
        render(<Label>Non-selectable Label</Label>);

        const label = screen.getByText('Non-selectable Label');
        expect(label).toHaveClass('select-none');
    });

    it('renders with icons correctly', () => {
        const IconComponent = () => <span data-testid="icon">★</span>;

        render(
            <Label>
                <IconComponent />
                Label with Icon
            </Label>
        );

        const label = screen.getByText('Label with Icon');
        const icon = screen.getByTestId('icon');

        expect(label).toBeInTheDocument();
        expect(icon).toBeInTheDocument();
        expect(label).toHaveClass('gap-2'); // Ensures proper spacing for icons
    });

    it('maintains accessibility with screen readers', () => {
        render(
            <div>
                <Label htmlFor="accessible-input">Accessible Label</Label>
                <input
                    id="accessible-input"
                    type="text"
                    aria-describedby="help-text"
                />
                <div id="help-text">This is help text</div>
            </div>
        );

        const label = screen.getByText('Accessible Label');
        const input = screen.getByRole('textbox');

        expect(label).toHaveAttribute('for', 'accessible-input');
        expect(input).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('supports required field indicators', () => {
        render(
            <Label>
                Required Field
                <span aria-label="required" style={{ color: 'red' }}>*</span>
            </Label>
        );

        const label = screen.getByText('Required Field');
        const required = screen.getByLabelText('required');

        expect(label).toBeInTheDocument();
        expect(required).toBeInTheDocument();
    });
});