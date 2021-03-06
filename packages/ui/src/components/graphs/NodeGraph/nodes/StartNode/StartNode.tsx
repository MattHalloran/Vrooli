import { Box, Tooltip, Typography, useTheme } from '@mui/material';
import { CSSProperties, useMemo } from 'react';
import { StartNodeProps } from '../types';
import { nodeLabel } from '../styles';
import { containerShadow, noSelect } from 'styles';
import { NodeWidth } from '../..';

export const StartNode = ({
    node,
    scale = 1,
    label = 'Start',
    labelVisible = true,
}: StartNodeProps) => {
    const { palette } = useTheme();

    const labelObject = useMemo(() => labelVisible && scale >= 0.5 ? (
        <Typography
            variant="h6"
            sx={{
                ...noSelect,
                ...nodeLabel,
            } as CSSProperties}
        >
            {label}
        </Typography>
    ) : null, [labelVisible, label, scale]);

    const nodeSize = useMemo(() => `max(${NodeWidth.Start * scale}px, 48px)`, [scale]);
    const fontSize = useMemo(() => `min(${NodeWidth.Start * scale / 5}px, 2em)`, [scale]);

    return (
        <Tooltip placement={'top'} title={label ?? ''}>
            <Box
                id={`node-${node.id}`}
                sx={{
                    ...containerShadow,
                    width: nodeSize,
                    height: nodeSize,
                    fontSize: fontSize,
                    position: 'relative',
                    display: 'block',
                    backgroundColor: palette.mode === 'light' ? '#259a17' : '#387e30',
                    color: 'white',
                    borderRadius: '100%',
                    '&:hover': {
                        filter: `brightness(120%)`,
                        transition: 'filter 0.2s',
                    },
                }}
            >
                {labelObject}
            </Box>
        </Tooltip>
    )
}