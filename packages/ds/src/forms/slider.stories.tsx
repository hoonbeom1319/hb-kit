import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Slider } from './slider';

const meta: Meta<typeof Slider> = {
    title: 'Forms/Slider',
    component: Slider,
    tags: ['autodocs'],
    parameters: { layout: 'centered' }
};

export default meta;

export const Default: StoryObj = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState([50]);
            return (
                <div className="flex flex-col gap-3 w-72">
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">볼륨</span>
                        <span className="font-medium text-neutral-800">{value[0]}</span>
                    </div>
                    <Slider value={value} onValueChange={setValue} min={0} max={100} step={1} />
                </div>
            );
        };
        return <Demo />;
    }
};

export const Disabled: StoryObj = {
    render: () => (
        <div className="flex flex-col gap-3 w-72">
            <div className="flex justify-between text-sm">
                <span className="text-neutral-500">비활성화</span>
                <span className="font-medium text-neutral-400">30</span>
            </div>
            <Slider defaultValue={[30]} disabled />
        </div>
    )
};
