import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

/**
 * Módulo principal de la aplicación Angular.
 *
 * Responsabilidad:
 * - Declara y arranca el componente raíz AppComponent.
 * - Importa módulos esenciales para la ejecución en navegador y para realizar peticiones HTTP.
 *
 * Interacción:
 * - Permite que AppComponent utilice HttpClient para comunicarse con el backend.
 * - Es el punto de entrada de la aplicación Angular.
 */
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

/**
 * Resumen:
 * Este archivo define el módulo raíz de Angular, declarando el componente principal y
 * habilitando la funcionalidad HTTP y de navegador para toda la
 */