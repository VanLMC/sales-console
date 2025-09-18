import { Opportunity } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { formatCurrency } from '../utils/formatting';

interface OpportunitiesListProps {
  opportunities: Opportunity[];
}

const stageColors: Record<string, 'default' | 'secondary' | 'outline'> = {
  'Qualification': 'secondary',
  'Proposal': 'outline',
  'Negotiation': 'default',
  'Closed Won': 'default',
};

export function OpportunitiesList({ opportunities }: OpportunitiesListProps) {

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 id="opportunities-heading">Opportunities</h2>
        <div
          className="text-sm text-muted-foreground"
          role="status"
          aria-live="polite"
          aria-label={`${opportunities.length} opportunities available`}
        >
          {opportunities.length} opportunities
        </div>
      </header>

      <div className="border rounded-md" role="region" aria-labelledby="opportunities-heading">
        <Table role="table" aria-label="List of opportunities with their details">
          <TableHeader>
            <TableRow role="row">
              <TableHead role="columnheader">Name</TableHead>
              <TableHead role="columnheader">Account</TableHead>
              <TableHead role="columnheader">Stage</TableHead>
              <TableHead className="text-right" role="columnheader">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.length === 0 ? (
              <TableRow role="row">
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground" role="cell">
                  No opportunities yet. Convert some leads to get started!
                </TableCell>
              </TableRow>
            ) : (
              opportunities.map((opportunity) => (
                <TableRow
                  key={opportunity.id}
                  role="row"
                  aria-label={`Opportunity: ${opportunity.name} for ${opportunity.accountName}`}
                >
                  <TableCell role="cell">{opportunity.name}</TableCell>
                  <TableCell role="cell">{opportunity.accountName}</TableCell>
                  <TableCell role="cell">
                    <Badge
                      variant={stageColors[opportunity.stage] || 'secondary'}
                      aria-label={`Stage: ${opportunity.stage}`}
                    >
                      {opportunity.stage}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" role="cell">
                    <span aria-label={`Amount: ${formatCurrency(opportunity.amount)}`}>
                      {formatCurrency(opportunity.amount)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}