import { useCallback, useEffect, useState } from 'react';
import Logo from 'assets/img/Logo.png';
import { BUSINESS_NAME, APP_LINKS } from '@local/shared';
import { AppBar, Toolbar, Typography, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Hamburger } from '../Hamburger/Hamburger';
import { NavList } from '../NavList/NavList';
import { useLocation } from 'wouter';
import { NavbarProps } from '../types';
import { HideOnScroll } from '..';

const SHOW_HAMBURGER_AT = 1000;

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: theme.palette.primary.dark,
        height: '10vh',
    },
    toRight: {
        marginLeft: 'auto',
    },
    navLogoContainer: {
        padding: 0,
        display: 'flex',
        alignItems: 'center',
    },
    navLogoDiv: {
        display: 'flex',
        padding: 0,
        cursor: 'pointer',
        margin: '5px',
        borderRadius: '500px',
    },
    navLogo: {
        verticalAlign: 'middle',
        fill: 'black',
        marginLeft: 'max(-5px, -5vw)',
        minWidth: '50px',
        minHeight: '50px',
        width: '6vh',
        height: '6vh',
    },
    navName: {
        position: 'relative',
        cursor: 'pointer',
        fontSize: '3.5em',
        fontFamily: `Lato`,
        color: theme.palette.primary.contrastText,
    },
    [theme.breakpoints.down(350)]: {
        navName: {
            display: 'none',
        }
    },
}));

export const Navbar = ({
    userRoles
}: NavbarProps) => {
    const classes = useStyles();
    const [, setLocation] = useLocation();
    const [show_hamburger, setShowHamburger] = useState(false);

    let child_props = { 
        userRoles: userRoles,
    }

    useEffect(() => {
        updateWindowDimensions();
        window.addEventListener("resize", updateWindowDimensions);

        return () => window.removeEventListener("resize", updateWindowDimensions);
    }, []);

    const updateWindowDimensions = () => setShowHamburger(window.innerWidth <= SHOW_HAMBURGER_AT);

    const toHome = useCallback(() => setLocation(APP_LINKS.Home), [setLocation]);

    return (
        <HideOnScroll>
            <AppBar className={classes.root}>
                <Toolbar>
                    <div className={classes.navLogoContainer} onClick={toHome}>
                        <div className={classes.navLogoDiv}>
                            <img src={Logo} alt={`${BUSINESS_NAME} Logo`} className={classes.navLogo} />
                        </div>
                        <Typography className={classes.navName} variant="h6" noWrap>{BUSINESS_NAME}</Typography>
                    </div>
                    <div className={classes.toRight}>
                        {show_hamburger ? <Hamburger {...child_props} /> : <NavList {...child_props} />}
                    </div>
                </Toolbar>
            </AppBar>
        </HideOnScroll>
    );
}