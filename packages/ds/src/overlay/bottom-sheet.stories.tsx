import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { BottomSheet, BottomSheetBody, BottomSheetClose, BottomSheetContent, BottomSheetFooter, BottomSheetHeader, BottomSheetTitle, BottomSheetTrigger } from './bottom-sheet';
import { Button } from '../display/button';

const meta: Meta = {
    title: 'Overlay/BottomSheet',
    tags: ['autodocs'],
    parameters: { layout: 'centered' }
};

export default meta;

export const Basic: StoryObj = {
    name: 'Basic (기본)',
    render: () => {
        const Demo = () => {
            const [open, setOpen] = useState(false);
            return (
                <BottomSheet open={open} onOpenChange={setOpen}>
                    <BottomSheetTrigger asChild>
                        <Button>바텀시트 열기</Button>
                    </BottomSheetTrigger>
                    <BottomSheetContent>
                        <BottomSheetHeader>
                            <BottomSheetTitle className="text-base font-semibold">공유하기</BottomSheetTitle>
                            <BottomSheetClose asChild>
                                <Button variant="ghost" size="sm">
                                    닫기
                                </Button>
                            </BottomSheetClose>
                        </BottomSheetHeader>
                        <BottomSheetBody>
                            <p className="text-sm text-neutral-600">손잡이를 아래로 끌어내리면 닫힙니다. 백드롭 탭이나 ESC로도 닫을 수 있어요.</p>
                        </BottomSheetBody>
                        <BottomSheetFooter>
                            <BottomSheetClose asChild>
                                <Button variant="outline" className="flex-1">
                                    취소
                                </Button>
                            </BottomSheetClose>
                            <Button className="flex-1" onClick={() => setOpen(false)}>
                                확인
                            </Button>
                        </BottomSheetFooter>
                    </BottomSheetContent>
                </BottomSheet>
            );
        };
        return <Demo />;
    }
};

export const LongContent: StoryObj = {
    name: 'Scrollable (긴 내용)',
    render: () => {
        const Demo = () => {
            const [open, setOpen] = useState(false);
            return (
                <BottomSheet open={open} onOpenChange={setOpen}>
                    <BottomSheetTrigger asChild>
                        <Button>메뉴 열기</Button>
                    </BottomSheetTrigger>
                    <BottomSheetContent>
                        <BottomSheetHeader>
                            <BottomSheetTitle className="text-base font-semibold">옵션 선택</BottomSheetTitle>
                        </BottomSheetHeader>
                        <BottomSheetBody>
                            <ul className="flex flex-col">
                                {Array.from({ length: 20 }, (_, i) => (
                                    <li key={i} className="border-border/60 border-b py-3 text-sm text-neutral-700 last:border-0">
                                        옵션 항목 {i + 1}
                                    </li>
                                ))}
                            </ul>
                        </BottomSheetBody>
                    </BottomSheetContent>
                </BottomSheet>
            );
        };
        return <Demo />;
    }
};

export const NoHandle: StoryObj = {
    name: 'No Handle (손잡이 없음)',
    render: () => {
        const Demo = () => {
            const [open, setOpen] = useState(false);
            return (
                <BottomSheet open={open} onOpenChange={setOpen}>
                    <BottomSheetTrigger asChild>
                        <Button variant="outline">손잡이 없는 시트</Button>
                    </BottomSheetTrigger>
                    <BottomSheetContent showHandle={false}>
                        <BottomSheetHeader>
                            <BottomSheetTitle className="text-base font-semibold">알림</BottomSheetTitle>
                        </BottomSheetHeader>
                        <BottomSheetBody>
                            <p className="text-sm text-neutral-600">showHandle=false — 드래그 손잡이 없이 백드롭 탭/버튼으로만 닫습니다.</p>
                        </BottomSheetBody>
                        <BottomSheetFooter>
                            <Button className="w-full" onClick={() => setOpen(false)}>
                                확인
                            </Button>
                        </BottomSheetFooter>
                    </BottomSheetContent>
                </BottomSheet>
            );
        };
        return <Demo />;
    }
};
