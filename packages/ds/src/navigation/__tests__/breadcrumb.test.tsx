import { render, screen } from '@testing-library/react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '../breadcrumb';

const TestBreadcrumb = () => (
    <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbLink href="/components">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
    </Breadcrumb>
);

describe('Breadcrumb', () => {
    it('renders nav with aria-label=breadcrumb', () => {
        render(<TestBreadcrumb />);
        expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
    });

    it('renders all links', () => {
        render(<TestBreadcrumb />);
        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Components' })).toHaveAttribute('href', '/components');
    });

    it('current page has aria-current=page', () => {
        render(<TestBreadcrumb />);
        expect(screen.getByText('Breadcrumb')).toHaveAttribute('aria-current', 'page');
    });

    it('renders default separator (aria-hidden chevron icon)', () => {
        const { container } = render(<TestBreadcrumb />);
        const separators = container.querySelectorAll('[role="presentation"]');
        expect(separators).toHaveLength(2);
        // default separator is an aria-hidden icon, not a "/" text
        expect(screen.queryByText('/')).not.toBeInTheDocument();
        expect(separators[0].querySelector('svg')).toBeInTheDocument();
    });

    it('renders custom separator', () => {
        render(
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbSeparator>›</BreadcrumbSeparator>
                </BreadcrumbList>
            </Breadcrumb>
        );
        expect(screen.getByText('›')).toBeInTheDocument();
    });
});
