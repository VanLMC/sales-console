import { useState, useEffect } from 'react';
import { Lead, LeadStatus } from '../types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { validateEmail, validateNonNegativeNumber } from '../utils/validation';
import { formatSimpleCurrency } from '../utils/formatting';
import { leadStatusOptions, getStatusBadgeVariant, getStatusLabel } from '../utils/status';

interface LeadDetailPanelProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (leadId: string, updates: Partial<Lead>) => void;
  onConvert: (lead: Lead) => void;
}





export function LeadDetailPanel({ lead, isOpen, onClose, onSave, onConvert }: LeadDetailPanelProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<LeadStatus>('new');
  const [amount, setAmount] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when lead changes
  useEffect(() => {
    if (lead) {
      setEmail(lead.email);
      setStatus(lead.status);
      setAmount(lead.amount?.toString() || '');
      setIsEditing(false);
      setEmailError('');
      setAmountError('');
    }
  }, [lead]);

  const isFormValid = (): boolean => {
    let hasErrors = false;

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasErrors = true;
    } else {
      setEmailError('');
    }

    if (!validateNonNegativeNumber(amount)) {
      setAmountError('Amount must be a positive number');
      hasErrors = true;
    } else {
      setAmountError('');
    }

    return !hasErrors;
  };

  const handleSave = async () => {
    if (!lead) return;

    if (!isFormValid()) return;

    setIsSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      const updates: Partial<Lead> = {
        email,
        status,
        amount: amount === '' ? undefined : parseFloat(amount)
      };
      onSave(lead.id, updates);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving lead:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (lead) {
      setEmail(lead.email);
      setStatus(lead.status);
      setAmount(lead.amount?.toString() || '');
      setEmailError('');
      setAmountError('');
      setIsEditing(false);
    }
  };

  const handleConvert = () => {
    if (lead) {
      onConvert(lead);
      onClose();
    }
  };



  if (!lead) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Lead Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6 p-6">
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <div className="mt-1 p-3 bg-muted/50 rounded-md">
                {lead.name}
              </div>
            </div>

            <div>
              <Label>Company</Label>
              <div className="mt-1 p-3 bg-muted/50 rounded-md">
                {lead.company}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <div className="mt-1">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={emailError ? 'border-red-500' : ''}
                  />
                  {emailError && (
                    <p className="mt-1 text-sm text-red-600">{emailError}</p>
                  )}
                </div>
              ) : (
                <div className="mt-1 p-3 bg-muted/50 rounded-md">
                  {lead.email}
                </div>
              )}
            </div>

            <div>
              <Label>Source</Label>
              <div className="mt-1 p-3 bg-muted/50 rounded-md">
                {lead.source}
              </div>
            </div>

            <div>
              <Label>Score</Label>
              <div className="mt-1 p-3 bg-muted/50 rounded-md">
                {lead.score}
              </div>
            </div>

            <div>
              <Label htmlFor="amount">Amount (Optional)</Label>
              {isEditing ? (
                <div className="mt-1">
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter amount..."
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={amountError ? 'border-red-500' : ''}
                  />
                  {amountError && (
                    <p className="mt-1 text-sm text-red-600">{amountError}</p>
                  )}
                </div>
              ) : (
                <div className="mt-1 p-3 bg-muted/50 rounded-md">
                  {formatSimpleCurrency(lead.amount)}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              {isEditing ? (
                <Select value={status} onValueChange={(value: LeadStatus) => setStatus(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {leadStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1 p-3 bg-muted/50 rounded-md">
                  <Badge variant={getStatusBadgeVariant(lead.status)}>
                    {getStatusLabel(lead.status)}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={handleConvert}
                  disabled={lead.status === 'unqualified'}
                >
                  Convert to Opportunity
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}