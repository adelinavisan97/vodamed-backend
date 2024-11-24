import React, {PropsWithChildren} from 'react';
import {Text} from '@react-email/components';

type VMTextProps = PropsWithChildren<{style?: React.CSSProperties}> & {
  bold?: boolean;
  span?: boolean;
  noMargin?: boolean;
  inline?: boolean;
};

const defaultText: React.CSSProperties = {
  fontSize: '16px',
  lineHeight: '24px',
};

const StrongWrapper = ({children, condition}: {children: React.ReactNode; condition?: boolean}) =>
  condition ? <strong style={{textShadow: '1px 0 0 currentColor'}}>{children}</strong> : <>{children}</>;

const VMText = ({children, bold, span, inline, noMargin, style = {}}: VMTextProps) => {
  const Tag = span ? 'span' : Text;

  return (
    <Tag
      style={{
        ...defaultText,
        margin: noMargin ? 0 : undefined,
        display: inline ? 'inline-block' : undefined,
        ...style,
      }}
    >
      <StrongWrapper condition={bold}>{children}</StrongWrapper>
    </Tag>
  );
};

export default VMText;
