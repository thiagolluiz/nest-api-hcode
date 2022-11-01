import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as nodemailer from 'nodemailer';
import { CLIENT_RENEG_WINDOW } from 'tls';

@Injectable()
export class EmailService {
  async sendEmail(to: string, subject: string, msg: string, options: object) {

    const clientID = process.env.CLIENT_ID;
    const secretKey = process.env.SECRET_KEY;
    const refreshToken = process.env.REFRESH_TOKEN;
    const redirectURI = 'https://developers.google.com/oauthplayground';
    const OAuth2 = google.auth.OAuth2;

    const oauth2Client = new OAuth2(clientID, secretKey, redirectURI);

    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const accessToken = oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      logger: false,
      debug: false,
      auth:{
        type: 'OAuth2',
        user: 'delimaluiz.thiago@gmail.com',
        clienteID: clientID,
        clientSecret: secretKey,
        refreshToken: refreshToken,
        accessToken,
      },
    });

    const mailOptions={
      from: 'delimaluiz.thiago@gmail.com',
      to: to,
      bcc: 'thi.hound@gmail.com',
      subject: subject,
      html:`
        Enviando e-mail com NodeJs + Gmail + NestJS + OAuth2
        <h1>${msg}</h1>
        Somente Especialista.
        `,
    };

    try{
      const result = transporter.sendEmail(mailOptions);
      if(!result.reject){
        return {message: 'Mensagem enviada com sucesso!'}
      }else{
        return{message: result.reject};
      }
    }catch (error){
      return{ massage: error.message}
    }

  }
}