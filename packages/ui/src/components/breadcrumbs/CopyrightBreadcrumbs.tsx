import { BreadcrumbsBase } from './BreadcrumbsBase';
import { BUSINESS_NAME, LANDING_LINKS, LANDING_URL } from '@local/shared';
import { BreadcrumbsBaseProps } from './types';

export const CopyrightBreadcrumbs = ({ 
    ...props 
}: Omit<BreadcrumbsBaseProps, 'paths' | 'ariaLabel' | 'style'>) => {
    const paths = [
        [`© ${new Date().getFullYear()} ${BUSINESS_NAME}`, `${LANDING_URL}${LANDING_LINKS.Home}`],
        ['Privacy', `${LANDING_URL}${LANDING_LINKS.PrivacyPolicy}`],
        ['Terms', `${LANDING_URL}${LANDING_LINKS.Terms}`]
    ].map(row => ({ text: row[0], link: row[1] }))
    return BreadcrumbsBase({
        paths: paths,
        ariaLabel: 'Copyright breadcrumb',
        style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        ...props
    })
}