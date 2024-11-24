import {Link} from '@react-email/components';
import React from 'react';

const defaultLink: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '16px',
};

const button: React.CSSProperties = {
  ...defaultLink,
  backgroundColor: '#301934',
  color: '#ffffff',
  borderRadius: '8px',
  padding: '4px 16px',
  textDecoration: 'none',
  margin: '0 0 16px 0',
};

type VMLinkProps = React.PropsWithChildren<{
  href: string;
  asButton?: boolean;
}>;

const VMLink = ({children, asButton = false, href}: VMLinkProps) => {
  return (
    <Link style={asButton ? button : defaultLink} href={href}>
      {children}
    </Link>
  );
};

export default VMLink;
