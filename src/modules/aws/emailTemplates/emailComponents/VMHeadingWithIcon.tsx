import {Section, Column, Img} from '@react-email/components';
import React from 'react';
import {VMText} from '.';

type VMHeadingWithIconProps = {
  icon: {
    src: string;
    alt: string;
    style?: React.CSSProperties;
  };
  heading: string;
  tag: 'h1' | 'h2';
};

const h1: React.CSSProperties = {
  fontSize: '1.5rem',
  textShadow: '1px 0 0 currentColor',
};

const h2: React.CSSProperties = {
  fontSize: '1.125rem',
  fontWeight: 'bold',
  marginTop: '8px',
  marginBottom: '8px',
};

const VMHeadingWithIcon = ({icon, heading, tag}: VMHeadingWithIconProps) => {
  return (
    <Section style={{margin: '16px 0'}}>
      <Column align="right" style={{width: '32px'}}>
        <Img src={icon.src} alt={icon.alt} style={{margin: '0 8px 0 0', ...icon.style}} />
      </Column>
      <Column align="right">
        <VMText
          bold
          style={{
            ...(tag === 'h1' ? h1 : h2),
            float: 'left',
          }}
        >
          {heading}
        </VMText>
      </Column>
    </Section>
  );
};

export default VMHeadingWithIcon;
