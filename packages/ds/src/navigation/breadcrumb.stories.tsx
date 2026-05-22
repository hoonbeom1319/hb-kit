import type { Meta, StoryObj } from '@storybook/react';

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './breadcrumb';

const meta: Meta = {
    title: 'Navigation/Breadcrumb',
    tags: ['autodocs'],
    parameters: { layout: 'padded' }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: () => (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>Components</BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
};

export const CustomSeparator: Story = {
    render: () => (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>›</BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">Docs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>›</BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Components</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
};

export const LinkAsButton: Story = {
    render: () => (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <button type="button">Home</button>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">Docs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Components</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
};
