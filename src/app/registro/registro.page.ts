import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  credentials: FormGroup;
  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,

  ) { }

    /**
   * @function email
   * @description toma el input del usuario en el formulario reactivo en el
   * campo de email.
   * @return {any} devuelve los datos correspondiente al mail
   * ingresada por el usuario en el como credencial.
   */
  get email() {
    return this.credentials.get('email');
  }

   /**
   * @function password
   * @description toma el input del usuario en el formulario reactivo en el
   * campo de contraseña.
   * @return {any} devuelve los datos correspondiente a la contraseña
   * ingresada por el usuario en el como credencial.
   */
  get password() {
    return this.credentials.get('password');
  }


  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  /**
   * @function showAlert
   * @param {any, any} header, message
   * @description Muestra una alerta al usuario con un mensaje configurado
   * según los datos asignados en la función que implementa la alerta para
   * header y mensaje.
   * El cartel de alerta se elimina al presionar el botón OK.
   */
  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }


 /**
   * @function registrarse
   * @description Llama a la función correspondiente de AuthService que
   * hace el registro en Firebase del nuevo usuario con ls credenciale válidas
   * ingresadas en los campos correspondiente en el formulario reactivo.
   * Si las credenciales son válidas, el usuario es redireccionado a login
   * desde donde ya podrá loguearse. Se lo contrario el usuario recibe un
   * mensaje indicando que falló el registro.
   */
  async registrarse() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.register(this.credentials.value);
    await loading.dismiss();

    if (user) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } else {
      this.showAlert('Falló el registro', 'Por favor intente de nuevo');
    }
  }
}
