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
      <div className="space-y-4">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <div className="h-10 bg-muted rounded-md animate-pulse" />
          </div>
          <div className="w-48">
            <div className="h-10 bg-muted rounded-md animate-pulse" />
          </div>
        </div>
        <div className="border rounded-md">
          <div className="h-12 bg-muted/50 border-b" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 border-b bg-muted/30 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or company..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value: LeadStatus | 'all') => updateStatusFilter(value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
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
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {displayedLeads.length} of {filteredAndSortedLeads.length} leads
        {filteredAndSortedLeads.length !== leads.length && (
          <span className="text-muted-foreground/70"> (filtered from {Array.isArray(leads) ? leads.length : 0} total)</span>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSortOrder}
                  className="h-auto p-0 hover:bg-transparent"
                >
                  Score <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
                >
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell className="text-center">{lead.score}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(lead.status)}>
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
        <div ref={observerRef} className="flex justify-center py-4">
          {isLoadingMore && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading more leads...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}