import { useState } from 'react';
import { Lead, Opportunity } from './types';
import { useLeads } from './hooks/useLeads';
import { LeadsList } from './components/LeadsList';
import { LeadDetailPanel } from './components/LeadDetailPanel';
import { OpportunitiesList } from './components/OpportunitiesList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Alert, AlertDescription } from './components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';

export default function App() {
  const { leads, isLoading, error, updateLead, removeLead } = useLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailPanelOpen(true);
  };

  const handleCloseDetailPanel = () => {
    setIsDetailPanelOpen(false);
    setSelectedLead(null);
  };

  const handleSaveLead = (leadId: string, updates: Partial<Lead>) => {
    updateLead(leadId, updates);

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleConvertToOpportunity = (lead: Lead) => {

    const opportunity: Opportunity = {
      id: `opp-${Date.now()}`,
      name: `${lead.company} - ${lead.name}`,
      stage: 'Qualification',
      accountName: lead.company,
      leadId: lead.id,
      amount: lead.amount,
    };

    setOpportunities(prev => [...prev, opportunity]);

    removeLead(lead.id);

    handleCloseDetailPanel();
  };



  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}. Please refresh the page to try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b" role="banner">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Sales Console</h1>
              <p className="text-muted-foreground mt-1">
                Manage your leads and convert them to opportunities
              </p>
            </div>
            <nav className="flex items-center gap-2" aria-label="Application settings">
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-8" role="main">
        <Tabs defaultValue="leads" className="space-y-6" aria-label="Sales data navigation">
          <TabsList role="tablist" aria-label="Choose data view">
            <TabsTrigger
              value="leads"
              role="tab"
              aria-controls="leads-panel"
              aria-label={`Leads tab, ${Array.isArray(leads) ? leads.length : 0} leads available`}
            >
              Leads ({Array.isArray(leads) ? leads.length : 0})
            </TabsTrigger>
            <TabsTrigger
              value="opportunities"
              role="tab"
              aria-controls="opportunities-panel"
              aria-label={`Opportunities tab, ${opportunities.length} opportunities available`}
            >
              Opportunities ({opportunities.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="leads"
            className="space-y-6"
            role="tabpanel"
            id="leads-panel"
            aria-labelledby="leads-tab"
          >
            <LeadsList
              leads={leads}
              isLoading={isLoading}
              onLeadClick={handleLeadClick}
            />
          </TabsContent>

          <TabsContent
            value="opportunities"
            className="space-y-6"
            role="tabpanel"
            id="opportunities-panel"
            aria-labelledby="opportunities-tab"
          >
            <OpportunitiesList opportunities={opportunities} />
          </TabsContent>
        </Tabs>
      </main>

      <LeadDetailPanel
        lead={selectedLead}
        isOpen={isDetailPanelOpen}
        onClose={handleCloseDetailPanel}
        onSave={handleSaveLead}
        onConvert={handleConvertToOpportunity}
      />
    </div>
  );
}