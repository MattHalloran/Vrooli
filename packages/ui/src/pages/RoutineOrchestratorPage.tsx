import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

export const RoutineOrchestratorPage = () => {
    const classes = useStyles();
    

    return (
        <div id="page" className={classes.root}>
            
        </div>
    )
};