import { Box, IconButton, Theme, Tooltip, Typography } from '@mui/material';
import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { LoopNodeProps } from '../types';
import { Loop as LoopIcon } from '@mui/icons-material';
import { NodeContextMenu } from '../..';
import { noSelect } from 'styles';

export const LoopNode = ({
    node,
    scale = 1,
    label = 'Loop',
    labelVisible = true,
}: LoopNodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const openDialog = () => setDialogOpen(true);
    const closeDialog = () => setDialogOpen(false);
    const dialog = useMemo(() => dialogOpen ? (
        <div>TODO</div>
    ) : null, [dialogOpen])

    const labelObject = useMemo(() => labelVisible ? (
        <Typography
            variant="h6"
            sx={{
                ...noSelect,
                ...nodeLabel,
                pointerEvents: 'none',
            }}
        >
            {label}
        </Typography>
    ) : null, [labelVisible, label]);

    const nodeSize = useMemo(() => `${100 * scale}px`, [scale]);
    const fontSize = useMemo(() => `min(${100 * scale / 5}px, 2em)`, [scale]);

    // Right click context menu
    const [contextAnchor, setContextAnchor] = useState<any>(null);
    const contextId = useMemo(() => `node-context-menu-${node.id}`, [node]);
    const openContext = useCallback((ev: MouseEvent<HTMLButtonElement>) => {
        setContextAnchor(ev.currentTarget)
        ev.preventDefault();
    }, []);
    const closeContext = useCallback(() => setContextAnchor(null), []);

    return (
        <Box>
            {dialog}
            <NodeContextMenu
                id={contextId}
                anchorEl={contextAnchor}
                node={node}
                onClose={closeContext}
                onAddBefore={() => { }}
                onAddAfter={() => { }}
                onDelete={() => { }}
                onEdit={() => { }}
                onMove={() => { }}
            />
            <Tooltip placement={'top'} title={label ?? ''}>
                <IconButton
                    onClick={openDialog}
                    aria-owns={Boolean(contextAnchor) ? contextId : undefined}
                    onContextMenu={openContext}
                    sx={{
                        ...containerShadow,
                        width: nodeSize,
                        height: nodeSize,
                        fontSize: fontSize,
                        position: 'relative',
                        display: 'block',
                        backgroundColor: '#6daf72',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#6daf72',
                            filter: `brightness(120%)`,
                            transition: 'filter 0.2s',
                        },
                    }}
                >
                    <LoopIcon
                        sx={{
                            width: '100%',
                            height: '100%',
                            color: '#00000044',
                            '&:hover': {
                                transform: 'rotate(-180deg)',
                                transition: 'transform .2s ease-in-out',
                            }
                        }}
                    />
                    {labelObject}
                </IconButton>
            </Tooltip>
        </Box>
    )
}