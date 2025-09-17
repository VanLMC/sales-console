import { useState, useEffect } from 'react';
import { Lead } from '../types';
import leadsData from '../data/leads.json';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setLeads(leadsData as Lead[]);
        setError(null);
      } catch (err) {
        setError('Failed to load leads');
        console.error('Error loading leads:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeads();
  }, []);

  const updateLead = (leadId: string, updates: Partial<Lead>) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, ...updates } : lead
      )
    );
  };

  const removeLead = (leadId: string) => {
    setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
  };

  return {
    leads,
    isLoading,
    error,
    updateLead,
    removeLead,
  };
}