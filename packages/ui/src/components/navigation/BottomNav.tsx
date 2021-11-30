import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { BottomNavigation, Theme } from '@material-ui/core';
import { actionsToBottomNav, getUserActions } from 'utils';
import { CommonProps } from 'types';

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
}: Pick<CommonProps, 'userRoles'>) => {
    let history = useHistory();
    const classes = useStyles();

    let actions = actionsToBottomNav({
        actions: getUserActions({ userRoles, exclude: ['logout'] }),
        history,
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