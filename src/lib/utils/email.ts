import sgMail, { MailDataRequired } from "@sendgrid/mail";
import handlebars from "handlebars";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "config";

const __dirname = dirname(fileURLToPath(import.meta.url));

sgMail.setApiKey(config.sendgridApiKey);

const sendEmailWithSendgrid = async (message: MailDataRequired) => {
  try {
    await sgMail.send(message);
  } catch (error) {
    if (error.response) {
      console.log(error.response.body);
    }
    throw error;
  }
};

const compileTemplate = (templatePath: string, data: any = {}) => {
  const source = readFileSync(join(__dirname, templatePath), "utf8");
  const compiledTemplate = handlebars.compile(source);
  return compiledTemplate(data);
};

export const sendEmail = async (
  message: { from: string; to: string; subject: string },
  templatePath: string,
  templateData: any
) => {
  const emailBody = compileTemplate(templatePath, templateData);
  await sendEmailWithSendgrid({ ...message, html: emailBody });
};
