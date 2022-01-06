import { useQuery } from "@apollo/client";
import { RoutineSortBy } from "@local/shared";
import { Grid, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { RoutineCard, SearchBar, Selector } from "components";
import { routines, routinesVariables } from "graphql/generated/routines";
import { routinesQuery } from "graphql/query";
import { useCallback, useMemo, useState } from "react";
import { combineStyles } from "utils";
import { searchStyles } from ".";

const componentStyles = (theme: Theme) => ({
    
});

const useStyles = makeStyles(combineStyles(searchStyles, componentStyles));

const SORT_OPTIONS: {label: string, value: RoutineSortBy}[] = Object.values(RoutineSortBy).map((sortOption) => ({ label: sortOption, value: sortOption as RoutineSortBy }));

export const SearchRoutinesPage = () => {
    const classes = useStyles();
    const [searchString, setSearchString] = useState<string>('');
    const [sortBy, setSortBy] = useState<RoutineSortBy>(SORT_OPTIONS[1].value);
    const { data } = useQuery<routines, routinesVariables>(routinesQuery, { variables: { input: { sortBy, searchString } }, pollInterval: 50000 });

    console.log('SEARCH DATA', data);

    const cards = useMemo(() => (
        data?.routines?.edges?.map((edge, index) =>
            <RoutineCard
                key={index}
                data={edge.node}
            />)
    ), [data])

    const handleSort = useCallback((e) => setSortBy(e.target.value), []);
    const handleSearch = useCallback((newString) => setSearchString(newString), []);

    return (
        <div id="page">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Selector
                        className={classes.selector}
                        fullWidth
                        options={SORT_OPTIONS}
                        selected={sortBy}
                        handleChange={handleSort}
                        inputAriaLabel='sort-actors-selector-label'
                        label="Sort" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <SearchBar fullWidth value={searchString} onChange={handleSearch} />
                </Grid>
            </Grid>
            <div className={classes.cardFlex}>
                {cards}
            </div>
        </div>
    )
}