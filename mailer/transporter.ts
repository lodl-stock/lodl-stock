import * as nodemailer from "nodemailer";

interface CustomNodeJsGlobal extends Global {
  transport: nodemailer.Transporter;
}

declare const global: CustomNodeJsGlobal;

const transport = global.transport || nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
});

global.transport = transport;

export default transport;
