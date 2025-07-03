// src/app/app.component.ts
import { Component, OnInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // El texto que va apareciendo en tiempo real
  text = '';
  // Resultado de la encriptación
  encrypted = '';

  // Referencia al SpeechRecognition y flag de estado
  private recognition!: any;
  isRecognizing = false;

  constructor(
    private http: HttpClient,
    private ngZone: NgZone
  ) {}

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

  /** Toggle start/stop del reconocimiento de voz */
  startListening(): void {
    if (!this.recognition) return;

    if (this.isRecognizing) {
      this.recognition.stop();   // Si ya está escuchando, lo detenemos
    } else {
      this.recognition.start();  // Si no, arrancamos la escucha
    }
  }

  /** Envía el texto al backend para encriptar */
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
