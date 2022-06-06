import { Box, Button, CircularProgress, Dialog, Grid, IconButton, LinearProgress, Stack, Tooltip, Typography, useTheme } from "@mui/material"
import { useLocation, useRoute } from "wouter";
import { APP_LINKS } from "@local/shared";
import { useMutation, useLazyQuery } from "@apollo/client";
import { routine, routineVariables } from "graphql/generated/routine";
import { routineQuery } from "graphql/query";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
    AccountTree as GraphIcon,
    DoneAll as MarkAsCompleteIcon,
    Edit as EditIcon,
    MoreHoriz as EllipsisIcon,
    PlayCircle as StartIcon,
} from "@mui/icons-material";
import { BaseObjectActionDialog, BuildView, LinkButton, ResourceListHorizontal, RunPickerDialog, RunView, SelectLanguageDialog, StarButton, UpTransition } from "components";
import { RoutineViewProps } from "../types";
import { getLanguageSubtag, getOwnedByString, getPreferredLanguage, getTranslation, getUserLanguages, ObjectType, parseSearchParams, Pubs, standardToFieldData, stringifySearchParams, TERTIARY_COLOR, toOwnedBy, useReactSearch } from "utils";
import { Node, NodeLink, Routine, Run } from "types";
import Markdown from "markdown-to-jsx";
import { runCompleteMutation } from "graphql/mutation";
import { mutationWrapper } from "graphql/utils/mutationWrapper";
import { NodeType, StarFor } from "graphql/generated/globalTypes";
import { BaseObjectAction } from "components/dialogs/types";
import { containerShadow } from "styles";
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { runComplete } from "graphql/generated/runComplete";
import { owns } from "utils/authentication";
import { useFormik } from "formik";
import { FieldData } from "forms/types";
import { generateInputComponent } from "forms/generators";

