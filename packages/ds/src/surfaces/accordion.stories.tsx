import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent } from './accordion';

const meta: Meta = {
    title: 'Surfaces/Accordion',
    tags: ['autodocs'],
    parameters: { layout: 'padded' }
};

export default meta;

const faqItems = [
    { value: 'q1', question: '배송은 얼마나 걸리나요?', answer: '주문 확인 후 영업일 기준 1~3일 내에 출고되며, 출고 후 1~2일 내에 도착합니다.' },
    {
        value: 'q2',
        question: '반품 및 교환 정책은 어떻게 되나요?',
        answer: '상품 수령 후 7일 이내에 반품 또는 교환 신청이 가능합니다. 단, 사용 흔적이 있거나 포장이 훼손된 경우에는 불가합니다.'
    },
    { value: 'q3', question: '해외 배송이 가능한가요?', answer: '현재 국내 배송만 지원하고 있습니다. 해외 배송은 추후 지원 예정입니다.' }
];

const designSystemItems = [
    {
        value: 'included',
        question: "What's included in the design system?",
        answer: 'Color tokens, type scale, shadow + radius scales, motion tokens, and ~25 React components built on Radix primitives.'
    },
    {
        value: 'palette',
        question: 'Can I customize the brand palette?',
        answer: 'Yes — override semantic tokens in theme.css or your app @theme block. Primary defaults to tangerine.'
    },
    {
        value: 'dark',
        question: 'Does it support dark mode?',
        answer: 'Not in the current kit. Components are light-only; dark mode would be a separate token pass.'
    }
];

export const Single: StoryObj<typeof Accordion> = {
    name: 'Single (하나만 열림)',
    render: () => (
        <Accordion type="single" collapsible>
            {faqItems.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                    <AccordionHeader>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                    </AccordionHeader>
                    <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
};

export const Multiple: StoryObj<typeof Accordion> = {
    name: 'Multiple (여러 개 열림)',
    render: () => (
        <Accordion type="multiple">
            {faqItems.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                    <AccordionHeader>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                    </AccordionHeader>
                    <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
};

export const DefaultOpen: StoryObj<typeof Accordion> = {
    name: 'Default Open',
    render: () => (
        <Accordion type="single" defaultValue="included" collapsible>
            {designSystemItems.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                    <AccordionHeader>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                    </AccordionHeader>
                    <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
};
