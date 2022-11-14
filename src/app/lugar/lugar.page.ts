import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FavoritosService } from '../services/favoritos.service';
import { Proveedor1Service } from '../services/proveedor1.service';

//Interfaz de detalle de lugar
interface Ubicacion {
  centroide: string;
  tipo: string;
}

interface Contenido {
  nombreId: string;
  nombre: string;
  posicion: string;
  valor: string;
}

interface Idata {
  contenido: Contenido[];
  fechaAlta: string;
  ubicacion: Ubicacion;
  fechaUltimaModificacion: string;
  id: string;
  direccionNormalizada: string;
  fechaActualizacion: string;
  fuente: string;
  claseId: string;
  clase: string;
  idForaneo: string;
}

@Component({
  selector: 'app-lugar',
  templateUrl: './lugar.page.html',
  styleUrls: ['./lugar.page.scss'],
})
export class LugarPage implements OnInit {

  data;
  contenidos: Contenido[];
  dir: string;
  contenido: Contenido;
  boton: boolean;

  constructor(
    public proveedor: Proveedor1Service,
    public toastController: ToastController,
    public favoritos: FavoritosService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.ionViewDidLoad();
  }

    /**
   * @function ionViewDidLoad
   * @description llama  al proveedor y obtiene los datos provistos
   * por la API
   */
  ionViewDidLoad(){
    this.proveedor.obtenerLugar(this.proveedor.idLugar)
    .subscribe(
      (data)=> {this.data = data;
                this.contenidos = this.data.contenido;
                this.dir = this.data.direccionNormalizada;
                this.tratarContenidos();},
      (error)=> {console.log(error);}
    );
  }

  /**
   * @function tratarContenidos
   * @description Filtra los datos recibidos de la API para que se muestren solo
   * los datos existentes, ya que la API no devuelve los mismos datos para cada
   * categoría de lugar. En caso que un dato de la interfaz esté vacío mostrará "n/a"
   * También recorta los strings correspondientes a página web e email para que se
   * visualicen correctamente.
   */
  tratarContenidos(){

    let tieneDireccion = false;

    for (const i of this.contenidos) {

      if (i.nombreId === 'direccion'){
        tieneDireccion = true;
      }

      if (i.valor === ''
          ||
          i.nombreId === 'redes_sociales'
         ){
        i.valor = 'n/a';
      }

      if(i.valor !== 'n/a'
         &&
         i.nombreId === 'email'){

          const mail1 = i.valor.split('>')[1];
          i.valor = mail1.split('<')[0];

         }

      if(i.valor !== 'n/a'
         &&
        (i.nombreId === 'web'
         ||
         i.nombreId === 'pagina_web')){

          const web1 = i.valor.split('>')[1];
          i.valor = web1.split('<')[0];

          const index = i.valor.indexOf('/');

          if (index > 0){
            i.valor = i.valor.split('/')[0];
          }
         }
    }

    if (!tieneDireccion){

      this.contenido =
      {
        nombre : ' ',
        nombreId : ' ',
        posicion: ' ',
        valor: ' '
      };

      console.log(this.contenido);

      this.contenido.nombre = 'Dirección';
      this.contenido.nombreId = 'direccion';
      const pos = this.contenidos.length + 1;
      this.contenido.posicion = pos.toString();
      this.contenido.valor = this.dir;
      console.log(this.contenido);
      this.contenidos.push(this.contenido);
    }
  }

   /**
   * @function presentToast1
   * @description Se activa al presionar el botón flotante ubicado abajo y
   * a la derecha del detalle de lugar. Muestra un mensaje al usuario de que
   * el lugar que stá viendo fue agragdo a su lista de favoritos.
   */
  async presentToast1() {
    if (this.boton === true) {
      const toast = await this.toastController.create({
        message: 'Agregado a favoritos',
        duration: 500,
        position: 'bottom',
      });
      toast.present();
    }
    else {
      // Nota: revisar esto, no estamos eliminando nada aún con el botón de favs.
      const toast = await this.toastController.create({
        message: 'Eliminado de favoritos',
        duration: 500,
        position: 'bottom',
      });
      toast.present();
    }
  }

   /**
   * @function guardarFavs
   * @description Se activa al presionar el botón flotante ubicado abajo y
   * a la derecha del detalle de lugar. Agrega el lugar a la lista de favoritos
   * del usuario logueado en ese momento.
   */
  async guardarFavs() {
    if (this.boton === true) {
      const creadaOk = this.favoritos.crearLista(this.proveedor.idLugar, this.proveedor.nombreLugar, this.authService.email);
  // --- Si tenemos tiempo extra, ver si es posible
  // hacer que el else no permita duplicar los lugares: ---
  //     if (creadaOk) { //Se verifica si la variable tiene un valor, es decir, que fue creada
  //       console.log('Lista guardada bro: ' + this.favoritos.favoritosDelUsuario);
  //     }
  //   }
  //   else {
  //     //this.listaFav.eliminarLista(this.listaItem);
  //     console.log('Borrado');
    }
  }

  /**
   * @function colorBoton
   * @description Se activa al presionar el botón flotante ubicado abajo y
   * a la derecha del detalle de lugar. Cambia el color del botón cuando se presiona.
   */
  colorBoton() {
    this.boton = !this.boton;
  }

}
