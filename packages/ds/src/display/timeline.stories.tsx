import type { Meta, StoryObj } from '@storybook/react';
import { Timeline, TimelineItem, TimelineDot, TimelineContent } from './timeline';

const meta: Meta = {
    title: 'Display/Timeline',
    tags: ['autodocs'],
    parameters: { layout: 'padded' }
};

export default meta;

export const Basic: StoryObj = {
    render: () => (
        <Timeline className="max-w-sm">
            <TimelineItem>
                <TimelineDot className="bg-primary-500" />
                <TimelineContent>
                    <p className="text-sm font-medium">주문 완료</p>
                    <p className="text-xs text-neutral-400">2024.01.10 14:32</p>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineDot className="bg-primary-500" />
                <TimelineContent>
                    <p className="text-sm font-medium">결제 확인</p>
                    <p className="text-xs text-neutral-400">2024.01.10 15:00</p>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineDot className="bg-primary-500" />
                <TimelineContent>
                    <p className="text-sm font-medium">배송 준비 중</p>
                    <p className="text-xs text-neutral-400">2024.01.11 09:15</p>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineDot className="bg-neutral-200" />
                <TimelineContent>
                    <p className="text-sm font-medium text-neutral-400">배송 중</p>
                    <p className="text-xs text-neutral-300">예정</p>
                </TimelineContent>
            </TimelineItem>
        </Timeline>
    )
};

export const WithConnector: StoryObj = {
    name: 'With Connector Line',
    render: () => (
        <Timeline className="max-w-sm">
            {[
                { label: '접수', date: '01.08', color: 'bg-success', active: true },
                { label: '검토 중', date: '01.09', color: 'bg-success', active: true },
                { label: '승인', date: '01.10', color: 'bg-success', active: true },
                { label: '처리 완료', date: '01.11', color: 'bg-neutral-200', active: false }
            ].map((step, i) => (
                <TimelineItem key={i} className="relative">
                    {i < 3 && (
                        <span className="absolute top-3 left-[5px] h-full w-px bg-neutral-200" />
                    )}
                    <TimelineDot className={`z-10 ${step.color}`} />
                    <TimelineContent>
                        <p className={`text-sm font-medium ${step.active ? '' : 'text-neutral-400'}`}>{step.label}</p>
                        <p className="text-xs text-neutral-400">{step.date}</p>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
)
};

export const StatusVariants: StoryObj = {
    name: 'Status Variants',
    render: () => (
        <Timeline className="max-w-sm">
            <TimelineItem>
                <TimelineDot className="bg-success" />
                <TimelineContent>
                    <p className="text-sm font-medium">성공</p>
                    <p className="text-xs text-neutral-400">처리가 완료되었습니다</p>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineDot className="bg-warning" />
                <TimelineContent>
                    <p className="text-sm font-medium">경고</p>
                    <p className="text-xs text-neutral-400">주의가 필요합니다</p>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineDot className="bg-danger" />
                <TimelineContent>
                    <p className="text-sm font-medium">오류</p>
                    <p className="text-xs text-neutral-400">처리 중 오류가 발생했습니다</p>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineDot className="bg-neutral-300" />
                <TimelineContent>
                    <p className="text-sm font-medium text-neutral-400">대기</p>
                    <p className="text-xs text-neutral-300">처리를 기다리는 중입니다</p>
                </TimelineContent>
            </TimelineItem>
        </Timeline>
    )
};
