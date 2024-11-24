import {Row, Column} from '@react-email/components';
import React from 'react';
import {VMText} from '.';

type VMTabularDataProps = {
  title: string;
  text: string | number;
  delimiter?: string;
};

const textStyles: React.CSSProperties = {
  margin: 0,
};

const VMTabularData = ({title, text, delimiter = ' : '}: VMTabularDataProps) => {
  return (
    <Row>
      <Column>
        <VMText inline style={textStyles}>
          {title}
        </VMText>
        {delimiter}
        <VMText inline bold style={textStyles}>
          {text}
        </VMText>
      </Column>
    </Row>
  );
};

export default VMTabularData;
