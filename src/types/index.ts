export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  amount?: number;
}

export interface Opportunity {
  id: string;
  name: string;
  stage: string;
  amount?: number;
  accountName: string;
  leadId: string;
}

export type LeadStatus = Lead['status'];