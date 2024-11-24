import { Container } from '@react-email/components';
import React from 'react';

const content: React.CSSProperties = {
  maxWidth: '520px',
  padding: '0 0 80px 0',
};

const VMContent = ({ children }: { children: React.ReactNode }) => {
  return <Container style={content}>{children}</Container>;
};

export default VMContent;