export const RoutineView = ({
    partialData,
    session,
    zIndex,
}: RoutineViewProps) => {
    const { palette } = useTheme();
    const [, setLocation] = useLocation();
    // Get URL params
    const [, params] = useRoute(`${APP_LINKS.Routine}/:id`);
    const [, params2] = useRoute(`${APP_LINKS.SearchRoutines}/view/:id`);
    const id = params?.id ?? params2?.id;
    // Fetch data
    const [getData, { data, loading }] = useLazyQuery<routine, routineVariables>(routineQuery);
    const [routine, setRoutine] = useState<Routine | null>(null);
    useEffect(() => {
        if (id && uuidValidate(id)) { getData({ variables: { input: { id } } }); }
    }, [getData, id])
    useEffect(() => {
        if (!data) return;
        setRoutine(data.routine);
    }, [data]);
    const updateRoutine = useCallback((routine: Routine) => { setRoutine(routine); }, [setRoutine]);

    const canEdit = useMemo<boolean>(() => owns(routine?.role), [routine?.role]);

    const search = useReactSearch(null);
    const { runId } = useMemo(() => ({
        runId: typeof search.run === 'string' && uuidValidate(search.run) ? search.run : null,
    }), [search]);

    const availableLanguages = useMemo<string[]>(() => (routine?.translations?.map(t => getLanguageSubtag(t.language)) ?? []), [routine?.translations]);
    const [language, setLanguage] = useState<string>(getUserLanguages(session)[0]);
    useEffect(() => {
        if (availableLanguages.length === 0) return;
        setLanguage(getPreferredLanguage(availableLanguages, getUserLanguages(session)));
    }, [availableLanguages, setLanguage, session]);

    const { title, description, instructions } = useMemo(() => {
        return {
            title: getTranslation(routine, 'title', [language]) ?? getTranslation(partialData, 'title', [language]),
            description: getTranslation(routine, 'description', [language]) ?? getTranslation(partialData, 'description', [language]),
            instructions: getTranslation(routine, 'instructions', [language]) ?? getTranslation(partialData, 'instructions', [language]),
        };
    }, [routine, language, partialData]);

    useEffect(() => {
        document.title = `${title} | Vrooli`;
    }, [title]);

    const ownedBy = useMemo<string | null>(() => getOwnedByString(routine, [language]), [routine, language]);
    const toOwner = useCallback(() => { toOwnedBy(routine, setLocation) }, [routine, setLocation]);

    const [runComplete] = useMutation<runComplete>(runCompleteMutation);
    const markAsComplete = useCallback(() => {
        if (!routine) return;
        mutationWrapper({
            mutation: runComplete,
            input: {
                id: routine.id,
                exists: false,
                title: title,
                version: routine?.version ?? '',
            },
            successMessage: () => 'Routine completed!🎉',
            onSuccess: () => {
                PubSub.publish(Pubs.Celebration);
                setLocation(APP_LINKS.Home)
            },
        })
    }, [routine, runComplete, setLocation, title]);

    const [isBuildOpen, setIsBuildOpen] = useState(false);
    // If buildId is in the URL, open the build
    useEffect(() => {
        const searchParams = parseSearchParams(window.location.search);
        if (searchParams.build) {
            // If build is not an id, populate routine with default start data
            if (!uuidValidate(searchParams.build ? `${searchParams.build}` : '')) {
                const startNode: Node = {
                    id: uuidv4(),
                    type: NodeType.Start,
                    columnIndex: 0,
                    rowIndex: 0,
                } as Node;
                const routineListNode: Node = {
                    id: uuidv4(),
                    type: NodeType.RoutineList,
                    columnIndex: 1,
                    rowIndex: 0,
                    data: {
                        id: uuidv4(),
                        isOptional: false,
                        isOrdered: false,
                        routines: [],
                    } as any,
                    translations: [{
                        language,
                        title: 'Subroutine 1',
                    }] as any
                } as Node
                const endNode: Node = {
                    id: uuidv4(),
                    type: NodeType.End,
                    columnIndex: 2,
                    rowIndex: 0,
                } as Node
                const link1: NodeLink = {
                    id: uuidv4(),
                    fromId: startNode.id,
                    toId: routineListNode.id,
                } as NodeLink
                const link2: NodeLink = {
                    id: uuidv4(),
                    fromId: routineListNode.id,
                    toId: endNode.id,
                } as NodeLink
                setRoutine({
                    inputs: [],
                    outputs: [],
                    nodes: [startNode, routineListNode, endNode],
                    nodeLinks: [link1, link2],
                    translations: [{
                        language,
                        title: 'New Routine',
                        instructions: 'Enter instructions here',
                        description: '',
                    }]
                } as any)
            }
            setIsBuildOpen(true);
        }
    }, [language]);
    const viewGraph = useCallback(() => {
        setLocation(stringifySearchParams({
            build: routine?.id,
        }), { replace: true });
        setIsBuildOpen(true);
    }, [routine?.id, setLocation]);
    const stopBuild = useCallback(() => { setIsBuildOpen(false) }, []);


    const [isRunOpen, setIsRunOpen] = useState(false)
    const [selectRunAnchor, setSelectRunAnchor] = useState<any>(null);
    const handleRunSelect = useCallback((run: Run | null) => {
        // If run is null, it means the routine will be opened without a run
        if (!run) {
            setLocation(stringifySearchParams({
                run: "test",
                step: [1]
            }), { replace: true });
        }
        // Otherwise, open routine where last left off in run
        else {
            setLocation(stringifySearchParams({
                run: run.id,
                step: run.steps.length > 0 ? run.steps[run.steps.length - 1].step : undefined,
            }), { replace: true });
        }
        setIsRunOpen(true);
    }, [setLocation]);
    const handleSelectRunClose = useCallback(() => setSelectRunAnchor(null), []);

    const runRoutine = useCallback((e: any) => {
        // Validate routine before trying to run
        if (!routine || !uuidValidate(routine.id)) {
            PubSub.publish(Pubs.Snack, { message: 'Error loading routine.', severity: 'error' });
            return;
        }
        // Find first node
        const firstNode = routine?.nodes?.find(node => node.type === NodeType.Start);
        if (!firstNode) {
            PubSub.publish(Pubs.Snack, { message: 'Routine invalid - cannot run.', severity: 'Error' });
            return;
        }
        // If run specified use that
        if (runId) {
            handleRunSelect({ id: runId } as Run);
        }
        // Otherwise, open dialog to select runs
        else {
            setSelectRunAnchor(e.currentTarget);
        }
    }, [handleRunSelect, routine, runId]);
    const stopRoutine = () => { setIsRunOpen(false) };

    const onEdit = useCallback(() => {
        // Depends on if we're in a search popup or a normal routine page
        const isMultiStep = (Array.isArray(routine?.nodes) && (routine?.nodes as Routine['nodes']).length > 1) ||
            (Array.isArray(routine?.nodeLinks) && (routine?.nodeLinks as Routine['nodeLinks']).length > 0);
        // If multi step, navigate to build page
        if (isMultiStep) {
            setLocation(stringifySearchParams({
                build: true,
                edit: true,
            }), { replace: true });
            setIsBuildOpen(true);
        }
        // Otherwise, edit as single step
        else {
            setLocation(Boolean(params?.id) ? `${APP_LINKS.Routine}/edit/${id}` : `${APP_LINKS.SearchRoutines}/edit/${id}`);
        }
    }, [routine?.nodes, routine?.nodeLinks, setLocation, id, params?.id]);

    // More menu
    const [moreMenuAnchor, setMoreMenuAnchor] = useState<any>(null);
    const openMoreMenu = useCallback((ev: MouseEvent<any>) => {
        setMoreMenuAnchor(ev.currentTarget);
        ev.preventDefault();
    }, []);
    const closeMoreMenu = useCallback(() => setMoreMenuAnchor(null), []);

    // Determine options available to object, in order
    const moreOptions: BaseObjectAction[] = useMemo(() => {
        // Initialize
        let options: BaseObjectAction[] = [];
        if (canEdit) {
            options.push(BaseObjectAction.Edit);
        }
        options.push(BaseObjectAction.Stats);
        if (session && !canEdit) {
            options.push(routine?.isUpvoted ? BaseObjectAction.Downvote : BaseObjectAction.Upvote);
            options.push(routine?.isStarred ? BaseObjectAction.Unstar : BaseObjectAction.Star);
            options.push(BaseObjectAction.Fork);
        }
        options.push(BaseObjectAction.Donate, BaseObjectAction.Share)
        if (session?.id) {
            options.push(BaseObjectAction.Report);
        }
        if (canEdit) {
            options.push(BaseObjectAction.Delete);
        }
        return options;
    }, [routine, canEdit, session]);

    /**
     * If routine has nodes (i.e. is not just this page), display "View Graph" and "Start" (or "Continue") buttons. 
     * Otherwise, display "Mark as Complete" button.
     */
    const actions = useMemo(() => {
        // If routine has no nodes
        if (!routine?.nodes?.length) {
            // Only show if logged in
            if (!session?.id) return null;
            return (
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Button startIcon={<MarkAsCompleteIcon />} fullWidth onClick={markAsComplete} color="secondary">Mark as Complete</Button>
                    </Grid>
                </Grid>
            )
        }
        // If routine has nodes
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                    <Button startIcon={<GraphIcon />} fullWidth onClick={viewGraph} color="secondary">View Graph</Button>
                </Grid>
                {/* Show continue if routine already has progress TODO */}
                <Grid item xs={12} sm={6}>
                    {routine && routine.runs?.length > 0 ?
                        <Button startIcon={<StartIcon />} fullWidth onClick={runRoutine} color="secondary">Continue</Button> :
                        <Button startIcon={<StartIcon />} fullWidth onClick={runRoutine} color="secondary">Start Now</Button>
                    }
                </Grid>
            </Grid>
        )
    }, [routine, viewGraph, runRoutine, session?.id, markAsComplete]);

    // The schema and formik keys for the form
    const formValueMap = useMemo<{ [fieldName: string]: FieldData } | null>(() => {
        if (!routine) return null;
        const schemas: { [fieldName: string]: FieldData } = {};
        for (let i = 0; i < routine.inputs?.length; i++) {
            const currSchema = standardToFieldData(routine.inputs[i].standard, `inputs-${i}`);
            if (currSchema) {
                schemas[currSchema.fieldName] = currSchema;
            }
        }
        return schemas;
    }, [routine]);
    const previewFormik = useFormik({
        initialValues: {
            ...formValueMap,
        },
        enableReinitialize: true,
        onSubmit: () => { },
    });

    const resourceList = useMemo(() => {
        console.log('calculating resource list start', routine?.resourceLists)
        if (!routine ||
            !Array.isArray(routine.resourceLists) ||
            routine.resourceLists.length < 1 ||
            routine.resourceLists[0].resources.length < 1) return null;
        console.log('got list', routine.resourceLists[0])
        return <ResourceListHorizontal
            title={'Resources'}
            list={routine.resourceLists[0]}
            canEdit={false}
            handleUpdate={() => { }} // Intentionally blank
            loading={loading}
            session={session}
            zIndex={zIndex}
        />
    }, [loading, routine, session, zIndex]);

    /**
     * Display body or loading indicator
     */
    const body = useMemo(() => {
        if (loading) return (
            <Box sx={{
                minHeight: 'min(300px, 25vh)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <CircularProgress color="secondary" />
            </Box>
        )
        return (
            <>
                {/* Stack that shows routine info, such as resources, description, inputs/outputs */}
                <Stack direction="column" spacing={2} padding={1}>
                    {/* Resources */}
                    {resourceList}
                    {/* Description */}
                    <Box sx={{
                        padding: 1,
                        color: Boolean(description) ? palette.background.textPrimary : palette.background.textSecondary,
                    }}>
                        <Typography variant="h6" sx={{ color: palette.background.textPrimary }}>Description</Typography>
                        <Typography variant="body1">{description ?? 'No description set'}</Typography>
                    </Box>
                    {/* Instructions */}
                    <Box sx={{
                        padding: 1,
                        borderRadius: 1,
                        color: Boolean(instructions) ? palette.background.textPrimary : palette.background.textSecondary,
                    }}>
                        <Typography variant="h6" sx={{ color: palette.background.textPrimary }}>Instructions</Typography>
                        <Markdown>{instructions ?? 'No instructions'}</Markdown>
                    </Box>
                    {/* Auto-generated inputs */}
                    {
                        Object.keys(previewFormik.values).length > 0 && <Box sx={{
                            padding: 1,
                            borderRadius: 1,
                        }}>
                            <Typography variant="h6" sx={{ color: palette.background.textPrimary }}>Inputs</Typography>
                            {
                                Object.values(formValueMap ?? {}).map((field: FieldData, i: number) => (
                                    <Box key={i} sx={{
                                        padding: 1,
                                        borderRadius: 1,
                                    }}>
                                        <Typography variant="h6" sx={{ color: palette.background.textPrimary }}>{field.label ?? `Input ${i + 1}`}</Typography>
                                        {
                                            generateInputComponent({
                                                data: field,
                                                disabled: false,
                                                formik: previewFormik,
                                                session,
                                                onUpload: () => { },
                                                zIndex,
                                            })
                                        }
                                    </Box>
                                ))
                            }
                        </Box>
                    }
                    {/* Stats */}
                    {Array.isArray(routine?.nodes) && (routine as any).nodes.length > 0 && <Box sx={{
                        padding: 1,
                        borderRadius: 1,
                    }}>
                        {/* TODO click to view */}
                        <Typography variant="h6">Stats</Typography>
                        <Typography variant="body1">Complexity: {routine?.complexity}</Typography>
                        <Typography variant="body1">Simplicity: {routine?.simplicity}</Typography>
                        <Typography variant="body1">Score: {routine?.score}</Typography>
                        <Typography variant="body1">Stars: {routine?.stars}</Typography>
                    </Box>}
                </Stack>
                {/* Actions */}
                {actions}
            </>
        )
    }, [loading, resourceList, description, palette.background.textPrimary, palette.background.textSecondary, instructions, formValueMap, routine, actions, previewFormik, session, zIndex]);

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            // xs: 100vh - navbar (64px) - bottom nav (56px)
            // md: 100vh - navbar (80px)
            minHeight: { xs: 'calc(100vh - 64px - 56px)', md: 'calc(100vh - 80px)' },
        }}>
            {/* Chooses which run to use */}
            <RunPickerDialog
                anchorEl={selectRunAnchor}
                handleClose={handleSelectRunClose}
                onSelect={handleRunSelect}
                routine={routine}
                session={session}
            />
            {/* Dialog for running routine */}
            <Dialog
                id="run-routine-view-dialog"
                fullScreen
                open={isRunOpen}
                onClose={stopRoutine}
                TransitionComponent={UpTransition}
                sx={{
                    zIndex: zIndex + 1,
                }}
            >
                {routine && <RunView
                    handleClose={stopRoutine}
                    routine={routine}
                    session={session}
                    zIndex={zIndex + 1}
                />}
            </Dialog>
            {/* Dialog for building routine */}
            <Dialog
                id="run-routine-view-dialog"
                fullScreen
                open={isBuildOpen}
                onClose={stopBuild}
                TransitionComponent={UpTransition}
                sx={{
                    zIndex: zIndex + 1,
                }}
            >
                <BuildView
                    handleClose={stopBuild}
                    loading={loading}
                    onChange={updateRoutine}
                    routine={routine}
                    session={session}
                    zIndex={zIndex + 1}
                />
            </Dialog>
            {/* Popup menu displayed when "More" ellipsis pressed */}
            <BaseObjectActionDialog
                handleActionComplete={() => { }} //TODO
                handleEdit={onEdit}
                objectId={id ?? ''}
                objectName={title ?? ''}
                objectType={ObjectType.Routine}
                anchorEl={moreMenuAnchor}
                title='Routine Options'
                availableOptions={moreOptions}
                onClose={closeMoreMenu}
                session={session}
                zIndex={zIndex + 1}
            />
            {/* Main container */}
            <Box sx={{
                background: palette.background.paper,
                overflowY: 'auto',
                width: 'min(100%, 600px)',
                borderRadius: { xs: '8px 8px 0 0', sm: '8px' },
                overflow: 'overlay',
                boxShadow: { xs: 'none', sm: (containerShadow as any).boxShadow },
                // Add bottom margin so that the bottom navbar doesn't cover the bottom of the page
                marginBottom: { xs: '48px', md: '0' },
            }}>
                {/* Heading container */}
                <Stack direction="column" spacing={1} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2,
                    marginBottom: 1,
                    background: palette.primary.main,
                    color: palette.primary.contrastText,
                }}>
                    {/* Show star button and ellipsis next to title */}
                    <Stack direction="row" spacing={1} alignItems="center">
                        {loading ?
                            <LinearProgress color="inherit" sx={{
                                borderRadius: 1,
                                width: '50vw',
                                height: 8,
                                marginTop: '12px !important',
                                marginBottom: '12px !important',
                                maxWidth: '300px',
                            }} /> :
                            <Typography variant="h5" sx={{ textAlign: 'center' }}>{title}</Typography>}

                        <Tooltip title="More options">
                            <IconButton
                                aria-label="More"
                                size="small"
                                onClick={openMoreMenu}
                                sx={{
                                    display: 'block',
                                    marginLeft: 'auto',
                                    marginRight: 1,
                                }}
                            >
                                <EllipsisIcon sx={{ fill: palette.primary.contrastText }} />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <StarButton
                            session={session}
                            objectId={routine?.id ?? ''}
                            showStars={false}
                            starFor={StarFor.Routine}
                            isStar={routine?.isStarred ?? false}
                            stars={routine?.stars ?? 0}
                            onChange={(isStar: boolean) => { routine && setRoutine({ ...routine, isStarred: isStar }) }}
                            tooltipPlacement="bottom"
                        />
                        {ownedBy && (
                            <LinkButton
                                onClick={toOwner}
                                text={ownedBy}
                            />
                        )}
                        <Typography variant="body1"> - {routine?.version}</Typography>
                        <SelectLanguageDialog
                            availableLanguages={availableLanguages}
                            canDropdownOpen={availableLanguages.length > 1}
                            currentLanguage={language}
                            handleCurrent={setLanguage}
                            session={session}
                            zIndex={zIndex}
                        />
                        {canEdit && <Tooltip title="Edit routine">
                            <IconButton
                                aria-label="Edit routine"
                                size="small"
                                onClick={onEdit}
                            >
                                <EditIcon sx={{ fill: TERTIARY_COLOR }} />
                            </IconButton>
                        </Tooltip>}
                    </Stack>
                </Stack>
                {/* Body container */}
                <Box sx={{
                    padding: 2,
                }}>
                    {body}
                </Box>
            </Box>
        </Box >
    )
}