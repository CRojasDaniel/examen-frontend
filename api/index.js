/**
 * @fileoverview
 * API principal del backend Node.js.
 * Expone endpoints para cifrado de texto usando una clave pública RSA.
 * Configura middlewares para JSON y CORS.
 */

const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const fs = require('fs');
const path = require('path');
// ya tenías express, cors y crypto…

/**
 * Clave pública RSA utilizada para cifrar los textos recibidos.
 * Se lee desde el archivo 'public.pem' en la carpeta 'keys' ubicada junto a este archivo.
 * @type {string}
 */
const PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname, 'keys', 'public.pem'),
  'utf8'
);

/**
 * Endpoint POST /api/encrypt
 * Cifra el texto recibido en el cuerpo de la petición usando la clave pública RSA.
 * 
 * @function
 * @name /api/encrypt
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} req.body - Debe contener la propiedad 'text' (string) a cifrar.
 * @param {Object} res - Objeto de respuesta Express.
 * @returns {Object} JSON con la propiedad 'encrypted' (string, base64).
 * @throws {Error} Si ocurre un error durante el cifrado.
 * @sideeffect Lee la clave pública del sistema de archivos.
 */
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

/**
 * Puerto en el que se ejecuta el servidor Express.
 * Usa el valor de la variable de entorno PORT o 3000 por defecto.
 * @type {number|string}
 */
const PORT = process.env.PORT || 3000;

/**
 * Inicializa el servidor Express y lo deja escuchando en el puerto especificado.
 * @event Inicia el backend y muestra la URL en consola.
 */
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));

/**
 * Resumen:
 * Este archivo implementa el backend de la API, permitiendo cifrar textos mediante RSA.
 * Expone un endpoint POST y configura middlewares esenciales para el funcionamiento seguro y correcto de la API.