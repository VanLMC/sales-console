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
      <div className="flex items-center justify-between">
        <h2>Opportunities</h2>
        <div className="text-sm text-muted-foreground">
          {opportunities.length} opportunities
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No opportunities yet. Convert some leads to get started!
                </TableCell>
              </TableRow>
            ) : (
              opportunities.map((opportunity) => (
                <TableRow key={opportunity.id}>
                  <TableCell>{opportunity.name}</TableCell>
                  <TableCell>{opportunity.accountName}</TableCell>
                  <TableCell>
                    <Badge variant={stageColors[opportunity.stage] || 'secondary'}>
                      {opportunity.stage}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(opportunity.amount)}
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