import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
} from '../table';

describe('Table Components', () => {
    describe('Table', () => {
        it('renders with container wrapper', () => {
            render(
                <Table data-testid="test-table">
                    <tbody>
                        <tr>
                            <td>Cell content</td>
                        </tr>
                    </tbody>
                </Table>
            );

            const container = document.querySelector('[data-slot="table-container"]');
            const table = screen.getByTestId('test-table');

            expect(container).toBeInTheDocument();
            expect(container).toHaveClass('relative');
            expect(container).toHaveClass('w-full');
            expect(container).toHaveClass('overflow-x-auto');

            expect(table).toBeInTheDocument();
            expect(table).toHaveAttribute('data-slot', 'table');
            expect(table).toHaveClass('w-full');
            expect(table).toHaveClass('caption-bottom');
            expect(table).toHaveClass('text-sm');
        });

        it('applies custom className to table', () => {
            render(<Table className="custom-table">Content</Table>);

            const table = document.querySelector('[data-slot="table"]');
            expect(table).toHaveClass('custom-table');
        });
    });

    describe('TableHeader', () => {
        it('renders with proper styling', () => {
            render(
                <table>
                    <TableHeader data-testid="header">
                        <tr>
                            <th>Header</th>
                        </tr>
                    </TableHeader>
                </table>
            );

            const header = screen.getByTestId('header');
            expect(header).toBeInTheDocument();
            expect(header).toHaveAttribute('data-slot', 'table-header');
            expect(header).toHaveClass('[&_tr]:border-b');
        });

        it('applies custom className', () => {
            render(
                <table>
                    <TableHeader className="custom-header">
                        <tr><th>Header</th></tr>
                    </TableHeader>
                </table>
            );

            const header = document.querySelector('[data-slot="table-header"]');
            expect(header).toHaveClass('custom-header');
        });
    });

    describe('TableBody', () => {
        it('renders with proper styling', () => {
            render(
                <table>
                    <TableBody data-testid="body">
                        <tr>
                            <td>Body content</td>
                        </tr>
                    </TableBody>
                </table>
            );

            const body = screen.getByTestId('body');
            expect(body).toBeInTheDocument();
            expect(body).toHaveAttribute('data-slot', 'table-body');
            expect(body).toHaveClass('[&_tr:last-child]:border-0');
        });

        it('applies custom className', () => {
            render(
                <table>
                    <TableBody className="custom-body">
                        <tr><td>Content</td></tr>
                    </TableBody>
                </table>
            );

            const body = document.querySelector('[data-slot="table-body"]');
            expect(body).toHaveClass('custom-body');
        });
    });

    describe('TableFooter', () => {
        it('renders with proper styling', () => {
            render(
                <table>
                    <TableFooter data-testid="footer">
                        <tr>
                            <td>Footer content</td>
                        </tr>
                    </TableFooter>
                </table>
            );

            const footer = screen.getByTestId('footer');
            expect(footer).toBeInTheDocument();
            expect(footer).toHaveAttribute('data-slot', 'table-footer');
            expect(footer).toHaveClass('bg-muted/50');
            expect(footer).toHaveClass('border-t');
            expect(footer).toHaveClass('font-medium');
        });
    });

    describe('TableRow', () => {
        it('renders with proper styling', () => {
            render(
                <table>
                    <tbody>
                        <TableRow data-testid="row">
                            <td>Row content</td>
                        </TableRow>
                    </tbody>
                </table>
            );

            const row = screen.getByTestId('row');
            expect(row).toBeInTheDocument();
            expect(row).toHaveAttribute('data-slot', 'table-row');
            expect(row).toHaveClass('hover:bg-muted/50');
            expect(row).toHaveClass('border-b');
            expect(row).toHaveClass('transition-colors');
        });

        it('supports selected state', () => {
            render(
                <table>
                    <tbody>
                        <TableRow data-state="selected">Selected row</TableRow>
                    </tbody>
                </table>
            );

            const row = document.querySelector('[data-state="selected"]');
            expect(row).toHaveClass('data-[state=selected]:bg-muted');
        });
    });

    describe('TableHead', () => {
        it('renders with proper styling', () => {
            render(
                <table>
                    <thead>
                        <tr>
                            <TableHead data-testid="head">Header Cell</TableHead>
                        </tr>
                    </thead>
                </table>
            );

            const head = screen.getByTestId('head');
            expect(head).toBeInTheDocument();
            expect(head).toHaveAttribute('data-slot', 'table-head');
            expect(head).toHaveClass('text-foreground');
            expect(head).toHaveClass('h-10');
            expect(head).toHaveClass('px-2');
            expect(head).toHaveClass('text-left');
            expect(head).toHaveClass('font-medium');
            expect(head).toHaveClass('whitespace-nowrap');
        });

        it('handles checkbox styling', () => {
            render(
                <table>
                    <thead>
                        <tr>
                            <TableHead>
                                <input type="checkbox" role="checkbox" />
                                Header with checkbox
                            </TableHead>
                        </tr>
                    </thead>
                </table>
            );

            const head = document.querySelector('[data-slot="table-head"]');
            expect(head).toHaveClass('[&:has([role=checkbox])]:pr-0');
            expect(head).toHaveClass('[&>[role=checkbox]]:translate-y-[2px]');
        });
    });

    describe('TableCell', () => {
        it('renders with proper styling', () => {
            render(
                <table>
                    <tbody>
                        <tr>
                            <TableCell data-testid="cell">Cell content</TableCell>
                        </tr>
                    </tbody>
                </table>
            );

            const cell = screen.getByTestId('cell');
            expect(cell).toBeInTheDocument();
            expect(cell).toHaveAttribute('data-slot', 'table-cell');
            expect(cell).toHaveClass('p-2');
            expect(cell).toHaveClass('align-middle');
            expect(cell).toHaveClass('whitespace-nowrap');
        });

        it('handles checkbox styling', () => {
            render(
                <table>
                    <tbody>
                        <tr>
                            <TableCell>
                                <input type="checkbox" role="checkbox" />
                                Cell with checkbox
                            </TableCell>
                        </tr>
                    </tbody>
                </table>
            );

            const cell = document.querySelector('[data-slot="table-cell"]');
            expect(cell).toHaveClass('[&:has([role=checkbox])]:pr-0');
            expect(cell).toHaveClass('[&>[role=checkbox]]:translate-y-[2px]');
        });
    });

    describe('TableCaption', () => {
        it('renders with proper styling', () => {
            render(
                <table>
                    <TableCaption data-testid="caption">Table caption</TableCaption>
                    <tbody>
                        <tr>
                            <td>Content</td>
                        </tr>
                    </tbody>
                </table>
            );

            const caption = screen.getByTestId('caption');
            expect(caption).toBeInTheDocument();
            expect(caption).toHaveAttribute('data-slot', 'table-caption');
            expect(caption).toHaveClass('text-muted-foreground');
            expect(caption).toHaveClass('mt-4');
            expect(caption).toHaveClass('text-sm');
        });
    });

    describe('Complete Table Structure', () => {
        it('renders a complete table with all components', () => {
            render(
                <Table>
                    <TableCaption>A list of test data</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>John Doe</TableCell>
                            <TableCell>john@example.com</TableCell>
                            <TableCell>Active</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Jane Smith</TableCell>
                            <TableCell>jane@example.com</TableCell>
                            <TableCell>Inactive</TableCell>
                        </TableRow>
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell>2 users</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            );

            // Check all components are rendered
            expect(screen.getByText('A list of test data')).toBeInTheDocument();
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText('Email')).toBeInTheDocument();
            expect(screen.getByText('Status')).toBeInTheDocument();
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('jane@example.com')).toBeInTheDocument();
            expect(screen.getByText('Total')).toBeInTheDocument();
            expect(screen.getByText('2 users')).toBeInTheDocument();

            // Check structure
            const table = document.querySelector('[data-slot="table"]');
            const container = document.querySelector('[data-slot="table-container"]');

            expect(container).toBeInTheDocument();
            expect(table).toBeInTheDocument();
        });

        it('maintains proper accessibility structure', () => {
            render(
                <Table role="table" aria-label="User data">
                    <TableHeader>
                        <TableRow role="row">
                            <TableHead role="columnheader">Name</TableHead>
                            <TableHead role="columnheader">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow role="row">
                            <TableCell role="cell">John</TableCell>
                            <TableCell role="cell">Active</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            );

            const table = document.querySelector('[role="table"]');
            const columnHeaders = screen.getAllByRole('columnheader');
            const cells = screen.getAllByRole('cell');
            const rows = screen.getAllByRole('row');

            expect(table).toHaveAttribute('aria-label', 'User data');
            expect(columnHeaders).toHaveLength(2);
            expect(cells).toHaveLength(2);
            expect(rows).toHaveLength(2); // Header row + body row
        });

        it('handles responsive overflow correctly', () => {
            render(
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Very long content that might overflow on small screens</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            );

            const container = document.querySelector('[data-slot="table-container"]');
            expect(container).toHaveClass('overflow-x-auto');
        });
    });
});