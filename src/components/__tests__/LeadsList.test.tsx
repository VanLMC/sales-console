import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeadsList } from '../LeadsList';
import { Lead } from '../../types';

// Mock the hooks
vi.mock('../../hooks/useDebounce', () => ({
    useDebounce: vi.fn((fn) => fn)
}));

vi.mock('../../hooks/useLeadsFilters', () => ({
    useLeadsFilters: vi.fn(() => ({
        searchTerm: '',
        statusFilter: 'all',
        sortOrder: 'desc',
        updateSearchTerm: vi.fn(),
        updateStatusFilter: vi.fn(),
        updateSortOrder: vi.fn(),
        resetFilters: vi.fn()
    }))
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

const mockLeads: Lead[] = [
    {
        id: '1',
        name: 'John Doe',
        company: 'Acme Corp',
        email: 'john@acme.com',
        source: 'Website',
        score: 85,
        status: 'new',
        amount: 5000
    },
    {
        id: '2',
        name: 'Jane Smith',
        company: 'Tech Solutions',
        email: 'jane@tech.com',
        source: 'Referral',
        score: 92,
        status: 'qualified',
        amount: 10000
    },
    {
        id: '3',
        name: 'Bob Johnson',
        company: 'StartupXYZ',
        email: 'bob@startup.com',
        source: 'Cold Call',
        score: 65,
        status: 'contacted'
    }
];

describe('LeadsList', () => {
    const mockOnLeadClick = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state correctly', () => {
        render(
            <LeadsList
                leads={[]}
                isLoading={true}
                onLeadClick={mockOnLeadClick}
            />
        );

        // Should show skeleton loading elements with animate-pulse class
        const loadingElements = document.querySelectorAll('.animate-pulse');
        expect(loadingElements.length).toBeGreaterThan(0);
    });

    it('renders leads table with data', () => {
        render(
            <LeadsList
                leads={mockLeads}
                isLoading={false}
                onLeadClick={mockOnLeadClick}
            />
        );

        // Check table headers
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Company')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Source')).toBeInTheDocument();
        expect(screen.getByText('Score')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();

        // Check lead data
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Acme Corp')).toBeInTheDocument();
        expect(screen.getByText('john@acme.com')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Tech Solutions')).toBeInTheDocument();
    });

    it('displays correct results count', () => {
        render(
            <LeadsList
                leads={mockLeads}
                isLoading={false}
                onLeadClick={mockOnLeadClick}
            />
        );

        expect(screen.getByText(/Showing 3 of 3 leads/)).toBeInTheDocument();
    });

    it('shows empty state when no leads match filters', () => {
        render(
            <LeadsList
                leads={[]}
                isLoading={false}
                onLeadClick={mockOnLeadClick}
            />
        );

        expect(screen.getByText('No leads available')).toBeInTheDocument();
    });

    it('calls onLeadClick when a lead row is clicked', async () => {
        const user = userEvent.setup();

        render(
            <LeadsList
                leads={mockLeads}
                isLoading={false}
                onLeadClick={mockOnLeadClick}
            />
        );

        const leadRow = screen.getByText('John Doe').closest('tr');
        expect(leadRow).toBeInTheDocument();

        if (leadRow) {
            await user.click(leadRow);
            expect(mockOnLeadClick).toHaveBeenCalledWith(mockLeads[0]);
        }
    });

    it('renders search input', () => {
        render(
            <LeadsList
                leads={mockLeads}
                isLoading={false}
                onLeadClick={mockOnLeadClick}
            />
        );

        const searchInput = screen.getByPlaceholderText('Search by name or company...');
        expect(searchInput).toBeInTheDocument();
    });

    it('renders status filter dropdown', () => {
        render(
            <LeadsList
                leads={mockLeads}
                isLoading={false}
                onLeadClick={mockOnLeadClick}
            />
        );

        // The select trigger should be present
        const selectTrigger = screen.getByRole('combobox');
        expect(selectTrigger).toBeInTheDocument();
    });

    it('renders sort button for score column', () => {
        render(
            <LeadsList
                leads={mockLeads}
                isLoading={false}
                onLeadClick={mockOnLeadClick}
            />
        );

        const sortButton = screen.getByRole('button', { name: /Sort by score/ });
        expect(sortButton).toBeInTheDocument();
    });

    it('handles empty leads array gracefully', () => {
        render(
            <LeadsList
                leads={[]}
                isLoading={false}
                onLeadClick={mockOnLeadClick}
            />
        );

        expect(screen.getByText('No leads available')).toBeInTheDocument();
        expect(screen.getByText(/Showing 0 of 0 leads/)).toBeInTheDocument();
    });

    it('handles undefined leads gracefully', () => {
        render(
            <LeadsList
                leads={undefined as any}
                isLoading={false}
                onLeadClick={mockOnLeadClick}
            />
        );

        expect(screen.getByText('No leads available')).toBeInTheDocument();
    });
});