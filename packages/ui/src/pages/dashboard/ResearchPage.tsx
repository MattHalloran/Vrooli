import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import { ResourceList } from 'components';

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

export const ResearchPage = ({

}) => {
    const classes = useStyles();

    return (
        <div id="page" className={classes.root}>
            asdfdsafdsafd
            asdf
            asdfdsafdsafddsa
            <ResourceList />
        </div>
    )
}