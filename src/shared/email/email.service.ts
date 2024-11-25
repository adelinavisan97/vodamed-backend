import { OrderModel } from '../../modules/users/models/order.interace';
import { UserModel } from '../../modules/users/models/user.interface';

const nodemailer = require('nodemailer');

//Class to handle the sending of all emails when users create orders or prescriptions - Will
export class MailService {
  async sendOrderMail(
    userDetails: UserModel,
    order: OrderModel,
    orderItemDetails: string
  ) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      //Set up details
      const today = new Date();
      // Format the current date in DD-MM-YYYY format
      const orderDate = `${today.getDate()}-${
        today.getMonth() + 1
      }-${today.getFullYear()}`;
      let mailOptions = {};
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: userDetails.email,
        subject: 'VodaMed Order Confirmation',
        //Looks a bit messy but is just required for formatting inside the email
        text: `
Hi ${userDetails.givenName},

Thank you for your order!

Order Date: ${orderDate}

Order Items:

${orderItemDetails}

Total: £${order.totalAmount}

Your order is being processed and will be shipped to:
${order.shippingAddress}

Thank you for shopping with us!

Best regards,
VodaMed Team
`,
        //Could use HTML instead but not worth the effort
        // html: `
      };
      const info = await transporter.sendMail(
        mailOptions,
        (error: any, info: any) => {
          if (error) {
            console.log(`Error: ${error}`);
          } else {
            console.log(`Email sent: ${info.response}`);
          }
        }
      );
    } catch (error) {
      console.log(error);
      throw new Error('Email failed to send');
    }
  }

  async sendPrescriptionMail(
    userDetails: UserModel,
    prescriptionItemDetails: string
  ) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      //Set up details
      const today = new Date();
      // Format the current date in DD-MM-YYYY format
      const prescriptionDate = `${today.getDate()}-${
        today.getMonth() + 1
      }-${today.getFullYear()}`;
      let mailOptions = {};
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: userDetails.email,
        subject: 'VodaMed Prescription Confirmation',
        //Looks a bit messy but is just required for formatting inside the email
        text: `
Hi ${userDetails.givenName},

Your prescription has been confirmed and is ready for processing as of ${prescriptionDate}.

Medicines:

${prescriptionItemDetails}

For any questions, please contact us or reply to this email.

Thank you for choosing VodaMed for your healthcare needs.

Best regards,
VodaMed Team
`,
      };
      const info = await transporter.sendMail(
        mailOptions,
        (error: any, info: any) => {
          if (error) {
            console.log(`Error: ${error}`);
          } else {
            console.log(`Email sent: ${info.response}`);
          }
        }
      );
    } catch (error) {
      console.log(error);
      throw new Error('Email failed to send');
    }
  }
}
