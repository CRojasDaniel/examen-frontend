const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const fs = require('fs');
const path = require('path');
// ya tenías express, cors y crypto…

// Replace with your actual RSA public key
// __dirname es la carpeta donde está index.js (por eso usamos path.join)
const PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname, 'keys', 'public.pem'),
  'utf8'
);


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