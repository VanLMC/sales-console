import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from '../card';

describe('Card Components', () => {
    describe('Card', () => {
        it('renders with default styling', () => {
            render(<Card data-testid="card">Card Content</Card>);

            const card = screen.getByTestId('card');
            expect(card).toBeInTheDocument();
            expect(card).toHaveClass('rounded-lg');
            expect(card).toHaveClass('border');
            expect(card).toHaveClass('bg-card');
            expect(card).toHaveClass('text-card-foreground');
            expect(card).toHaveClass('shadow-sm');
        });

        it('applies custom className', () => {
            render(<Card className="custom-card" data-testid="card">Content</Card>);

            const card = screen.getByTestId('card');
            expect(card).toHaveClass('custom-card');
        });

        it('forwards other props correctly', () => {
            render(<Card role="region" aria-label="Card region">Content</Card>);

            const card = screen.getByRole('region');
            expect(card).toHaveAttribute('aria-label', 'Card region');
        });
    });

    describe('CardHeader', () => {
        it('renders with proper styling', () => {
            render(<CardHeader data-testid="header">Header Content</CardHeader>);

            const header = screen.getByTestId('header');
            expect(header).toBeInTheDocument();
            expect(header).toHaveClass('flex');
            expect(header).toHaveClass('flex-col');
            expect(header).toHaveClass('space-y-1.5');
            expect(header).toHaveClass('p-6');
        });

        it('applies custom className', () => {
            render(<CardHeader className="custom-header" data-testid="header">Content</CardHeader>);

            const header = screen.getByTestId('header');
            expect(header).toHaveClass('custom-header');
        });
    });

    describe('CardTitle', () => {
        it('renders as h3 element with proper styling', () => {
            render(<CardTitle>Card Title</CardTitle>);

            const title = screen.getByRole('heading', { level: 3 });
            expect(title).toBeInTheDocument();
            expect(title).toHaveTextContent('Card Title');
            expect(title).toHaveClass('text-2xl');
            expect(title).toHaveClass('font-semibold');
            expect(title).toHaveClass('leading-none');
            expect(title).toHaveClass('tracking-tight');
        });

        it('applies custom className', () => {
            render(<CardTitle className="custom-title">Title</CardTitle>);

            const title = screen.getByRole('heading');
            expect(title).toHaveClass('custom-title');
        });
    });

    describe('CardDescription', () => {
        it('renders as paragraph with proper styling', () => {
            render(<CardDescription>Card description text</CardDescription>);

            const description = screen.getByText('Card description text');
            expect(description).toBeInTheDocument();
            expect(description.tagName).toBe('P');
            expect(description).toHaveClass('text-sm');
            expect(description).toHaveClass('text-muted-foreground');
        });

        it('applies custom className', () => {
            render(<CardDescription className="custom-desc">Description</CardDescription>);

            const description = screen.getByText('Description');
            expect(description).toHaveClass('custom-desc');
        });
    });

    describe('CardContent', () => {
        it('renders with proper styling', () => {
            render(<CardContent data-testid="content">Content text</CardContent>);

            const content = screen.getByTestId('content');
            expect(content).toBeInTheDocument();
            expect(content).toHaveClass('p-6');
            expect(content).toHaveClass('pt-0');
        });

        it('applies custom className', () => {
            render(<CardContent className="custom-content" data-testid="content">Content</CardContent>);

            const content = screen.getByTestId('content');
            expect(content).toHaveClass('custom-content');
        });
    });

    describe('CardFooter', () => {
        it('renders with proper styling', () => {
            render(<CardFooter data-testid="footer">Footer content</CardFooter>);

            const footer = screen.getByTestId('footer');
            expect(footer).toBeInTheDocument();
            expect(footer).toHaveClass('flex');
            expect(footer).toHaveClass('items-center');
            expect(footer).toHaveClass('p-6');
            expect(footer).toHaveClass('pt-0');
        });

        it('applies custom className', () => {
            render(<CardFooter className="custom-footer" data-testid="footer">Footer</CardFooter>);

            const footer = screen.getByTestId('footer');
            expect(footer).toHaveClass('custom-footer');
        });
    });

    describe('Complete Card Structure', () => {
        it('renders a complete card with all components', () => {
            render(
                <Card data-testid="complete-card">
                    <CardHeader>
                        <CardTitle>Test Card Title</CardTitle>
                        <CardDescription>Test card description</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>This is the card content</p>
                    </CardContent>
                    <CardFooter>
                        <button>Action Button</button>
                    </CardFooter>
                </Card>
            );

            const card = screen.getByTestId('complete-card');
            const title = screen.getByRole('heading', { level: 3 });
            const description = screen.getByText('Test card description');
            const content = screen.getByText('This is the card content');
            const button = screen.getByRole('button');

            expect(card).toBeInTheDocument();
            expect(title).toHaveTextContent('Test Card Title');
            expect(description).toBeInTheDocument();
            expect(content).toBeInTheDocument();
            expect(button).toHaveTextContent('Action Button');
        });

        it('maintains proper semantic structure', () => {
            render(
                <Card role="article" aria-labelledby="card-title">
                    <CardHeader>
                        <CardTitle id="card-title">Semantic Card</CardTitle>
                        <CardDescription>Accessible description</CardDescription>
                    </CardHeader>
                    <CardContent>
                        Content with proper semantics
                    </CardContent>
                </Card>
            );

            const card = screen.getByRole('article');
            const title = screen.getByRole('heading');

            expect(card).toHaveAttribute('aria-labelledby', 'card-title');
            expect(title).toHaveAttribute('id', 'card-title');
        });
    });
});