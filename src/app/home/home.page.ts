import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Proveedor1Service } from '../services/proveedor1.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  profile = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    public proveedor: Proveedor1Service
  ) {}

  /**
   * @function logout
   * @description Se activa al presionar el botón "Cerrar sesión".
   * Llama a la función logout (desloguear) del AuthService.
   * Desloguea al usuario y lo redirecciona al login.
   */
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

   /**
   * @function changeImage
   * @description Muestra una sucesión de imágenes precargadas en
   * el carrusel de cada sección dentro de la etiqueta <ion-slide>
   * según las opciones definidas.
   */
  async changeImage() {}
  option = {
      initialSlide: 1,
      speed: 400,
      autoplay:true,
  };

   /**
   * @function navegarAListado
   * @param {string} opcion
   * @description se activa al presionar sobre el nombre de alguna
   * de las secciones del home. Redirecciona al usuario a la página
   * lista-lugar donde se mostrará un listado de lugares correspondiente
   * a cada opción.
   */
  async navegarAListado(opcion: string){
    //console.log('Dio click en ' + opcion);
    this.proveedor.opcion = opcion;
    this.router.navigateByUrl('lista-lugar', { replaceUrl: true });
  }
}
