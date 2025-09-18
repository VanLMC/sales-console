import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Lead, LeadStatus } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Search, ArrowUpDown, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useDebounce } from '../hooks/useDebounce';
import { useLeadsFilters } from '../hooks/useLeadsFilters';
import { leadStatusFilterOptions, getStatusBadgeVariant, getStatusLabel } from '../utils/status';

interface LeadsListProps {
  leads: Lead[];
  isLoading: boolean;
  onLeadClick: (lead: Lead) => void;
}



const ITEMS_PER_PAGE = 20;

export function LeadsList({ leads, isLoading, onLeadClick }: LeadsListProps) {
  // Use localStorage hook for persistent filters
  const {
    searchTerm: persistedSearchTerm,
    statusFilter,
    sortOrder,
    updateSearchTerm,
    updateStatusFilter,
    updateSortOrder,
    resetFilters
  } = useLeadsFilters();

  const [searchInput, setSearchInput] = useState(persistedSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(persistedSearchTerm);
  const [displayedLeads, setDisplayedLeads] = useState<Lead[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

  // Debounced search function that also updates localStorage
  const debouncedSearch = useDebounce((searchTerm: string) => {
    setDebouncedSearchTerm(searchTerm);
    updateSearchTerm(searchTerm);
  }, 500);

  // Handle search input changes
  useEffect(() => {
    debouncedSearch(searchInput);
  }, [searchInput, debouncedSearch]);

  // Initialize search input from localStorage on mount
  useEffect(() => {
    setSearchInput(persistedSearchTerm);
    setDebouncedSearchTerm(persistedSearchTerm);
  }, [persistedSearchTerm]);

  const filteredAndSortedLeads = useMemo(() => {
    if (!Array.isArray(leads)) return [];

    let filtered = leads.filter(lead => {
      const matchesSearch =
        lead.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort by score
    filtered.sort((a, b) => {
      return sortOrder === 'desc' ? b.score - a.score : a.score - b.score;
    });

    return filtered;
  }, [leads, debouncedSearchTerm, statusFilter, sortOrder]);

  const loadMoreLeads = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    // Simulate loading delay for better UX
    setTimeout(() => {
      const currentLength = displayedLeads.length;
      const nextBatch = filteredAndSortedLeads.slice(currentLength, currentLength + ITEMS_PER_PAGE);

      if (nextBatch.length === 0) {
        setHasMore(false);
      } else {
        setDisplayedLeads(prev => [...prev, ...nextBatch]);
        setHasMore(currentLength + nextBatch.length < filteredAndSortedLeads.length);
      }

      setIsLoadingMore(false);
    }, 300);
  }, [displayedLeads.length, filteredAndSortedLeads, isLoadingMore, hasMore]);

  // Reset displayed leads when filters change
  useEffect(() => {
    const initialBatch = filteredAndSortedLeads.slice(0, ITEMS_PER_PAGE);
    setDisplayedLeads(initialBatch);
    setHasMore(filteredAndSortedLeads.length > ITEMS_PER_PAGE);
  }, [filteredAndSortedLeads]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreLeads();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreLeads, hasMore, isLoadingMore]);



  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    updateSortOrder(newSortOrder);
  };

  const handleResetFilters = () => {
    resetFilters();
    setSearchInput('');
    setDebouncedSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading leads">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <div className="h-10 bg-muted rounded-md animate-pulse" aria-hidden="true" />
          </div>
          <div className="w-48">
            <div className="h-10 bg-muted rounded-md animate-pulse" aria-hidden="true" />
          </div>
        </div>
        <div className="border rounded-md">
          <div className="h-12 bg-muted/50 border-b" aria-hidden="true" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 border-b bg-muted/30 animate-pulse" aria-hidden="true" />
          ))}
        </div>
        <span className="sr-only">Loading leads data, please wait...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <section className="flex gap-4 mb-6" role="search" aria-label="Lead filters">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" aria-hidden="true" />
          <Input
            placeholder="Search by name or company..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
            aria-label="Search leads by name or company"
            role="searchbox"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value: LeadStatus | 'all') => updateStatusFilter(value)}
        >
          <SelectTrigger className="w-48" aria-label="Filter by lead status">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {leadStatusFilterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(searchInput || statusFilter !== 'all' || sortOrder !== 'desc') && (
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="whitespace-nowrap"
            aria-label="Clear all filters and reset to default view"
          >
            Reset Filters
          </Button>
        )}
      </section>

      {/* Results count */}
      <div
        className="text-sm text-muted-foreground"
        role="status"
        aria-live="polite"
        aria-label={`Search results: showing ${displayedLeads.length} of ${filteredAndSortedLeads.length} leads`}
      >
        Showing {displayedLeads.length} of {filteredAndSortedLeads.length} leads
        {filteredAndSortedLeads.length !== (Array.isArray(leads) ? leads.length : 0) && (
          <span className="text-muted-foreground/70"> (filtered from {Array.isArray(leads) ? leads.length : 0} total)</span>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-md" role="region" aria-label="Leads data table">
        <Table role="table" aria-label="List of leads with their details">
          <TableHeader>
            <TableRow role="row">
              <TableHead role="columnheader" aria-sort="none">Name</TableHead>
              <TableHead role="columnheader" aria-sort="none">Company</TableHead>
              <TableHead role="columnheader" aria-sort="none">Email</TableHead>
              <TableHead role="columnheader" aria-sort="none">Source</TableHead>
              <TableHead
                className="text-center"
                role="columnheader"
                aria-sort={sortOrder === 'desc' ? 'descending' : 'ascending'}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSortOrder}
                  className="h-auto p-0 hover:bg-transparent"
                  aria-label={`Sort by score ${sortOrder === 'desc' ? 'ascending' : 'descending'}`}
                >
                  Score <ArrowUpDown className="ml-1 h-3 w-3" aria-hidden="true" />
                </Button>
              </TableHead>
              <TableHead role="columnheader" aria-sort="none">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedLeads.length === 0 ? (
              <TableRow role="row">
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground" role="cell">
                  {debouncedSearchTerm || statusFilter !== 'all'
                    ? 'No leads match your search criteria'
                    : 'No leads available'
                  }
                </TableCell>
              </TableRow>
            ) : (
              displayedLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onLeadClick(lead)}
                  role="row"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onLeadClick(lead);
                    }
                  }}
                  aria-label={`Lead: ${lead.name} from ${lead.company}, click to view details`}
                >
                  <TableCell role="cell">{lead.name}</TableCell>
                  <TableCell role="cell">{lead.company}</TableCell>
                  <TableCell role="cell">{lead.email}</TableCell>
                  <TableCell role="cell">{lead.source}</TableCell>
                  <TableCell className="text-center" role="cell">{lead.score}</TableCell>
                  <TableCell role="cell">
                    <Badge
                      variant={getStatusBadgeVariant(lead.status)}
                      aria-label={`Status: ${getStatusLabel(lead.status)}`}
                    >
                      {getStatusLabel(lead.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Loading more indicator and infinite scroll trigger */}
      {hasMore && displayedLeads.length > 0 && (
        <div
          ref={observerRef}
          className="flex justify-center py-4"
          role="status"
          aria-live="polite"
          aria-label="Loading more leads"
        >
          {isLoadingMore && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Loading more leads...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}