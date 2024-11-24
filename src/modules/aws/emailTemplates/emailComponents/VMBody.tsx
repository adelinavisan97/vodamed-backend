import {Container} from '@react-email/components';
import React from 'react';

const body: React.CSSProperties = {
  margin: '0 auto',
  width: '600px',
  backgroundColor: '#fff',
};

const VMBody = ({children}: {children: React.ReactNode}) => {
  return <Container style={body}>{children}</Container>;
};

export default VMBody;
