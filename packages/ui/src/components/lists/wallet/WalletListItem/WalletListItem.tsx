// Used to display popular/search results of a particular object type
import { Box, IconButton, ListItem, ListItemText, Stack, Tooltip, useTheme } from '@mui/material';
import { WalletListItemProps } from '../types';
import { multiLineEllipsis } from 'styles';
import { useCallback, useMemo } from 'react';
import {
    Check as VerifyIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';

const Status = {
    NotVerified: '#a71c2d', // Red
    Verified: '#19972b', // Green
}

export function WalletListItem({
    handleDelete,
    handleUpdate,
    handleVerify,
    index,
    data,
}: WalletListItemProps) {
    const { palette } = useTheme();
    const isNamed = useMemo(() => data.name && data.name.length > 0, [data.name]);

    const onDelete = useCallback(() => {
        handleDelete(data);
    }, [data, handleDelete]);

    const onVerify = useCallback(() => {
        handleVerify(data);
    }, [data, handleVerify]);

    /**
     * Shortens staking address to first 2 letters, an ellipsis, and last 6 letters
     */
    const shortenedAddress = useMemo(() => {
        if (!data.stakingAddress) return '';
        return `${data.stakingAddress.substring(0, 2)}...${data.stakingAddress.substring(data.stakingAddress.length - 6)}`;
    }, [data.stakingAddress]);

    return (
        <ListItem
            disablePadding
            sx={{
                display: 'flex',
                background: index % 2 === 0 ? '#c8d6e9' : '#e9e9e9',
                color: 'black',
                padding: 1,
            }}
        >
            {/* Left informational column */}
            <Stack direction="column" spacing={1} pl={2} sx={{ marginRight: 'auto' }}>
                <Stack direction="row" spacing={1}>
                    {/* Name (or publich address if not name) */}
                    <ListItemText
                        primary={isNamed ? data.name : shortenedAddress}
                        sx={{ ...multiLineEllipsis(1) }}
                    />
                    {/* Bio/Description */}
                    {isNamed && <ListItemText
                        primary={shortenedAddress}
                        sx={{ ...multiLineEllipsis(1), color: palette.text.secondary }}
                    />}
                </Stack>
                {/* Verified indicator */}
                <Box sx={{
                    borderRadius: 1,
                    border: `2px solid ${data.verified ? Status.Verified : Status.NotVerified}`,
                    color: data.verified ? Status.Verified : Status.NotVerified,
                    height: 'fit-content',
                    fontWeight: 'bold',
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    textAlign: 'center',
                    padding: 0.25,
                    width: 'fit-content',
                }}>
                    {data.verified ? "Verified" : "Not Verified"}
                </Box>
            </Stack>
            {/* Right action buttons */}
            <Stack direction="row" spacing={1}>
                {!data.verified && <Tooltip title="Verify Wallet">
                    <IconButton
                        onClick={onVerify}
                    >
                        <VerifyIcon sx={{ fill: Status.NotVerified }} />
                    </IconButton>
                </Tooltip>}
                <Tooltip title="Delete Wallet">
                    <IconButton
                        onClick={onDelete}
                    >
                        <DeleteIcon sx={{ fill: palette.secondary.main }} />
                    </IconButton>
                </Tooltip>
            </Stack>
        </ListItem>
    )
}