import { useEffect } from 'react';
import { APP_LINKS } from '@local/shared';
import { useLocation, Redirect } from 'wouter';
import { UserRoles } from 'types';
import { Pubs } from 'utils';

interface Props {
    title?: string;
    sessionChecked: boolean;
    redirect?: string;
    userRoles: UserRoles;
    restrictedToRoles?: string[];
    children: JSX.Element;
}

export const Page = ({
    title = '',
    sessionChecked,
    redirect = APP_LINKS.Home,
    userRoles,
    restrictedToRoles = [],
    children
}: Props) => {
    const [location] = useLocation();
    console.log('sessio checked', sessionChecked, userRoles);

    useEffect(() => {
        document.title = title;
    }, [title]);

    // If this page has restricted access
    if (restrictedToRoles.length > 0) {
        if (Array.isArray(userRoles)) {
            if (userRoles.some(r => restrictedToRoles.includes(r))) return children;
        }
        if (sessionChecked && location !== redirect) { 
            console.log('session check failed', restrictedToRoles, userRoles)
            PubSub.publish(Pubs.Snack, { message: 'Page restricted. Please log in', severity: 'error' });
            return <Redirect to={redirect} />
        }
        return null;
    }

    return children;
};