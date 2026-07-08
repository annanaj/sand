import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import { emailTemplate } from './emailTemplate.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS, // app-specific pwd for the given Google account
	},
});

// POST endpoint for sending emails
app.post('/send-email', (req, res) => {
	const { email, message } = req.body;
	const htmlTemplate = emailTemplate(message);
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: 'Invite email from The App 🐾',
		html: htmlTemplate,
		attachments: [
			{
				filename: 'logo.png',
				path: path.join(__dirname, '..', 'public', 'logo.png'),
				cid: 'logo@cid', // CID for the HTML template, base64 conversion does not work
			},
		],
	};

	transporter.sendMail(mailOptions, (error) => {
		if (error) {
			console.error('Error while sending email:', error);
			return res.status(500).send('Error while sending email.');
		}
		res.status(200).send('Email sent');
	});
});

app.listen(5002, () => {
	console.log('Email server is running on http://localhost:5002');
});
