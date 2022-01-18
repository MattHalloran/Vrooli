// Used to display popular/search results of a particular object type
import { IconButton, ListItem, ListItemButton, ListItemText, Stack, Tooltip } from '@mui/material';
import { RoutineListItemProps } from '../types';
import { multiLineEllipsis } from 'styles';
import { useCallback, useMemo } from 'react';
import { APP_LINKS, VoteFor } from '@local/shared';
import {
    Star as IsStarredIcon,
    StarBorder as IsNotStarredIcon,
} from '@mui/icons-material';
import { useLocation } from 'wouter';
import { UpvoteDownvote } from '..';
import { useMutation } from '@apollo/client';
import { voteMutation } from 'graphql/mutation';
import { vote } from 'graphql/generated/vote';

export function RoutineListItem({
    session,
    data,
    isStarred = false,
    isOwn = false,
    onClick,
    onStarClick = () => { },
}: RoutineListItemProps) {
    const [, setLocation] = useLocation();
    const [vote, { loading }] = useMutation<vote>(voteMutation);

    const handleClick = useCallback(() => {
        // If onClick provided, call if
        if (onClick) onClick(data);
        // Otherwise, navigate to the object's page
        else setLocation(`${APP_LINKS.Routine}/${data.id}`)
    }, [onClick, data, setLocation]);

    const handleStarClick = useCallback((e: any) => {
        // Prevent propagation of normal click event
        e.stopPropagation();
        // Call the onStarClick callback
        onStarClick(data.id, isStarred)
    }, [onStarClick, data.id, isStarred]);

    const handleVote = useCallback((e: any, isUpvote: boolean | null) => {
        // Prevent propagation of normal click event
        e.stopPropagation();
        // Send vote mutation
        vote({ variables: { input: {
            isUpvote,
            voteFor: VoteFor.Project,
            forId: data.id
        } } });
    }, [data])

    const starIcon = useMemo(() => {
        const Icon = isStarred ? IsStarredIcon : IsNotStarredIcon;
        let tooltip: string;
        if (isOwn) tooltip = 'Cannot favorite yourself 💩';
        else if (isStarred) tooltip = 'Remove routine from favorites';
        else tooltip = 'Love this routine? Give it a star!';

        return (
            <Tooltip placement="left" title={tooltip}>
                <Icon onClick={handleStarClick} sx={{ fill: '#ffac3a', cursor: isOwn ? 'default' : 'pointer' }} />
            </Tooltip>
        )
    }, [isOwn, isStarred, handleStarClick]);

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
                    <UpvoteDownvote
                        session={session}
                        score={data.score}
                        isUpvoted={data.isUpvoted}
                        onVote={handleVote}
                    />
                    <Stack direction="column" spacing={1} pl={2} sx={{width: '-webkit-fill-available'}}>
                        <ListItemText
                            primary={data.title}
                            sx={{ ...multiLineEllipsis(1) }}
                        />
                        <ListItemText
                            primary={data.description}
                            sx={{ ...multiLineEllipsis(2) }}
                        />
                    </Stack>
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