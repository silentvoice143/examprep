import nodemailer from "nodemailer";

type SendEmailParamsProps = {
    title?: string;
    name?: string;
    phone?: string;
    email: string;
    message?: string;
};

export async function sendContactEmail({
    title,
    name,
    phone,
    email,
    message,
}: SendEmailParamsProps) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

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
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

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