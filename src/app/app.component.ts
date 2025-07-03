import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <h1>Encriptación RSA con Angular</h1>
      <input [value]="text" disabled maxlength="15" />
      <button (click)="startListening()">🎤</button>
      <button (click)="encrypt()" [disabled]="!text">Encrypt</button>
      <p *ngIf="encrypted">Encrypted: {{ encrypted }}</p>
    </div>
  `,
  styles: [`.container { max-width: 600px; margin: 2rem auto; display: flex; flex-direction: column; gap: 1rem; }`]
})
export class AppComponent implements OnInit {
  text = '';
  encrypted = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        this.text = transcript.replace(/[^a-zA-Z0-9]/g, '').slice(0, 15);
      };
      this.startRecognition = () => recognition.start();
    }
  }

  startListening() {
    if (this.startRecognition) { this.startRecognition(); }
  }

  encrypt() {
    this.http.post<{ encrypted: string }>('/api/encrypt', { text: this.text })
      .subscribe(res => this.encrypted = res.encrypted);
  }

  private startRecognition?: () => void;
}