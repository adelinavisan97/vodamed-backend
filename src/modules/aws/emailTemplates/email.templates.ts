import { OrderCreationFields } from './orderFields';
import Ses, { SendEmailCommandOutput } from './ses';
import { config } from '../../../config';
// import { PerscriptionCreationFields } from './prescriptionFields';
import orderCreationEmailBody from './orderCreationTemplate';

const ses = new Ses();

/**
 * Send a notification when a new order is created.
 * @param emailBodyData an object containing the values for the field inputs in the email template
 * @param to the list of email addresses to send the email to.
 * @param cc the list of email addresses to send the email to as cc.
 * @param bcc the list of email addresses to send the email to as bcc.
 * @returns a Promise<SendEmailCommandOutput> object.
 */
export async function sendOrderCreationEmail(
  emailBodyData: OrderCreationFields,
  to?: Array<string>,
  cc?: Array<string>,
  bcc?: Array<string>
): Promise<SendEmailCommandOutput> {
  const subject = 'New Order Creation';
  return ses.sendSesEmailUsingReactTemplate(
    subject,
    config.SourceEmail,
    orderCreationEmailBody(emailBodyData),
    to,
    cc,
    bcc
  );
}

// /**
//  * Send a notification when a new prescription is created.
//  * @param emailBodyData an object containing the values for the field inputs in the email template
//  * @param to the list of email addresses to send the email to.
//  * @param cc the list of email addresses to send the email to as cc.
//  * @param bcc the list of email addresses to send the email to as bcc.
//  * @returns a Promise<SendEmailCommandOutput> object.
//  */
// export async function sendPrescriptionOrderl(
//   emailBodyData: PerscriptionCreationFields,
//   to?: Array<string>,
//   cc?: Array<string>,
//   bcc?: Array<string>
// ): Promise<SendEmailCommandOutput> {
//   const subject = 'New Prescription Creation';
//   return ses.sendSesEmailUsingReactTemplate(
//     subject,
//     config.SourceEmail,
//     orderCreationEmailBody(emailBodyData),
//     to,
//     cc,
//     bcc
//   );
// }
