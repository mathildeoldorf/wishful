const router = require("express").Router();
const User = require("./../models/User");
const emailValidation = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
const smtp = require("./../config/smtpCredentials");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const nodemailer = require("nodemailer");
let saltRounds = 10;
let user;

router.post("/requestReset", async (req, res) => {
    let {
        email
    } = req.body;

    console.log(req.body);

    if (!email) {
        return res.status(401).send({
            response: "Missing fields.",
        });
    }
    if (emailValidation.test(email) === false) {
        return res.status(401).send({
            response: "Not a valid e-mail.",
        });
    }

    try {
        user = await User.query()
            .select()
            .where({
                email: email,
            })
            .limit(1);

        if (!user[0]) {
            return res.status(404).send({
                response: "User not found."
            })
        }

        // GENERATING THE TOKEN
        crypto.randomBytes(48, async function (err, buffer) {
            if (err) {
                console.log('Error generating token');
                return
            }
            const token = buffer.toString('hex');

            try {
                let insertToken = await User.query().update({
                    token: token
                }).where({
                    ID: user[0].ID
                });
            } catch (error) {
                console.log('Setting token into database');
                return res.status(500).send({
                    response: "Setting token into database"
                })
            } // END insert token into DB

            const transporter = nodemailer.createTransport(smtp);

            transporter.verify((error) => {
                if (error) {
                    console.log(error)
                    return res.status(502).send({
                        response: "Sorry, something went wrong. Please try again"
                    })
                }
            }); // End setup transporter

            // const emailOutput = `<h1>Reset password</h1> <p>Please follow the <a href="http://localhost:3000/confirmReset/${token}">link</a> to reset your password</p>`;
            const emailOutput = `
            <!DOCTYPE html
                PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html>

            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="x-apple-disable-message-reformatting" />
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <title></title>
                <style type="text/css" rel="stylesheet" media="all">
                    @import url("https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap");

                    body {
                        width: 100% !important;
                        margin: 0;
                        background-color: #F2F4F6;
                        color: #fff;
                    }

                    td {
                        word-break: break-word;
                    }

                    .preheader {
                        display: none !important;
                        visibility: hidden;
                        font-size: 1px;
                        line-height: 1px;
                        max-height: 0;
                        max-width: 0;
                        opacity: 0;
                        overflow: hidden;
                    }

                    body,
                    td,
                    th {
                        font-family: 'Lato', sans-serif;
                    }

                    h1 {
                        color: #fff;
                        font-size: 22px;
                        font-weight: bold;
                        text-align: left;
                    }

                    td,
                    th {
                        font-size: 16px;
                    }

                    a {
                        color: #fff !important;
                    }

                    p {
                        margin: .4em 0 1.1875em;
                        font-size: 16px;
                        line-height: 1.625;
                    }

                    p.sub {
                        font-size: 13px;
                    }

                    .align-center {
                        text-align: center;
                    }

                    .button {
                        background-color: rgb(109, 122, 192);
                        color: #fff;
                        border: none;
                        display: inline-block;
                        margin: 0.5vw 0;
                        padding: 1vw;
                        text-decoration: none;
                        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
                        box-sizing: border-box;
                        font-size: calc(0.5em + 30%);
                    }

                    p {
                        color: #51545E;
                    }

                    .email-footer p {
                        color: #fff;
                    }

                    .email-wrapper {
                        width: 100%;
                        margin: 0;
                        padding: 0;
                        -premailer-width: 100%;
                        -premailer-cellpadding: 0;
                        -premailer-cellspacing: 0;
                        background: #74ebd5;
                        background: -webkit-linear-gradient(to right, #ACB6E5, #74ebd5);
                        background: linear-gradient(to right, #ACB6E5, #74ebd5);
                    }

                    .email-content {
                        width: 50%;
                        margin: 0;
                        padding: 0;
                        -premailer-width: 100%;
                        -premailer-cellpadding: 0;
                        -premailer-cellspacing: 0;
                    }

                    /* Masthead ----------------------- */

                    .email-masthead {
                        padding: 25px 0;
                        text-align: center;
                    }

                    .email-masthead_logo {
                        width: 94px;
                    }

                    .email-masthead_name {
                        font-size: 16px;
                        font-weight: bold;
                        color: #A8AAAF;
                        text-decoration: none;
                        text-shadow: 0 1px 0 white;
                    }

                    /* Body ------------------------------ */

                    .banner {
                        background-color: teal;
                        height: auto;
                        display: grid;
                        align-content: center;
                        padding: 3% 10%;
                        margin-top: 2vw;
                    }

                    @media screen and (max-width: 800px) {
                        .banner {
                            padding: 10% 20%;
                        }
                    }

                    .email-body {
                        width: 100%;
                        margin: 0;
                        padding: 0;
                        -premailer-width: 100%;
                        -premailer-cellpadding: 0;
                        -premailer-cellspacing: 0;
                        background-color: #fff;
                    }

                    .email-body_inner {
                        font-weight: 300;
                        width: 100%;
                        margin: 0 auto;
                        padding: 1vw 5vw;
                        -premailer-width: 570px;
                        -premailer-cellpadding: 0;
                        -premailer-cellspacing: 0;

                    }

                    .email-footer {
                        width: 570px;
                        margin: 1vw auto;
                        padding: 0;
                        -premailer-width: 570px;
                        -premailer-cellpadding: 0;
                        -premailer-cellspacing: 0;
                        text-align: center;
                    }

                    .body-action {
                        width: 100%;
                        margin: 30px auto;
                        padding: 0;
                        -premailer-width: 100%;
                        -premailer-cellpadding: 0;
                        -premailer-cellspacing: 0;
                        text-align: center;
                    }

                    .body-sub {
                        margin-top: 25px;
                        padding-top: 25px;
                        border-top: 1px solid #EAEAEC;
                    }

                    @media only screen and (max-width: 500px) {
                        .button {
                            width: 100% !important;
                            text-align: center !important;
                        }
                    }

                    @media only screen and (max-width: 600px) {

                        .email-body_inner,
                        .email-footer {
                            width: 100% !important;
                        }
                    }

                </style>

            </head>

            <body>
                <span class="preheader">Use this link to reset your password. The link is only valid for 24 hours.</span>
                <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                        <td align="center">
                            <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                    <td class="email-masthead">
                                        <a href="http://localhost:3000/" class="f-fallback email-masthead_name">
                                        </a>
                                    </td>
                                </tr>
                                <!-- Email Body -->
                                <tr>
                                    <td class="email-body" width="570" cellpadding="0" cellspacing="0">
                                        <div class="banner">
                                            <h1>Hi ${user[0].firstName},</h1>
                                        </div>
                                        <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0"
                                            role="presentation">
                                            <!-- Body content -->
                                            <tr>
                                                <td class="content-cell">
                                                    <div class="f-fallback">
                                                        <p>You recently requested to reset your password for your Wishful
                                                            account. Use the button below to reset it. </p>
                                                        <p><strong>This password reset
                                                                is only valid for the next 24 hours.</strong></p>
                                                        <!-- Action -->
                                                        <table class="body-action" align="center" width="100%" cellpadding="0"
                                                            cellspacing="0" role="presentation">
                                                            <tr>
                                                                <td align="center">
                                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0"
                                                                        role="presentation">
                                                                        <tr>
                                                                            <td align="center">
                                                                                <a href="http://localhost:3000/confirmReset/${token}"
                                                                                    class="f-fallback button" target="_blank">Reset
                                                                                    your password</a>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <p>Best regards,
                                                            <br><strong>The Wishful Team</strong></p>
                                                        <!-- Sub copy -->
                                                        <table class="body-sub" role="presentation">
                                                            <tr>
                                                                <td>
                                                                    <p class="f-fallback sub">If you’re having trouble with the
                                                                        button above, copy and paste the URL below into your web
                                                                        browser.</p>
                                                                    <p class="f-fallback sub">
                                                                        http://localhost:3000/confirmReset/${token}</p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0"
                                            role="presentation">
                                            <tr>
                                                <td class="content-cell" align="center">
                                                    <p class="f-fallback sub align-center">&copy; 2020 Wishful. All rights
                                                        reserved.</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            `;

            const mailOptions = {
                from: "mathildeatkea@gmail.com",
                to: "mathildeatkea@gmail.com",
                subject: "Wishful | Reset password",
                text: "Use this link to reset your password. The link is only valid for 24 hours.",
                html: emailOutput
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                    return res.status(502).send({
                        response: "Sorry, something went wrong. Please try again"
                    });
                }

                return res.status(200).send({
                    response: "Email sent succesfully"
                })
            }) // END Sending email
        }); // END Generating the token and sending email
    } catch (error) {
        return res.status(404).send({
            response: "Error connecting to the database.",
        });
    }
});

