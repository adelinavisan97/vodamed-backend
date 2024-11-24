import * as React from 'react';
import { Section } from '@react-email/components';
import {
  VMHeading,
  VMText,
  VMTabularData,
  VMEmail,
  VMLink,
  VMHeadingWithIcon,
} from './emailComponents';
import { NumberRequestEmailFields } from './emailTemplate';

export default function numberRequestEmailBody(
  fields: NumberRequestEmailFields,
  isAdminEmail: boolean
): React.ReactElement {
  const header = isAdminEmail
    ? 'Number request raised for ' + fields.customerName
    : 'Thank you for your number request.';

  return (
    <VMEmail previewText={fields.previewText}>
      <VMHeading heading={header} tag="h1" />

      <Section>
        <VMText noMargin>Hello from UC Hub,</VMText>
        <VMText>
          A number request {fields.orderId} has been{'  '}
          <VMText span bold>
            {fields.orderUpdatedStatus}
          </VMText>{' '}
          from your {isAdminEmail && "customer's "}UC Hub account.
        </VMText>
      </Section>

      <VMHeadingWithIcon
        icon={{
          src: 'https://hub.ucc-dev.vodafone.com/core/img/email/dial_pad.png',
          alt: 'Vodafone Dial Pad',
          style: { marginLeft: '-8px' },
        }}
        heading={'Number request summary'}
        tag="h2"
      />

      <Section style={{ marginTop: '10px' }}>
        {fields.customerName && (
          <VMTabularData title="Customer name" text={fields.customerName} />
        )}
        {fields.endCustomerName && (
          <VMTabularData title="End user name" text={fields.endCustomerName} />
        )}
        {fields.orderDate && (
          <VMTabularData title="Ordered on" text={fields.orderDate} />
        )}
        {fields.country && (
          <VMTabularData title="Country" text={fields.country} />
        )}
        {fields.numberType && (
          <VMTabularData title="Number type" text={fields.numberType} />
        )}
        {fields.city && <VMTabularData title="Area" text={fields.city} />}
        {fields.useCase && (
          <VMTabularData title="Use case" text={fields.useCase} />
        )}
        {fields.quantity ? (
          <VMTabularData title="Quantity" text={fields.quantity} />
        ) : null}
      </Section>

      <Section>
        <VMText>
          To view regulatory requirements for the request, click here:{' '}
          <VMLink href={fields.regulatoryRequirementsUrl} asButton>
            Regulatory requirements
          </VMLink>
        </VMText>
      </Section>

      <Section>
        <VMText>
          <VMLink href={fields.orderUrl}>Click here</VMLink> to go to{' '}
          {isAdminEmail && 'the '} {!isAdminEmail && 'your '}
          number request.
        </VMText>
      </Section>

      {!isAdminEmail && (
        <Section>
          <VMText>
            Our team aims to reply to your enquiries within one business day.
          </VMText>
        </Section>
      )}
    </VMEmail>
  );
}
