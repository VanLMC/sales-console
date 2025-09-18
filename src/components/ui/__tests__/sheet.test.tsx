import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
} from '../sheet';

describe('Sheet Components', () => {
    describe('Sheet', () => {
        it('renders trigger and opens sheet on click', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Open Sheet</SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Sheet Title</SheetTitle>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            );

            const trigger = screen.getByText('Open Sheet');
            expect(trigger).toBeInTheDocument();

            await user.click(trigger);

            expect(screen.getByText('Sheet Title')).toBeInTheDocument();
        });

        it('supports controlled mode', () => {
            const onOpenChange = vi.fn();

            render(
                <Sheet open={true} onOpenChange={onOpenChange}>
                    <SheetTrigger>Open Sheet</SheetTrigger>
                    <SheetContent>
                        <SheetTitle>Controlled Sheet</SheetTitle>
                    </SheetContent>
                </Sheet>
            );

            expect(screen.getByText('Controlled Sheet')).toBeInTheDocument();
        });
    });

    describe('SheetTrigger', () => {
        it('renders as button by default', () => {
            render(
                <Sheet>
                    <SheetTrigger data-testid="trigger">Trigger</SheetTrigger>
                    <SheetContent>Content</SheetContent>
                </Sheet>
            );

            const trigger = screen.getByTestId('trigger');
            expect(trigger.tagName).toBe('BUTTON');
            expect(trigger).toHaveAttribute('data-slot', 'sheet-trigger');
        });

        it('can render as child component', () => {
            render(
                <Sheet>
                    <SheetTrigger asChild>
                        <a href="#" data-testid="link-trigger">Link Trigger</a>
                    </SheetTrigger>
                    <SheetContent>Content</SheetContent>
                </Sheet>
            );

            const trigger = screen.getByTestId('link-trigger');
            expect(trigger.tagName).toBe('A');
        });

        it('applies custom className', () => {
            render(
                <Sheet>
                    <SheetTrigger className="custom-trigger">Trigger</SheetTrigger>
                    <SheetContent>Content</SheetContent>
                </Sheet>
            );

            expect(screen.getByText('Trigger')).toHaveClass('custom-trigger');
        });
    });

    describe('SheetContent', () => {
        it('renders with default side (right)', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Open</SheetTrigger>
                    <SheetContent data-testid="content">
                        <SheetTitle>Content</SheetTitle>
                    </SheetContent>
                </Sheet>
            );

            await user.click(screen.getByText('Open'));

            const content = screen.getByTestId('content');
            expect(content).toBeInTheDocument();
            expect(content).toHaveClass('inset-y-0', 'right-0', 'h-full', 'w-3/4');
        });

        it('renders with different sides', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Open</SheetTrigger>
                    <SheetContent side="left" data-testid="content">
                        <SheetTitle>Left Sheet</SheetTitle>
                    </SheetContent>
                </Sheet>
            );

            await user.click(screen.getByText('Open'));
            expect(screen.getByTestId('content')).toHaveClass('inset-y-0', 'left-0');
        });

        it('applies custom className', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Open</SheetTrigger>
                    <SheetContent className="custom-content">
                        <SheetTitle>Content</SheetTitle>
                    </SheetContent>
                </Sheet>
            );

            await user.click(screen.getByText('Open'));

            expect(screen.getByText('Content').closest('[role="dialog"]')).toHaveClass('custom-content');
        });

        it('has proper data attributes', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Open</SheetTrigger>
                    <SheetContent data-testid="content">
                        <SheetTitle>Content</SheetTitle>
                    </SheetContent>
                </Sheet>
            );

            await user.click(screen.getByText('Open'));

            const content = screen.getByTestId('content');
            expect(content).toHaveAttribute('data-slot', 'sheet-content');
        });
    });

    describe('SheetHeader', () => {
        it('renders with proper spacing', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Open</SheetTrigger>
                    <SheetContent>
                        <SheetHeader data-testid="header">
                            <SheetTitle>Title</SheetTitle>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            );

            await user.click(screen.getByText('Open'));

            const header = screen.getByTestId('header');
            expect(header).toBeInTheDocument();
            expect(header).toHaveClass('flex', 'flex-col', 'gap-1.5', 'p-4');
            expect(header).toHaveAttribute('data-slot', 'sheet-header');
        });

        it('applies custom className', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Open</SheetTrigger>
                    <SheetContent>
                        <SheetHeader className="custom-header">
                            <SheetTitle>Title</SheetTitle>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            );

            await user.click(screen.getByText('Open'));

            expect(screen.getByText('Title').parentElement).toHaveClass('custom-header');
        });
    });

    describe('SheetFooter', () => {
        it('renders with proper layout', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Open</SheetTrigger>
                    <SheetContent>
                        <SheetTitle>Title</SheetTitle>
                        <SheetFooter data-testid="footer">
                            <button>Cancel</button>
                            <button>Save</button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            );

            await user.click(screen.getByText('Open'));

            const footer = screen.getByTestId('footer');
            expect(footer).toBeInTheDocument();
            expect(footer).toHaveClass('mt-auto', 'flex', 'flex-col', 'gap-2', 'p-4');
            expect(footer).toHaveAttribute('data-slot', 'sheet-footer');
        });

        it('applies custom className', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Open</SheetTrigger>
                    <SheetContent>
                        <SheetTitle>Title</SheetTitle>
                        <SheetFooter className="custom-footer">
                            <button>Action</button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            );

            await user.click(screen.getByText('Open'));

            expect(screen.getByText('Action').parentElement).toHaveClass('custom-footer');
        });
    });

    describe('SheetTitle', () => {
        it('renders as h2 by default', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Open</SheetTrigger>
                    <SheetContent>
                        <SheetTitle>Sheet Title</SheetTitle>
                    </SheetContent>
                </Sheet>
            );

            await user.click(screen.getByText('Open'));

            const title = screen.getByRole('heading', { level: 2 });
            expect(title).toBeInTheDocument();
            expect(title).toHaveTextContent('Sheet Title');
        });

        it('has proper typography styles', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Open</SheetTrigger>
                    <SheetContent>
                        <SheetTitle data-testid="title">Title</SheetTitle>
                    </SheetContent>
                </Sheet>
            );

            await user.click(screen.getByText('Open'));

            const title = screen.getByTestId('title');
            expect(title).toHaveClass('text-foreground', 'font-semibold');
            expect(title).toHaveAttribute('data-slot', 'sheet-title');
        });

        it('applies custom className', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Open</SheetTrigger>
                    <SheetContent>
                        <SheetTitle className="custom-title">Title</SheetTitle>
                    </SheetContent>
                </Sheet>
            );

            await user.click(screen.getByText('Open'));

            expect(screen.getByRole('heading')).toHaveClass('custom-title');
        });
    });

    describe('SheetDescription', () => {
        it('renders with muted text style', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Open</SheetTrigger>
                    <SheetContent>
                        <SheetTitle>Title</SheetTitle>
                        <SheetDescription data-testid="description">
                            This is a description
                        </SheetDescription>
                    </SheetContent>
                </Sheet>
            );

            await user.click(screen.getByText('Open'));

            const description = screen.getByTestId('description');
            expect(description).toBeInTheDocument();
            expect(description).toHaveClass('text-muted-foreground', 'text-sm');
            expect(description).toHaveAttribute('data-slot', 'sheet-description');
        });

        it('applies custom className', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Open</SheetTrigger>
                    <SheetContent>
                        <SheetTitle>Title</SheetTitle>
                        <SheetDescription className="custom-description">
                            Description
                        </SheetDescription>
                    </SheetContent>
                </Sheet>
            );

            await user.click(screen.getByText('Open'));

            expect(screen.getByText('Description')).toHaveClass('custom-description');
        });
    });

    describe('SheetClose', () => {
        it('closes the sheet when clicked', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Open Sheet</SheetTrigger>
                    <SheetContent>
                        <SheetTitle>Sheet Title</SheetTitle>
                        <SheetClose>Close Button</SheetClose>
                    </SheetContent>
                </Sheet>
            );

            await user.click(screen.getByText('Open Sheet'));
            expect(screen.getByText('Sheet Title')).toBeInTheDocument();

            await user.click(screen.getByText('Close Button'));
            expect(screen.queryByText('Sheet Title')).not.toBeInTheDocument();
        });

        it('can render as child component', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Open</SheetTrigger>
                    <SheetContent>
                        <SheetTitle>Title</SheetTitle>
                        <SheetClose asChild>
                            <button className="custom-close">Custom Close</button>
                        </SheetClose>
                    </SheetContent>
                </Sheet>
            );

            await user.click(screen.getByText('Open'));

            const closeButton = screen.getByText('Custom Close');
            expect(closeButton).toHaveClass('custom-close');
        });

        // Note: SheetClose requires Sheet context, tested in integration tests above
    });

    describe('Complete Sheet Structure', () => {
        it('renders a complete sheet with all components', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Edit Profile</SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Edit Profile</SheetTitle>
                            <SheetDescription>
                                Make changes to your profile here. Click save when you're done.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <input placeholder="Name" />
                            <input placeholder="Email" />
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <button>Cancel</button>
                            </SheetClose>
                            <button>Save changes</button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            );

            await user.click(screen.getByText('Edit Profile'));

            expect(screen.getByRole('heading', { name: 'Edit Profile' })).toBeInTheDocument();
            expect(screen.getByText('Make changes to your profile here. Click save when you\'re done.')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
            expect(screen.getByText('Cancel')).toBeInTheDocument();
            expect(screen.getByText('Save changes')).toBeInTheDocument();
        });

        it('supports keyboard navigation and escape key', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Open</SheetTrigger>
                    <SheetContent>
                        <SheetTitle>Sheet</SheetTitle>
                        <button>Button 1</button>
                        <button>Button 2</button>
                    </SheetContent>
                </Sheet>
            );

            await user.click(screen.getByText('Open'));
            expect(screen.getByText('Sheet')).toBeInTheDocument();

            // Close with Escape key
            await user.keyboard('{Escape}');
            expect(screen.queryByText('Sheet')).not.toBeInTheDocument();
        });

        it('maintains accessibility attributes', async () => {
            const user = userEvent.setup();

            render(
                <Sheet>
                    <SheetTrigger>Open Sheet</SheetTrigger>
                    <SheetContent>
                        <SheetTitle>Accessible Sheet</SheetTitle>
                        <SheetDescription>This sheet is accessible</SheetDescription>
                    </SheetContent>
                </Sheet>
            );

            await user.click(screen.getByText('Open Sheet'));

            const dialog = screen.getByRole('dialog');
            expect(dialog).toBeInTheDocument();
            expect(dialog).toHaveAttribute('aria-describedby');
        });
    });
});