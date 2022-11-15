import { Component, OnInit } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { AuthService } from '../services/auth.service';

const IMAGE_DIR = 'stored-images';

interface ArchivoLocal {
	name: string;
	path: string;
	data: string;
}

@Component({
  selector: 'app-galeria-fotos',
  templateUrl: './galeria-fotos.page.html',
  styleUrls: ['./galeria-fotos.page.scss'],
})
export class GaleriaFotosPage implements OnInit {

  images: ArchivoLocal[] = [];

  constructor(
    private plt: Platform,
		private loadingCtrl: LoadingController,
		private toastCtrl: ToastController,
		public authService: AuthService
  ) { }

  async ngOnInit() {
    this.cargarArchivos();
  }

  /**
   * @function cargarArchivos
   * @description refresca la galería de imágenes cargadas
   * por el usuario logueado.
   * Accede a los archivos del dispositivo mediante el plugin capacitor
   * FileSystem.
   */
  async cargarArchivos() {
		this.images = [];

		const loading = await this.loadingCtrl.create({
			message: 'Cargando datos...'
		});
		await loading.present();

		Filesystem.readdir({
			//path: IMAGE_DIR,
			path: `${IMAGE_DIR}/${this.authService.email}`,
			directory: Directory.Data
		})
			.then(
				(resultado) => {
					this.cargarDataDelArchivo(resultado.files);
				},
				async (err) => {
					await Filesystem.mkdir({
						//path: IMAGE_DIR,
						path:  `${IMAGE_DIR}/${this.authService.email}`,
						directory: Directory.Data
					});
				}
			)
			.then((_) => {
				loading.dismiss();
			});
    }
	/**
   * @function cargarDataDelArchivo
   * @param {any[]} filenames
   * @description Recorre el listado de archivos. Guarda la ruta de cada
   * archivo asociándola al mail del usuario logueado. Guarda los datos de la
   * imagen en un array.
   */
	async cargarDataDelArchivo(fileNames: any[]) {
		for (const f of fileNames) {
			//const filePath = `${IMAGE_DIR}/${f.name}`;
			const filePath =  `${IMAGE_DIR}/${this.authService.email}/${f.name}`;

      //console.log('Ruta Archivo: '+filePath);

			const readFile = await Filesystem.readFile({
				path: filePath,
				directory: Directory.Data
			});

			this.images.push({
				name: f,
				path: filePath,
				data: `data:image/jpeg;base64,${readFile.data}`
			});
      //console.log(readFile);
		}
	}

	/**
   * @function presentToast
   * @param {any} text
   * @description Muestra un mensaje al usuario según el texto introducido.
   */
	async presentToast(text) {
		const toast = await this.toastCtrl.create({
			message: text,
			duration: 3000
		});
		toast.present();
	}

	/**
   * @function seleccionarImagen
   * @description Se activa al presionar el botón Cargar una nueva Imagen.
   * Abre una imagen a través del plugin Capacitor Camera. La imagen
   * seleccionada es guardada.
   */
	async seleccionarImagen() {
    const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
    });

    if (image) {
        this.guardarImagen(image);
    }
}


/**
 * @function guardarImagen
 * @description Crea un nuevo archivo a partir de la imagen seleccionada.
 * Luego refresca la lista de archivos.
 */
async guardarImagen(photo: Photo) {
  const base64Data = await this.readAsBase64(photo);

  const fileName = new Date().getTime() + '.jpeg';
  const savedFile = await Filesystem.writeFile({
      //path: `${IMAGE_DIR}/${fileName}`,
	  path:  `${IMAGE_DIR}/${this.authService.email}/${fileName}`,
      data: base64Data,
      directory: Directory.Data
  });

  this.cargarArchivos();
}

/**
 * @function readAsBase64
 * @description toma un archivo de foto y la lee como formato base64.
 * @return {string} - devuelve una representación en formato string
 * de los datos contenidos en el archivo de la foto en formato base64..
 */
 private async readAsBase64(photo: Photo) {
  if (this.plt.is('hybrid')) {
      const file = await Filesystem.readFile({
          path: photo.path
      });

      return file.data;
  }
  else {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
  }
}

/**
 * @function convertBlobToBase64
 * @description convierte la imagen desde blob a formato base64. El blob es
 * un tipo de objeto de datos crudos e inmutables. Representa data que no
 * necesariamente está en formato JavaScript.
 */
// eslint-disable-next-line @typescript-eslint/member-ordering
convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
      resolve(reader.result);
  };
  reader.readAsDataURL(blob);
});

/**
 * @function borrarImagen
 * @description se activa al presionar el icon de tacho de basura junto a
 * la imagen. La imagen es eliminada y se refresca el listado.
 */
	// eslint-disable-next-line @typescript-eslint/member-ordering
	async borrarImagen(file: ArchivoLocal) {
		await Filesystem.deleteFile({
      directory: Directory.Data,
      path: file.path
  });
  this.cargarArchivos();
  this.presentToast('Archivo eliminado.');
	}


}