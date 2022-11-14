import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
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
   * @description toma el input del usuario reactivo en el campo de email y lo guarda como credencial.
   * @return {string} devuelve el string correspondiente al email ingresado
   * por el usuario en el formulario reactivo.
   */
  get email() {
    this.authService.email = this.credentials.value.email; 
    return this.credentials.get('email');
  }
  /**
   * @function email
   * @description toma el input del usuario reactivo en el campo de
   * contraseña y lo guarda como credencial.
   * @return {string} devuelve el string correspondiente a la contraseña 
   * ingresada por el usuario en el formulario reactivo.
   */
  get password() {
    return this.credentials.get('password');
  }

  /**
   * @function ngOnInit
   * @description toma las credenciales ingresadas en el formulario reactivo y aplica los validadores correspondientes.
   */
  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  /**
   * @function login
   * @description Se activa al presionar el botón de login. Si las
   * credenciales ingresadas por el usuario son válidas, el usuario es
   * redireccionado al home. Si no, el usuario permanece en la página.
   * En cualquiera de ambos casos mostará un mensaje al usuario.
   */
  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();

    if (user) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
      //console.log('usuario logueado');
    } else {
      this.showAlert('Falló el login', 'Por favor intente de nuevo');
    }
  }

  /**
   * @function showAlert
   * @param {any, any} header, message
   * @description Muestra una alerta al usuario con un mensaje asignado
   * según el caso. El cartel de alerta se elimina al presionar el botón OK.
   */
  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

}
