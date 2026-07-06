import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BottomSheet, BottomSheetBody, BottomSheetClose, BottomSheetContent, BottomSheetTitle, BottomSheetTrigger } from '../bottom-sheet';

const TestSheet = ({ showHandle }: { showHandle?: boolean }) => (
    <BottomSheet>
        <BottomSheetTrigger>Open Sheet</BottomSheetTrigger>
        <BottomSheetContent showHandle={showHandle}>
            <BottomSheetTitle>Sheet title</BottomSheetTitle>
            <BottomSheetBody>
                <p>Sheet content</p>
            </BottomSheetBody>
            <BottomSheetClose>Close</BottomSheetClose>
        </BottomSheetContent>
    </BottomSheet>
);

describe('BottomSheet', () => {
    it('renders trigger', () => {
        render(<TestSheet />);
        expect(screen.getByText('Open Sheet')).toBeInTheDocument();
    });

    it('content is not mounted while closed', () => {
        render(<TestSheet />);
        expect(screen.queryByText('Sheet content')).not.toBeInTheDocument();
    });

    it('opens on trigger click', async () => {
        const user = userEvent.setup();
        render(<TestSheet />);
        await user.click(screen.getByText('Open Sheet'));
        expect(screen.getByText('Sheet content')).toBeInTheDocument();
    });

    it('closes when close button is clicked', async () => {
        const user = userEvent.setup();
        render(<TestSheet />);
        await user.click(screen.getByText('Open Sheet'));
        expect(screen.getByText('Sheet content')).toBeInTheDocument();
        await user.click(screen.getByText('Close'));
        await waitFor(() => {
            expect(screen.queryByText('Sheet content')).not.toBeInTheDocument();
        });
    });

    it('renders a drag handle by default', async () => {
        const user = userEvent.setup();
        render(<TestSheet />);
        await user.click(screen.getByText('Open Sheet'));
        expect(document.body.querySelector('.cursor-grab')).toBeInTheDocument();
    });

    it('hides the drag handle when showHandle=false', async () => {
        const user = userEvent.setup();
        render(<TestSheet showHandle={false} />);
        await user.click(screen.getByText('Open Sheet'));
        expect(screen.getByText('Sheet content')).toBeInTheDocument();
        expect(document.body.querySelector('.cursor-grab')).not.toBeInTheDocument();
    });
});