router.post("/confirmReset", async (req, res) => {
    const {
        password,
        repeatPassword,
        token
    } = req.body;

    if (!password && !repeatPassword && !ID) {
        return res.status(400).send({
            response: "Missing fields."
        });
    }
    if (password !== repeatPassword) {
        return res.status(400).send({
            response: "Passwords don't match."
        });
    }

    try {
        const response = await User.query().select("password").where({
            token: token
        });

        const userPassword = response[0].password;

        if (!userPassword) {
            return res.status(404).send({
                response: "User not authorized."
            });
        }

        bcrypt.compare(password, userPassword, (error, isSame) => {
            if (error) {
                console.log(error);
                return res.status(500).send({
                    response: "Something went wrong. Please try again"
                });
            }

            if (isSame) {
                return res.status(400).send({
                    response: "Sorry, you can't use a previously used password. Please try again"
                });
            }

            bcrypt.hash(password, saltRounds, async (error, hashedPassword) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send({
                        response: "Something went wrong. Please try again"
                    });
                }

                await User.query().update({
                    password: hashedPassword,
                    token: null
                }).where({
                    token: token
                });

                return res.status(200).send({
                    response: "Password updated succesfully. Redirecting to login..."
                });
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(404).send({
            response: "Error connecting to the database.",
        });
    }

});

module.exports = router;