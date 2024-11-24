import React from 'react';

const item: React.CSSProperties = {
  padding: '0 0 2px 12px',
  fontSize: '16px',
  lineHeight: '24px',
};

const VMListItem = ({children}: {children: React.ReactNode}) => {
  return <li style={item}>{children}</li>;
};

export default VMListItem;
