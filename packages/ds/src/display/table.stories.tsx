import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from './table';

const meta: Meta = {
    title: 'Display/Table',
    tags: ['autodocs'],
    parameters: { layout: 'padded' }
};

export default meta;

const invoices = [
    { id: 'INV-001', name: '김훈범', status: '완료', amount: '₩120,000' },
    { id: 'INV-002', name: '이지수', status: '대기', amount: '₩85,000' },
    { id: 'INV-003', name: '박성현', status: '취소', amount: '₩240,000' },
    { id: 'INV-004', name: '최유진', status: '완료', amount: '₩55,000' }
];

const statusClass: Record<string, string> = {
    완료: 'bg-success/10 text-success',
    대기: 'bg-warning/10 text-warning',
    취소: 'bg-danger/10 text-danger'
};

export const Basic: StoryObj = {
    render: () => (
        <Table>
            <TableHeader>
                <TableRow className="border-b border-neutral-200">
                    <TableHead>번호</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">금액</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.map((row) => (
                    <TableRow key={row.id} className="border-b border-neutral-100">
                        <TableCell className="text-neutral-400">{row.id}</TableCell>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass[row.status]}`}>
                                {row.status}
                            </span>
                        </TableCell>
                        <TableCell className="text-right">{row.amount}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
};

export const WithCaption: StoryObj = {
    name: 'With Caption',
    render: () => (
        <Table>
            <TableCaption>최근 청구 내역</TableCaption>
            <TableHeader>
                <TableRow className="border-b border-neutral-200">
                    <TableHead>이름</TableHead>
                    <TableHead>금액</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.slice(0, 2).map((row) => (
                    <TableRow key={row.id} className="border-b border-neutral-100">
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>{row.amount}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
};

export const WithFooter: StoryObj = {
    name: 'With Footer',
    render: () => (
        <Table>
            <TableHeader>
                <TableRow className="border-b border-neutral-200">
                    <TableHead>이름</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">금액</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.map((row) => (
                    <TableRow key={row.id} className="border-b border-neutral-100">
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell className="text-right">{row.amount}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow className="border-t border-neutral-200 bg-neutral-50">
                    <TableCell colSpan={2} className="font-medium">합계</TableCell>
                    <TableCell className="text-right font-semibold">₩500,000</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
};
