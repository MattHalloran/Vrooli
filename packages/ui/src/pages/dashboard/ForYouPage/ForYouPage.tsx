import { Box, Stack, Tab, Tabs } from '@mui/material';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { forYouPage, forYouPageVariables } from 'graphql/generated/forYouPage';
import { useQuery } from '@apollo/client';
import { forYouPageQuery } from 'graphql/query';
import { TitleContainer } from 'components';
import { useLocation } from 'wouter';
import { APP_LINKS } from '@local/shared';
import { ForYouPageProps } from '../types';
import { listToListItems, openObject } from 'utils';
import _ from 'lodash';
import { Organization, Project, Routine, Standard, User } from 'types';

const activeRoutinesText = `Routines that you've started to execute, and have not finished.`;

const completedRoutinesText = `Routines that you've executed and completed`

const recentText = `Organizations, projects, routines, standards, and users that you've recently viewed.`;

const starredText = `Organizations, projects, routines, standards, and users that you've starred.`;

const tabOptions = [
    ['Popular', APP_LINKS.Home],
    ['For You', APP_LINKS.ForYou],
];

/**
 * Containers a search bar, lists of routines, projects, tags, and organizations, 
 * and a FAQ section.
 * If a search string is entered, each list is filtered by the search string. 
 * Otherwise, each list shows popular items. Each list has a "See more" button, 
 * which opens a full search page for that object type.
 */
export const ForYouPage = ({
    session
}: ForYouPageProps) => {
    const [, setLocation] = useLocation();
    const { data, refetch, loading } = useQuery<forYouPage, forYouPageVariables>(forYouPageQuery, { variables: { input: {} } });
    useEffect(() => { refetch() }, [refetch]);

    // Handle tabs
    const tabIndex = useMemo(() => {
        if (window.location.pathname === APP_LINKS.ForYou) return 1;
        return 0;
    }, []);
    const handleTabChange = (_e, newIndex) => {
        setLocation(tabOptions[newIndex][1], { replace: true });
    };

    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const closeCreateDialog = useCallback(() => { setCreateDialogOpen(false) }, [setCreateDialogOpen]);

    /**
     * Opens page for list item
     */
     const toItemPage = useCallback((event: any, item: Organization | Project | Routine | Standard | User) => {
        event?.stopPropagation();
        // Navigate to item page
        openObject(item, setLocation);
    }, [setLocation]);

    const activeRoutines = useMemo(() => listToListItems(
        data?.forYouPage?.activeRuns ?? [],
        session,
        'active-runs-list-item',
        (item, event) => { toItemPage(event, item) },
    ), [data, session])

    const completedRoutines = useMemo(() => listToListItems(
        data?.forYouPage?.completedRuns ?? [],
        session,
        'completed-runs-list-item',
        (item, event) => { toItemPage(event, item) },
    ), [data, session])

    const recent = useMemo(() => listToListItems(
        data?.forYouPage?.recentlyViewed ?? [],
        session,
        'recently-viewed-list-item',
        (item, event) => { toItemPage(event, item) },
    ), [data, session])
    console.log('got recent', data?.forYouPage?.recentlyViewed);

    const starred = useMemo(() => listToListItems(
        data?.forYouPage?.recentlyStarred ?? [],
        session,
        'starred-list-item',
        (item, event) => { toItemPage(event, item) },
    ), [data, session])

    return (
        <Box id="page">
            {/* Navigate between normal home page (shows popular results) and for you page (shows personalized results) */}
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                indicatorColor="secondary"
                textColor="inherit"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="search-type-tabs"
                sx={{
                    marginBottom: 2,
                    '& .MuiTabs-flexContainer': {
                        justifyContent: 'center',
                    },
                }}
            >
                {tabOptions.map((option, index) => (
                    <Tab
                        key={index}
                        id={`for-you-tab-${index}`}
                        {...{ 'aria-controls': `for-you-tabpanel-${index}` }}
                        label={option[0]}
                        color={index === 0 ? '#ce6c12' : 'default'}
                    />
                ))}
            </Tabs>
            {/* Result feeds (or popular feeds if no search string) */}
            <Stack spacing={10} direction="column">
                {/* Search results */}
                <TitleContainer
                    title={"Active Routines"}
                    helpText={activeRoutinesText}
                    loading={loading}
                    onClick={() => { }}
                    options={[['See all', () => { }]]}
                >
                    {activeRoutines}
                </TitleContainer>
                <TitleContainer
                    title={"Completed Routines"}
                    helpText={completedRoutinesText}
                    loading={loading}
                    onClick={() => { }}
                    options={[['See all', () => { }]]}
                >
                    {completedRoutines}
                </TitleContainer>
                <TitleContainer
                    title={"Recently Viewed"}
                    helpText={recentText}
                    loading={loading}
                    onClick={() => { }}
                    options={[['See all', () => { }]]}
                >
                    {recent}
                </TitleContainer>
                <TitleContainer
                    title={"Starred"}
                    helpText={starredText}
                    loading={loading}
                    onClick={() => { }}
                    options={[['See all', () => { }]]}
                >
                    {starred}
                </TitleContainer>
            </Stack>
        </Box>
    )
}