import { LeadStatus } from '../types';

export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

/**
 * Status options for leads (without 'all' option)
 */
export const leadStatusOptions: { value: LeadStatus; label: string }[] = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'unqualified', label: 'Unqualified' },
];

/**
 * Status options for leads with 'all' option for filtering
 */
export const leadStatusFilterOptions: { value: LeadStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    ...leadStatusOptions,
];

/**
 * Gets the appropriate badge variant for a lead status
 * @param status - The lead status
 * @returns The badge variant to use
 */
export const getStatusBadgeVariant = (status: LeadStatus): BadgeVariant => {
    switch (status) {
        case 'new':
            return 'secondary';
        case 'contacted':
            return 'outline';
        case 'qualified':
            return 'default';
        case 'unqualified':
            return 'destructive';
        default:
            return 'secondary';
    }
};

/**
 * Gets the label for a lead status
 * @param status - The lead status
 * @returns The human-readable label for the status
 */
export const getStatusLabel = (status: LeadStatus): string => {
    const option = leadStatusOptions.find(opt => opt.value === status);
    return option?.label || status;
};