import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeadDetailPanel } from '../LeadDetailPanel';
import { Lead } from '../../types';

const mockLead: Lead = {
    id: '1',
    name: 'John Doe',
    company: 'Acme Corp',
    email: 'john@acme.com',
    source: 'Website',
    score: 85,
    status: 'new',
    amount: 5000
};

describe('LeadDetailPanel', () => {
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();
    const mockOnConvert = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders nothing when lead is null', () => {
        const { container } = render(
            <LeadDetailPanel
                lead={null}
                isOpen={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
                onConvert={mockOnConvert}
            />
        );

        expect(container.firstChild).toBeNull();
    });

    it('renders lead details in read-only mode', () => {
        render(
            <LeadDetailPanel
                lead={mockLead}
                isOpen={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
                onConvert={mockOnConvert}
            />
        );

        expect(screen.getByText('Lead Details')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Acme Corp')).toBeInTheDocument();
        expect(screen.getByText('john@acme.com')).toBeInTheDocument();
        expect(screen.getByText('Website')).toBeInTheDocument();
        expect(screen.getByText('85')).toBeInTheDocument();
        expect(screen.getByText('$5,000')).toBeInTheDocument();
    });

    it('shows Edit and Convert buttons in read-only mode', () => {
        render(
            <LeadDetailPanel
                lead={mockLead}
                isOpen={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
                onConvert={mockOnConvert}
            />
        );

        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Convert to Opportunity' })).toBeInTheDocument();
    });

    it('enters edit mode when Edit button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <LeadDetailPanel
                lead={mockLead}
                isOpen={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
                onConvert={mockOnConvert}
            />
        );

        const editButton = screen.getByRole('button', { name: 'Edit' });
        await user.click(editButton);

        // Should show Save and Cancel buttons
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();

        // Should show input fields
        expect(screen.getByDisplayValue('john@acme.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
    });

    it('validates email field in edit mode', async () => {
        const user = userEvent.setup();

        render(
            <LeadDetailPanel
                lead={mockLead}
                isOpen={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
                onConvert={mockOnConvert}
            />
        );

        // Enter edit mode
        await user.click(screen.getByRole('button', { name: 'Edit' }));

        // Clear email and enter invalid email
        const emailInput = screen.getByDisplayValue('john@acme.com');
        await user.clear(emailInput);
        await user.type(emailInput, 'invalid-email');

        // Try to save
        await user.click(screen.getByRole('button', { name: 'Save' }));

        // Should show validation error
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
        expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('validates amount field in edit mode', async () => {
        const user = userEvent.setup();

        render(
            <LeadDetailPanel
                lead={mockLead}
                isOpen={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
                onConvert={mockOnConvert}
            />
        );

        // Enter edit mode
        await user.click(screen.getByRole('button', { name: 'Edit' }));

        // Enter invalid amount
        const amountInput = screen.getByDisplayValue('5000');
        await user.clear(amountInput);
        await user.type(amountInput, '-100');

        // Try to save
        await user.click(screen.getByRole('button', { name: 'Save' }));

        // Should show validation error
        expect(screen.getByText('Amount must be a positive number')).toBeInTheDocument();
        expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('saves changes when form is valid', async () => {
        const user = userEvent.setup();

        render(
            <LeadDetailPanel
                lead={mockLead}
                isOpen={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
                onConvert={mockOnConvert}
            />
        );

        // Enter edit mode
        await user.click(screen.getByRole('button', { name: 'Edit' }));

        // Change email
        const emailInput = screen.getByDisplayValue('john@acme.com');
        await user.clear(emailInput);
        await user.type(emailInput, 'newemail@acme.com');

        // Change amount
        const amountInput = screen.getByDisplayValue('5000');
        await user.clear(amountInput);
        await user.type(amountInput, '7500');

        // Save changes
        await user.click(screen.getByRole('button', { name: 'Save' }));

        // Wait for save to complete
        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalledWith('1', {
                email: 'newemail@acme.com',
                status: 'new',
                amount: 7500
            });
        });
    });

    it('cancels edit mode and resets form', async () => {
        const user = userEvent.setup();

        render(
            <LeadDetailPanel
                lead={mockLead}
                isOpen={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
                onConvert={mockOnConvert}
            />
        );

        // Enter edit mode
        await user.click(screen.getByRole('button', { name: 'Edit' }));

        // Change email
        const emailInput = screen.getByDisplayValue('john@acme.com');
        await user.clear(emailInput);
        await user.type(emailInput, 'changed@email.com');

        // Cancel changes
        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        // Should be back in read-only mode
        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
        expect(screen.getByText('john@acme.com')).toBeInTheDocument(); // Original email restored
    });

    it('calls onConvert when Convert button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <LeadDetailPanel
                lead={mockLead}
                isOpen={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
                onConvert={mockOnConvert}
            />
        );

        await user.click(screen.getByRole('button', { name: 'Convert to Opportunity' }));

        expect(mockOnConvert).toHaveBeenCalledWith(mockLead);
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('disables Convert button for unqualified leads', () => {
        const unqualifiedLead = { ...mockLead, status: 'unqualified' as const };

        render(
            <LeadDetailPanel
                lead={unqualifiedLead}
                isOpen={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
                onConvert={mockOnConvert}
            />
        );

        const convertButton = screen.getByRole('button', { name: 'Convert to Opportunity' });
        expect(convertButton).toBeDisabled();
    });

    it('handles lead without amount', () => {
        const leadWithoutAmount = { ...mockLead, amount: undefined };

        render(
            <LeadDetailPanel
                lead={leadWithoutAmount}
                isOpen={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
                onConvert={mockOnConvert}
            />
        );

        expect(screen.getByText('Not specified')).toBeInTheDocument();
    });

    it('shows loading state during save', async () => {
        const user = userEvent.setup();

        render(
            <LeadDetailPanel
                lead={mockLead}
                isOpen={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
                onConvert={mockOnConvert}
            />
        );

        // Enter edit mode
        await user.click(screen.getByRole('button', { name: 'Edit' }));

        // Start save
        await user.click(screen.getByRole('button', { name: 'Save' }));

        // Should show saving state
        expect(screen.getByRole('button', { name: 'Saving...' })).toBeInTheDocument();
    });
});