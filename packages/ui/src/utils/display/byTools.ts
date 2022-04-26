import { APP_LINKS } from "@local/shared";
import { Organization, Project, Routine, Standard, User } from "types";
import { Pubs } from "../consts";
import { getTranslation } from "./translationTools";

/**
 * Gets name of user or organization that owns this object
 * @params object Either a project or routine
 * @params languages Languages preferred by user
 * @returns String of owner, or empty string if no owner
 */
export const getOwnedByString = (object: Project | Routine | null | undefined, languages: string[]): string => {
    if (!object || !object.owner) return '';
    // Check if user or organization. Only users have a non-translated name
    if (object.owner.__typename === 'User' || object.owner.hasOwnProperty('name')) {
        return (object.owner as User).name ?? object.owner.handle ?? '';
    } else {
        return getTranslation(object.owner, 'name', languages, true) ?? object.owner.handle ?? '';
    }
}

/**
 * Gets name of user or organization that created this object
 * @params object
 * @params languages Languages preferred by user
 * @returns String of owner, or empty string if no owner
 */
 export const getCreatedByString = (object: Standard | null | undefined, languages: string[]): string => {
    if (!object || !object.creator) return '';
    // Check if user or organization. Only users have a non-translated name
    if (object.creator.__typename === 'User' || object.creator.hasOwnProperty('name')) {
        return (object.creator as User).name ?? object.creator.handle ?? '';
    } else {
        return getTranslation(object.creator, 'name', languages, true) ?? object.creator.handle ?? '';
    }
}

/**
 * Navigates to owner of object
 * @params object Either a project or routine
 * @params setLocation Function to set location in history
 */
export const toOwnedBy = (
    object: Project | Routine | null | undefined,
    setLocation: (to: string, options?: { replace?: boolean | undefined } | undefined) => void
): void => {
    if (!object || !object.owner) {
        PubSub.publish(Pubs.Snack, { message: 'Could not find owner.', severity: 'Error' });
        return;
    }
    // If object has handle, use that instead of ID
    const objLocation = object.owner.handle ?? object.owner.id;
    // Check if user or organization
    if (object.owner.__typename === 'User' || object.owner.hasOwnProperty('name')) {
        setLocation(`${APP_LINKS.Profile}/${objLocation}`);
    } else {
        setLocation(`${APP_LINKS.Organization}/${objLocation}`);
    }
}