import nodemailer from 'nodemailer'
import {User} from '../utils/interfaces';


export const emailsManager = {
  async sendEmailConfirmationMessage(user: User) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'denisdevelopertestacc@gmail.com',
        pass: 'sbxgofqtlxkbvgss',
      },
    });

    return transporter.sendMail({
      from: '"Denis" <denisdevelopertestacc@gmail.com>', // sender address
      to: user.accountData.email, // list of receivers
      subject: "Confirm your registration", // Subject line
      html: " <h1>Thank for your registration</h1>\n" +
        "       <p>To finish registration please follow the link below:\n" +
        "          <a href='https://somesite.com/confirm-email?code="+user.emailConfirmation.confirmationCode+"'>complete registration</a>\n" +
        "      </p>\n" +
        "    "
    });
  },
  async sendPasswordRecoveryEmail(email: string, passwordRecoveryCode: string) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'denisdevelopertestacc@gmail.com',
        pass: 'sbxgofqtlxkbvgss',
      },
    });

    return transporter.sendMail({
      from: '"Denis" <denisdevelopertestacc@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Password recovery", // Subject line
      html: " <h1>Password recovery</h1>\n" +
        "       <p>To finish password recovery please follow the link below:\n" +
        "          <a href='https://somesite.com/password-recovery?recoveryCode="+passwordRecoveryCode+"'>recovery password</a>\n" +
        "      </p>\n" +
        "    "
    });
  }
}
