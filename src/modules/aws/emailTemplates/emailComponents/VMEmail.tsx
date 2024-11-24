import { Head, Html, Img, Preview, Section } from '@react-email/components';
import { Font } from '@react-email/font';
import React from 'react';
import { VMContent, VMText, VMBody } from '.';

type VMEmailProps = React.PropsWithChildren<{
  previewText?: string;
}>;

const VMEmail = ({ children, previewText }: VMEmailProps) => {
  return (
    <Html>
      <Head>
        <Font
          fallbackFontFamily={['Helvetica', 'Arial']}
          fontFamily="Helvetica"
        />
      </Head>
      <VMBody>
        {/* <Section>
          <Img
            src="https://hub.ucc-dev.vodafone.com/core/img/email/banner_header.png"
            alt="VodaMed Header Banner"
          />
        </Section> */}

        {previewText && <Preview>{previewText}</Preview>}

        <VMContent>
          {children}

          <Section>
            <VMText noMargin>Regards,</VMText>
            <VMText noMargin>Team VodaMed</VMText>
          </Section>
        </VMContent>

        {/* <Section>
          <Img
            src="https://hub.ucc-dev.vodafone.com/core/img/email/banner_footer.png"
            alt="VodaMed Footer Banner"
          />
        </Section> */}
      </VMBody>
    </Html>
  );
};

export default VMEmail;
