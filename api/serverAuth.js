import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

// BE server (pres Express, requesty na /discord/callback) přijme kód od fe aplikace,
// pošle ho na Discord a vrátí přístupový token na FE.

// server pustit pres terminal a node, node api/serverAuth.js

app.use(cors({
	origin: 'http://localhost:5173', // URL frontendového serveru
	methods: ['POST'],
	credentials: true, // pokud používáš cookies nebo jiné autorizace
}));
app.use(express.json()); // Pro příjem JSON dat

// Discord OAuth2 parametry
const clientId = '1361263425111720097'; // Discord Developer Portal
const clientSecret = 'EhTWW8i_oksXDt0ZWQxf2PsWZ9m5OyYJ'; // Discord Developer Portal
const redirectUri = 'http://localhost:5173/sand/callback'; // Discord Developer Portal

app.post('/discord/callback', async (req, res) => {
	const { code } = req.body;
	console.log('Received code:', code); // ✅ Ujisti se, že dostáváš správný kód.

	if (!code) {
		return res.status(400).send('Missing authorization code');
	}

	try {
		const response = await axios.post(
			'https://discord.com/api/oauth2/token',
			new URLSearchParams({
				client_id: clientId,
				client_secret: clientSecret,
				grant_type: 'authorization_code',
				code,
				redirect_uri: redirectUri,
				scope: 'identify email',
			}).toString(),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);

		console.log('Discord response:', response.data); // ✅ Zkontroluj, že dostáváš response s `access_token`.

		const accessToken = response.data.access_token;
		console.log('Sending access token to frontend:', accessToken); // ✅ Zkontroluj, že posíláš správný `access_token`.

		res.json({ accessToken }); // Odesíláme access token na frontend
	} catch (error) {
		console.error('Error exchanging code for token:', error?.response?.data || error);
		res.status(500).send('Internal Server Error');
	}
});

app.listen(3001, () => {
	console.log('Server running on http://localhost:3001');
});
