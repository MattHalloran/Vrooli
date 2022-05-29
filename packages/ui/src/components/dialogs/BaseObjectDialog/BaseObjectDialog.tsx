import {
    AppBar,
    Box,
    Dialog,
    IconButton,
    Slide,
    Stack,
    Toolbar,
    Tooltip,
    Typography,
    useScrollTrigger,
    useTheme,
} from '@mui/material';
import {
    ChevronLeft as PreviousIcon,
    ChevronRight as NextIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { UpTransition } from 'components';
import { useCallback, useState } from 'react';
import { BaseObjectDialogProps, ObjectDialogAction } from '../types';

/**
 * Dialog for displaying any "Add" form
 * @returns 
 */
export const BaseObjectDialog = ({
    children,
    onAction,
    open = true,
    title,
}: BaseObjectDialogProps) => {
    const { palette } = useTheme();

    const [scrollTarget, setScrollTarget] = useState<HTMLElement | undefined>(undefined);
    const scrollTrigger = useScrollTrigger({ target: scrollTarget });

    const onClose = useCallback(() => onAction(ObjectDialogAction.Close), [onAction]);
    const onPrevious = useCallback(() => onAction(ObjectDialogAction.Previous), [onAction]);
    const onNext = useCallback(() => onAction(ObjectDialogAction.Next), [onAction]);

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={UpTransition}
        >
            {/* TODO hide not working */}
            <Slide appear={false} direction="down" in={!scrollTrigger}>
                <AppBar ref={node => {
                    if (node) {
                        setScrollTarget(node);
                    }
                }}>
                    <Toolbar>
                        {/* Title */}
                        <Typography variant="h5">
                            {title}
                        </Typography>
                        {/* Close icon */}
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={onClose}
                            aria-label="close"
                            sx={{
                                marginLeft: 'auto',
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </Slide>
            <Box
                sx={{
                    background: palette.background.default,
                    flex: 'auto',
                    padding: 0,
                    paddingTop: { xs: '56px', sm: '64px' },
                    width: '100%',
                }}
            >
                {children}
            </Box>
        </Dialog>
    );
}