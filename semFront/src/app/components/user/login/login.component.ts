import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from "../../../services/auth.service";
import { DataApiService } from "../../../services/data-api.service";
import { PanelDataService } from "../../../services/panel-data.service";

import { NgxSpinnerService } from "ngx-spinner";
import { PacienteInterface } from "../../../models/paciente-interface";
import { EmpleadoInterface } from "../../../models/empleado-interface";
import { MedicoInterface } from "../../../models/medico-interface";
import { AdministradorInterface } from "../../../models/administrador-interface";
import { UserInterface } from "../../../models/user-interface";
import { LoginInterface } from "../../../models/login-interface";
import { ImagenologiaInterface } from "../../../models/imagenologia-interface";
import { FisioterapeutaInterface } from "../../../models/fisioterapeuta-interface";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;


  constructor(
    private dataApiService: DataApiService,
    private api_panel: PanelDataService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) { }


  //bandera que identifica si el login fue exitoso
  public noValido = false;
  // error por default
  public msgError = "Datos no validos";

  user: UserInterface = {
    email: "",
    password: ""
  };

  imagenologo: ImagenologiaInterface = {};
  fisioterapeuta: FisioterapeutaInterface = {};
  paciente: PacienteInterface = {};
  empleado: EmpleadoInterface = {};
  medico: MedicoInterface = {};
  administrador: AdministradorInterface = {};
  login: LoginInterface = {};

  userAPI: UserInterface = {
    first_name: "",
    last_name: "",
    email: "",
    id_sem: "",
    tipo: ""
  };

  flagLogin: boolean = false;
  isMobile: boolean = false;

  //Patrón para identificar un correo.
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  ngOnInit() {
    $('#login')[0].scrollIntoView(true);
    //se purgan las credenciales pasadas cada vez que entra a login
    localStorage.removeItem("currentUser");
    localStorage.removeItem("accessToken");
    this.validarFormulario();
    // Verificar si el usuario esta accediendo desde un dispositivo
    this.isMobile = this.getMobileOperatingSystem();
  }

  getMobileOperatingSystem() {
    (<any>window).MyNamespace;
    var userAgent = navigator.userAgent || navigator.platform;
    console.log(userAgent)
    // Si es un dispositivo android redireccionar a la app o google play dependiendo el caso
    if (/android|Google/i.test(userAgent)) {
      return true;
    }
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return false;
    }

    // En caso de que no sea Android o IOS se le deja en el sitio web
    return false;
  }


  // Aqui se definen las reglas que seguirá cada formulario.
  validarFormulario() {
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(40), Validators.pattern(this.emailPattern)])],
      password: ["", Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])],
    });
  }

  // funcion para consultar un paciente
  // una vez llamado el paciente verifica que el id de perfil y el de su objeto sean identicos en caso contrario no permite login
  // tambien verifica el status del paciente dea Activa
  consultarPaciente() {
    this.dataApiService.consultarPaciente(this.userAPI.id_sem)
      .subscribe(
        (data: PacienteInterface) => {
          this.paciente = data;
          if (this.userAPI.email == this.paciente.email) {
            this.spinner.hide();
            this.almacenarLogin();
            this.router.navigate(['/inicio/promociones']);
          } else {
            this.spinner.hide();
            console.log("no valido");
            this.router.navigate(['/login']);
            localStorage.removeItem("currentUser");
            localStorage.removeItem("accessToken");
            this.loginDataError();
          }
        }, error => this.mensajeError(error)
      );
  }

  correoMinusculas() {
    console.log("entra")
    this.user.email = this.user.email.toLowerCase();
  }


  //registra un login
  //FRONT
  almacenarLogin() {
    console.log("almacenando")
    this.dataApiService.almacenarLogin(this.userAPI.id_sem, "WEB")
      .subscribe(
        (
          data: LoginInterface) => {
          this.login = data;
          console.log("Login registrado");
        },
      );
  }

  // funcion para consultar un paciente
  // una vez llamado el paciente verifica que el id de perfil y el de su objeto sean identicos en caso contrario no permite login
  // tambien verifica el status del paciente dea Activa
  consultarMedico() {
    this.dataApiService.consultarMedico(this.userAPI.id_sem)
      .subscribe((
        data: MedicoInterface) => {
        this.medico = data;
        console.log(this.medico)
        const { id, nombre, apellido_paterno, apellido_materno } = data;
        if (this.userAPI.email == this.medico.email) {
          if (this.medico.verificado == 'APROBADO') {
            console.log("Medico Verificado");
            const fechaCaducidad = new Date(this.medico.caducidad).getTime() / 1000
            const fechaActual = new Date().getTime() / 1000
            if (fechaCaducidad > fechaActual) {
              console.log("Medico no Caducado");
              this.spinner.hide();
              this.router.navigate(['/medico/citas']);

              this.api_panel.postLogin(nombre, apellido_paterno, apellido_materno, "Inicio de Sesion Medico").subscribe();

            } else {
              console.log("Medico Caducado");
              this.router.navigate(['/login']);
              localStorage.removeItem("currentUser");
              localStorage.removeItem("accessToken");
              this.msgError = "Su cuenta ha cadudado. Por favor contacte a soporte técnico."
              this.loginMedicoError()
            }
          }
          else {
            console.log("Medico no Verificado");
            console.log("no valido");
            this.router.navigate(['/login']);
            localStorage.removeItem("currentUser");
            localStorage.removeItem("accessToken");
            this.msgError = "Su cuenta aún no ha sido verificada por uno de nuestros representantes. Por favor contacte a soporte técnico."
            this.loginMedicoError()
          }
        } else {
          this.spinner.hide();
          console.log("no valido");
          this.router.navigate(['/login']);
          localStorage.removeItem("currentUser");
          localStorage.removeItem("accessToken");
          this.loginDataError();
        }
      }, error => this.mensajeError(error)
      );
  }


  // funcion para consultar un paciente
  // una vez llamado el paciente verifica que el id de perfil y el de su objeto sean identicos en caso contrario no permite login
  // tambien verifica el status del paciente dea Activa
  consultarAdministrador() {
    this.dataApiService.consultarAdministrador(this.userAPI.id_sem)
      .subscribe(
        (data: AdministradorInterface) => {
          console.log(data);
          this.administrador = data;
          if (this.userAPI.email == this.administrador.email) {
            this.spinner.hide();
            this.router.navigate(['/admin/panel']);
          } else {
            this.spinner.hide();
            console.log("no valido");
            this.router.navigate(['/login']);
            localStorage.removeItem("currentUser");
            localStorage.removeItem("accessToken");
            this.loginDataError();
          }
        }, error => this.mensajeError(error)
      );
  }

  consultarOperador() {
    this.dataApiService.consultarOperador(this.userAPI.id_sem)
      .subscribe(
        (data: EmpleadoInterface) => {
          console.log(data);
          this.empleado = data;
          const { id, nombre, apellido_paterno, apellido_materno } = data;
          if (this.userAPI.email == this.empleado.email) {
            this.spinner.hide();
            this.router.navigate(['/panel/citas']);
            this.api_panel.postLogin(nombre, apellido_paterno, apellido_materno, "Inicio de Sesion Operador").subscribe();
          } else {
            this.spinner.hide();
            console.log("no valido");
            this.router.navigate(['/login']);
            localStorage.removeItem("currentUser");
            localStorage.removeItem("accessToken");
            this.loginDataError();
          }
        }, error => this.mensajeError(error)
      );
  }

  consultarRadiologo() {
    this.dataApiService.consultarImagenologo(this.userAPI.id_sem)
      .subscribe((data: any) => {
        console.log(data);
        this.imagenologo = data.data;
        if (this.userAPI.email == this.imagenologo.email) {
          this.spinner.hide();
          this.router.navigate(['/radiologo/estudios']);
        } else {
          console.log(this.imagenologo.email)
          this.spinner.hide();
          console.log("no valido");
          this.router.navigate(['/login']);
          localStorage.removeItem("currentUser");
          localStorage.removeItem("accessToken");
          this.loginDataError();
        }
      },
        error => this.mensajeError(error)
      );
  }

  consultarFisioterapeuta() {
    this.dataApiService.consultarFisioterapueta(this.userAPI.id_sem)
      .subscribe((data: any) => {
        console.log('holaaaaaaaaaaaa');
        this.fisioterapeuta = data;
        console.log(data);
        if (this.userAPI.email == this.fisioterapeuta.email) {
          console.log('si entra y debe redireccionar');
          this.spinner.hide();
          this.router.navigate(['/fisio/studios']);
          console.log('wiiiiiiii ya entre');
        } else {
          console.log(this.fisioterapeuta.email)
          this.spinner.hide();
          console.log("no valido");
          this.router.navigate(['/login']);
          localStorage.removeItem("currentUser");
          localStorage.removeItem("accessToken");
          this.loginDataError();
        }
      },
        error => this.mensajeError(error)
      );
  }

  consultarUserAuditorPanelData = () => {
    console.log('consultando ususario Auditor')
    this.api_panel.consultAuditorUser(this.userAPI.email).subscribe(
      (data: any) => {
        console.log(data);
        if (data) {
          const { id, nombre, apellido_paterno, apellido_materno } = data;
          this.spinner.hide();
          this.router.navigate(['/paneldata']);
          // this.api_panel.postLogin(nombre, apellido_paterno, apellido_materno, 'Inicio Sesion Auditor de Panel Coorporativo').subscribe();
        }
        else {
          console.log("no valido");
          this.spinner.hide();
          this.router.navigate(['/login']);
          localStorage.removeItem("currentUser");
          localStorage.removeItem("accessToken");
        }

      }
    )
  }

  consultarUserAdminPanelData = () => {
    console.log('consultando ususario administrador')
    this.api_panel.consultAdminUser(this.userAPI.email).subscribe(
      (data: any) => {
        console.log(data);
        if (data) {
          const { id, nombre, apellido_paterno, apellido_materno } = data;
          this.spinner.hide();
          this.router.navigate(['/paneldata']);
          // this.api_panel.postLogin(nombre, apellido_paterno, apellido_materno, 'Inicio Sesion Auditor de Panel Coorporativo').subscribe();
        }
        else {
          console.log("no valido");
          this.spinner.hide();
          this.router.navigate(['/login']);
          localStorage.removeItem("currentUser");
          localStorage.removeItem("accessToken");
        }

      }
    )
  }

  //función para login al sistema
  //BEFORE PRODUCTION
  // onLogin(form: NgForm){
  onLogin(form) {
    if (form.valid) {
      this.spinner.show();
      this.flagLogin = true;
      return this.authService.loginuser(this.user.email, this.user.password)
        .subscribe(
          data => {
            console.log(data);
            this.userAPI.first_name = data.user.first_name
            this.userAPI.last_name = data.user.last_name
            this.userAPI.email = data.user.email
            this.userAPI.id_sem = data.user.id_sem
            this.userAPI.tipo = data.user.tipo
            this.authService.setInterface(this.userAPI);
            this.authService.setToken(data.key);
            //Compara el tipo de usuario y si tiene un id_dem enlazado, en caso contrario no permite el login
            if (data.user.tipo == "Operador" && data.user.id_sem) {
              console.log("entra Operador");
              this.consultarOperador();
            } else if (data.user.tipo == "Paciente" && data.user.id_sem) {
              console.log("entra Paciente");
              this.consultarPaciente();
            }
            else if (data.user.tipo == "Medico" && data.user.id_sem) {
              console.log("entra Medico");
              this.consultarMedico();
            }
            else if (data.user.tipo == "Administrador" && data.user.id_sem) {
              console.log("entra Administrador");
              this.consultarAdministrador();
            } else if (data.user.tipo == "Imagenologia" && data.user.id_sem) {
              this.consultarRadiologo();
            }
            else if (data.user.tipo == "Fisioterapeuta" && data.user.id_sem) {
              console.log("entra Fisioterapeuta");
              this.consultarFisioterapeuta();
            }
            else if (data.user.tipo == "Auditor_panel" && data.user.id_sem) {
              console.log("entra Auditor de panel data");
              this.consultarUserAuditorPanelData();
            }
            else if (data.user.tipo == "Admin_panel" && data.user.id_sem) {
              console.log("entra administrador de panel data");
              this.consultarUserAdminPanelData();
            }
            else {
              // En caso de error regresa a la pagina de login
              console.log("no valido");
              console.log(data)
              this.router.navigate(['/login']);
              localStorage.removeItem("currentUser");
              localStorage.removeItem("accessToken");
              this.loginError();
            }
          },
          error => this.mensajeError(error)
        );
    } else {
      this.loginError();
    }
  }

  //en caso de un error en el login se muestra un mensaje durante 5 segundos
  loginError() {
    this.spinner.hide();
    this.noValido = true;
    //this.user = {}
    setTimeout(() => {
      this.noValido = false;
      this.flagLogin = false;
    }, 5000);
  }

  //en caso de un error en la verificacion del correo y status del doctor se muestra un mensaje durante 5 segundos
  loginDataError() {
    this.spinner.hide();
    this.msgError = "Existe un problema relacionado a su cuenta, por favor contacte a soporte técnico."
    this.noValido = true;
    setTimeout(() => {
      this.noValido = false;
      this.flagLogin = false;
    }, 10000);
  }


  //en caso de un error en la verificacion del correo y status del doctor se muestra un mensaje durante 5 segundos
  loginMedicoError() {
    this.spinner.hide();
    this.noValido = true;
    setTimeout(() => {
      this.noValido = false;
      this.flagLogin = false;
    }, 10000);
  }

  //identifica el error de login 
  mensajeError(error) {
    this.spinner.hide();
    this.noValido = true;
    if (error.statusText == "Unknown Error") {
      this.msgError = "No es posible consultar el expediente"
    }
    else if (error.statusText == "Unauthorized") {
      this.msgError = "Usuario o contraseña erroneas"
    }
    else if (error.statusText == "Too Many Requests") {
      this.msgError = "Demasiados intentos errórneos"
    }
    setTimeout(() => {
      this.noValido = false;
      this.flagLogin = false;
    }, 5000);
  }

}