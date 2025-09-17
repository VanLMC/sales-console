import { useLocalStorage } from './useLocalStorage';
import { LeadStatus } from '../types';

interface LeadsFiltersState {
  searchTerm: string;
  statusFilter: LeadStatus | 'all';
  sortOrder: 'asc' | 'desc';
}

const defaultFilters: LeadsFiltersState = {
  searchTerm: '',
  statusFilter: 'all',
  sortOrder: 'desc'
};

export function useLeadsFilters() {
  const [filters, setFilters] = useLocalStorage<LeadsFiltersState>('leads-filters', defaultFilters);

  const updateSearchTerm = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  const updateStatusFilter = (statusFilter: LeadStatus | 'all') => {
    setFilters(prev => ({ ...prev, statusFilter }));
  };

  const updateSortOrder = (sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortOrder }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return {
    searchTerm: filters.searchTerm,
    statusFilter: filters.statusFilter,
    sortOrder: filters.sortOrder,
    updateSearchTerm,
    updateStatusFilter,
    updateSortOrder,
    resetFilters
  };
}