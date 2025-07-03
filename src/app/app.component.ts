/**
 * @fileoverview
 * Componente principal de la aplicación Angular.
 * Permite capturar texto por voz, mostrarlo en tiempo real y enviarlo al backend para cifrado RSA.
 * Gestiona la integración con SpeechRecognition y la comunicación HTTP con el backend.
 */

import { Component, OnInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Componente raíz de la aplicación.
 * 
 * Responsabilidad:
 * - Gestiona la captura de voz a texto usando SpeechRecognition.
 * - Permite enviar el texto capturado al backend para cifrado.
 * - Muestra el texto y el resultado cifrado en la interfaz.
 * 
 * Interacción:
 * - Usa HttpClient para comunicarse con el backend Node.js.
 * - Utiliza NgZone para actualizar el estado de Angular desde eventos externos.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  /**
   * Texto capturado en tiempo real desde el reconocimiento de voz.
   * Solo permite letras, números y espacios, limitado a 15 caracteres.
   * @type {string}
   */
  text = '';

  /**
   * Resultado de la encriptación recibido desde el backend.
   * @type {string}
   */
  encrypted = '';

  /**
   * Referencia a la instancia de SpeechRecognition.
   * @type {any}
   * @private
   */
  private recognition!: any;

  /**
   * Indica si el reconocimiento de voz está activo.
   * @type {boolean}
   */
  isRecognizing = false;

  /**
   * Constructor del componente.
   * 
   * @param {HttpClient} http - Servicio para realizar peticiones HTTP al backend.
   * @param {NgZone} ngZone - Permite ejecutar cambios de estado fuera de Angular.
   */
  constructor(
    private http: HttpClient,
    private ngZone: NgZone
  ) {}

  /**
   * Inicializa el reconocimiento de voz y configura sus eventos.
   * 
   * @returns {void}
   * @sideeffect Configura SpeechRecognition y actualiza el estado del componente en respuesta a eventos de voz.
   */
  ngOnInit(): void {
    const SR = (window as any).SpeechRecognition
              || (window as any).webkitSpeechRecognition;
    if (!SR) {
      console.warn('SpeechRecognition no disponible en este navegador.');
      return;
    }

    // Inicializar reconocimiento de voz
    this.recognition = new SR();
    this.recognition.lang = 'es-ES';
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    // Cuando empieza la escucha, activamos el spinner
    this.recognition.onstart = () => {
      this.ngZone.run(() => this.isRecognizing = true);
    };
    // Cuando para la escucha, desactivamos el spinner
    this.recognition.onend = () => {
      this.ngZone.run(() => this.isRecognizing = false);
    };

    // Cada vez que hay resultado (intermedio o final), actualizamos `text`
    this.recognition.onresult = (event: any) => {
      // Convertimos los resultados en un array para mapearlos
      const results: any[] = Array.from(event.results);
      // Unimos cada fragmento con un espacio y recortamos a 15 chars
      const transcript = results
        .map(r => (r[0].transcript as string).trim())
        .join(' ');

      this.ngZone.run(() => {
        // Permitimos letras, números y espacios; luego limitamos a 15 caracteres
        this.text = transcript
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .slice(0, 15);
      });
    };
  }

  /**
   * Inicia o detiene el reconocimiento de voz según el estado actual.
   * 
   * @returns {void}
   * @sideeffect Activa o desactiva SpeechRecognition y actualiza el estado visual.
   */
  startListening(): void {
    if (!this.recognition) return;

    if (this.isRecognizing) {
      this.recognition.stop();   // Si ya está escuchando, lo detenemos
    } else {
      this.recognition.start();  // Si no, arrancamos la escucha
    }
  }

  /**
   * Envía el texto actual al backend para ser cifrado mediante RSA.
   * 
   * @returns {void}
   * @sideeffect Realiza una petición HTTP POST al backend y actualiza el resultado cifrado.
   */
  encrypt(): void {
    const url = 'http://localhost:3000/api/encrypt';
    this.http.post<{ encrypted: string }>(url, { text: this.text })
      .subscribe({
        next: res => this.encrypted = res.encrypted,
        error: err => {
          console.error('Error al encriptar:', err);
          alert('No fue posible encriptar. Revisa la consola.');
        }
      });
  }
}

/** 
 * Resumen:
 * Este archivo implementa el componente principal de Angular, encargado de capturar texto por voz,
 * mostrarlo en pantalla y enviarlo al backend para cifrado RSA, integrando servicios de voz y HTTP.
 */