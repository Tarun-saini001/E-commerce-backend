import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

interface MailOptions {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject?: string;
  template?: string;
  data?: Record<string, any>;
  attachments?: { filename: string; path: string }[];
}

// const transporter = nodemailer.createTransport({
//   service: "Mailgun",
//   auth: {
//     user: process.env.MAILGUN_USER!,
//     pass: process.env.MAILGUN_PASSWORD!,
//   },
// });
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // or 587 for TLS
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.GMAIL_USER,      // your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD,  // your app password
  },
});

export const sendMail = async (obj: MailOptions) => {
  const toList = Array.isArray(obj.to) ? obj.to : [obj.to];

  let htmlText = "";
  if (obj.template) {
    // const templatePath = path.join(process.cwd(), "app", obj.template, "html.ejs");
    // Correct template path resolution
    const templatePath = path.join(process.cwd(), obj.template, "html.ejs");
    // htmlText = await ejs.renderFile(templatePath, (error: Error | null, result: string | null) => {
    //   if (error) {
    //     console.error(error);
    //     return null;
    //   }
    //   return result;
    // }, { cache: false });
    htmlText = await ejs.renderFile(
      templatePath,
      obj.data || {},   // ✅ pass template data here
      { cache: false }
    );
  }

  const mailOpts = {
    from: obj.from || "noreply@yoyo.co",
    to: toList,
    cc: obj.cc || [],
    bcc: obj.bcc || [],
    subject: obj.subject || "Sample Subject",
    html: htmlText,
    attachments: obj.attachments || [],
  };

  return transporter.sendMail(mailOpts);
};
