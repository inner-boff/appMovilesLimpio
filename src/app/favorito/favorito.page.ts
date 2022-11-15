import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Favorito } from '../models/favorito.model';
import { AuthService } from '../services/auth.service';
import { FavoritosService } from '../services/favoritos.service';
import { Proveedor1Service } from '../services/proveedor1.service';


@Component({
  selector: 'app-favorito',
  templateUrl: './favorito.page.html',
  styleUrls: ['./favorito.page.scss'],
})
export class FavoritoPage implements OnInit {

  public listaFav: Favorito[];
  public nuevoListado: Favorito[];


  constructor(
    public favoritosService: FavoritosService,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public router: Router,
    public proveedor: Proveedor1Service,
    public authService: AuthService,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.listaFav = this.favoritosService.favoritosDelUsuario;

    console.log(this.authService.email);

    this.nuevoListado = this.listaFav.filter((listaItem)=> listaItem.email === this.authService.email);
  }


  /**
   * @function eliminarLista
   * @param {Favorito} listaItem
   * @description se activa al presionar el botón Eliminar el slide sobre el
   * lugar seleccionar. Muestra una alerta al usuario para vereificar que se
   * realizará la eliminación del elemento de la lista. Si el usuario acepta
   * llama a la función correspondiente que elimina items del local storage
   * del servicio favoritosService. Refresca la lista una vez realizada la
   * acción.
   */
  async eliminarLista(listaItem: Favorito) {
    const alerta = await this.alertController.create({
      header: '¿Seguro que quieres eliminar el lugar de Favoritos?',

      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'ELiminar',
          handler: (data: any) => {
            const esValido = true;
            if (esValido) {

                this.favoritosService.eliminarLista(listaItem);
              this.presentToast('Lugar eliminado correctamente!');
              this.doRefresh();
            }
          }
        }
      ]
    });
    await alerta.present();
  }

  async presentToast(mensage: string) {
    const toast = await this.toastController.create({
      message: mensage,
      duration: 2000
    });
    toast.present();
  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  doRefresh() {
    this.listaFav = null;
    this.ngOnInit(); //
    setTimeout(() => {
  }, 2000);
  }

    /**
   * @function verLugar
   * @param {string, string} id, nombre - toma los datos id y nombre
   * proporcionados por la API a través del proveedor.
   * @description se activa al presionar sobre un elemento de la lista de
   * lugares favoritos del usuario. Redirecciona
   * al usuario a la página de detalle del lugar seleccionado.
   */
  async verLugar(id: string, nombre: string){
    console.log('Dio click en ' + id);
    this.proveedor.idLugar = id;
    this.proveedor.nombreLugar = nombre;
    this.router.navigateByUrl('lugar', { replaceUrl: true });
  }
}
