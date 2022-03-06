/**
 * Drawer to display overall orchestration info on the orchestration page. 
 * Swipes left from right of screen
 */
import { useCallback, useMemo, useState } from 'react';
import {
    Cancel as CancelIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    Info as InfoIcon,
    Update as UpdateIcon,
    QueryStats as StatsIcon,
    ForkRight as ForkIcon,
} from '@mui/icons-material';
import {
    Box,
    Checkbox,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    SwipeableDrawer,
    Tooltip,
    Typography,
} from '@mui/material';
import { OrchestrationInfoDialogProps } from '../types';
import { Organization, User } from 'types';
import Markdown from 'markdown-to-jsx';
import { ResourceListHorizontal } from 'components';
import { SvgIconComponent } from '@mui/icons-material';
import { DeleteRoutineDialog } from '..';

enum ActionOption {
    Cancel = 'cancel',
    Delete = 'delete',
    Fork = 'fork',
    Stats = 'stats',
    Update = 'update',
}

export const OrchestrationInfoDialog = ({
    handleUpdate,
    isEditing,
    routine,
    sxs,
}: OrchestrationInfoDialogProps) => {
    // Open boolean for drawer
    const [open, setOpen] = useState(false);
    // Open boolean for delete routine confirmation
    const [deleteOpen, setDeleteOpen] = useState(false);
    const toggleOpen = () => setOpen(o => !o);
    const closeMenu = () => setOpen(false);

    /**
     * Name of user or organization that owns this routine
     */
    const ownedBy = useMemo<string | null>(() => {
        if (!routine?.owner) return null;
        return (routine.owner as User)?.username ?? (routine.owner as Organization)?.name ?? null;
    }, [routine?.owner]);

    /**
     * Determines which action buttons to display
     */
    const actions = useMemo(() => {
        // [value, label, icon]
        const results: [ActionOption, string, any][] = [];
        // If editing, show "Update", "Cancel", and "Delete" buttons
        if (isEditing) {
            results.push(
                [ActionOption.Update, 'Update', UpdateIcon],
                [ActionOption.Cancel, 'Cancel', CancelIcon],
                [ActionOption.Delete, 'Delete', DeleteIcon],
            )
        }
        // If not editing, show "Stats" and "Fork" buttons
        else {
            results.push(
                [ActionOption.Stats, 'Stats', StatsIcon],
                [ActionOption.Fork, 'Fork', ForkIcon],
            )
        }
        return results;
    }, [isEditing, routine]);

    const handleAction = useCallback((option: ActionOption) => {
        //TODO
    }, []);

    return (
        <>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleOpen}>
                <InfoIcon sx={sxs?.icon} />
            </IconButton>
            <SwipeableDrawer
                anchor="right"
                open={open}
                onOpen={() => { }}
                onClose={closeMenu}
                sx={{
                    '& .MuiDrawer-paper': {
                        background: (t) => t.palette.background.default,
                        borderLeft: `1px solid ${(t) => t.palette.text.primary}`,
                        maxWidth: { xs: '100%', sm: '75%', md: '50%', lg: '40%', xl: '30%' },
                    }
                }}
            >
                {/* Title bar */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    background: (t) => t.palette.primary.dark,
                    color: (t) => t.palette.primary.contrastText,
                    padding: 1,
                }}>
                    {/* Title, created by, and version  */}
                    <Stack direction="column" spacing={1} alignItems="center" sx={{ marginLeft: 'auto' }}>
                        <Typography variant="h5">{routine?.title}</Typography>
                        <Stack direction="row" spacing={1}>
                            {ownedBy ? <Typography variant="body1">{ownedBy} - </Typography> : null}
                            <Typography variant="body1">{routine?.version}</Typography>
                        </Stack>
                    </Stack>
                    <IconButton onClick={closeMenu} sx={{
                        color: (t) => t.palette.primary.contrastText,
                        borderRadius: 0,
                        borderBottom: `1px solid ${(t) => t.palette.primary.dark}`,
                        justifyContent: 'end',
                        flexDirection: 'row-reverse',
                        marginLeft: 'auto',
                    }}>
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </Box>
                {/* Main content */}
                {/* Stack that shows routine info, such as resources, description, inputs/outputs */}
                <Stack direction="column" spacing={2} padding={1}>
                    {/* Resources */}
                    <ResourceListHorizontal />
                    {/* Description */}
                    <Box sx={{
                        padding: 1,
                        border: `1px solid ${(t) => t.palette.primary.dark}`,
                        borderRadius: 1,
                    }}>
                        <Typography variant="h6">Description</Typography>
                        <Markdown>{routine?.description ?? ''}</Markdown>
                    </Box>
                    {/* Instructions */}
                    <Box sx={{
                        padding: 1,
                        border: `1px solid ${(t) => t.palette.background.paper}`,
                        borderRadius: 1,
                    }}>
                        <Typography variant="h6">Instructions</Typography>
                        <Markdown>{routine?.instructions ?? ''}</Markdown>
                    </Box>
                    {/* Inputs/Outputs TODO*/}
                    {/* Is internal checkbox */}
                    <Tooltip placement={'top'} title='Indicates if this routine is shown in search results'>
                        <FormControlLabel
                            disabled={!isEditing}
                            label='Internal'
                            control={
                                <Checkbox
                                    id='routine-info-dialog-is-internal'
                                    size="small"
                                    name='isInternalCheckbox'
                                    value='isInternalCheckbox'
                                    color='secondary'
                                    checked={routine?.isInternal ?? false}
                                    onChange={() => { }}
                                />
                            }
                        />
                    </Tooltip>
                </Stack>
                {/* List of actions that can be taken, such as viewing stats, forking, and deleting */}
                <List sx={{ marginTop: 'auto' }}>
                    {actions.map(([value, label, Icon]) => (
                        <ListItem
                            key={value}
                            button
                            onClick={() => handleAction(value)}
                        >
                            <ListItemIcon>
                                <Icon />
                            </ListItemIcon>
                            <ListItemText primary={label} />
                        </ListItem>
                    ))}
                </List>
            </SwipeableDrawer>
            {/* Delete routine confirmation dialog */}
            <DeleteRoutineDialog
                isOpen={deleteOpen}
                routineName={routine?.title ?? ''}
                handleClose={() => setDeleteOpen(false)}
                handleDelete={() => { }}
            />
        </>
    );
}