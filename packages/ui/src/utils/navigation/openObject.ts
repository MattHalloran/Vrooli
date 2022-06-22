/**
 * Navigate to various objects and object search pages
 */

import { APP_LINKS } from "@local/shared";
import { SetLocation } from "types";
import { Pubs } from "utils/consts";

export enum ObjectType {
    Comment = 'Comment',
    Organization = 'Organization',
    Project = 'Project',
    Routine = 'Routine',
    Standard = 'Standard',
    User = 'User',
}

export const objectLinkMap: { [key in ObjectType]?: [string, string] } = {
    [ObjectType.Organization]: [APP_LINKS.SearchOrganizations, APP_LINKS.Organization],
    [ObjectType.Project]: [APP_LINKS.SearchProjects, APP_LINKS.Project],
    [ObjectType.Routine]: [APP_LINKS.SearchRoutines, APP_LINKS.Routine],
    [ObjectType.Standard]: [APP_LINKS.SearchStandards, APP_LINKS.Standard],
    [ObjectType.User]: [APP_LINKS.SearchUsers, APP_LINKS.Profile],
}

/**
 * Opens search page for given object type
 * @param objectType Object type
 * @param setLocation Function to set location in history
 */
export const openSearchPage = (objectType: ObjectType, setLocation: SetLocation) => {
    const linkBases = objectLinkMap[objectType];
    if (linkBases) setLocation(linkBases[0]);
}

/**
 * Opens any object with an id and __typename
 * @param object Object to open
 * @param setLocation Function to set location in history
 */
export const openObject = (object: { id: string, handle?: string | null, __typename: string }, setLocation: SetLocation) => {
    // Check if __typename is in objectLinkMap
    if (!objectLinkMap.hasOwnProperty(object.__typename)) {
        PubSub.publish(Pubs.Snack, { message: 'Could not parse object type.', severity: 'error' });
        return; 
    }
    // Navigate to object page
    const linkBases = objectLinkMap[object.__typename];
    const linkId = object.handle ? object.handle : object.id;
    setLocation(`${linkBases[1]}/${linkId}`);
}