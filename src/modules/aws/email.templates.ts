
/**
* Send a notification when a regulatory bundle status has changed.
* @param emailBodyData an object containing the values for the field inputs in the email template
* @param to the list of email addresses to send the email to.
* @param cc the list of email addresses to send the email to as cc.
* @param bcc the list of email addresses to send the email to as bcc.
* @returns a Promise<SendEmailCommandOutput> object.

*/

import { OrderCreationFields } from './order.fields';
import Ses, {SendEmailCommandOutput} from './ses';
import { config } from "../../config";
const ses = new Ses()
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
      regulatoryBundleChangeStatusEmailBody(emailBodyData),
      to,
      cc,
      bcc
    );
  }

  export async function sendPrescriptionOrderl(
    emailBodyData: OrderCreationFields,
    to?: Array<string>,
    cc?: Array<string>,
    bcc?: Array<string>
  ): Promise<SendEmailCommandOutput> {
    const subject = 'New Order Creation';
    return ses.sendSesEmailUsingReactTemplate(
      subject,
      config.SourceEmail,
      regulatoryBundleChangeStatusEmailBody(emailBodyData),
      to,
      cc,
      bcc
    );
  }