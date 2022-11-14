import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Proveedor1Service } from '../services/proveedor1.service';

//Interfaz de listado de lugares
interface ClasesEncontrada {
  nombreId:	string;
  nombre: string;
  total: string;
  id: string;
}

interface Instancia {
  headline:	string;
  nombre: string;
  claseId: string;
  clase: string;
  id: string;
}

interface Idata {

  totalFull: string;
  clasesEncontradas: ClasesEncontrada[];
  instancias: Instancia[];
  total: string;

}

@Component({
  selector: 'app-lista-lugar',
  templateUrl: './lista-lugar.page.html',
  styleUrls: ['./lista-lugar.page.scss'],
})
export class ListaLugarPage implements OnInit {

  data;
  lugares: Instancia[];

  constructor(
    public proveedor: Proveedor1Service,
    private router: Router
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
    this.proveedor.obtenerLista()
    .subscribe(
      (data)=> {this.data = data;
                this.lugares = this.data.instancias},
      (error)=> {console.log(error);}
    );
  }

  /**
   * @function verLugar
   * @param {string, string} id, nombre - toma los datos id y nombre proporcionados
   * por la API a través del proveedor.
   * @description se activa al presionar sobre un elemento de la lista de
   * lugares de la categoría en la que se encuentra el usuario. Redirecciona
   * al usuario a la página de detalle del lugar seleccionado.
   */
  async verLugar(id: string, nombre: string){
    //console.log("Dio click en " + id);
    this.proveedor.idLugar = id;
    this.proveedor.nombreLugar = nombre;
    this.router.navigateByUrl('lugar', { replaceUrl: true });
  }
}
