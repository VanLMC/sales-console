import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
    SelectSeparator,
} from '../select';

describe('Select Components', () => {
    describe('Select', () => {
        it('renders with default value', () => {
            render(
                <Select defaultValue="option1">
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                    </SelectContent>
                </Select>
            );

            expect(screen.getByRole('combobox')).toBeInTheDocument();
            expect(screen.getByText('Option 1')).toBeInTheDocument();
        });

        it('supports controlled mode', () => {
            const onValueChange = vi.fn();

            render(
                <Select value="option2" onValueChange={onValueChange}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                    </SelectContent>
                </Select>
            );

            expect(screen.getByText('Option 2')).toBeInTheDocument();
        });

        it('can be disabled', () => {
            render(
                <Select disabled>
                    <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                    </SelectContent>
                </Select>
            );

            const trigger = screen.getByRole('combobox');
            expect(trigger).toBeDisabled();
        });
    });

    describe('SelectTrigger', () => {
        it('renders with proper styles', () => {
            render(
                <Select>
                    <SelectTrigger data-testid="trigger">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                    </SelectContent>
                </Select>
            );

            const trigger = screen.getByTestId('trigger');
            expect(trigger).toHaveClass('flex', 'w-full', 'items-center', 'justify-between');
        });

        it('applies custom className', () => {
            render(
                <Select>
                    <SelectTrigger className="custom-trigger">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                    </SelectContent>
                </Select>
            );

            expect(screen.getByRole('combobox')).toHaveClass('custom-trigger');
        });

        it('has proper data attributes', () => {
            render(
                <Select>
                    <SelectTrigger data-testid="trigger">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                    </SelectContent>
                </Select>
            );

            const trigger = screen.getByTestId('trigger');
            expect(trigger).toHaveAttribute('data-slot', 'select-trigger');
            expect(trigger).toHaveAttribute('data-size', 'default');
        });
    });

    describe('SelectValue', () => {
        it('shows placeholder when no value selected', () => {
            render(
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose an option" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                    </SelectContent>
                </Select>
            );

            expect(screen.getByText('Choose an option')).toBeInTheDocument();
        });

        it('shows selected value', () => {
            render(
                <Select defaultValue="option1">
                    <SelectTrigger>
                        <SelectValue placeholder="Choose an option" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="option1">Selected Option</SelectItem>
                    </SelectContent>
                </Select>
            );

            expect(screen.getByText('Selected Option')).toBeInTheDocument();
            expect(screen.queryByText('Choose an option')).not.toBeInTheDocument();
        });
    });

    describe('Component Integration', () => {
        it('renders a complete select structure', () => {
            render(
                <Select defaultValue="apple">
                    <SelectTrigger>
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Popular Fruits</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                        </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                            <SelectLabel>Exotic Fruits</SelectLabel>
                            <SelectItem value="mango">Mango</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            );

            // Check initial state
            expect(screen.getByText('Apple')).toBeInTheDocument();
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        it('maintains accessibility attributes', () => {
            render(
                <Select>
                    <SelectTrigger aria-label="Fruit selector">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="apple">Apple</SelectItem>
                    </SelectContent>
                </Select>
            );

            const trigger = screen.getByRole('combobox');
            expect(trigger).toHaveAttribute('aria-label', 'Fruit selector');
            expect(trigger).toHaveAttribute('aria-expanded', 'false');
        });

        it('supports different trigger sizes', () => {
            render(
                <Select>
                    <SelectTrigger size="sm" data-testid="small-trigger">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                    </SelectContent>
                </Select>
            );

            const trigger = screen.getByTestId('small-trigger');
            expect(trigger).toHaveAttribute('data-size', 'sm');
        });
    });
});