import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Button } from '../display/button';

const meta: Meta = {
    title: 'Overlay/Tooltip',
    tags: ['autodocs'],
    parameters: { layout: 'centered' }
};

export default meta;

export const Default: StoryObj = {
    render: () => (
        <TooltipProvider delayDuration={0}>
            <Tooltip defaultOpen>
                <TooltipTrigger asChild>
                    <Button variant="outline">호버해 보세요</Button>
                </TooltipTrigger>
                <TooltipContent>아이템을 클립보드에 복사합니다</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
};

export const Sides: StoryObj = {
    render: () => (
        <TooltipProvider delayDuration={0}>
            <div className="grid grid-cols-2 gap-x-32 gap-y-20 p-16">
                {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                    <Tooltip key={side} defaultOpen>
                        <TooltipTrigger asChild>
                            <Button variant="outline" className="w-24">{side}</Button>
                        </TooltipTrigger>
                        <TooltipContent side={side}>side = {side}</TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    )
};

export const DelayDuration: StoryObj = {
    render: () => (
        <TooltipProvider delayDuration={800}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline">800ms 딜레이 후 표시</Button>
                </TooltipTrigger>
                <TooltipContent>delayDuration=800</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
};
