import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';



@Component({
  selector: 'app-recuperar-usuario',
  templateUrl: './recuperar-usuario.page.html',
  styleUrls: ['./recuperar-usuario.page.scss'],
})
export class RecuperarUsuarioPage implements OnInit {

  credentials: FormGroup;

  constructor(
    private fb: FormBuilder, private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService
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
  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]]

    })
  }

  /**
   * @function recuperarUsuario
   * @description Se activa al presionar el botón Enviar. Este botón se
   * activa cuando se valida la credencial de email ingresada por el usuario
   * en el campo correspondiente en el formulario reactivo. Llama a la
   * función correspondiente de AuthService que envía un correo de
   * recuperación al usuario registrado con el mail ingresado.
   * Redirecciona al usuario a la página e login.
   */
   recuperarUsuario() {

    if (this.credentials.valid) {

    const { email } = this.credentials.value;
     this.authService.recuperarContraseña(email);

     this.router.navigateByUrl('/login', { replaceUrl: true });
    }

  }
}
