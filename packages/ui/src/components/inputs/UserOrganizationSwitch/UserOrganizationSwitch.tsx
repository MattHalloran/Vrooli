import { Box, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { UserOrganizationSwitchProps } from '../types';
import { noSelect } from 'styles';
import { getTranslation, getUserLanguages } from 'utils';
import { OrganizationSelectOrCreateDialog } from 'components/dialogs';
import {
    Apartment as OrganizationIcon,
    Person as SelfIcon
} from '@mui/icons-material';

const grey = {
    400: '#BFC7CF',
    800: '#2F3A45',
};

export function UserOrganizationSwitch({
    session,
    selected,
    onChange,
    disabled,
    zIndex,
    ...props
}: UserOrganizationSwitchProps) {
    const { palette } = useTheme();
    const languages = useMemo(() => getUserLanguages(session), [session])

    // Create dialog
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const openCreateDialog = useCallback(() => { setIsCreateDialogOpen(true) }, [setIsCreateDialogOpen]);
    const closeCreateDialog = useCallback(() => { setIsCreateDialogOpen(false); }, [setIsCreateDialogOpen]);

    const handleClick = useCallback((ev: React.MouseEvent<any>) => {
        if (disabled) return;
        // If assigning with self, remove organization data
        if (Boolean(selected)) {
            onChange(null);
        } 
        // Otherwise, open dialog to select organization
        else {
            openCreateDialog();
            ev.preventDefault();
        }
    }, [disabled, onChange, openCreateDialog, selected]);

    const Icon = useMemo(() => Boolean(selected) ? OrganizationIcon : SelfIcon, [selected]);

    return (
        <>
            {/* Popup for adding/connecting a new organization */}
            <OrganizationSelectOrCreateDialog
                isOpen={isCreateDialogOpen}
                handleAdd={onChange}
                handleClose={closeCreateDialog}
                session={session}
                zIndex={zIndex+1}
            />
            {/* Main component */}
            <Stack direction="row" spacing={1} justifyContent="center">
                <Typography variant="h6" sx={{ ...noSelect }}>For:</Typography>
                <Box component="span" sx={{
                    display: 'inline-block',
                    position: 'relative',
                    width: '64px',
                    height: '36px',
                    padding: '8px',
                }}>
                    {/* Track */}
                    <Box component="span" sx={{
                        backgroundColor: palette.mode === 'dark' ? grey[800] : grey[400],
                        borderRadius: '16px',
                        width: '100%',
                        height: '65%',
                        display: 'block',
                    }}>
                        {/* Thumb */}
                        <IconButton sx={{
                            backgroundColor: palette.secondary.main,
                            display: 'inline-flex',
                            width: '30px',
                            height: '30px',
                            position: 'absolute',
                            top: 0,
                            transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: `translateX(${Boolean(selected) ? '24' : '0'}px)`,
                        }}>
                            <Icon sx={{
                                position: 'absolute',
                                display: 'block',
                                fill: 'white',
                                borderRadius: '8px',
                            }} />
                        </IconButton>
                    </Box>
                    {/* Input */}
                    <input
                        type="checkbox"
                        checked={Boolean(selected)}
                        disabled={disabled}
                        aria-label="user-organization-toggle"
                        onClick={handleClick}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            top: '0',
                            left: '0',
                            opacity: '0',
                            zIndex: '1',
                            margin: '0',
                            cursor: 'pointer',
                        }} />
                </Box >
                <Typography variant="h6" sx={{ ...noSelect }}>{Boolean(selected) ? getTranslation(selected, 'name', languages, true) : 'Self'}</Typography>
            </Stack>
        </>
    )
}
