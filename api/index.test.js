// api/index.test.js
const request = require('supertest');
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Montamos express igual que en tu index.js
const app = express();
app.use(express.json());
const publicKey = fs.readFileSync(path.join(__dirname, 'keys', 'public.pem'));
app.post('/api/encrypt', (req, res) => {
  const buffer = Buffer.from(req.body.text, 'utf8');
  const encrypted = crypto.publicEncrypt(
    { key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING },
    buffer
  );
  res.json({ encrypted: encrypted.toString('base64') });
});

describe('POST /api/encrypt', () => {
  it('debe devolver un Base64 no vacío para un texto dado', async () => {
    const texto = 'Prueba123';
    const res = await request(app)
      .post('/api/encrypt')
      .send({ text: texto })
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.encrypted).toBeDefined();
    expect(res.body.encrypted).toMatch(/^[A-Za-z0-9+/=]+$/);
  });
});
