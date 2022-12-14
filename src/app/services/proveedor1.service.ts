import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Proveedor1Service {

  public idLugar: string;
  public nombreLugar: string;
  public opcion: string;

  constructor(
    public http: HttpClient
  ) {
    //console.log('Hola Proveedor1');
  }

/**
 * @function obtenerLista
 * @description hace la llamada a la API (GET) y obtiene los lugares
 * de la opción elegida.
 */
  obtenerLista(){
    //console.log('haciendo GET de la API opcion')
    return this.http.get('https://epok.buenosaires.gob.ar/buscar/?texto=' + this.opcion);
  }

  /**
 * @function obtenerLugar
 * @description hace la llamada a la API (GET) y obtiene los datos de un
 * lugar específico por su id.
 */
  obtenerLugar(id: string){
    //Se obtiene los datos del lugar
    //console.log('haciendo GET de la API Lugar');
    return this.http.get('https://epok.buenosaires.gob.ar/getObjectContent?id=' + id);
  }

}
