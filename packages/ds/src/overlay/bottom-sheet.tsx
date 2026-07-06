'use client';

import { CSSProperties, ComponentProps, PointerEvent as ReactPointerEvent, PropsWithChildren, ReactNode, createContext, useCallback, useContext, useRef, useState } from 'react';

import { cn } from '../lib/utils';
import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from '../primitives/dialog';

type BottomSheetContextValue = { setOpen: (open: boolean) => void };

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

const useBottomSheetContext = () => {
    const ctx = useContext(BottomSheetContext);
    if (!ctx) throw new Error('BottomSheet 하위 컴포넌트는 <BottomSheet> 안에서만 쓸 수 있습니다.');
    return ctx;
};

type BottomSheetProps = {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactNode;
};

/**
 * 모바일 하단에서 올라오는 바텀시트.
 * 손잡이를 아래로 끌면 닫히고(threshold 기반), 백드롭 탭·ESC·닫기 버튼으로도 닫힌다.
 * Radix Dialog 위에 얹어 포커스 트랩·스크롤 락·접근성을 그대로 얻는다. 스냅 포인트는 없다(열림/닫힘 2단).
 */
const BottomSheet = ({ open, defaultOpen = false, onOpenChange, children }: BottomSheetProps) => {
    const [uncontrolled, setUncontrolled] = useState(defaultOpen);
    const isControlled = open !== undefined;
    const actualOpen = isControlled ? open : uncontrolled;

    const setOpen = useCallback(
        (next: boolean) => {
            if (!isControlled) setUncontrolled(next);
            onOpenChange?.(next);
        },
        [isControlled, onOpenChange]
    );

    return (
        <BottomSheetContext.Provider value={{ setOpen }}>
            <Dialog open={actualOpen} onOpenChange={setOpen}>
                {children}
            </Dialog>
        </BottomSheetContext.Provider>
    );
};

const BottomSheetTrigger = DialogTrigger;
const BottomSheetClose = DialogClose;
const BottomSheetTitle = DialogTitle;

type BottomSheetContentProps = Omit<ComponentProps<typeof DialogContent>, 'children'> & {
    children: ReactNode;
    /** 상단 드래그 손잡이 노출 여부 */
    showHandle?: boolean;
    /** 이 픽셀 이상 끌어내리면 닫힌다 */
    closeThreshold?: number;
};

const BottomSheetContent = ({ className, children, showHandle = true, closeThreshold = 96, ...props }: BottomSheetContentProps) => {
    const { setOpen } = useBottomSheetContext();

    const [dragY, setDragY] = useState(0);
    // 드래그로 닫을 때 exit 애니메이션이 시작할 위치(px). 그래야 손 놓은 지점에서 이어서 내려간다.
    const [exitFrom, setExitFrom] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);
    const start = useRef({ y: 0, t: 0 });

    // 드래그 오프셋은 시트 높이(= translateY 100%)를 넘지 않게 막는다. 안 그러면 exit가 거꾸로 튄다.
    const clampDrag = (delta: number) => Math.min(contentRef.current?.offsetHeight ?? Infinity, Math.max(0, delta));

    const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        dragging.current = true;
        start.current = { y: event.clientY, t: event.timeStamp };
    };

    const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return;
        setDragY(clampDrag(event.clientY - start.current.y));
    };

    const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return;
        dragging.current = false;
        event.currentTarget.releasePointerCapture(event.pointerId);

        const distance = clampDrag(event.clientY - start.current.y);
        const elapsed = event.timeStamp - start.current.t;
        const velocity = elapsed > 0 ? distance / elapsed : 0; // px/ms

        // 충분히 끌어내렸거나(threshold) 빠르게 튕겼으면(velocity) 닫는다.
        if (distance > closeThreshold || velocity > 0.6) {
            setExitFrom(distance); // 손 놓은 지점에서 exit 애니메이션이 이어지도록
            setOpen(false);
        }
        setDragY(0);
    };

    return (
        <DialogPortal>
            <DialogOverlay className="z-backdrop fixed inset-0 bg-black/50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
            <DialogContent
                ref={contentRef}
                aria-describedby={undefined}
                onAnimationEnd={(event) => {
                    // exit 애니메이션이 끝나면 다음 닫기(버튼·백드롭)가 0에서 시작하도록 되돌린다.
                    if (event.animationName === 'sheet-out') setExitFrom(0);
                }}
                className={cn(
                    'z-modal bg-surface text-surface-foreground fixed inset-x-0 bottom-0 mx-auto flex max-h-[90dvh] w-full max-w-lg flex-col rounded-t-2xl pb-[env(safe-area-inset-bottom)] shadow-lg outline-none',
                    'data-[state=closed]:animate-sheet-out data-[state=open]:animate-sheet-in',
                    className
                )}
                style={
                    {
                        '--sheet-exit-from': `${exitFrom}px`,
                        transform: dragY ? `translateY(${dragY}px)` : undefined,
                        transition: dragging.current ? 'none' : 'transform var(--duration-normal) var(--ease-spring)'
                    } as CSSProperties
                }
                {...props}
            >
                {showHandle && (
                    <div
                        aria-hidden
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        className="flex shrink-0 cursor-grab touch-none justify-center pt-3 pb-1 active:cursor-grabbing"
                    >
                        <span className="bg-border h-1.5 w-10 rounded-full" />
                    </div>
                )}
                {children}
            </DialogContent>
        </DialogPortal>
    );
};

const BottomSheetHeader = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
    <div className={cn('flex shrink-0 items-center justify-between px-4 pt-1 pb-3', className)}>{children}</div>
);

const BottomSheetBody = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
    <div className={cn('min-h-0 flex-1 overflow-y-auto px-4 pb-4', className)}>{children}</div>
);

const BottomSheetFooter = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
    <div className={cn('flex shrink-0 gap-2 px-4 pt-3 pb-4', className)}>{children}</div>
);

export { BottomSheet, BottomSheetTrigger, BottomSheetClose, BottomSheetTitle, BottomSheetContent, BottomSheetHeader, BottomSheetBody, BottomSheetFooter };
