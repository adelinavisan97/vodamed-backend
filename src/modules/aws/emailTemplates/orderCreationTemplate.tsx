import * as React from 'react';
import { Section } from '@react-email/components';
import {
  VMHeading,
  VMText,
  VMTabularData,
  VMEmail,
  VMHeadingWithIcon,
  VMList,
  VMListItem,
} from './emailComponents';
import { OrderCreationFields } from './orderFields';

export default function orderCreationEmailBody(
  fields: OrderCreationFields
): React.ReactElement {
  const header = 'Order created for ' + fields.customerName;

  return (
    <VMEmail previewText="New order created">
      <VMHeading heading={header} tag="h1" />

      <Section>
        <VMText noMargin>Hello {fields.customerName},</VMText>
        <VMText>A new order has been created from your Vodamed account.</VMText>
      </Section>

      <VMHeadingWithIcon
        icon={{
          src: 'https://www.flaticon.com/free-icons/list',
          alt: 'Order pad icon',
          style: { marginLeft: '-8px' },
        }}
        heading={'Order summary'}
        tag="h2"
      />

      <Section style={{ marginTop: '10px' }}>
        {fields.customerName && (
          <VMTabularData title="Customer name" text={fields.customerName} />
        )}
        {fields.orderDate && (
          <VMTabularData title="Ordered on" text={fields.orderDate} />
        )}
        {fields.shippingAddress && (
          <VMTabularData
            title="Shipping address"
            text={fields.shippingAddress}
          />
        )}
        <VMList>
          {fields.orderItems.map((item, index) => (
            <VMListItem key={index}>
              <strong>{item.medicine}</strong> - Quantity: {item.quantity},
              Price: ${item.price}, Total: ${item.total}
            </VMListItem>
          ))}
        </VMList>
        {fields.totalAmount && (
          <VMTabularData title="Total amount" text={fields.totalAmount} />
        )}
      </Section>
    </VMEmail>
  );
}
