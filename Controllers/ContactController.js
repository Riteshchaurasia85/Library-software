const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

exports.getContactPage = (req, res) => {
    res.render("contact");
};

exports.sendMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Basic validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });
        }

        // Save message to Database (MongoDB)
        let contact;
        try {
            contact = await Contact.create({
                name,
                email,
                subject,
                message
            });
        } catch (dbError) {
            console.error("Database Save Error:", dbError);
            return res.status(500).json({
                success: false,
                message: "Failed to save message to database. Please try again."
            });
        }

        // Try to send email notification
        let emailSent = false;
        let emailErrorDetail = null;

        try {
            if (!process.env.EMAIL || !process.env.PASSWORD) {
                throw new Error("SMTP credentials missing in environment variables.");
            }

           const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

           const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    replyTo: email,
    subject: `New Contact Form Message - ${subject}`,
    html: `
        <h2>New Contact Message</h2>

        <p><b>Name:</b> ${name}</p>

        <p><b>Email:</b> ${email}</p>

        <p><b>Subject:</b> ${subject}</p>

        <p><b>Message:</b></p>

        <p>${message}</p>
    `
};

            await transporter.sendMail(mailOptions);
            emailSent = true;
            console.log("Mail Sent Successfully ✅");
        } catch (mailError) {
            console.error("Mail Sending Error:", mailError.message);
            emailErrorDetail = mailError.message;
        }

        if (emailSent) {
            return res.status(200).json({
                success: true,
                message: "Thank you! Your message has been sent and saved successfully. ✅"
            });
        } else {
            // Partial success: DB saved, but email failed (e.g. invalid Gmail app credentials)
            return res.status(200).json({
                success: true,
                partial: true,
                message: "Your message has been successfully saved in our database. ⚠️ (Note: Admin email notification failed due to Gmail SMTP App Password mismatch, but the admin can read your message in the database!)"
            });
        }

    } catch (error) {
        console.error("General Server Error:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred. Please try again later."
        });
    }
};
