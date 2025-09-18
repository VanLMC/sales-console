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
      <SheetContent
        className="w-[400px] sm:w-[540px]"
        role="dialog"
        aria-labelledby="lead-details-title"
        aria-describedby="lead-details-description"
      >
        <SheetHeader>
          <SheetTitle id="lead-details-title">Lead Details</SheetTitle>
          <p id="lead-details-description" className="sr-only">
            View and edit lead information including contact details, status, and potential deal amount
          </p>
        </SheetHeader>

        <div className="mt-6 space-y-6 p-6">
          <fieldset className="space-y-4" disabled={isSaving}>
            <legend className="sr-only">
              {isEditing ? 'Edit lead information' : 'Lead information (read-only)'}
            </legend>
            <div>
              <Label htmlFor="lead-name">Name</Label>
              <div
                id="lead-name"
                className="mt-1 p-3 bg-muted/50 rounded-md"
                role="textbox"
                aria-readonly="true"
                aria-label={`Lead name: ${lead.name}`}
              >
                {lead.name}
              </div>
            </div>

            <div>
              <Label htmlFor="lead-company">Company</Label>
              <div
                id="lead-company"
                className="mt-1 p-3 bg-muted/50 rounded-md"
                role="textbox"
                aria-readonly="true"
                aria-label={`Company: ${lead.company}`}
              >
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
                    aria-invalid={emailError ? 'true' : 'false'}
                    aria-describedby={emailError ? 'email-error' : undefined}
                    aria-label="Lead email address"
                  />
                  {emailError && (
                    <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                      {emailError}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className="mt-1 p-3 bg-muted/50 rounded-md"
                  role="textbox"
                  aria-readonly="true"
                  aria-label={`Email: ${lead.email}`}
                >
                  {lead.email}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="lead-source">Source</Label>
              <div
                id="lead-source"
                className="mt-1 p-3 bg-muted/50 rounded-md"
                role="textbox"
                aria-readonly="true"
                aria-label={`Lead source: ${lead.source}`}
              >
                {lead.source}
              </div>
            </div>

            <div>
              <Label htmlFor="lead-score">Score</Label>
              <div
                id="lead-score"
                className="mt-1 p-3 bg-muted/50 rounded-md"
                role="textbox"
                aria-readonly="true"
                aria-label={`Lead score: ${lead.score} out of 100`}
              >
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
                    aria-invalid={amountError ? 'true' : 'false'}
                    aria-describedby={amountError ? 'amount-error' : 'amount-help'}
                    aria-label="Potential deal amount in dollars"
                  />
                  <p id="amount-help" className="sr-only">
                    Enter the potential deal amount. Leave empty if unknown.
                  </p>
                  {amountError && (
                    <p id="amount-error" className="mt-1 text-sm text-red-600" role="alert">
                      {amountError}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className="mt-1 p-3 bg-muted/50 rounded-md"
                  role="textbox"
                  aria-readonly="true"
                  aria-label={`Deal amount: ${formatSimpleCurrency(lead.amount)}`}
                >
                  {formatSimpleCurrency(lead.amount)}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              {isEditing ? (
                <Select
                  value={status}
                  onValueChange={(value: LeadStatus) => setStatus(value)}
                >
                  <SelectTrigger
                    className="mt-1"
                    id="status"
                    aria-label="Select lead status"
                  >
                    <SelectValue placeholder="Select status" />
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
                <div
                  className="mt-1 p-3 bg-muted/50 rounded-md"
                  role="textbox"
                  aria-readonly="true"
                  aria-label={`Lead status: ${getStatusLabel(lead.status)}`}
                >
                  <Badge
                    variant={getStatusBadgeVariant(lead.status)}
                    aria-hidden="true"
                  >
                    {getStatusLabel(lead.status)}
                  </Badge>
                </div>
              )}
            </div>
          </fieldset>

          <div className="flex gap-3 pt-6 border-t" role="group" aria-label="Lead actions">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  aria-describedby="save-help"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <p id="save-help" className="sr-only">
                  Save changes to lead information
                </p>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  aria-label="Cancel editing and discard changes"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit lead information"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={handleConvert}
                  disabled={lead.status === 'unqualified'}
                  aria-label={
                    lead.status === 'unqualified'
                      ? 'Cannot convert unqualified lead to opportunity'
                      : 'Convert this lead to an opportunity'
                  }
                  aria-describedby="convert-help"
                >
                  Convert to Opportunity
                </Button>
                <p id="convert-help" className="sr-only">
                  {lead.status === 'unqualified'
                    ? 'This lead cannot be converted because it is unqualified'
                    : 'This will create a new opportunity and remove the lead from the leads list'
                  }
                </p>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet >
  );
}