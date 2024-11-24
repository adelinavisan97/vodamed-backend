import React from 'react';

type VMListProps = React.PropsWithChildren<{
  ordered?: boolean;
}>;

const list: React.CSSProperties = {
  paddingLeft: '14px',
  margin: 0,
};

const VMList = ({children, ordered}: VMListProps) => {
  const Tag = ordered ? 'ol' : 'ul';
  return <Tag style={list}>{children}</Tag>;
};

export default VMList;
