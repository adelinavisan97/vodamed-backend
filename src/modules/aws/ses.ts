// 'use strict';
// import {
//   SES,
//   SendEmailRequest,
//   SendEmailCommandOutput,
// } from '@aws-sdk/client-ses';
// import { Options, render } from '@react-email/render';
/**
 * Allows for an instance of SES to be instantiated.
 * @class
 * @classdesc SES module contains functions to interact with AWS SES features.
 */
// export class Ses {
//   private SESVERSION = '2010-12-01';
//   private defaultRegion = 'eu-west-1';
//   private ses: SES;

//   /** Creates an instance of Cognito when a Logger instance is passed in as an argument */
//   constructor() {
//     this.ses = new SES({
//       apiVersion: this.SESVERSION,
//       region: this.defaultRegion,
//     });
//   }

//   /**
//    * Function to send an email through SES.
//    * @param {object} params The main parameters used in the function.
//    * @return {promise} Returns a promise.
//    */
//   async sendSesEmail(
//     sendSesEmailArgs: SendEmailRequest
//   ): Promise<SendEmailCommandOutput> {
//     const innerFunctionName = 'ses.sendSesEmail';
//     console.log(
//       `About to send email with subject: ${sendSesEmailArgs.Message?.Subject}, to: ${sendSesEmailArgs.Destination}`
//     );

//     return new Promise((resolve, reject) => {
//       this.ses.sendEmail(sendSesEmailArgs, (err, data) => {
//         if (err) {
//           console.log(`Error sending email to ${err.message}`), reject(err);
//         } else {
//           if (data !== undefined) {
//             console.log(`Successfully sent email ${data}`), resolve(data);
//           } else {
//             console.log('Send Email Failed: data undefined');
//             throw new Error(
//               JSON.stringify({
//                 message: 'Send Email Failed: data undefined',
//                 code: 424,
//               })
//             );
//           }
//         }
//       });
//     });
//   }

/**
 * Sends an email via AWS SES
 * @param subject the subject of the email
 * @param bodyHtml the HTML body content of the email
 * @param to the list of email addresses to send the email to
 * @param cc the list of email addresses to send the email to as cc
 * @param bcc the list of email addresses to send the email to as bcc
 * @returns a Promise<SendEmailCommandOutput>
 */
// async useSendSesEmail(
//   subject: string,
//   bodyHtml: string,
//   sourceEmail: string,
//   to?: Array<string>,
//   cc?: Array<string>,
//   bcc?: Array<string>
// ): Promise<SendEmailCommandOutput> {
//   return this.sendSesEmail({
//     Source: `noreply@${sourceEmail}`,
//     Destination: {
//       ToAddresses: to,
//       CcAddresses: cc,
//       BccAddresses: bcc,
//     },
//     Message: {
//       Body: {
//         Html: {
//           Data: bodyHtml,
//           Charset: 'UTF-8',
//         },
//       },
//       Subject: {
//         Data: subject,
//       },
//     },
//   });
// }

/**
 * Send an email via AWS SES using a React Email template for the body.
 * @param subject the subject of the email.
 * @param bodyTemplate the React Email template for the body of the email.
 * @param bodyRenderOptions render options for the email body template.
 * @param to the list of email addresses to send the email to.
 * @param cc the list of email addresses to send the email to as cc.
 * @param bcc the list of email addresses to send the email to as bcc.
 * @returns a Promise<SendEmailCommandOutput> object.
 */
// async sendSesEmailUsingReactTemplate(
//   subject: string,
//   sourceEmail: string,
//   bodyTemplate: React.ReactElement,
//   to?: Array<string>,
//   cc?: Array<string>,
//   bcc?: Array<string>,
//   bodyRenderOptions?: Options
// ): Promise<SendEmailCommandOutput> {
//   return this.useSendSesEmail(subject, render(bodyTemplate, bodyRenderOptions), sourceEmail, to, cc, bcc);
// }
// }

// export type { SendEmailCommandOutput, SendEmailRequest };
// export default Ses;
