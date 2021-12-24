import { APP_LINKS, EMAIL, LANDING_LINKS, LANDING_URL, SOCIALS } from '@local/shared';
import { makeStyles } from '@mui/styles';
import { 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Grid, 
    Tooltip, 
    Theme, 
    useTheme 
} from '@mui/material';
import {
    Email as EmailIcon,
    GitHub as GitHubIcon,
    Twitter as TwitterIcon,
    SvgIconComponent,
} from '@mui/icons-material';
import { CopyrightBreadcrumbs } from 'components';
import { useNavigate } from 'react-router-dom';
import { openLink } from 'utils';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        overflow: 'hidden',
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        position: 'relative',
        paddingBottom: '7vh',
    },
    upper: {
        textTransform: 'uppercase',
    },
    imageContainer: {
        maxWidth: '33vw',
        padding: 10,
    },
    image: {
        maxWidth: '100%',
        maxHeight: 200,
        background: theme.palette.primary.contrastText,
    },
    icon: {
        fill: theme.palette.primary.contrastText,
    },
    copyright: {
        color: theme.palette.primary.contrastText,
    },
}));

export const Footer = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const theme = useTheme();

    const contactLinks: Array<[string, string, string, string, SvgIconComponent]> = [
        ['contact-twitter', 'Find us on Twitter', SOCIALS.Twitter, 'Twitter', TwitterIcon],
        ['contact-email', 'Have a question or feedback? Email us!', EMAIL.Link, 'Email Us', EmailIcon],
        ['contact-github', 'Check out the source code, or contribute :)', SOCIALS.GitHub, 'Source Code', GitHubIcon],
    ]

    return (
        <div className={classes.root}>
            <Grid container justifyContent='center' spacing={1}>
                <Grid item xs={12} sm={6}>
                    <List component="nav">
                        <ListItem component="h3" >
                            <ListItemText className={classes.upper} primary="Resources" />
                        </ListItem>
                        <ListItemButton component="a" onClick={() => openLink(navigate, `${LANDING_URL}${LANDING_LINKS.About}`)} >
                            <ListItemText primary="About Us" />
                        </ListItemButton>
                        <ListItemButton component="a" onClick={() => openLink(navigate, APP_LINKS.Stats)} >
                            <ListItemText primary="View Stats" />
                        </ListItemButton>
                    </List>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <List component="nav">
                        <ListItem component="h3" >
                            <ListItemText className={classes.upper} primary="Contact" />
                        </ListItem>
                        {contactLinks.map(([label, tooltip, src, text, Icon], key) => (
                            <Tooltip key={key} title={tooltip} placement="left">
                                <ListItemButton aria-label={label} onClick={() => openLink(navigate, src)}>
                                    <ListItemIcon>
                                        <Icon className={classes.icon} ></Icon>
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </Tooltip>
                        ))}
                    </List>
                </Grid>
            </Grid>
            <CopyrightBreadcrumbs className={classes.copyright} textColor={theme.palette.primary.contrastText} />
        </div>
    );
}