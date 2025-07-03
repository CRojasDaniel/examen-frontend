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



## Pruebas unitarias

Se han añadido pruebas unitarias tanto para el frontend (Angular) como para el backend (Node.js):

### Frontend (Angular)

- **Frameworks**: Karma y Jasmine.
- **Comandos**:
  ```bash
  npm run test
  ```
  Ejecuta `ng test` que levanta Karma en modo headless (ChromeHeadless), ejecuta todos los archivos `*.spec.ts` y muestra el reporte y cobertura en `./coverage`.

### Backend (Node.js)

- **Frameworks**: Jest y Supertest.
- **Comandos**:
  ```bash
  npm run test:api
  ```
  Ejecuta `jest --config jest.config.js`, corre los tests ubicados en `api/*.test.js` o `api/*.test.ts` y muestra el resultado en consola.

## Prompt de inicialización

El proyecto fue generado originalmente a partir del siguiente prompt de ChatGPT, guardado en `prompt.txt`:

```text
Genera exactamente un archivo comprimido ZIP llamado `examen-angular.zip` que contenga esta aplicación desde cero, respetando al pie de la letra la especificación de la Prueba técnica desarrollador Front End (puntos 1–5 según el PDF) y reproduciendo la misma estructura y funcionalidad que el proyecto compartido:

examen-angular/
├── package.json
├── angular.json
├── tsconfig.json
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   ├── styles.css
│   └── assets/
│       └── personas.png
│   └── app/
│       ├── app.module.ts
│       ├── app.component.ts
│       ├── app.component.html
│       └── app.component.scss
├── api/
│   ├── keys/
│   │   ├── public.pem
│   │   └── private.pem
│   └── index.js


## 1. Angular 14 con Angular CLI

- **Módulo raíz (`AppModule`)** y **componente principal (`AppComponent`)**.
- **UI responsive** usando **Bootstrap 5**, centrada en una tarjeta de ancho máximo 400 px que muestre:
  - Imagen en `src/assets/personas.png` (según el mockup del PDF).
  - Título principal y subtítulo informativo.
  - **Input** de texto **inhabilitado**, alineado a la izquierda, con placeholder “Escribe tu nombre” y contador de caracteres **0/15**.
  - **Botón 🎤** superpuesto sobre la línea del input, acompañado de un **spinner** (`spinner-border-sm`) cuando está escuchando.
  - **Botón “Comenzar”** a ancho completo (`w-100`) que invoca la función `encrypt()`.

## 2. Node.js + Express

- **Endpoint** `POST /api/encrypt` en `api/index.js`.
- **Carga** de la clave pública RSA desde `api/keys/public.pem`.
- Uso de `crypto.publicEncrypt` con `padding: RSA_PKCS1_PADDING`.
- **Respuesta** JSON:  
  ```json
  { "encrypted": "<cadena Base64 resultante>" }
  ```

## 3. Reconocimiento de voz

- API Web **SpeechRecognition** (o prefijo `webkitSpeechRecognition`).
- Propiedad `interimResults = true` para resultados parciales en tiempo real.
- Transformación de `text`:
  - Limpiar a caracteres alfanuméricos y espacios.
  - Recortar a máximo 15 caracteres.
- Indicador de estado `isRecognizing` mediante `NgZone` para actualizar la UI dinámicamente.

## 4. Configuración y scripts

- **package.json** con los scripts:
  - `"start"`: `ng serve --open`
  - `"start:api"`: `node api/index.js`
  - `"build"`: `ng build`
  - `"test"`: `ng test`
  - `"test:api"`: `jest --config jest.config.js`
- **angular.json** con targets:
  - `build`
  - `serve`
  - `test` (usando `@angular-devkit/build-angular:karma` y `karma.conf.js`)
- **tsconfig.json** y **tsconfig.spec.json** para compilación y tests de Angular.

## 5. Archivos RSA

- Carpeta `api/keys/` con:
  - `public.pem` (clave pública)
  - `private.pem` (clave privada)
- *(Opcional)* Script `generate-keys.js` para regenerar las llaves.

---

> Al finalizar, comprime **todo** en `examen-angular.zip`.  
> El ZIP debe estar listo para ejecutar:
> ```bash
> npm install
> npm run start:api
> npm start
```
