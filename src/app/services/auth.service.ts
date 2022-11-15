import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public email: any;

  constructor(

    private auth: Auth,
    private afAuth: AngularFireAuth,
    private alertController: AlertController


  ) { }

  /**
 * @function register
 * @description llama a la función correspondiente de Auth que guarda
 * en Firebase los datos del nuevo usuario que ha introducido credenciales
 * válidas. Si el usuario no es válido devuelve null.
 */
  async register({ email, password }) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user;
    } catch (e) {
      return null;
    }
  }

  /**
 * @function logout
 * @description llama a la función correspondiente de Auth que loguea
 * al usuario que ha introducido credenciales válidas. Si el usuario no
 * es válido devuelve null.
 */
  async login({ email, password }) {
    try {
      const user = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user;
    } catch (e) {
      return null;
    }
  }

/**
 * @function logout
 * @description llama a la función correspondiente de Auth que desloguea
 * al usuario logueado en el momento.
 * @returns {Auth} devuelve una llamada a la función signOut del módulo Auth.
 */
  logout() {
    return signOut(this.auth);
  }

/**
   * @function recuperarContraseña
   * @param {string} email
   * @description llama a la función correspondiente de AngularFireAuth
   * que envía un correo a la dirección provista como parámetro.
   * Si la dirección no está registrada (esta validacón se hace en el
   * formulario reactivo de la página de recuperar usuario), muestar un
   * mensaje de error. Si es válida muestra un mensaje que indica al usuario
   * revisar su casilla de mail en la cual recibirá el link de recupración.
   */
  async recuperarContraseña(email: string){
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      //console.log(user)
      this.showAlert('Enviado! ', 'Por favor revise su casilla de mail');
      //console.log('El mail está registrado - enviando correo de recuperación');
    } catch (e) {

      this.showAlert('Disculpe ', 'El correo no está registrado. Registre un nuevo usuario.');
      //console.log('El mail no está registrado');
    }

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

}
