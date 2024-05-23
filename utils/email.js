// emailUtils.js
const nodemailer = require('nodemailer');

const sendRegistrationEmail = async (email, verificationLink) => {
    console.log(email, verificationLink);
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'yonatanwork122@gmail.com',
            pass: 'qmls sqda aaqk gaws'
        }
    });

    const subject = 'Registration Confirmation';
    const text = `Please verify your email by clicking the following link: ${verificationLink}`;

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"yonatan" <yonatanwork122@gmail.com>',
        to: email,
        subject: subject,
        text: text
    });

    console.log("Message sent: %s", info.messageId);
};

const sendPasswordResetEmail = async (email, resetLink) => {
    let transporter = nodemailer.createTransport({
   
        service: 'Gmail',
        auth: {
            user: 'yonatanwork122@gmail.com',
            pass: 'qmls sqda aaqk gaws'
        }
    });

    const subject = 'Password Reset';
    const text = `You have requested to reset your password. Click the following link to reset your password: ${resetLink}`;

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Yonatan" <yonatanwork122@gmail.com>',
        to: email,
        subject: subject,
        text: text
    });

    console.log("Message sent: %s", info.messageId);
};

const sendReportEmail = async (email, reportData) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'yonatanwork122@gmail.com',
            pass: 'qmls sqda aaqk gaws'
        }
    });

    const subject = 'Your Task Report';
    const text = `Here is your task report:\n\nTotal Tasks: ${reportData.totalTasks}\nCompleted Tasks: ${reportData.completedTasks}\nPending Tasks: ${reportData.pendingTasks}\nFor Review Tasks: ${reportData.forReviewTasks}\nCompletion Rate: ${reportData.completionRate}%\nOverdue Tasks: ${reportData.overdueTasks}`;

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Yonatan" <yonatanwork122@gmail.com>',
        to: email,
        subject: subject,
        text: text
    });

    console.log("Message sent: %s", info.messageId);
};

module.exports = {
    sendRegistrationEmail,
    sendPasswordResetEmail,
    sendReportEmail
};
