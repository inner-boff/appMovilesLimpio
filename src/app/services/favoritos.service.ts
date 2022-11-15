/* eslint-disable prefer-const */
import { Injectable } from '@angular/core';
import { Favorito } from '../models/favorito.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  public favoritosDelUsuario: Favorito[] = []; //Lista de lugares favoritos 

  constructor() {
    this.cargarStorage();
  }

  /**
 * @function crearLista
 * @param {string, string, string} id, nombre, favorito
 * @description instancia un nuevo objeto de tipo Favorito con los
 * datos ingresados por parámetro. Inserta este nuevo objeto en el array
 * que contiene los objetos que representan los lugares favoritos del usuario
 * y lo guarda en el local storage.
 * @return un string con el nombre del lugar.
 */
  crearLista(id: string, nombre: string, email: string) {
    let ObjetoFavorito = new Favorito(id, nombre, email);

    this.favoritosDelUsuario.push(ObjetoFavorito);
    this.guardarStorage();

    return ObjetoFavorito.nombreLugar;
  }

/**
 * @function guardarStorage
 * @description convierte en texto plano (string) el objeto array que
 * representa la lista de favoritos del usuario. Llama a la función setItem
 * para guardar el string creado en el local storage Para esto se deben
 * ingresar dos parámetros, el primero un nombre(key) y el segundo el
 * contenido (value). Se guarda entonces como un par key-value
 */
  guardarStorage() {
    let stringFavoritos: string = JSON.stringify(this.favoritosDelUsuario);
    // eslint-disable-next-line max-len
    localStorage.setItem('favoritosDelUsuario', stringFavoritos);
  }

 /**
 * @function cargarStorage
 * @description refresca los objetos guardados en el local storage.
 * Llama a la función getItem en la cual debe igresarse como parámetro
 * el nombre del objeto que queremos recuperar. Si el Storage está vacío
 * devolverá el objeto listas vacío también. Convierte el texto plano a
 * objeto para poder ingresarlo
 */
  cargarStorage() {
    // eslint-disable-next-line max-len
    const listaStorage = localStorage.getItem('favoritosDelUsuario');
    if(listaStorage === null) {
    return this.favoritosDelUsuario = [];
    }
    let objLista = JSON.parse(listaStorage);
    this.favoritosDelUsuario = objLista;
  }

/**
 * @function eliminarLista
 * @description guarda todas las listas menos la lista a eliminar.
 * Llama a la función filter que devuelve un arreglo de listas.
 */
  eliminarLista(lista: Favorito) {
    // eslint-disable-next-line max-len
    let nuevoListado = this.favoritosDelUsuario.filter((listaItem)=> listaItem.idLugar !== lista.idLugar);
    this.favoritosDelUsuario = nuevoListado;
    this.guardarStorage();
  }

}
