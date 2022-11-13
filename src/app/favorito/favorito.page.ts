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
  public nuevoListado: Favorito[]; // nuevo


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


  async eliminarLista(listaItem: Favorito) {
    const alerta = await this.alertController.create({
      header: 'Seguro que quieres eliminar el lugar de Favoritos',

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
    this.listaFav = null; // this is replacement of splice
    this.ngOnInit(); //
    setTimeout(() => {
      //this.router.navigate(['/favorito']);
  }, 2000);
  }

  async verLugar(id: string, nombre: string){
    console.log('Dio click en ' + id);
    this.proveedor.idLugar = id;
    this.proveedor.nombreLugar = nombre;
    this.router.navigateByUrl('lugar', { replaceUrl: true });
  }
}
