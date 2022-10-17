import NextLink from 'next/link'

const Link = ({ children, className, ...props }) => (
    <NextLink href={props.href} {...props}>
        <a className={className ? className : "underline hover:decoration-dashed"}>
            {children}
        </a>
    </NextLink>
)

export default Link