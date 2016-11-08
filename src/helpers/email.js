'use strict';
var nodemailer = require('nodemailer');
exports.send = function (subject, to, body, resolve, reject) {
    var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'carcarenote.info@gmail.com',
            pass: 'ccninfo321'
        }
    };
    var transporter = nodemailer.createTransport(smtpConfig);

    var mailOptions = {
        from: '"www.carcarenote.com" <carcarenote.info@gmail.com>', // sender address
        to: to, // list of receivers
        subject: subject,
        html: body
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            reject(error);
        }
        else {
            resolve();
        }
    });
};
