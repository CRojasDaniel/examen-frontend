// src/app/app.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgZone } from '@angular/core';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let httpMock: HttpTestingController;
  let zone: NgZone;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AppComponent],
      providers: [NgZone]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    zone = TestBed.inject(NgZone);
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit registra SpeechRecognition si está disponible', () => {
    // Simulamos la API de voz
    const fakeRec = {
      lang: '',
      interimResults: false,
      maxAlternatives: 1,
      onstart: () => {},
      onend: () => {},
      onresult: () => {},
      start: () => {},
      stop: () => {}
    };
    (window as any).SpeechRecognition = jasmine.createSpy('SpeechRecognition').and.returnValue(fakeRec);
    (window as any).webkitSpeechRecognition = undefined;

    component.ngOnInit();
    // Debe haber asignado recognition internamente
    expect((component as any).recognition).toBe(fakeRec);
  });

  it('startListening togglea start/stop de recognition', () => {
    // Preparamos un recognition falso
    const rec: any = {
      start: jasmine.createSpy('start'),
      stop: jasmine.createSpy('stop')
    };
    (component as any).recognition = rec;

    // caso: no reconociendo -> llama start()
    (component as any).isRecognizing = false;
    component.startListening();
    expect(rec.start).toHaveBeenCalled();

    // caso: ya reconociendo -> llama stop()
    (component as any).isRecognizing = true;
    component.startListening();
    expect(rec.stop).toHaveBeenCalled();
  });

  it('encrypt() hace POST y asigna encrypted', fakeAsync(() => {
    const testText = 'Hola123';
    component.text = testText;
    
    component.encrypt();
    // Capturamos la petición
    const req = httpMock.expectOne('http://localhost:3000/api/encrypt');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ text: testText });

    // Respondemos
    const fakeResponse = { encrypted: 'BASE64XYZ' };
    req.flush(fakeResponse);
    tick();

    expect(component.encrypted).toBe('BASE64XYZ');
    httpMock.verify();
  }));
});
