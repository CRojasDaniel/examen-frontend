const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());

// Replace with your actual RSA public key
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
YOUR_PUBLIC_KEY_HERE
-----END PUBLIC KEY-----`;

app.post('/api/encrypt', (req, res) => {
  const { text } = req.body;
  const buffer = Buffer.from(text, 'utf8');
  const encrypted = crypto.publicEncrypt(
    {
      key: PUBLIC_KEY,
      padding: crypto.constants.RSA_PKCS1_PADDING
    },
    buffer
  );
  res.json({ encrypted: encrypted.toString('base64') });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));