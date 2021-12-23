import {
    ContactInfo,
    PopupMenu
} from 'components';
import { Action, actionsToMenu, ACTION_TAGS, getUserActions, openLink } from 'utils';
import { Button, Container, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { NavListProps } from '../types';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        marginTop: '0px',
        marginBottom: '0px',
        right: '0px',
        padding: '0px',
    },
    navItem: {
        background: 'transparent',
        color: theme.palette.primary.contrastText,
        textTransform: 'none',
        fontSize: '1.5em',
        '&:hover': {
            color: theme.palette.secondary.light,
        },
    },
    button: {
        fontSize: '1.5em',
        marginLeft: '20px',
        borderRadius: '10px',
    },
    menuItem: {
        color: theme.palette.primary.contrastText,
    },
    menuIcon: {
        fill: theme.palette.primary.contrastText,
    },
    contact: {
        width: 'calc(min(100vw, 400px))',
        height: '300px',
    },
}));

export const NavList = ({
    userRoles
}: NavListProps) => {
    const classes = useStyles();
    const navigate = useNavigate();

    const nav_actions = useMemo<Action[]>(() => getUserActions({ userRoles }), [userRoles]);
    // Display button for entering main application
    const enter_action: Action | undefined = nav_actions.find((action: Action) => action.value === ACTION_TAGS.LogIn)
    const enter_button = useMemo(() => enter_action ? (
        <Button 
            className={classes.button} 
            onClick={() => openLink(navigate, enter_action.link)}
            >
                {enter_action.label}
        </Button>
    ) : null, [enter_action, classes.button, navigate])

    return (
        <Container className={classes.root}>
            <PopupMenu
                text="Contact"
                variant="text"
                size="large"
                className={classes.navItem}
            >
                <ContactInfo className={classes.contact} />
            </PopupMenu>
            {actionsToMenu({
                actions: nav_actions.filter((a: Action) => a.value !== ACTION_TAGS.LogIn),
                navigate,
                classes: { root: classes.navItem },
            })}
            {enter_button}
        </Container>
    );
}