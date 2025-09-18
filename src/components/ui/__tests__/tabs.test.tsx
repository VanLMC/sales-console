import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs';

describe('Tabs Components', () => {
    describe('Tabs', () => {
        it('renders with default value', () => {
            render(
                <Tabs defaultValue="tab1" data-testid="tabs">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content 1</TabsContent>
                </Tabs>
            );

            expect(screen.getByTestId('tabs')).toBeInTheDocument();
            expect(screen.getByText('Content 1')).toBeInTheDocument();
        });

        it('supports controlled mode', () => {
            const onValueChange = vi.fn();

            render(
                <Tabs value="tab2" onValueChange={onValueChange}>
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content 1</TabsContent>
                    <TabsContent value="tab2">Content 2</TabsContent>
                </Tabs>
            );

            expect(screen.getByText('Content 2')).toBeInTheDocument();
            expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
        });

        it('applies custom className', () => {
            render(
                <Tabs defaultValue="tab1" className="custom-tabs" data-testid="tabs">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    </TabsList>
                </Tabs>
            );

            expect(screen.getByTestId('tabs')).toHaveClass('custom-tabs');
        });

        it('has proper data attributes', () => {
            render(
                <Tabs defaultValue="tab1" data-testid="tabs">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    </TabsList>
                </Tabs>
            );

            expect(screen.getByTestId('tabs')).toHaveAttribute('data-slot', 'tabs');
        });
    });

    describe('TabsList', () => {
        it('renders with proper styles', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList data-testid="tabs-list">
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    </TabsList>
                </Tabs>
            );

            const tabsList = screen.getByTestId('tabs-list');
            expect(tabsList).toBeInTheDocument();
            expect(tabsList).toHaveClass('bg-muted', 'text-muted-foreground', 'h-9', 'w-fit', 'items-center', 'justify-center', 'rounded-xl', 'flex');
            expect(tabsList).toHaveAttribute('data-slot', 'tabs-list');
        });

        it('applies custom className', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList className="custom-list" data-testid="tabs-list">
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    </TabsList>
                </Tabs>
            );

            expect(screen.getByTestId('tabs-list')).toHaveClass('custom-list');
        });
    });

    describe('TabsTrigger', () => {
        it('renders as button with proper styles', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1" data-testid="trigger">Tab 1</TabsTrigger>
                    </TabsList>
                </Tabs>
            );

            const trigger = screen.getByTestId('trigger');
            expect(trigger.tagName).toBe('BUTTON');
            expect(trigger).toHaveClass('inline-flex', 'items-center', 'justify-center', 'whitespace-nowrap');
            expect(trigger).toHaveAttribute('data-slot', 'tabs-trigger');
        });

        it('shows active state for selected tab', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1" data-testid="active-trigger">Active Tab</TabsTrigger>
                        <TabsTrigger value="tab2" data-testid="inactive-trigger">Inactive Tab</TabsTrigger>
                    </TabsList>
                </Tabs>
            );

            const activeTrigger = screen.getByTestId('active-trigger');
            const inactiveTrigger = screen.getByTestId('inactive-trigger');

            expect(activeTrigger).toHaveAttribute('data-state', 'active');
            expect(inactiveTrigger).toHaveAttribute('data-state', 'inactive');
        });

        it('handles click events', async () => {
            const user = userEvent.setup();

            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content 1</TabsContent>
                    <TabsContent value="tab2">Content 2</TabsContent>
                </Tabs>
            );

            expect(screen.getByText('Content 1')).toBeInTheDocument();

            await user.click(screen.getByText('Tab 2'));

            expect(screen.getByText('Content 2')).toBeInTheDocument();
            expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
        });

        it('can be disabled', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2" disabled>Disabled Tab</TabsTrigger>
                    </TabsList>
                </Tabs>
            );

            const disabledTrigger = screen.getByText('Disabled Tab');
            expect(disabledTrigger).toBeDisabled();
        });

        it('applies custom className', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1" className="custom-trigger">Tab 1</TabsTrigger>
                    </TabsList>
                </Tabs>
            );

            expect(screen.getByText('Tab 1')).toHaveClass('custom-trigger');
        });
    });

    describe('TabsContent', () => {
        it('renders content for active tab', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1" data-testid="content">
                        <p>This is tab 1 content</p>
                    </TabsContent>
                </Tabs>
            );

            const content = screen.getByTestId('content');
            expect(content).toBeInTheDocument();
            expect(screen.getByText('This is tab 1 content')).toBeInTheDocument();
        });

        it('hides content for inactive tabs', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content 1</TabsContent>
                    <TabsContent value="tab2">Content 2</TabsContent>
                </Tabs>
            );

            expect(screen.getByText('Content 1')).toBeInTheDocument();
            expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
        });

        it('applies proper styles', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1" data-testid="content">
                        Content
                    </TabsContent>
                </Tabs>
            );

            const content = screen.getByTestId('content');
            expect(content).toHaveClass('flex-1', 'outline-none');
            expect(content).toHaveAttribute('data-slot', 'tabs-content');
        });

        it('applies custom className', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1" className="custom-content">
                        Content
                    </TabsContent>
                </Tabs>
            );

            expect(screen.getByText('Content')).toHaveClass('custom-content');
        });
    });

    describe('Complete Tabs Structure', () => {
        it('renders a complete tabs component with multiple tabs', () => {
            render(
                <Tabs defaultValue="overview">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <h3>Overview Content</h3>
                        <p>This is the overview tab content.</p>
                    </TabsContent>
                    <TabsContent value="analytics">
                        <h3>Analytics Content</h3>
                        <p>This is the analytics tab content.</p>
                    </TabsContent>
                    <TabsContent value="reports">
                        <h3>Reports Content</h3>
                        <p>This is the reports tab content.</p>
                    </TabsContent>
                </Tabs>
            );

            // Check all tabs are rendered
            expect(screen.getByText('Overview')).toBeInTheDocument();
            expect(screen.getByText('Analytics')).toBeInTheDocument();
            expect(screen.getByText('Reports')).toBeInTheDocument();

            // Check default content is shown
            expect(screen.getByText('Overview Content')).toBeInTheDocument();
            expect(screen.queryByText('Analytics Content')).not.toBeInTheDocument();
        });

        it('supports keyboard navigation', async () => {
            const user = userEvent.setup();

            render(
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content 1</TabsContent>
                    <TabsContent value="tab2">Content 2</TabsContent>
                </Tabs>
            );

            const tab1 = screen.getByText('Tab 1');
            const tab2 = screen.getByText('Tab 2');

            // Focus first tab
            tab1.focus();
            expect(tab1).toHaveFocus();

            // Navigate to second tab with arrow key
            await user.keyboard('{ArrowRight}');
            expect(tab2).toHaveFocus();

            // Activate with Enter
            await user.keyboard('{Enter}');
            expect(screen.getByText('Content 2')).toBeInTheDocument();
        });

        it('maintains accessibility attributes', () => {
            render(
                <Tabs defaultValue="tab1">
                    <TabsList role="tablist">
                        <TabsTrigger value="tab1" role="tab">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2" role="tab">Tab 2</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1" role="tabpanel">Content 1</TabsContent>
                    <TabsContent value="tab2" role="tabpanel">Content 2</TabsContent>
                </Tabs>
            );

            expect(screen.getByRole('tablist')).toBeInTheDocument();
            expect(screen.getAllByRole('tab')).toHaveLength(2);
            expect(screen.getByRole('tabpanel')).toBeInTheDocument();
        });
    });
});