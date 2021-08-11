import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxNotificationService } from "ngx-notification";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { DataApiService } from "../../services/data-api.service";
import { AuthService } from "../../services/auth.service";

import { CitaInterface } from "../../models/cita-interface";
import { TarjetaInterface } from "../../models/tarjeta-interface";
import { FacturacionInterface } from "../../models/facturacion-interface";
import { UserInterface } from "../../models/user-interface";
import { environment } from '../../../environments/environment';


declare var OpenPay: any;
//declare var PaymentService: any;
declare var paypal: any;
declare var Stripe: any;

@Component({
  selector: "app-menu-carrito",
  templateUrl: "./menu-carrito.component.html",
  styleUrls: ["./menu-carrito.component.css"],
})
export class MenuCarritoComponent implements OnInit {
  // Intialize Paypal Smartbutton
  @ViewChild("paypal", { static: false }) set content(
    paypalElement: ElementRef
  ) {
    if (paypalElement) {
      paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: "Servicios medicos Semin", 
                  amount: {
                    currency_code: "MXN",
                    type: "SERVICE",
                    value: this.totalPagoFinal,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            this.spinner.show();
            const order = await actions.order.capture();
            var i;
            var factura = "0";
            for (i = 0; i < this.citas.results.length; ++i) {
              if (this.citas.results[i].estatus == "CARRITO") {
                console.log(this.citas.results[i].id); 
                this.dataApiService.activarCitaPagoPayPal(this.citas.results[i].id, order.id).subscribe(
                  () => {
                    console.log("Actualizando id cita");
                    this.spinner.hide();
                    this.mensajeExito();
                    if( factura == "0"){
                      this.crearFactura();
                      factura = "1" ;
                    }
                    this.router.navigate(["/inicio/estudios"]);
                  },
                  (error) => this.mensajeError(error), 
                );
              }
            }
            console.log(order.id);
          },
          onError: (err) => {
            this.spinner.hide();
            console.log(err);
          },
        })
        .render(paypalElement.nativeElement);
    }
  }

  // Initialize card input Stripe
  @ViewChild("cardElement", { static: false }) set element(
    cardElement: ElementRef
  ) {
    if (cardElement) {
      this.stripe = Stripe(environment.stripe_api_key);
      const elements = this.stripe.elements();

      this.card = elements.create("card", { hidePostalCode: true });
      this.card.mount(cardElement.nativeElement);

      this.card.addEventListener("change", ({ error }) => {
        this.cardErrors = error && error.message;
      });
    }
  }

  // Send form when the payment is with Stripe
  async handleForm(e) {
    e.preventDefault();
    const { source, error } = await this.stripe.createSource(this.card);
    this.spinner.show();
    if (error) {
      this.spinner.hide();
      // Inform the customer that there was an error.
      this.cardErrors = error.message;
      console.log(error);
    } else {
      // Send the token to your server.
      // Stripe cobra en centavos entonces se tiene que multiplicar 1000
      // Para que sea la cantidad correcta
      let items_citas = (this.citas.results).reduce((ids, element) => {
        if( element.estatus == "CARRITO"){
          ids.push({"item": element.id})
        }
        return ids;
      }, []);

      this.dataApiService
        .registrarPagoStripe(source.id, this.totalPagoFinal * 100, items_citas)
        .subscribe(
          () => {
            console.log("Guardado correctamente");
            this.mensajeExito(); 
            this.crearFactura();
            this.spinner.hide();
            this.router.navigate(["/inicio/estudios"]); 
          },
          (error) => this.mensajeError(error)
        );
      console.log(source);
    }
  }

  stripe;
  card;
  cardErrors;

  tarjetaForm: FormGroup;
  FacturacionCrearForm: FormGroup;

  citas: CitaInterface = {};
  cita: CitaInterface = {};
  tarjeta: TarjetaInterface = {};
  facturaTmp: FacturacionInterface = {};
  userAPI: UserInterface = {};
  items_in_card: Array<{ item: number }> = [];

  totalPago;
  totalPagoIva;
  totalPagoFinal;
  totalSucursal;
  idCita;
  promocionCita;
  nombrePromocion;
  modoPago = 0;
  estatusPago = 0;
  msgError = 0;
  pagoEstatus = 0;
  pagoMsg = "Pago en Sucursal"
  flagFactura = false;
  flagFacturaCompleta = false;
  flagPago = false;
  route: string;

  //Patrón para identificar un correo.
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //Patrón para identificar un nombre
  NamePattern: any = /^([a-zA-Z]+\s)*[a-zA-Z]+$/
  //Patrón para identificar un texto sin caracteres especiales
  textPattern: any=/^[^<>%$|&*;]*$/ 

  //Patrón para identificar un rfc
  rfcPattern: any=/^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/     

  //Patrón para identificar un nombre
  firstNamePattern: any = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/

  //Patrón para identificar un apellido 
  lastNamePattern: any = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/


  constructor(
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private ngxNotificationService: NgxNotificationService,
    private dataApiService: DataApiService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.consultarPacienteCitas();
    this.ValidarFacturacionCrearForm();
    this.desactivarSelect();
    window.scroll(0, 0);
    this.spinner.show();
  }

  desactivarSelect(){
    this.flagFacturaCompleta = false;
    this.FacturacionCrearForm.get('tipo_rfc').disable();
    this.FacturacionCrearForm.get('impresion').disable();
    this.FacturacionCrearForm.get('cfdi_uso').disable();
    this.FacturacionCrearForm.get('forma_pago').disable();
  }
  
  activarSelect(){
    this.flagFacturaCompleta = false;
    this.FacturacionCrearForm.get('tipo_rfc').enable();
    this.FacturacionCrearForm.get('impresion').enable();
    this.FacturacionCrearForm.get('cfdi_uso').enable();
    this.FacturacionCrearForm.get('forma_pago').enable();
  }

  verificarSelect(){
    if(this.flagFactura){
      this.desactivarSelect();
      this.facturaTmp = {};
      this.ValidarFacturacionCrearForm();
    }else{
      this.activarSelect();
    }
  } 

  activar(){
    this.flagFacturaCompleta = true; 
    console.log((this.flagFacturaCompleta))
  }


  ValidarFacturacionCrearForm(){
    this.FacturacionCrearForm = this.formBuilder.group({
      nombre: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(90), Validators.pattern(this.firstNamePattern)])],
      apellido_paterno: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(45), Validators.pattern(this.lastNamePattern)])],
      apellido_materno: ["", Validators.compose([Validators.minLength(3), Validators.maxLength(45), Validators.pattern(this.lastNamePattern)])],
      tipo_rfc: ["", Validators.compose([Validators.required])], 
      rfc: ["", Validators.compose([Validators.required,Validators.minLength(12),Validators.maxLength(13), Validators.pattern(this.rfcPattern)])],
      cfdi_uso: ["", Validators.compose([Validators.required])], 
      forma_pago: ["", Validators.compose([Validators.required])], 
      impresion: ["", Validators.compose([Validators.required])], 
    });
  }

  //front
  agendarPagoSucursal() {
    console.log("entrado pago sucursal");
    this.flagPago = true;
    this.pagoMsg ="Espere..."
    this.flagFactura = true; 
    var i;
    for (i = 0; i < this.citas.results.length; ++i) {
      if (this.citas.results[i].estatus == "CARRITO") {
        console.log(this.citas.results[i].id);
        if (this.citas.results[i].costoSucursal > 0){
          this.citas.results[i].precioVenta = this.citas.results[i].costoSucursal
        }
        console.log(this.citas.results[i].id)
        console.log(this.citas.results[i].precioVenta)
        this.dataApiService.activarCita(this.citas.results[i].id, this.citas.results[i].precioVenta).subscribe(
          () => {
            console.log("Actualizando id cita");
            this.mensajeExito();
            this.pagoMsg ="Cita Agendada."
            this.router.navigate(["/inicio/estudios"]);
          },
          (error) => this.mensajeError(error)
        );
      }
    }
  }

  crearFactura() {
    if (this.flagFacturaCompleta) {
      this.userAPI = this.authService.getCurrentUser();
      this.facturaTmp.cantidad_pagada = this.totalPagoFinal;
      this.facturaTmp.creador = "Paciente";
      this.facturaTmp.editor = "Paciente";
      this.facturaTmp.metodo_pago = "PUE-Pago en una sola exhibición";
      this.facturaTmp.email = this.userAPI.email;
      this.facturaTmp.factura_estatus = "SOLICITADO";
      this.facturaTmp.Paciente = this.userAPI.id_sem;
      let estudios = "";
      this.facturaTmp.nombre_paciente =
        this.userAPI.first_name + " " + this.userAPI.last_name;
      let i;
      //estudios_realizados: factura.estudios_realizados,
      for (i = 0; i < this.citas.results.length; ++i) {
        if (this.citas.results[i].estatus == "CARRITO") {
          if(i==0){
            this.facturaTmp.descripcion = this.citas.results[i].prueba;
          }
          else{
            this.facturaTmp.descripcion = this.facturaTmp.descripcion + ' ,' + this.citas.results[i].prueba;
          }
        }
      }
      this.facturaTmp.estudios_realizados = this.facturaTmp.descripcion;
      console.log(this.facturaTmp);
      this.dataApiService.crearFactura(this.facturaTmp).subscribe(
        () => {
          console.log("Creando Factura");
          this.mensajeExito();
        },
        (error) => this.mensajeError(error)
      );
    }
  }

  vaciarCamposTarjeta() {
    this.tarjeta = {};
    this.estatusPago = 0;
    this.pagoEstatus = 0;
  }

  cambiarEstatusPago() {
    this.estatusPago = 1;
  }

 
  // funcion para listado de todos los estudios
  consultarPacienteCitas() {
    this.citas = {};
    this.dataApiService.consultarPacienteCitas().subscribe(
      (data: CitaInterface) => {
        this.citas = data;
        this.mensajeExito();
        console.log("Citas Cargadas");
        console.log(this.citas);
        this.sumarPacienteCitasCarrito();
      },
      (error) => this.mensajeError(error)
    );
  }


  sumarPacienteCitasCarrito() {
    console.log("sumar");
    this.totalPago = 0;
    this.totalSucursal = 0;
    var i;
    for (i = 0; i < this.citas.count; i++) {
      if (this.citas.results[i].estatus == "CARRITO") {
        this.totalPago = this.totalPago + this.citas.results[i].precioVenta;
        if(!this.citas.results[i].promocion){
          this.totalSucursal = this.totalSucursal + this.citas.results[i].costoSucursal;
        }else{
          this.totalSucursal = this.totalSucursal + this.citas.results[i].precioVenta;
        }
      }
    }
    this.totalPagoFinal = this.totalPago;
    if(this.totalPagoFinal == 0)
    {
      this.recargar();
    }
    console.log(this.totalPago);
    console.log(this.totalPagoFinal);
    console.log(this.totalSucursal);
    this.spinner.hide();
  }

  recargar(){  
    // @ts-ignore
    if(this.location._platformLocation.pathname == '/inicio/carrito'){
      setTimeout(() => {
        console.log("recargando...")
        this.ValidarFacturacionCrearForm();
        this.desactivarSelect();
        this.consultarPacienteCitas();
        this.spinner.show();
      }, 2000);
    }
  } 

  // funcion para eliminar una cita
  eliminarCita(id, promocion, nombre) {
    this.idCita = id;
    this.promocionCita = promocion;
    this.nombrePromocion = nombre;
    if (!this.promocionCita) {
      this.dataApiService.eliminarCita(this.idCita).subscribe(
        () => {
          this.router.navigate(["/inicio/lista"]); 
          setTimeout(() => {
            console.log("recargando...")
            this.router.navigate(["/inicio/carrito"]); 
          }, 100);
          this.consultarPacienteCitas();
          console.log("Eliminar Cita " + this.idCita);
          this.mensajeExito();
        },
        (error) => this.mensajeError(error)
      );
    } else {
      var i,
        n = this.citas.results.length;
      for (i = 0; i < n; ++i) {
        if (
          this.citas.results[i].promocion &&
          this.citas.results[i].nombre_promocion == this.nombrePromocion &&
          this.citas.results[i].estatus == "CARRITO"
        ) {
          this.dataApiService.eliminarCita(this.citas.results[i].id).subscribe(
            () => {
              this.mensajeExito();
              if (i == n) {
                this.consultarPacienteCitas();
              }
            },
            (error) => this.mensajeError(error)
          );
        }
      }
      this.router.navigate(["/inicio/lista"]); 
      setTimeout(() => {
        console.log("recargando...")
        this.router.navigate(["/inicio/carrito"]); 
      }, 100);
    }
  }

  // funcion para abrir modal de estudios
  verEstudios(modal, id, promocion, nombre) {
    console.log("abriendo modal");
    this.idCita = id;
    this.promocionCita = promocion;
    this.nombrePromocion = nombre;
    console.log(this.idCita);
    console.log(this.promocionCita);
    console.log(this.nombrePromocion);
    this.modalService.open(modal, {
      size: "lg",
    });
  }

  // funcion para abrir modal de pago
  verModalPago(modal) {
    this.modoPago = 0;
    console.log("abriendo modal");
    this.modalService.open(modal, {
      size: "lg",
    });
  }

  tipoPago(tipo) {
    this.modoPago = tipo;
  }

  //aviso de exito en una operacion en el api
  mensajeExito() {
    this.ngxNotificationService.sendMessage(
      "Búsqueda exitosa",
      "success ",
      "bottom-right"
    );
  }

  mensajeError(error) {
    this.spinner.hide();
    this.pagoEstatus = 3;
    this.ngxNotificationService.sendMessage(
      "Ha ocurrido un error ",
      "danger ",
      "bottom-right"
    );
    console.log(error);
    //this.msgError = error.error.status;
  }
}
