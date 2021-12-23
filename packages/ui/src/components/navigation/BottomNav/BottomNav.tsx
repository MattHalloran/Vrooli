import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { BottomNavigation, Theme } from '@mui/material';
import { actionsToBottomNav, ACTION_TAGS, getUserActions } from 'utils';
import { CommonProps } from 'types';
import { BottomNavProps } from '../types';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: theme.palette.primary.dark,
        position: 'fixed',
        zIndex: 5,
        bottom: '0',
        width: '100%',
    },
    icon: {
        color: theme.palette.primary.contrastText,
        '&:hover': {
            color: theme.palette.secondary.light,
        },
    },
    [theme.breakpoints.up(1000)]: {
        root: {
            display: 'none',
        }
    },
}));

export const BottomNav = ({
    userRoles,
    ...props
}: BottomNavProps) => {
    let navigate = useNavigate();
    const classes = useStyles();

    let actions = actionsToBottomNav({
        actions: getUserActions({ userRoles, exclude: [ACTION_TAGS.LogOut] }),
        navigate,
        classes: { root: classes.icon }
    });

    return (
        <BottomNavigation
            className={classes.root}
            showLabels
            {...props}
        >
            {actions}
        </BottomNavigation>
    );
}