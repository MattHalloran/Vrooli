import { APP_LINKS, ROLES } from "@local/shared";
import { ShareDialog } from "components";
import { OrganizationDialog } from "components/dialogs/OrganizationDialog/OrganizationDialog";
import { organizationsQuery } from "graphql/query";
import { useCallback, useEffect, useState } from "react";
import { Organization } from "types";
import { ObjectType, Pubs, stringifySearchParams } from "utils";
import { useLocation } from "wouter";
import { BaseSearchPage } from "./BaseSearchPage";
import { SearchOrganizationsPageProps } from "./types";

export const SearchOrganizationsPage = ({
    session
}: SearchOrganizationsPageProps) => {
    const [location, setLocation] = useLocation();

    // Handles item add/select/edit
    const [selectedItem, setSelectedItem] = useState<Organization | undefined>(undefined);
    const handleSelected = useCallback((selected: Organization) => {
        setSelectedItem(selected);
    }, []);
    useEffect(() => {
        if (selectedItem) {
            setLocation(`${APP_LINKS.SearchOrganizations}/view/${selectedItem.id}`);
        }
    }, [selectedItem, setLocation]);
    useEffect(() => {
        if (location === APP_LINKS.SearchOrganizations) {
            setSelectedItem(undefined);
        }
    }, [location])

    // Handles dialog when adding a new organization
    const handleAddDialogOpen = useCallback(() => {
        const canAdd = Array.isArray(session?.roles) && session.roles.includes(ROLES.Actor);
        if (canAdd) {
            setLocation(`${APP_LINKS.SearchOrganizations}/add`)
        }
        else {
            PubSub.publish(Pubs.Snack, { message: 'Must be logged in.', severity: 'error' });
            setLocation(`${APP_LINKS.Start}${stringifySearchParams({
                redirect: APP_LINKS.SearchOrganizations
            })}`);
        }
    }, [session?.roles, setLocation]);

    // Handles dialog for the button that appears after scrolling a certain distance
    const [surpriseDialogOpen, setSurpriseDialogOpen] = useState(false);
    const handleSurpriseDialogOpen = useCallback(() => setSurpriseDialogOpen(true), []);
    const handleSurpriseDialogClose = useCallback(() => setSurpriseDialogOpen(false), []);

    return (
        <>
            {/* Invite link dialog */}
            <ShareDialog onClose={handleSurpriseDialogClose} open={surpriseDialogOpen} />
            {/* View/Add/Update dialog */}
            <OrganizationDialog
                partialData={selectedItem}
                session={session}
            />
            {/* Search component */}
            <BaseSearchPage
                itemKeyPrefix="organization-list-item"
                title="Organizations"
                searchPlaceholder="Search..."
                query={organizationsQuery}
                objectType={ObjectType.Organization}
                onObjectSelect={handleSelected}
                onAddClick={handleAddDialogOpen}
                popupButtonText="Invite"
                popupButtonTooltip="Can't find who you're looking for? Invite them😊"
                onPopupButtonClick={handleSurpriseDialogOpen}
                session={session}
            />
        </>
    )
}