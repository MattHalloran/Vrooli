import { SvgProps } from './types';

export const InstagramIcon = (props: SvgProps) => (
    <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 54 54"
        style={props.style}
        aria-labelledby="instagram-icon"
        width={props.width}
        height={props.height}
        onClick={() => typeof props.onClick === 'function' && props.onClick()}>
        <title id="instagram-icon">{props.iconTitle ?? 'Instagram Icon'}</title>
        <path fill="none" d="M-.2.1h53.8v53.4H-.2z" />
        <path d="M48.1 26.3c0 4.3 0 7.2-.1 8.8-.2 3.9-1.3 6.9-3.5 9s-5.1 3.3-9 3.5c-1.6.1-4.6.1-8.8.1-4.3 0-7.2 0-8.8-.1-3.9-.2-6.9-1.3-9-3.5-2.1-2.1-3.3-5.1-3.5-9-.1-1.6-.1-4.6-.1-8.8s0-7.2.1-8.8c.2-3.9 1.3-6.9 3.5-9C11 6.4 14 5.2 17.9 5c1.6-.1 4.6-.1 8.8-.1 4.3 0 7.2 0 8.8.1 3.9.2 6.9 1.3 9 3.5s3.3 5.1 3.5 9c0 1.6.1 4.5.1 8.8zM28.8 8.7h-7.1c-.7 0-1.6 0-2.7.1-1.1 0-2.1.1-2.9.3-.8.1-1.5.3-2 .5-.9.4-1.7.9-2.5 1.6-.7.7-1.2 1.5-1.6 2.5-.2.5-.4 1.2-.5 2s-.2 1.7-.3 2.9c0 1.1-.1 2-.1 2.7v10c0 .7 0 1.6.1 2.7 0 1.1.1 2.1.3 2.9s.3 1.5.5 2c.4.9.9 1.7 1.6 2.5.7.7 1.5 1.2 2.5 1.6.5.2 1.2.4 2 .5.8.1 1.7.2 2.9.3s2 .1 2.7.1h10c.7 0 1.6 0 2.7-.1 1.1 0 2.1-.1 2.9-.3.8-.1 1.5-.3 2-.5.9-.4 1.7-.9 2.5-1.6.7-.7 1.2-1.5 1.6-2.5.2-.5.4-1.2.5-2 .1-.8.2-1.7.3-2.9 0-1.1.1-2 .1-2.7v-10c0-.7 0-1.6-.1-2.7 0-1.1-.1-2.1-.3-2.9-.1-.8-.3-1.5-.5-2-.4-.9-.9-1.7-1.6-2.5-.7-.7-1.5-1.2-2.5-1.6-.5-.2-1.2-.4-2-.5-.8-.1-1.7-.2-2.9-.3-1.1 0-2-.1-2.7-.1h-2.9zm5.6 9.8c2.1 2.1 3.2 4.7 3.2 7.8s-1.1 5.6-3.2 7.8c-2.1 2.1-4.7 3.2-7.8 3.2-3.1 0-5.6-1.1-7.8-3.2-2.1-2.1-3.2-4.7-3.2-7.8s1.1-5.6 3.2-7.8c2.1-2.1 4.7-3.2 7.8-3.2 3.1 0 5.7 1 7.8 3.2zm-2.7 12.8c1.4-1.4 2.1-3.1 2.1-5s-.7-3.7-2.1-5.1c-1.4-1.4-3.1-2.1-5.1-2.1-2 0-3.7.7-5.1 2.1s-2.1 3.1-2.1 5.1.7 3.7 2.1 5c1.4 1.4 3.1 2.1 5.1 2.1 2 0 3.7-.7 5.1-2.1zM39.9 13c.5.5.8 1.1.8 1.8s-.3 1.3-.8 1.8-1.1.8-1.8.8-1.3-.3-1.8-.8-.8-1.1-.8-1.8.3-1.3.8-1.8 1.1-.8 1.8-.8 1.3.3 1.8.8z" />
    </svg>
)