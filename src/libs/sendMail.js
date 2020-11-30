const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: 'phamduccong3368@gmail.com', // generated ethereal user
    pass: 'pjwbqsnmjsxgcmwn' // generated ethereal password
  }
});

module.exports.sendSignup = async (email, number) => {
  let info = await transporter.sendMail({
    from: 'phamduccong3368@gmail.com', 
    to: email, 
    subject: "Signup ",
    html: `<h1>Please type your code here to acctive account</h1>
    <p><h2>Code Active : </h2></p>` + number,
    
  });
}