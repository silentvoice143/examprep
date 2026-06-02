import nodemailer from "nodemailer";

type SendEmailParamsProps = {
    title?: string;
    name?: string;
    phone?: string;
    email: string;
    message?: string;
};

type SendVerificationEmailProps = {
    email: string;
    verificationLink: string;
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendContactEmail({
    title,
    name,
    phone,
    email,
    message,
}: SendEmailParamsProps) {


    const fields = [
        name && `<p><b>Name:</b> ${name}</p>`,
        email && `<p><b>Email:</b> ${email}</p>`,
        phone && `<p><b>Phone:</b> ${phone}</p>`,
        message && `<p><b>Message:</b> ${message}</p>`,
    ]
        .filter(Boolean)
        .join("");

    const textFields = [
        name && `Name: ${name}`,
        email && `Email: ${email}`,
        phone && `Phone: ${phone}`,
        message && `Message: ${message}`,
    ]
        .filter(Boolean)
        .join("\n");

    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        replyTo: email,
        to: process.env.EMAIL_USER,

        subject: title || "New Contact Form Submission",

        text: textFields,

        html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6;">
        <h2>📩 ${title || "New Contact Message"}</h2>
        ${fields}
      </div>
    `,
    });
}

type SendOTPEmailProps = {
    email: string;
    otp: string;
};

export async function sendOTPEmail({ email, otp }: SendOTPEmailProps) {


    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",

        text: `Your OTP is ${otp}. It will expire in 5 minutes.`,

        html: `
      <div style="font-family: Arial; text-align:center;">
        <h2>🔐 OTP Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>This OTP will expire in <b>5 minutes</b>.</p>
        <p>If you didn’t request this, ignore this email.</p>
      </div>
    `,
    });
}






export async function sendVerificationEmail({
    email,
    verificationLink,
}: SendVerificationEmailProps) {
    await transporter.sendMail({
        from: `"ExamEdge" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email - ExamEdge",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center" style="padding:40px 20px;">
                        
                        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
                            
                            <!-- Header -->
                            <tr>
                                <td
                                    style="
                                        background:linear-gradient(135deg,#8200FF,#470C85);
                                        padding:40px 20px;
                                        text-align:center;
                                    "
                                >
                                    <h1 style="margin:0;color:#ffffff;font-size:32px;">
                                        ExamEdge
                                    </h1>
                                    <p style="margin:10px 0 0;color:#e9d7ff;">
                                        Your Competitive Exam Companion
                                    </p>
                                </td>
                            </tr>

                            <!-- Content -->
                            <tr>
                                <td style="padding:40px;">
                                    <h2 style="margin-top:0;color:#18134C;">
                                        Verify Your Email
                                    </h2>

                                    <p style="color:#555;font-size:16px;line-height:1.7;">
                                        Welcome to <strong>ExamEdge</strong>!
                                        Thank you for creating an account.
                                    </p>

                                    <p style="color:#555;font-size:16px;line-height:1.7;">
                                        Please verify your email address by clicking
                                        the button below.
                                    </p>

                                    <div style="text-align:center;margin:40px 0;">
                                        <a
                                            href="${verificationLink}"
                                            style="
                                                display:inline-block;
                                                padding:14px 32px;
                                                background:#8200FF;
                                                color:#ffffff;
                                                text-decoration:none;
                                                border-radius:10px;
                                                font-weight:bold;
                                                font-size:16px;
                                            "
                                        >
                                            Verify Email
                                        </a>
                                    </div>

                                    <p style="color:#777;font-size:14px;line-height:1.7;">
                                        This verification link will expire in
                                        <strong>24 hours</strong>.
                                    </p>

                                    <p style="color:#777;font-size:14px;line-height:1.7;">
                                        If the button doesn't work, copy and paste
                                        the following URL into your browser:
                                    </p>

                                    <p style="word-break:break-all;color:#8200FF;font-size:14px;">
                                        ${verificationLink}
                                    </p>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td
                                    style="
                                        background:#f8f9ff;
                                        padding:24px;
                                        text-align:center;
                                        border-top:1px solid #eee;
                                    "
                                >
                                    <p style="margin:0;color:#666;font-size:14px;">
                                        © ${new Date().getFullYear()} ExamEdge
                                    </p>

                                    <p style="margin-top:10px;color:#999;font-size:12px;">
                                        If you didn't create this account,
                                        you can safely ignore this email.
                                    </p>
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>
        </body>
        </html>
        `,
    });
}

type SendActionEmailProps = {
    email: string;
    subject: string;
    title: string;
    description: string;
    buttonText: string;
    actionLink: string;
    expiryText?: string;
};

export async function sendActionEmail({
    email,
    subject,
    title,
    description,
    buttonText,
    actionLink,
    expiryText,
}: SendActionEmailProps) {
    await transporter.sendMail({
        from: `"ExamEdge" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center" style="padding:40px 20px;">
                        
                        <table width="600" cellpadding="0" cellspacing="0"
                            style="background:#fff;border-radius:16px;overflow:hidden;">

                            <tr>
                                <td
                                    style="
                                        background:linear-gradient(135deg,#8200FF,#470C85);
                                        padding:40px 20px;
                                        text-align:center;
                                    "
                                >
                                    <h1 style="margin:0;color:white;">
                                        ExamEdge
                                    </h1>

                                    <p style="color:#e9d7ff;margin-top:10px;">
                                        Your Competitive Exam Companion
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:40px;">
                                    <h2 style="color:#18134C;">
                                        ${title}
                                    </h2>

                                    <p
                                        style="
                                            color:#555;
                                            line-height:1.8;
                                            font-size:16px;
                                        "
                                    >
                                        ${description}
                                    </p>

                                    <div
                                        style="
                                            text-align:center;
                                            margin:40px 0;
                                        "
                                    >
                                        <a
                                            href="${actionLink}"
                                            style="
                                                display:inline-block;
                                                padding:14px 32px;
                                                background:#8200FF;
                                                color:white;
                                                text-decoration:none;
                                                border-radius:10px;
                                                font-weight:bold;
                                            "
                                        >
                                            ${buttonText}
                                        </a>
                                    </div>

                                    ${expiryText
                ? `
                                        <p style="color:#777;">
                                            ${expiryText}
                                        </p>
                                    `
                : ""
            }

                                    <p
                                        style="
                                            word-break:break-all;
                                            color:#8200FF;
                                            font-size:14px;
                                        "
                                    >
                                        ${actionLink}
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td
                                    style="
                                        background:#f8f9ff;
                                        padding:24px;
                                        text-align:center;
                                    "
                                >
                                    <p style="margin:0;color:#666;">
                                        © ${new Date().getFullYear()} ExamEdge
                                    </p>

                                    <p
                                        style="
                                            margin-top:10px;
                                            color:#999;
                                            font-size:12px;
                                        "
                                    >
                                        If you didn't request this action,
                                        you can safely ignore this email.
                                    </p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `,
    });
}