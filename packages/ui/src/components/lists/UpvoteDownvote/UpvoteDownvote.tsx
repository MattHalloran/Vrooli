import { useMutation } from '@apollo/client';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { vote, voteVariables } from 'graphql/generated/vote';
import { voteMutation } from 'graphql/mutation';
import { mutationWrapper } from 'graphql/utils/mutationWrapper';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { UpvoteDownvoteProps } from '../types';

export const UpvoteDownvote = ({
    direction = "column",
    session,
    score,
    isUpvoted,
    objectId,
    voteFor,
    onChange,
}: UpvoteDownvoteProps) => {
    // Used to respond to user clicks immediately, without having 
    // to wait for the mutation to complete
    const [internalIsUpvoted, setInternalIsUpvoted] = useState<boolean | null>(isUpvoted ?? null);
    useEffect(() => setInternalIsUpvoted(isUpvoted ?? null), [isUpvoted]);

    const internalScore = useMemo(() => {
        const scoreNum = score ?? 0;
        // If the score and internal score match, return the score
        if (internalIsUpvoted === isUpvoted) return scoreNum;
        // Otherwise, determine score based on internal state
        if ((isUpvoted === true && internalIsUpvoted === null) ||
            (isUpvoted === null && internalIsUpvoted === false)) return scoreNum - 1;
        if ((isUpvoted === false && internalIsUpvoted === null) ||
            (isUpvoted === null && internalIsUpvoted === true)) return scoreNum + 1;
        return scoreNum;
    }, [internalIsUpvoted, isUpvoted, score]);

    const [mutation] = useMutation<vote, voteVariables>(voteMutation);
    const handleVote = useCallback((e: any, isUpvote: boolean | null) => {
        // Prevent propagation of normal click event
        e.stopPropagation();
        // Send vote mutation
        mutationWrapper({
            mutation,
            input: { isUpvote, voteFor, forId: objectId },
            onSuccess: () => { onChange(isUpvote) },
        })
    }, [objectId, voteFor, onChange, mutation]);

    const handleUpvoteClick = useCallback((event: any) => {
        if (!session.id) return;
        // If already upvoted, cancel the vote
        const vote = internalIsUpvoted === true ? null : true;
        setInternalIsUpvoted(vote);
        handleVote(event, vote);
    }, [session.id, internalIsUpvoted, handleVote]);

    const handleDownvoteClick = useCallback((event: any) => {
        if (!session.id) return;
        // If already downvoted, cancel the vote
        const vote = internalIsUpvoted === false ? null : false;
        setInternalIsUpvoted(vote);
        handleVote(event, vote);
    }, [session.id, internalIsUpvoted, handleVote]);

    const upvoteColor = useMemo(() => {
        if (!session.id) return "rgb(189 189 189)";
        if (internalIsUpvoted === true) return "#34c38b";
        return "#687074";
    }, [internalIsUpvoted, session.id]);

    const downvoteColor = useMemo(() => {
        if (!session.id) return "rgb(189 189 189)";
        if (internalIsUpvoted === false) return "#af2929";
        return "#687074";
    }, [internalIsUpvoted, session.id]);

    return (
        <Stack direction={direction}>
            {/* Upvote arrow */}
            <Tooltip title="Upvote" placement={direction === "column" ? "left" : "top"}>
                <Box
                    display="inline-block"
                    onClick={handleUpvoteClick}
                    role="button"
                    aria-pressed={internalIsUpvoted === true}
                    sx={{
                        cursor: session.id ? 'pointer' : 'default',
                        display: 'flex',
                        '&:hover': {
                            filter: session.id ? `brightness(120%)` : 'none',
                            transition: 'filter 0.2s',
                        },
                    }}
                >
                    <svg width="36" height="36">
                        <path
                            d={direction === 'column' ? "M2 26h32L18 10 2 26z" : "M6 26h24L18 6 6 26z"}
                            fill={upvoteColor}
                        ></path>
                    </svg>
                </Box>
            </Tooltip>
            {/* Score */}
            <Typography variant="body1" textAlign="center" sx={{ margin: 'auto' }}>{internalScore}</Typography>
            {/* Downvote arrow */}
            <Tooltip title="Downvote" placement={direction === "column" ? "left" : "top"}>
                <Box
                    display="inline-block"
                    onClick={handleDownvoteClick}
                    role="button"
                    aria-pressed={internalIsUpvoted === false}
                    sx={{
                        cursor: session.id ? 'pointer' : 'default',
                        display: 'flex',
                        '&:hover': {
                            filter: session.id ? `brightness(120%)` : 'none',
                            transition: 'filter 0.2s',
                        },
                    }}
                >
                    <svg width="36" height="36">
                        <path
                            d={direction === 'column' ? "M2 10h32L18 26 2 10z" : "M6 6h24L18 26 6 6z"}
                            fill={downvoteColor}
                        ></path>
                    </svg>
                </Box>
            </Tooltip>
        </Stack>
    )
}