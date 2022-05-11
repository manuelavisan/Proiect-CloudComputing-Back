const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const dotenv = require("dotenv");
dotenv.config();


const sendMail = (receiver, sender, msg, subject) => {
  const msgToSend = {
    to: receiver,
    from: sender,
    subject,
    text: msg,
    //html: "...", pentru a trimite mailuri mai smechere, stilizate
  };

  sgMail
    // .send(msgToSend)
    // .then((response) => {
    //   console.log(response[0].statusCode);
    //   return response[0].statusCode;
    // })
    // .catch((error) => {
    //   console.error(error);
    // });

    .send(msgToSend)
    .then((response) => {
      console.log(response);
      return 200;
    })
    .catch((error) => {
      console.log(error);
      return 500;
    });
};


module.exports = {
    sendMail,
}