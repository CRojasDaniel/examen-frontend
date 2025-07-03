# Examen Angular – Frontend + Backend RSA

**Ultima actualizacion:** 2025-07-02  
**Autor:** Carlos Daniel Rojas Romero

---

## Resumen

Este proyecto es la solucion de la prueba tecnica de Front-End que combina:

1. **Frontend** en Angular 14 que:
   - Muestra una pantalla de bienvenida al Banco Azteca.
   - Incluye un input deshabilitado de hasta 15 caracteres.
   - Usa la Web Speech API para dictar tu nombre en tiempo real.
   - Valida solo caracteres alfanumericos, maximo 15 caracteres.
   - Muestra un spinner mientras escucha y un boton 🎤 para controlar la escucha.
   - Envía el nombre al backend para encriptarlo.

2. **Backend** en Node.js + Express que:
   - Expone un endpoint POST /api/encrypt.
   - Carga una clave publica RSA (public.pem).
   - Cifra la cadena recibida con RSA/ECB/PKCS1Padding (UTF-8).
   - Devuelve la cadena encriptada en Base64.

## Estructura de carpetas

```
examen-angular/
├── api/
│   ├── keys/
│   │   ├── public.pem
│   │   └── private.pem
│   └── index.js
├── src/
│   ├── assets/
│   │   └── personas.png
│   ├── app/
│   │   ├── app.module.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   └── app.component.scss
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   └── styles.scss
├── angular.json
├── package.json
└── tsconfig.json
```

## Caracteristicas principales

### Frontend (Angular)
- Reconocimiento de voz implementado con SpeechRecognition.
- UI responsiva con Bootstrap 5 y SCSS personalizado.
- Input supervisado y spinner de estado de escucha.
- Boton de cifrado que consume el servicio REST.

### Backend (Node.js)
- Express con JSON middleware y CORS.
- Endpoint /api/encrypt para cifrar texto con una clave RSA publica.
- Uso de crypto.publicEncrypt y padding PKCS1.

## Configuracion e instalacion

1. Clonar el repositorio:
   ```bash
   git clone <repo-url>
   cd examen-angular
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Generar llaves RSA (si faltan en api/keys):
   ```bash
   openssl genrsa -out private.pem 2048
   openssl rsa -in private.pem -pubout -out public.pem
   ```
4. Levantar backend:
   ```bash
   npm run start:api
   ```
5. Levantar frontend:
   ```bash
   npm start
   ```
