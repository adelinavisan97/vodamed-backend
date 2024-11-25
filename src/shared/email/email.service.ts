import { OrderModel } from '../../modules/users/models/order.interace';
import { PerscriptionModel } from '../../modules/users/models/perscription.interface';

const nodemailer = require('nodemailer');

export class MailService {
  async sendOrderMail(to: string, order: OrderModel) {
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
        to: to,
        subject: 'VodaMed Order Confirmation',
        text: `
            Hi ${to.split('@')[0]},

            Thank you for your order!

            Order Date: ${orderDate}

            Items:
            ${JSON.stringify(order.orderItems)}

            Total: ${order.totalAmount}

            Your order is being processed and will be shipped to:
            ${order.shippingAddress}

            Thank you for shopping with us!

            Best regards,
            VodaMed Team
            `,
        //HTML not worth the effort
        // html: `
        //     <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        //     <h2 style="color: #333;">Thank you for your order!</h2>
        //     <p>Hi <strong>${to.split('@')[0]},</strong>,</p>
        //     <p>Your order has been successfully placed. Here are the details:</p>
        //     <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        //     <tr style="background-color: #f8f8f8;">
        //     <td style="padding: 10px; border: 1px solid #ddd;">Order Details</td>
        //     <td style="padding: 10px; border: 1px solid #ddd;">#12345</td>
        //     </tr>
        //     <tr>
        //     <td style="padding: 10px; border: 1px solid #ddd;">Order Date:</td>
        //     <td style="padding: 10px; border: 1px solid #ddd;">${orderDate}</td>
        //     </tr>
        //     </table>
        //     <h3 style="color: #333;">Items:</h3>
        //     <ul style="list-style-type: none; padding: 0;">
        //     <li>${JSON.stringify(order.orderItems)}</li>
        //     </ul>
        //     <p style="font-size: 1.2em;"><strong>Total: $80</strong></p>
        //     <p>Your order is being processed and will be shipped to:</p>
        //     <address>
        //     ${order.shippingAddress}
        //     </address>
        //     <p>Thank you for shopping with us!</p>
        //     <p>Best regards,<br>VodaMed Team</p>
        //     </div>
        //     `,
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
    }
  }

  async sendPrescriptionMail(to: string, prescription: PerscriptionModel) {
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
      let medicationString = '';
      for (const med of prescription.medicines) {
        medicationString =
          medicationString +
          `Medicaiton: ${med.medicine}, Dosage: ${med.dosage}, Quantity: ${med.quantity}\n`;
      }
      let mailOptions = {};
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'VodaMed Prescription Confirmation',
        text: `
            Hi ${to.split('@')[0]},

            Your prescription has been confirmed and is ready for processing as of ${prescriptionDate}. 

            Medicines:
            ${medicationString}

            For any questions, please contact us or reply to this email.

            Thank you for choosing VodaMed for your healthcare needs.

            Best regards,
            VodaMed Team
            `,
        // html: `
        //     <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        //     <h2 style="color: #333;">Prescription Confirmation</h2>
        //     <p>Hi <strong>[Customer Name]</strong>,</p>
        //     <p>Your prescription has been confirmed and is ready for processing. Below are the details:</p>
        //     <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        //     <tr style="background-color: #f8f8f8;">
        //     <td style="padding: 10px; border: 1px solid #ddd;">Prescription ID:</td>
        //     <td style="padding: 10px; border: 1px solid #ddd;">RX123456</td>
        //     </tr>
        //     <tr>
        //     <td style="padding: 10px; border: 1px solid #ddd;">Medication:</td>
        //     <td style="padding: 10px; border: 1px solid #ddd;">Amoxicillin 500mg</td>
        //     </tr>
        //     <tr style="background-color: #f8f8f8;">
        //     <td style="padding: 10px; border: 1px solid #ddd;">Dosage:</td>
        //     <td style="padding: 10px; border: 1px solid #ddd;">Take 1 capsule 3 times daily</td>
        //     </tr>
        //     <tr>
        //     <td style="padding: 10px; border: 1px solid #ddd;">Quantity:</td>
        //     <td style="padding: 10px; border: 1px solid #ddd;">30 capsules</td>
        //     </tr>
        //     </table>
        //     <p><strong>Pickup Location:</strong> [Pharmacy Name, Address]</p>
        //     <p><strong>Pickup Time:</strong> [Date and Time]</p>
        //     <p>If you have selected delivery, your prescription will be sent to:</p>
        //     <address>[Delivery Address]</address>
        //     <p>If you have any questions, feel free to contact us at <a href="tel:1234567890" style="color: #007BFF;">(123) 456-7890</a> or reply to this email.</p>
        //     <p>Thank you for choosing <strong>[Pharmacy Name]</strong> for your healthcare needs!</p>
        //     <p>Best regards,<br>Your Pharmacy Team</p>
        //     </div>
        //     `,
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
    }
  }
}
