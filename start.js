const config = require("config");
const Mailer = require("mailgun-mustache-mailer");
const app = require("./app");

let mailer = new Mailer(config.mailgun);
app(mailer).listen(config.port);
