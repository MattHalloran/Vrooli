// Used to display popular/search results of a particular object type
import { IconButton, ListItem, ListItemButton, ListItemText, Stack, Tooltip } from '@mui/material';
import { ActorListItemProps } from '../types';
import { multiLineEllipsis } from 'styles';
import { useCallback, useMemo } from 'react';
import { APP_LINKS } from '@local/shared';
import {
    Star as IsStarredIcon,
    StarBorder as IsNotStarredIcon,
} from '@mui/icons-material';
import { useLocation } from 'wouter';

export function ActorListItem({
    data,
    isStarred = false,
    isOwn = false,
    onClick,
    onStarClick = () => { },
}: ActorListItemProps) {
    const [, setLocation] = useLocation();

    const handleClick = useCallback(() => {
        // If onClick provided, call it
        if (onClick) onClick(data);
        // Otherwise, navigate to the actor's profile
        else setLocation(`${APP_LINKS.Profile}/${data.id}`)
    }, [onClick, data.id]);

    const handleStarClick = useCallback((e: any) => {
        // Prevent propagation of normal click event
        e.stopPropagation();
        // Call the onStarClick callback
        onStarClick(data.id ?? '', isStarred)
    }, [onStarClick, data.id, isStarred]);

    const starIcon = useMemo(() => {
        const Icon = isStarred ? IsStarredIcon : IsNotStarredIcon;
        let tooltip: string;
        if (isOwn) tooltip = 'Cannot favorite yourself 💩';
        else if (isStarred) tooltip = 'Remove user from favorites';
        else tooltip = 'Love this user? Give them a star!';

        return (
            <Tooltip placement="left" title={tooltip}>
                <Icon onClick={handleStarClick} sx={{ fill: '#ffac3a', cursor: isOwn ? 'default' : 'pointer' }} />
            </Tooltip>
        )
    }, [isOwn, isStarred])

    return (
        <Tooltip placement="top" title="View details">
            <ListItem
                disablePadding
                onClick={handleClick}
                sx={{
                    display: 'flex',
                }}
            >
                <ListItemButton component="div" onClick={handleClick}>
                    <ListItemText
                        primary={data.username}
                        sx={{ ...multiLineEllipsis(2) }}
                    />
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            marginRight: 0,
                            maxWidth: '25%',
                        }}
                    >
                        {starIcon}
                        <ListItemText
                            primary={data.stars}
                            sx={{ ...multiLineEllipsis(1) }}
                        />
                    </Stack>
                </ListItemButton>
            </ListItem>
        </Tooltip>
    )
}