import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";
import {AuthService} from "./auth.service";

import { PacienteInterface } from "../models/paciente-interface"; 
import { UserInterface } from "../models/user-interface";
import { CitaInterface } from "../models/cita-interface";
import { PromocionInterface } from "../models/promocion-interface";
import { ResultadoInterface } from "../models/resultado-interface"; 
import { FacturacionInterface } from "../models/facturacion-interface";
import { EncuestaInterface } from '../models/encuesta-interface';
import { CitaMedicoInterface } from "../models/citaMedico-interface";
import { MedicoInterface } from "../models/medico-interface";
import { TablaPermisosInterface } from "../models/tablaPermisos-interface";
import { HistoriaClinicaInterface } from "../models/historiaClinica-interface"; 
import { NotaInterface } from "../models/nota-interface"; 
import { QueryInterface } from "../models/query-interface";
import { LoginInterface } from "../models/login-interface";
import { CallInterface } from "../models/call-interface";
import { ComentariosInterface } from "../models/comentarios-interface";
import { QuejasSugerenciasInterface } from "../models/quejasSugerencias-interface";
import { RehabilitacionInterface } from "../models/rehabilitacion-interface";



@Injectable({
  providedIn: 'root'
})

export class DataApiService {

  constructor(private http:HttpClient, private AuthService: AuthService) { }

  headers : HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  
  private currentUser: UserInterface = {
    first_name: "",
    first_last_name: "",
    second_last_name: "",
    password: "",
    email: ""
  };

  public domainUrl = "https://semindigital.com:8090"
  public testUrl = "http://semindigital.com:8005"

  logoutUserFull(): Observable<any>{
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    const url_api = this.domainUrl+'/rest-auth/logout/';
    return this.http
    .post<UserInterface>
    (url_api,
      {},
      {headers: httpHeaders },
      ).pipe(map(data => data)); 
    console.log("usuario desconectado");
  }

  
  //Consulta los estudios
  consultarEstudio(query,list): Observable<any>{
    console.log("consultar estudio");
    console.log(query)
    console.log(list)
    var flag = true;
    var area = '';
    var newArea = '';
    var i, n = list.length;
    for (i = 0; i < n; ++i) {
      if (list[i].flag == false){
        flag = false;
      } 
    }
    if (flag){
      area = '&category=All'
    }else{
      for (i = 0; i < n; ++i) { 
        if (list[i].flag == true){
          newArea = '&category='+list[i].name;
            area = area+newArea;
        } 
      }
      console.log(area);
    }
    const url_api = this.domainUrl+'/api/v1/buscar/catalogo/searchAdvance/category/?sentence='+query+area;
    console.log(url_api);
    var httpHeaders = {};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }


  //Consulta la tabla de permisos
  buscarTablaPermiso(token): Observable<any>{
    console.log("consultar Tabla Permiso");
    console.log(token)
    const url_api = this.domainUrl+'/api/v1/buscar/tablaPermisos/?token='+token;
    console.log(url_api);
    var httpHeaders = {};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta un estudio mediante un id
  consultarCatalogoId(id): Observable<any>{
    console.log("consultar estudio id");
    const url_api = this.domainUrl+'/api/v1/paciente/catalogo/'+id;
    console.log(url_api);
    var httpHeaders = {};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta datos de una sucursal
  consultarDisponibilidad(estudio): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/paciente/disponibilidadServ?sala='+estudio.sala+'&page_size=9999';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta datos de una sucursal
  consultarDisponibilidadId(idSala): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/paciente/disponibilidadServ/'+idSala;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta tiempo de servicio
  consultarTiempo(): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/paciente/tiempoServicio';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }


  //Consulta citas
  consultarCitas(fecha,id,sucursal): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/paciente/citaSucursal?fecha='+fecha+'&id='+id+'&sucursal='+sucursal+'&page_size=9999'
    console.log(url_api)
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  } 


  //Consulta citas Medico
  consultarCitasMedico(): Observable<any>{
    console.log("Citas Medicos")
    const url_api = this.domainUrl+'/api/v1/medico/citaMedico?page_size=9999' 
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

    //Actualizar un medico
    actualizarHorarioMedico(medico){
      const url_api = this.domainUrl+'/api/v1/medico/medico/'+medico.id;
      var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
      return this.http
        .put<MedicoInterface>(
          url_api, 
          {
            hora_apertura : medico.hora_apertura,
            hora_cierre : medico.hora_cierre
          },
          {headers: httpHeaders },
        ).pipe(map(data => data)); 
    }

    
  //Actualizar un paciente
  actualizarMedico(medico){
    const url_api = this.domainUrl+'/api/v1/medico/medico/'+medico.id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<MedicoInterface>(
        url_api, 
        { 
          calle: medico.calle,
          colonia: medico.colonia,
          cp: medico.cp,
          descripcion: medico.descripcion,
          especialidad: medico.especialidad,
          subespecialidad: medico.subespecialidad,
          estado: medico.estado,
          fecha_nacimiento: medico.fecha_nacimiento,
          localidad: medico.localidad,
          municipio: medico.municipio,
          num_exterior: medico.num_exterior,
          num_interior: medico.num_interior,
          sexo: medico.sexo,
          telefono: medico.telefono
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

  //Actualizar un paciente
  actualizarMedicoAdmin(medico){
    const url_api = this.domainUrl+'/api/v1/admin/medico/'+medico.id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    console.log(medico)
    return this.http
      .put<MedicoInterface>(
        url_api, 
        {
          apellido_materno: medico.apellido_materno,
          apellido_paterno: medico.apellido_paterno,
          caducidad: medico.caducidad,
          calle: medico.calle,
          cedula: medico.cedula,
          colonia: medico.colonia,
          cp: medico.cp,
          descripcion: medico.descripcion,
          especialidad: medico.especialidad,
          subespecialidad: medico.subespecialidad,
          estado: medico.estado,
          estrellas: medico.estrellas,
          fecha_nacimiento: medico.fecha_nacimiento,
          localidad: medico.localidad,
          municipio: medico.municipio,
          nombre: medico.nombre,
          num_exterior: medico.num_exterior,
          num_interior: medico.num_interior,
          ranking: medico.ranking,
          sexo: medico.sexo,
          telefono: medico.telefono
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }


  //Actualizar un paciente
  actualizarMedicoEstatusAdmin(medico){
    const url_api = this.domainUrl+'/api/v1/admin/medico/'+medico.id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    console.log(medico)
    return this.http
      .put<MedicoInterface>(
        url_api, 
        {
          verificado: medico.verificado
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }
 
    actualizarHorarioMedicoSab(medico){
      const url_api = this.domainUrl+'/api/v1/medico/medico/'+medico.id;
      var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
      return this.http
        .put<MedicoInterface>(
          url_api, 
          {
            hora_apertura_sab : medico.hora_apertura_sab,
            hora_cierre_sab : medico.hora_cierre_sab
          },
          {headers: httpHeaders },
        ).pipe(map(data => data)); 
    }

    actualizarHorarioMedicoDom(medico){
      const url_api = this.domainUrl+'/api/v1/medico/medico/'+medico.id;
      var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
      return this.http
        .put<MedicoInterface>(
          url_api, 
          {
            hora_apertura_dom : medico.hora_apertura_dom,
            hora_cierre_dom : medico.hora_cierre_dom
          },
          {headers: httpHeaders },
        ).pipe(map(data => data)); 
    }
  
  //Crea una cita
  crearCitaMedico(cita: CitaMedicoInterface): Observable<any>{ 
    const url_api = this.domainUrl+'/api/v1/medico/citaMedico';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .post<CitaMedicoInterface>(
        url_api, 
        {
          fecha_cita: cita.fecha_cita, 
          hora_inicio: cita.hora_inicio,
          hora_final: cita.hora_final,
          costo: cita.costo,
          notas : cita.notas,
          tipo : cita.tipo,
          titulo : cita.titulo,
          estatus : cita.estatus,
          creador : cita.creador,
          telefono : cita.telefono,
          unidadEnvio : cita.unidadEnvio,
          editor : cita.editor,
          Medico : cita.Medico  
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

  //Consulta citas Operador
  consultarCitasOp(id,sucursal): Observable<any>{
    console.log(id)
    console.log(sucursal)
    const url_api = this.domainUrl+'/api/v1/operador/citaSucursal?id='+id+'&sucursal='+sucursal+'&page_size=9999'
    console.log(url_api)
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta citas Operador
  consultarCitasBuscadorOp(id,sucursal): Observable<any>{
    console.log(id)
    console.log(sucursal)
    const url_api = this.domainUrl+'/api/v1/operador/citaSucursal?id='+id+'&sucursal='+sucursal+'&buscador=True&page_size=9999'
    console.log(url_api)
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }


//Consulta un QuejasSugerencias Operador
consultarQuejasSugerenciaOp(id): Observable<any>{
  const url_api = this.domainUrl+'/api/v1/operador/quejasSugerencias/'+id;
  console.log(url_api);
  var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
  return this.http
  .get
  (url_api,
    {headers: httpHeaders },
    ).pipe(map(data => data))
}


//Consulta todos los quejasSugerencias Operador
consultarQuejasSugerenciasOp(): Observable<any>{
  const url_api = this.domainUrl+'/api/v1/operador/quejasSugerencias?page_size=9999'
  console.log(url_api);
  var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
  return this.http
  .get
  (url_api,
    {headers: httpHeaders },
    ).pipe(map(data => data))
}

//Editar QuejasSugerencias operador
editarQuejasSugerenciasOp(quejasSugerencia: QuejasSugerenciasInterface){
  console.log(quejasSugerencia.id)
  const url_api = this.domainUrl+'/api/v1/operador/quejasSugerencias/'+quejasSugerencia.id;
  var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
  return this.http
    .put<CitaInterface>(
      url_api, 
      {
        nombre_encargado: quejasSugerencia.nombre_encargado,
        puesto_encargado: quejasSugerencia.puesto_encargado,
        fecha_encargado: quejasSugerencia.fecha_encargado,
        notas: quejasSugerencia.notas,
        procede: quejasSugerencia.procede,
        recurrente: quejasSugerencia.recurrente,
        editor: quejasSugerencia.editor
      },
      {headers: httpHeaders },
    ).pipe(map(data => data)); 
}

//Crea una quejasSugerencia Operador
  crearQuejasSugerenciasOp(quejasSugerencia: QuejasSugerenciasInterface): Observable<any>{ 
    console.log(quejasSugerencia)
    const url_api = this.domainUrl+'/api/v1/operador/quejasSugerencias';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .post<CitaInterface>(
        url_api, 
        {
          folio: quejasSugerencia.folio,
          tipo: quejasSugerencia.tipo,
          fecha_evento: quejasSugerencia.fecha_evento,
          hora_evento: quejasSugerencia.hora_evento,
          sucursal: quejasSugerencia.sucursal,
          tipo_recibo: quejasSugerencia.tipo_recibo,
          nombre_presentante: quejasSugerencia.nombre_presentante,
          telefono: quejasSugerencia.telefono,
          email: quejasSugerencia.email,
          descripcion: quejasSugerencia.descripcion,
          nombre_personal: quejasSugerencia.nombre_personal,
          puesto_personal: quejasSugerencia.puesto_personal,
          fecha_recibo: quejasSugerencia.fecha_recibo,
          notas: quejasSugerencia.notas,
          Paciente: quejasSugerencia.Paciente,
          creador: quejasSugerencia.creador,
          editor: quejasSugerencia.editor
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }


  //Consulta citas Externas Operador
  consultarCitasExternasOp(): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/operador/citaSucursal?tipo=EXTERNA&page_size=9999'
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  
  //Consulta un comentario Operador
  consultarComentarioOp(id): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/operador/comentarios/'+id;
    console.log(url_api);
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  
  //Consulta todos los comentario Operador
  consultarComentariosOp(): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/operador/comentarios?page_size=9999'
    console.log(url_api);
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Editar comentario operador
  editarComentariosOp(comentario: ComentariosInterface){
    const url_api = this.domainUrl+'/api/v1/operador/comentarios/'+comentario.id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<CitaInterface>(
        url_api, 
        {
          notas: comentario.notas,
          editor: comentario.editor
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

  //Crea una Comentario Operador
    crearComentarioOp(comentario: ComentariosInterface): Observable<any>{ 
      const url_api = this.domainUrl+'/api/v1/operador/comentarios';
      var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
      return this.http
        .post<CitaInterface>(
          url_api, 
          {
            sucursal: comentario.sucursal,
            fecha: comentario.fecha,
            hora: comentario.hora,
            num_recibo: comentario.num_recibo,
            nombre_paciente: comentario.nombre_paciente,
            telefono: comentario.telefono,
            email: comentario.email,
            estudios_solicitados: comentario.estudios_solicitados,
            como_entero: comentario.como_entero,
            tipo_opinion: comentario.tipo_opinion,
            nombre_personal: comentario.nombre_personal,
            comentarios: comentario.comentarios,
            notas: comentario.notas,
            Paciente: comentario.Paciente,
            creador: comentario.creador,
            editor: comentario.editor
          },
          {headers: httpHeaders },
        ).pipe(map(data => data)); 
    }


  //Consulta citas Externas Operador
  consultarCitasRembolsoOp(): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/operador/citaSucursal?rembolso=TRUE&page_size=9999'
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta citas Facturaciones Operador
  consultarCitasFacturacionOp(): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/operador/facturacion?page_size=9999'
    console.log(url_api);
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Editar cita de un paciente
  editarFacturaOp(factura: FacturacionInterface){
    const url_api = this.domainUrl+'/api/v1/operador/facturacion/'+factura.id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<CitaInterface>(
        url_api, 
        {
          observaciones : factura.observaciones,
          editor : factura.editor,
          factura_estatus : factura.factura_estatus
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }


    //Crea una factura Operador
    crearFacturaOp(factura: FacturacionInterface): Observable<any>{ 
      const url_api = this.domainUrl+'/api/v1/operador/facturacion';
      var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
      return this.http
        .post<CitaInterface>(
          url_api, 
          {
            nombre: factura.nombre,
            apellido_paterno: factura.apellido_paterno,
            apellido_materno: factura.apellido_materno,
            rfc: factura.rfc,
            cantidad_pagada: factura.cantidad_pagada,
            telefono: factura.telefono,
            email: factura.email,
            cfdi_uso: factura.cfdi_uso,
            forma_pago: factura.forma_pago,
            metodo_pago: factura.metodo_pago,
            descripcion: factura.descripcion,
            nombre_paciente: factura.nombre_paciente,
            num_expediente: factura.num_expediente,
            num_folio: factura.num_folio,
            estudios_realizados: factura.estudios_realizados,
            observaciones: factura.observaciones,
            creador: factura.creador,
            editor: factura.editor,
            factura_estatus: factura.factura_estatus,
            empresa: factura.empresa,
            sucursal: factura.sucursal
          },
          {headers: httpHeaders },
        ).pipe(map(data => data)); 
    }

        //Crea una factura paciente
        crearFactura(factura: FacturacionInterface): Observable<any>{ 
          const url_api = this.domainUrl+'/api/v1/paciente/facturacion';
          var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
          return this.http
            .post<CitaInterface>(
              url_api, 
              {
                nombre: factura.nombre,
                apellido_paterno: factura.apellido_paterno,
                apellido_materno: factura.apellido_materno,
                tipo_rfc: factura.tipo_rfc,
                rfc: factura.rfc,
                impresion: factura.impresion,
                cantidad_pagada: factura.cantidad_pagada,
                email: factura.email,
                estudios_realizados: factura.estudios_realizados,
                nombre_paciente: factura.nombre_paciente,
                metodo_pago: factura.metodo_pago,
                descripcion: factura.descripcion,
                cfdi_uso: factura.cfdi_uso,
                forma_pago: factura.forma_pago,
                creador: factura.creador,
                editor: factura.editor, 
                factura_estatus: factura.factura_estatus,
                Paciente: factura.Paciente
              },
              {headers: httpHeaders },
            ).pipe(map(data => data)); 
        }

  //Consulta citas Abiertas Operador
  consultarCitasAbiertasOp(): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/operador/citaSucursal?tipo=ABIERTA&page_size=9999'
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Actualizar un paciente
  actualizarCitaOp(id, estatus, operador){
    let text =null
    if(estatus==1){
      text = "CERRADA"
    }else if(estatus ==2){
      text = "CANCELADA"
    }else{
      text = null;
    }
    const url_api = this.domainUrl+'/api/v1/operador/citaSucursal/'+id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<CitaInterface>(
        url_api, 
        {
          estatus : text,
          editor : operador
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }


  //Actualizar un paciente
  actualizarCitaMedico(id, estatus, operador){
    let text =null
    if(estatus==1){
      text = "CERRADA"
    }else if(estatus ==2){
      text = "CANCELADA"
    }else{
      text = null;
    }
    console.log(id)
    console.log(estatus)
    console.log(operador)
    const url_api = this.domainUrl+'/api/v1/medico/citaMedico/'+id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<CitaInterface>(
        url_api, 
        {
          estatus : text,
          editor : operador
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
    }
  
  generateNewCharge(source_id : string , amount : number, cvv2, description :string, order_id  , device_session_id: string, name: string, last_name:string ,email:string): Observable<any> {
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    const url_api = this.domainUrl+'/api/v1/paciente/payment/charge';
    return this.http
      .post(
        url_api, 
        {
          source_id : source_id,
          amount : amount ,
          cvv2 : cvv2 ,
          description : description,
          order_id : order_id,
          device_session_id: device_session_id,
          name : name,
          last_name: last_name,
          email : email
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

  //Actualizar a ACTIVA una cita de un paciente
  activarCita(id,precioVenta){
    const url_api = this.domainUrl+'/api/v1/paciente/citaSucursal/'+id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<CitaInterface>(
        url_api, 
        {
          estatus : "ACTIVA",
          precioVenta : precioVenta
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

  //Actualizar a ACTIVA una cita de un paciente
  activarCitaPagoPayPal(id: string, order_id){
    const url_api = this.domainUrl+'/api/v1/paciente/citaSucursal/'+id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<CitaInterface>(
        url_api, 
        {
          estatus : "ACTIVA",
          tipo_pago : "PAYPAL",
          id_pago: order_id

        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }


  //Editar cita de un paciente
  editarCitaOp(id, notas, operador){
    console.log(id)
    console.log(notas)
    console.log(operador)
    const url_api = this.domainUrl+'/api/v1/operador/citaSucursal/'+id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<CitaInterface>(
        url_api, 
        {
          notas : notas,
          editor : operador,
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }


  //Editar cita de un paciente
  editarCitaMedico(id, notas, operador){
    console.log(id)
    console.log(notas)
    console.log(operador)
    const url_api = this.domainUrl+'/api/v1/medico/citaMedico/'+id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<CitaInterface>(
        url_api, 
        {
          notas : notas,
          editor : operador
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

  //Editar cita de un paciente
  editarCitaRemOp(id, notas, estatus, rembolso, razon, operador){
    console.log(id)
    console.log(notas)
    console.log(estatus)
    console.log(razon)
    console.log(operador)
    const url_api = this.domainUrl+'/api/v1/operador/citaSucursal/'+id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<CitaInterface>(
        url_api, 
        {
          notas : notas,
          estatus: estatus,
          estatus_rembolso: rembolso,
          razon_rembolso: razon,
          editor : operador
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

  //Editar cita de un paciente
  editarCitaRem(id, rembolso, razon, estatus){
    console.log(id)
    console.log(rembolso)
    console.log(razon)
    console.log(estatus)
    const url_api = this.domainUrl+'/api/v1/paciente/citaSucursal/'+id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<CitaInterface>(
        url_api, 
        {
          estatus_rembolso: rembolso,
          razon_rembolso: razon,
          estatus: estatus
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

  // funcion para reagendar citas
  reagendarCitaOp(cita){
    const url_api = this.domainUrl+'/api/v1/operador/citaSucursal/'+cita.id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<CitaInterface>(
        url_api, 
        {
          editor: cita.editor,
          estatus: cita.estatus,
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }
  
  //Crea una cita
  crearCita(cita: CitaInterface): Observable<any>{ 
    console.log("creando cita +++++")
    const url_api = this.domainUrl+'/api/v1/paciente/citaSucursal';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .post<CitaInterface>(
        url_api, 
        {
          estatus: cita.estatus,
          fecha_cita: cita.fecha_cita, 
          hora_inicio: cita.hora_inicio,
          hora_final: cita.hora_final,
          precioVenta: cita.precioVenta,
          tipo_cita: cita.tipo_cita,
          id_sala: cita.id_sala,
          prueba: cita.prueba,
          notas : cita.notas,
          promocion: cita.promocion,
          nombre_promocion: cita.nombre_promocion,
          categoria: cita.categoria,
          otro_parentesco_paciente: cita.otro_parentesco_paciente,
          otro_nombre_paciente: cita.otro_nombre_paciente,
          otro_fecha_nacimento: cita.otro_fecha_nacimento,
          costoSucursal: cita.costoSucursal,
          Sucursal: cita.Sucursal
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

    //Crea una cita
    crearCitaSucursalMedico(cita: CitaInterface): Observable<any>{ 
      console.log("creando cita +++++")
      console.log(cita)
      const url_api = this.domainUrl+'/api/v1/medico/citaSucursalMedico';
      var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
      return this.http
        .post<CitaInterface>(
          url_api, 
          {
            estatus: cita.estatus,
            fecha_cita: cita.fecha_cita, 
            hora_inicio: cita.hora_inicio,
            hora_final: cita.hora_final,
            precioVenta: cita.precioVenta,
            tipo_cita: cita.tipo_cita,
            id_sala: cita.id_sala,
            prueba: cita.prueba,
            categoria: cita.categoria,
            costoSucursal: cita.costoSucursal,
            creador: cita.creador,
            editor: cita.editor,
            Sucursal: cita.Sucursal,
            Paciente: cita.Paciente
          },
          {headers: httpHeaders },
        ).pipe(map(data => data)); 
    }

  //Crea una lista de citas (promociones)
  crearCitaList(cita: CitaInterface, promocion: PromocionInterface): Observable<any>{ 
    var array ="?id="+promocion.Catalogo[0];
    var id;
    var i, n = promocion.Catalogo.length;
    for (i = 0; i < n; ++i) {
      if(i>0){
        array=array+"&id="+promocion.Catalogo[i];
      }
    }
    console.log(array)
    const url_api = this.domainUrl+'/api/v1/paciente/citaSucursalList'+array;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .post<CitaInterface>(
        url_api, 
        {
          estatus: cita.estatus,
          fecha_cita: cita.fecha_cita, 
          hora_inicio: cita.hora_inicio,
          hora_final: cita.hora_final,
          precioVenta: cita.precioVenta,
          tipo_cita: cita.tipo_cita,
          id_sala: cita.id_sala,
          prueba: cita.prueba,
          notas : cita.notas,
          promocion: cita.promocion,
          nombre_promocion: cita.nombre_promocion,
          otro_parentesco_paciente: cita.otro_parentesco_paciente,
          otro_nombre_paciente: cita.otro_nombre_paciente,
          otro_fecha_nacimento: cita.otro_fecha_nacimento,
          categoria: cita.categoria,
          Sucursal: cita.Sucursal
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

  //Crea una cita
  crearCitaOp(cita: CitaInterface): Observable<any>{ 
    let idPaciente;
    if(cita.Paciente){
      idPaciente = cita.Paciente.id;
    }else{
      idPaciente = null;
    }
    const url_api = this.domainUrl+'/api/v1/operador/citaSucursal';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    console.log(cita)
    return this.http
      .post<CitaInterface>(
        url_api, 
        {
          fecha_cita: cita.fecha_cita, 
          hora_inicio: cita.hora_inicio,
          hora_final: cita.hora_final,
          tipo_cita: cita.tipo_cita,
          estatus: cita.estatus,
          id_sala: cita.id_sala,
          prueba: cita.prueba,
          categoria: cita.categoria,
          precioVenta: cita.precioVenta,
          notas : cita.notas,
          tipo_pago : cita.tipo_pago,
          id_pago: cita.id_pago,
          otro_parentesco_paciente: cita.otro_parentesco_paciente,
          otro_nombre_paciente: cita.otro_nombre_paciente,
          otro_fecha_nacimento: cita.otro_fecha_nacimento,
          creador: cita.creador,
          editor: cita.editor,
          Sucursal: cita.Sucursal,
          Paciente: idPaciente
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }



  //Elimina una cita
  eliminarCita(citaId): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/paciente/citaSucursal/'+citaId;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .delete
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta todas las citas de un paciente
  consultarPacienteCitas(): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/paciente/citaSucursal?page_size=9999'
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Cambiar Contraseña
  cambiarContrasena(email: string): Observable<any>{
    const url_api = 'https://semindigital.com:8090/rest-auth/password/reset/';
    return this.http
      .post<UserInterface>(
        url_api, 
        {
          email: email
        }
      ).pipe(map(data => data)); 
  }

  //Consulta datos de un paciente
  consultarPaciente(pacienteId): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/paciente/paciente/'+pacienteId;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta datos de un paciente mediante el token de TablaPermisos
  consultarPacienteExterno(pacienteId, tokenId, token): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/externo/paciente/'+pacienteId+'?token='+token+'&id='+tokenId;
    var httpHeaders = {};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta la tabla de permisos de un medico
  consultarTablaPermisosMedico(): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/medico/tablaPermisos?page_size=9999';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta la tabla de permisos de un medico
  importarTablaPermisosMedico(email): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/admin/tablaPermisosUpdate?email='+email;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }



  //Consulta datos de todos los pacientes de un medico
  consultarPacientesMedico(): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/medico/paciente?page_size=9999';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }
  

  //Consulta datos de un Medico
  consultarMedico(medicoId): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/medico/medico/'+medicoId;
    console.log(url_api)
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }
  
    //Consulta datos de un Medico
    consultarMedicoAdmin(medicoId): Observable<any>{
      const url_api = this.domainUrl+'/api/v1/admin/medico/'+medicoId;
      console.log(url_api)
      var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
      return this.http
      .get
      (url_api,
        {headers: httpHeaders },
        ).pipe(map(data => data))
    }
  
    //Consulta datos de un Medico 
    consultarMedicosAdmin(tipoSeleccionado): Observable<any>{
      if(tipoSeleccionado==0 || tipoSeleccionado=='Null'){
        tipoSeleccionado='All'
      }
      const url_api = this.domainUrl+'/api/v1/admin/medico?tipo='+tipoSeleccionado+'&page_size=9999';
      console.log(url_api)
      var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
      return this.http
      .get
      (url_api,
        {headers: httpHeaders },
        ).pipe(map(data => data))
    }
    
  //Consulta datos de un Administrador
  consultarAdministrador(pacienteId): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/admin/admin/'+pacienteId;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }
  
  //Consulta datos de un paciente
  consultarPacientesOp(): Observable<any>{ 
    const url_api = this.domainUrl+'/api/v1/operador/paciente?page_size=99999';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta datos de un paciente
  consultarPacienteOp(id): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/operador/paciente/'+id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Actualizar un paciente
  actualizarPaciente(paciente){
    const url_api = this.domainUrl+'/api/v1/paciente/paciente/'+paciente.id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<PacienteInterface>(
        url_api, 
        {
          sexo : paciente.sexo,
          fecha_nacimiento : paciente.fecha_nacimiento,
          tipo_sangre : paciente.tipo_sangre,
          curp : paciente.curp,
          entidad_nacimiento : paciente.entidad_nacimiento,
          entidad : paciente.entidad,
          nivel_socioeconomico : paciente.nivel_socioeconomico,
          tipo_vivienda : paciente.tipo_vivienda,
          discapacidad : paciente.discapacidad,
          grupoEtnico : paciente.grupoEtnico,
          religion : paciente.religion,
          ocupacion : paciente.ocupacion,
          tipoDomicilio : paciente.tipoDomicilio,
          calle : paciente.calle,
          colonia : paciente.colonia,
          num_interior : paciente.num_interior,
          num_exterior : paciente.num_exterior,
          cp : paciente.cp,
          municipio : paciente.municipio,
          localidad : paciente.localidad,
          estado : paciente.estado,
          telefonoCasa : paciente.telefonoCasa,
          telefonoOficina : paciente.telefonoOficina,
          telefonoCelular : paciente.telefonoCelular,
          email : paciente.email,
          numExpediente : paciente.numExpediente,
          fecha_registro : paciente.fecha_registro
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

  //Actualizar un paciente
  actualizarPacienteOp(paciente){
    const url_api = this.domainUrl+'/api/v1/operador/paciente/'+paciente.id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<PacienteInterface>(
        url_api, 
        {
          nombre : paciente.nombre,
          apellido_paterno : paciente.apellido_paterno,
          apellido_materno : paciente.apellido_materno,
          sexo : paciente.sexo,
          fecha_nacimiento : paciente.fecha_nacimiento,
          tipo_sangre : paciente.tipo_sangre,
          curp : paciente.curp,
          entidad_nacimiento : paciente.entidad_nacimiento,
          entidad : paciente.entidad,
          nivel_socioeconomico : paciente.nivel_socioeconomico,
          tipo_vivienda : paciente.tipo_vivienda,
          discapacidad : paciente.discapacidad,
          grupoEtnico : paciente.grupoEtnico,
          religion : paciente.religion,
          ocupacion : paciente.ocupacion,
          tipoDomicilio : paciente.tipoDomicilio,
          calle : paciente.calle,
          colonia : paciente.colonia,
          num_interior : paciente.num_interior,
          num_exterior : paciente.num_exterior,
          cp : paciente.cp,
          municipio : paciente.municipio,
          localidad : paciente.localidad,
          estado : paciente.estado,
          telefonoCasa : paciente.telefonoCasa,
          telefonoOficina : paciente.telefonoOficina,
          telefonoCelular : paciente.telefonoCelular,
          email : paciente.email,
          fecha_registro : paciente.fecha_registro
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }


  //front
  //Consulta paciente mediante nombre
  consultarPacienteSearchOp(queryBuscador): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/operador/pacienteSearch?queryBuscador='+queryBuscador+'&page_size=9999';
    console.log(url_api)
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }


    //Actualizar un paciente
    actualizarPacienteMonederoOp(paciente, monedero,editor){
      const url_api = this.domainUrl+'/api/v1/operador/paciente/'+paciente;
      var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
      return this.http
        .put<PacienteInterface>(
          url_api, 
          {
            monedero : monedero,
            editor: editor
            
          },
          {headers: httpHeaders },
        ).pipe(map(data => data)); 
    }

  //Actualizar un paciente
  actualizarPacienteMedico(paciente){
    const url_api = this.domainUrl+'/api/v1/medico/paciente/'+paciente.id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<PacienteInterface>(
        url_api, 
        {
          nombre : paciente.nombre,
          apellido_paterno : paciente.apellido_paterno,
          apellido_materno : paciente.apellido_materno,
          sexo : paciente.sexo,
          fecha_nacimiento : paciente.fecha_nacimiento,
          tipo_sangre : paciente.tipo_sangre,
          curp : paciente.curp,
          entidad_nacimiento : paciente.entidad_nacimiento,
          entidad : paciente.entidad,
          nivel_socioeconomico : paciente.nivel_socioeconomico,
          tipo_vivienda : paciente.tipo_vivienda,
          discapacidad : paciente.discapacidad,
          grupoEtnico : paciente.grupoEtnico,
          religion : paciente.religion,
          ocupacion : paciente.ocupacion,
          tipoDomicilio : paciente.tipoDomicilio,
          calle : paciente.calle,
          colonia : paciente.colonia,
          num_interior : paciente.num_interior,
          num_exterior : paciente.num_exterior,
          cp : paciente.cp,
          municipio : paciente.municipio,
          localidad : paciente.localidad,
          estado : paciente.estado,
          telefonoCasa : paciente.telefonoCasa,
          telefonoOficina : paciente.telefonoOficina,
          telefonoCelular : paciente.telefonoCelular,
          email : paciente.email,
          numExpediente : paciente.numExpediente,
          fecha_registro : paciente.fecha_registro
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

  //Crea un paciente 
  crearPaciente(nombre: string, primer_apellido: string, segundo_apellido: string, fecha_nacimiento: string, sexo: string, email : string,telefono : string): Observable<any>{
    let fecha = new Date(Date.now());
    let mes;
    fecha.setMonth(fecha.getMonth() );
    mes = fecha.getMonth()+1;
    let fechaFormato = fecha.getFullYear()+"-"+mes+"-"+fecha.getDate()
    console.log(fecha)
    console.log(fechaFormato)
    const url_api = this.domainUrl+'/api/v1/paciente/paciente';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .post<PacienteInterface>(
        url_api, 
        {
          nombre: nombre,
          apellido_paterno: primer_apellido,
          apellido_materno: segundo_apellido,
          email: email,
          sexo: sexo,
          fecha_nacimiento: fecha_nacimiento,
          telefonoCelular: telefono,
          fecha_registro : fechaFormato
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }


  //Crea un Medico
  crearMedico(medico: UserInterface): Observable<any>{ 
    let fecha = new Date(Date.now());
    let mes;
    fecha.setMonth(fecha.getMonth() );
    mes = fecha.getMonth()+1;
    let fechaFormato = fecha.getFullYear()+"-"+mes+"-"+fecha.getDate()
    console.log(fecha)
    console.log(fechaFormato)
    const url_api = this.domainUrl+'/api/v1/medico/medico';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .post<PacienteInterface>(
        url_api, 
        {
          nombre: medico.first_name,
          apellido_paterno: medico.first_last_name,
          apellido_materno: medico.second_last_name,
          email: medico.email,
          sexo: medico.sexo,
          fecha_nacimiento: medico.fecha_nacimiento,
          telefono: medico.telefono,
          fecha_registro : fechaFormato,
          cedula : medico.cedula,
          especialidad : medico.especialidad,
          estado : medico.estado,
          caducidad : medico.caducidad,
          room : medico.room
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }
  
  //Otorga permisos de edicion a un paciente
  permisoPaciente(id: string): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/paciente/paciente/'+id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<PacienteInterface>(
        url_api, 
        {
        },
        {headers: httpHeaders },
      ).pipe(map(data => data));     
  }

  //Otorga permisos de edicion a un paciente
  actualizarPerfilPaciente(id_sem: string): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/general/perfiles/';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<PacienteInterface>(
        url_api, 
        {
          id_sem: id_sem, 
          tipo: "Paciente"
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }


  //Otorga permisos de edicion a un medico
  actualizarPerfilMedico(id_sem: string): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/general/perfiles/';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<MedicoInterface>(
        url_api, 
        {
          id_sem: id_sem, 
          tipo: "Medico"
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }
 
  //Consulta datos de un operador
  consultarOperador(operadorId): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/operador/operador/'+operadorId;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta datos de las promociones
  consultarPromociones(): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/paciente/promocion';
    return this.http
    .get
    (url_api,
      ).pipe(map(data => data))
  }


  //Consulta datos de las promociones Token
  consultarPromoTicket(nombre): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/buscar/promocionTicket/?nombre='+nombre;
    console.log(url_api)
    return this.http
    .get
    (url_api,
      ).pipe(map(data => data))
  }

  //Resta uno a la promocion por ticket
  restarPromoTicket(id): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/restar/promocionTicket/?id='+id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta datos de todos los estudios 
  consultarResultados(): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/paciente/estudio?page_size=9999';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta datos de un estudio
  consultarResultado(id): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/paciente/estudio'+id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta datos de todos los estudios, es necesario dar el id del paciente "Operador"
  consultarResultadosOp(id): Observable<any>{
    console.log(id)
    const url_api = this.domainUrl+'/api/v1/operador/estudio?paciente='+id+'&page_size=9999';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }


  //Consulta datos de todos los estudios, es necesario dar el id del paciente "Operador"
  consultarResultadosExterno(id, tokenId, token): Observable<any>{
    console.log(id)
    const url_api = this.domainUrl+'/api/v1/externo/estudio?paciente='+id+'&token='+token+'&id='+tokenId+'&page_size=9999';
    var httpHeaders = {};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta datos de un estudio "Operador"
  consultarResultadoOp(id): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/operador/estudio'+id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

    //Consulta datos de todos los estudios, es necesario dar el id del paciente "Medico"
    consultarHistoriasClinicasPaciente(id): Observable<any>{
      const url_api = this.domainUrl+'/api/v1/paciente/historiaClinica?paciente='+id+'&page_size=9999';
      var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
      return this.http
      .get
      (url_api,
        {headers: httpHeaders },
        ).pipe(map(data => data))
    }

  //Consulta datos de todos los estudios, es necesario dar el id del paciente "Medico"
  consultarHistoriasClinicasMedico(id): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/medico/historiaClinica?paciente='+id+'&page_size=9999';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  } 

  //Consulta datos de todos los estudios, es necesario dar el id del paciente "Medico"
  consultarHistoriasClinicasOp(id): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/operador/historiaClinica?paciente='+id+'&page_size=9999';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta datos de todos los estudios, es necesario dar el id del paciente "Medico"
  consultarHistoriasClinicasExterno(id, tokenId, token): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/externo/historiaClinica?paciente='+id+'&token='+token+'&id='+tokenId+'&page_size=9999';
    var httpHeaders = {};
    return this.http 
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Crea Una tabla de permisos nueva
  crearHistoriaMed(historiaClinica: HistoriaClinicaInterface): Observable<any>{ 
    const url_api = this.domainUrl+'/api/v1/medico/historiaClinica';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .post<HistoriaClinicaInterface>(
        url_api, 
        {
          Paciente: historiaClinica.Paciente,
          calle: historiaClinica.calle,
          colonia: historiaClinica.colonia,
          cp: historiaClinica.cp,
          email: historiaClinica.email,
          entidad_nacimiento: historiaClinica.entidad_nacimiento,
          estado: historiaClinica.estado,
          estadoCivil: historiaClinica.estadoCivil,
          estadoSalud: historiaClinica.estadoSalud,
          frecuenciaCardiaca: historiaClinica.frecuenciaCardiaca,
          frecuenciaRespiratoria: historiaClinica.frecuenciaRespiratoria,
          hijos: historiaClinica.hijos,
          indiceMasaCorporal: historiaClinica.indiceMasaCorporal,
          informador: historiaClinica.informador,
          localidad: historiaClinica.localidad,
          maxGradoEstudios: historiaClinica.maxGradoEstudios,
          municipio: historiaClinica.municipio,
          numHijos: historiaClinica.numHijos,
          num_exterior: historiaClinica.num_exterior,
          num_interior: historiaClinica.num_interior,
          ocupacion: historiaClinica.ocupacion,
          peso: historiaClinica.peso,
          religion: historiaClinica.religion,
          sexo: historiaClinica.sexo,
          sistemaDigestivo: historiaClinica.sistemaDigestivo,
          sistemaMusculoEsqueletico: historiaClinica.sistemaMusculoEsqueletico,
          sistemaNeurologico: historiaClinica.sistemaNeurologico,
          sistemaReproductor: historiaClinica.sistemaReproductor,
          sistemaRespiratorio: historiaClinica.sistemaRespiratorio,
          sistemaTegumentario: historiaClinica.sistemaTegumentario,
          sistemaUrinario: historiaClinica.sistemaUrinario,
          sistemasSentidos: historiaClinica.sistemasSentidos,
          talla: historiaClinica.talla,
          telefonoCasa: historiaClinica.telefonoCasa,
          telefonoCelular: historiaClinica.telefonoCelular,
          telefonoOficina: historiaClinica.telefonoOficina,
          temperatura: historiaClinica.temperatura,
          tensionArterialDiastole: historiaClinica.tensionArterialDiastole,
          tensionArterialSistole: historiaClinica.tensionArterialSistole,
          tipoInterrogatorio: historiaClinica.tipoInterrogatorio,
          antecedentesFamiliares: historiaClinica.antecedentesFamiliares,
          antecedentesPersonalesNoPatologicos: historiaClinica.antecedentesPersonalesNoPatologicos,
          antecedentesPersonalesPatologicos: historiaClinica.antecedentesPersonalesPatologicos,
          procedimientoActual: historiaClinica.procedimientoActual,
          auxiliaresDiagnostico:historiaClinica.auxiliaresDiagnostico,
          creador: historiaClinica.creador,
          editor:historiaClinica.editor
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

  

  //Consulta datos de todos los estudios, es necesario dar el id del paciente "Medico"
  consultarNotasPaciente(categoria,fecha): Observable<any>{
    console.log(categoria)
    if(categoria==0 || categoria=='Null'){
      categoria='All'
    }
    if(fecha==0 || fecha=='Null'){
      fecha='All'
    }
    var url_api = this.domainUrl+'/api/v1/paciente/consulta?fecha='+fecha+'&especialidad='+categoria+'&page_size=9999';
    console.log(url_api)
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta datos de todos los estudios, es necesario dar el token y su id de tabla
  consultarNotasPacienteExterno(categoria,fecha,pacienteId, tokenId, token): Observable<any>{
    console.log(categoria)
    if(categoria==0 || categoria=='Null'){
      categoria='All'
    }
    if(fecha==0 || fecha=='Null'){
      fecha='All'
    }
    var url_api = this.domainUrl+'/api/v1/externo/consulta?fecha='+fecha+'&especialidad='+categoria+'&paciente='+pacienteId+'&token='+token+'&id='+tokenId+'&page_size=9999';
    console.log(url_api)
    var httpHeaders = {};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta datos de todos los estudios, es necesario dar el id del paciente "Medico"
  consultarNotasMedico(id,categoria,fecha,medico): Observable<any>{
    console.log(categoria)
    if(categoria==0 || categoria=='Null'){
      categoria='All'
    }
    if(fecha==0 || fecha=='Null'){
      fecha='All'
    }
    var url_api = this.domainUrl+'/api/v1/medico/consulta?paciente='+id+'&fecha='+fecha+'&especialidad='+categoria+'&page_size=9999';
    if(medico==2){
     url_api = this.domainUrl+'/api/v1/medico/consulta?paciente='+id+'&fecha='+fecha+'&especialidad='+categoria+'&medico=True&page_size=9999';
     
    }
    console.log(url_api)
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }


  //registra las consultas del paciente
  almacenarConsulta(consulta: string, origen: string): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/paciente/query';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .post<QueryInterface>(
        url_api, 
        {
          consulta: consulta,
          origen: origen
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

    //registra las consultas del paciente
    almacenarLogin(paciente: string, origen: string): Observable<any>{
      const url_api = this.domainUrl+'/api/v1/paciente/login';
      var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
      return this.http
        .post<LoginInterface>(
          url_api, 
          {
            Paciente: paciente,
            origen: origen
          },
          {headers: httpHeaders },
        ).pipe(map(data => data)); 
    }

    //Crea Una tabla de permisos nueva
    crearNotaMed(nota: NotaInterface): Observable<any>{ 
      const url_api = this.domainUrl+'/api/v1/medico/consulta';
      var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
      return this.http
        .post<NotaInterface>(
          url_api, 
          {
            Paciente: nota.Paciente,
            Medico: nota.Medico, 
            analisis: nota.analisis,
            clinicos: nota.clinicos,
            especialidad: nota.especialidad,
            frecuenciaCardiaca: nota.frecuenciaCardiaca,
            frecuenciaRespiratoria: nota.frecuenciaRespiratoria,
            impresionDiagnostica: nota.impresionDiagnostica,
            indiceMasaCorporal: nota.indiceMasaCorporal,
            manejoRecomendaciones: nota.manejoRecomendaciones,
            notaCuatro: nota.notaCuatro,
            notaDos: nota.notaDos,
            notaEvolucion: nota.notaEvolucion,
            notaTres: nota.notaTres,
            notaUno: nota.notaUno,
            objetivo: nota.objetivo,
            peso: nota.peso,
            plan: nota.plan,
            sexo: nota.sexo,
            subjetivo: nota.subjetivo,
            talla: nota.talla,
            temperatura: nota.temperatura,
            tensionArterialDiastole: nota.tensionArterialDiastole,
            tensionArterialSistole: nota.tensionArterialSistole,
            tituloCuatro: nota.tituloCuatro,
            tituloDos: nota.tituloDos,
            tituloTres: nota.tituloTres,
            tituloUno: nota.tituloUno,
            creador: nota.creador,
            editor: nota.editor
          },
          {headers: httpHeaders },
        ).pipe(map(data => data)); 
    }


  //Consulta datos de todos los estudios, es necesario dar el id del paciente "Medico"
  consultarResultadosMedico(id): Observable<any>{
    console.log(id)
    const url_api = this.domainUrl+'/api/v1/medico/estudio?paciente='+id+'&page_size=9999';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta datos de un estudio "Medico"
  consultarResultadoMedico(id): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/medico/estudio'+id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }


  //Editar estudio de un paciente "Operador"
  editarResultadoOp(id, tipo, realizacion, notas, operador){
    const url_api = this.domainUrl+'/api/v1/operador/estudio/'+id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<ResultadoInterface>(
        url_api, 
        {
          tipoEstudio : tipo,
          fecha_realizacion: realizacion,
          notasEstudio : notas,
          editor : operador
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

  //crear estudio de un paciente "Operador"
  crearResultadoEmpresaOp(formData): Observable<any>{
    console.log("api")
    console.log(formData)
    const url_api = this.domainUrl+'/api/v1/operador/estudioEmpresa';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .post<ResultadoInterface>(
        url_api, 
        formData,
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

  //crear estudio de un paciente "Operador"
  crearResultadoOp(formData): Observable<any>{ 
    const url_api = this.domainUrl+'/api/v1/operador/estudio';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .post<ResultadoInterface>(
        url_api, 
        formData,
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

    //crear estudio de un paciente "Operador"
    crearResultadoMed(formData): Observable<any>{ 
      const url_api = this.domainUrl+'/api/v1/medico/estudio';
      var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
      return this.http
        .post<ResultadoInterface>(
          url_api, 
          formData,
          {headers: httpHeaders },
        ).pipe(map(data => data)); 
    }
  
  //subir imagen medico
  actualizarMedicoImagen(formData, id): Observable<any>{ 
    const url_api = this.domainUrl+'/api/v1/medico/medico/'+id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<MedicoInterface>(
        url_api, 
        formData,
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

  //subir imagen medico
  actualizarMedicoImagenAdmin(formData, id): Observable<any>{ 
    const url_api = this.domainUrl+'/api/v1/admin/medico/'+id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<MedicoInterface>(
        url_api, 
        formData,
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

  //subir imagen paciente
  actualizarPacienteImagen(formData, id): Observable<any>{ 
    const url_api = this.domainUrl+'/api/v1/paciente/paciente/'+id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<PacienteInterface>(
        url_api, 
        formData,
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }


  //Crea Una tabla de permisos nueva
  crearTablaPermisoPac(tablaPermisos: TablaPermisosInterface): Observable<any>{ 
    const url_api = this.domainUrl+'/api/v1/paciente/tablaPermisos';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .post<TablaPermisosInterface>(
        url_api, 
        {
          token: tablaPermisos.token,
          caducidad: tablaPermisos.caducidad,
          email: tablaPermisos.email,
          tipo: tablaPermisos.tipo,
          Medico: tablaPermisos.Medico,
          Paciente: tablaPermisos.Paciente,
          creador: tablaPermisos.creador,
          editor: tablaPermisos.editor
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }


  consultarTablaPermisoPac(): Observable<any> {
    const url_api = this.domainUrl+'/api/v1/paciente/tablaPermisos';
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .get<TablaPermisosInterface>(
        url_api,
        {
          headers: httpHeaders 
        },
      ).pipe(map(data => data));
  }

  //Editar cita de un paciente
  editarTablaPermisoPac(tabla: TablaPermisosInterface, operador){
    const url_api = this.domainUrl+'/api/v1/paciente/tablaPermisos/'+tabla.id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<CitaInterface>(
        url_api, 
        {
          estatus : "INACTIVO",
          editor : operador
          
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

  consultarTablaPermisoOp(id, tipo): Observable<any> {
    const url_api = this.domainUrl+'/api/v1/operador/tablaPermisos?id='+id+'&tipo='+tipo+'&page_size=9999';;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .get<TablaPermisosInterface>(
        url_api,
        {
          headers: httpHeaders 
        },
      ).pipe(map(data => data));
  }


  //Editar cita de un paciente
  editarTablaPermisoOp(tabla: TablaPermisosInterface, operador){
    const url_api = this.domainUrl+'/api/v1/operador/tablaPermisos/'+tabla.id;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .put<CitaInterface>(
        url_api, 
        {
          estatus : "INACTIVO",
          editor : operador
          
        },
        {headers: httpHeaders },
      ).pipe(map(data => data)); 
  }

  //Crea Una tabla de permisos nueva
    crearTablaPermisoOp(tablaPermisos: TablaPermisosInterface): Observable<any>{ 
      const url_api = this.domainUrl+'/api/v1/operador/tablaPermisos';
      var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
      return this.http
        .post<TablaPermisosInterface>(
          url_api, 
          {
            token: tablaPermisos.token,
            caducidad: tablaPermisos.caducidad,
            email: tablaPermisos.email,
            tipo: tablaPermisos.tipo,
            Medico: tablaPermisos.Medico,
            Paciente: tablaPermisos.Paciente,
            creador: tablaPermisos.creador,
            editor: tablaPermisos.editor
          },
          {headers: httpHeaders },
        ).pipe(map(data => data)); 
    }


  //Consulta estudio empresa Operador
  consultarEstudioEmpresas(): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/operador/estudioEmpresa?page_size=9999'
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

  //Consulta estudios empresa Operador
  consultarEstudioEmpresa(id): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/operador/estudioEmpresa/'+id;
    console.log(url_api)
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }


  //Consulta empresas Operador
  consultarEmpresasOp(): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/operador/empresa?page_size=9999'
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }
  

  // Consultar informacion de las encuestas
  consultarEncuestas(idSucursal, idEstudio): Observable<any> {
    const url_api = this.domainUrl+`/api/v1/admin/encuesta/primeraEncuesta/${idSucursal}/${idEstudio}`;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
      .get<ResultadoInterface>(
        url_api,
        {
          headers: httpHeaders 
        },
      ).pipe(map(data => data));
  }

  // Enviar encuesta
  crearEncuesta(preguntaUno:string, preguntaDos:string, preguntaTres:string) {
    const url_api = this.domainUrl+'/api/v1/admin/encuesta/primeraEncuesta';
    return this.http.post<EncuestaInterface>(
        url_api, 
        {
          preguntaUno,
          preguntaDos,
          preguntaTres
        },
        {
          headers: this.headers
        }
      ).pipe(map(data => data));
  }

  // Obtener enfermedades CIE10
  consultarEnfermedades(query: string): Observable<any>{
    const url_api = this.domainUrl+`/api/v1/buscar/cie10/nombre?enfermedad=${query}`;
    return this.http.get(url_api).pipe(map(data => data))
  }

  // Consulta los datos de un Medico mediante su correo
  consultarEmailMedico(email: string): Observable<any>{
    const url_api = this.domainUrl+`/api/v1/buscar/medico-email?email=${email}`;
    console.log(url_api)
    return this.http.get(url_api).pipe(map(data => data))
  }

  // Consulta los datos de un Medico mediante su correo
  consultarEmailPaciente(email: string): Observable<any>{
    const url_api = this.domainUrl+`/api/v1/buscar/paciente-email?email=${email}`;
    console.log(url_api)
    return this.http.get(url_api).pipe(map(data => data))
  }

  //Consulta todas  llamadas realizadas
  consultarCallOp(): Observable<any>{
    const url_api = this.domainUrl+'/api/v1/operador/call?page_size=9999'
    console.log(url_api);
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
    return this.http
    .get
    (url_api,
      {headers: httpHeaders },
      ).pipe(map(data => data))
  }

    //Editar una llamada telefonica
    editarCallOp(call: CallInterface){
      const url_api = this.domainUrl+'/api/v1/operador/facturacion/'+call.id;
      var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
      return this.http
        .put<CitaInterface>(
          url_api, 
          {
            tipo: call.tipo,
            telefono: call.telefono,
            interes: call.interes,
            nombre: call.nombre,
            apellido_paterno: call.apellido_paterno,
            apellido_materno: call.apellido_materno,
            email: call.email,
            fecha_nacimiento: call.fecha_nacimiento,
            experiencia: call.experiencia,
            creador: call.creador,
            editor: call.editor
          },
          {headers: httpHeaders },
        ).pipe(map(data => data)); 
    }
 
    //Crea una llamada telefonica
    crearCallOp(call: CallInterface): Observable<any>{ 
      console.log(call)
      const url_api = this.domainUrl+'/api/v1/operador/call';
      var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};
      return this.http
        .post<CitaInterface>(
          url_api, 
          {
            tipo: call.tipo,
            telefono: call.telefono,
            interes: call.interes,
            nombre: call.nombre,
            apellido_paterno: call.apellido_paterno,
            apellido_materno: call.apellido_materno,
            email: call.email,
            fecha_nacimiento: call.fecha_nacimiento,
            experiencia: call.experiencia,
            creador: call.creador,
            editor: call.editor
          },
          {headers: httpHeaders },
        ).pipe(map(data => data)); 
    }

  // Registrar pagos con Paypal
  registarPagoPaypal(payment_id: string, order_id) {
    const url_api = this.domainUrl + '/api/v1/paciente/payment/paypalCharge';
    //const url_api = `//semindigital.com:8001/api/v1/paciente/payment/paypalCharge`;
    var httpHeaders = {
      Authorization: "Token " + localStorage.getItem("accessToken"),
    };
    return this.http
      .post(
        url_api,
        {
          payment_id: payment_id,
          order_id: order_id,
        },
        {
          headers: httpHeaders,
        }
      )
      .pipe(map((data) => data));
  }


  // Registrar pagos con Stripe
  registrarPagoStripe(token: string, amount: number, order_id) {
    const url_api = this.domainUrl + `/api/v1/paciente/payment/stripeCharge`;
    var httpHeaders = {
      Authorization: "Token " + localStorage.getItem("accessToken"),
    };
    console.log(order_id)
    return this.http
      .post(
        url_api,
        {
          token,
          amount,
          order_id,
        },
        {
          headers: httpHeaders,
        }
      )
      .pipe(map((data) => data));
  }

  // -----------------------Start-----------------------------

    // Consultar pacientes con estudios DICOM
    consultarPacientesDicom(page: number, userId: number= 0){
      let url_api = this.testUrl + `/api/v1/radiologos/estudios?page=${page}&user_id=${userId}`;
      var httpHeaders = {
        Authorization: "Token " + localStorage.getItem("accessToken"),
      };
  
      return this.http.
        get(
          url_api
          )
        .pipe(map(data => data))
  
    }
  
    // Calular el tiempo que tardara en cargarse los estudios
    calculateDicomTime(dicom_link: string){
      let url_api = this.testUrl + '/api/v1/radiologos/preview';
      var httpHeaders = {
        Authorization: "Token " + localStorage.getItem("accessToken"),
      };
  
      return this.http
        .post(
          url_api,
          {
            dicom_link
          },
          {
            headers: httpHeaders,
          }
        )
        .pipe(map((data) => data));
    }
  
    loadDicomData(instance: any){
      const url_api = this.testUrl + '/api/v1/radiologos/';
      var httpHeaders = {
        Authorization: "Token " + localStorage.getItem("accessToken"),
      };
  
      return this.http
        .post(
          url_api,
          {
            "estudio": instance.estudio,
            "paciente":{
              "email": instance.email,
              "nombre": instance.nombre,
              "apellido_paterno": instance.apellido_paterno,
              "apellido_materno": instance.apellido_materno
            },
            "dicom_link": instance.dicom_link
          },
          {
            headers: httpHeaders,
          }
        )
        .pipe(map((data) => data));
    }

    descargarZip(path: string){
      const url_api = this.testUrl + `/api/v1/radiologos/descargar?folder_url=${path}`;
      window.open(url_api, '_blank');
    } 


    getHistorial(id: any){
      let url_api = this.testUrl + `/api/v1/radiologos/actualizaciones?estudio_dicom=${id}`;
      var httpHeaders = {
        Authorization: "Token " + localStorage.getItem("accessToken"),
      };

      return this.http.
        get(
          url_api
          )
        .pipe(map(data => data))
    }



  cargarInterpretacion(formData, userId){
    let url_api = this.testUrl + `/api/v1/radiologos/interpretacion?userId=${userId}`;
    var httpHeaders = {
      Authorization: "Token " + localStorage.getItem("accessToken"),
    };

      return this.http.post<any>(
        url_api, 
        formData,
        {
          headers: httpHeaders
        }
        );
  }

  cargarMarca(formData, userId){
    let url_api = this.testUrl + `/api/v1/radiologos/imagenologo?user_id=${userId}`;
    var httpHeaders = {
      Authorization: "Token " + localStorage.getItem("accessToken"),
    };

    return this.http.put<any>(
      url_api, 
      formData,
      {
        headers: httpHeaders
      }
      );
  }


  removeInterpretation(userId){
    let url_api = this.testUrl + `/api/v1/radiologos/interpretacion`;
    var httpHeaders = {'Authorization': 'Token '+localStorage.getItem("accessToken")};

    return this.http.put<any>(
      url_api,
      {
        'user_id': userId
      }, 
      {
        headers: httpHeaders
      }
    );
  }
  
  consultarImagenologo(userId){
    let url_api = this.testUrl + `/api/v1/radiologos/imagenologo?user_id=${userId}`;
    var httpHeaders = {
      Authorization: "Token " + localStorage.getItem("accessToken"),
    };
    
    return this.http.get(
      url_api
      )
      .pipe(map(data => data))
    }

  liberarEstudio(estudioId){
    let url_api = this.testUrl + `/api/v1/radiologos/estudios`;
    var httpHeaders = {
      Authorization: "Token " + localStorage.getItem("accessToken"),
    }

    return this.http.post(
        url_api,
        {
          'estudio_id': estudioId
        },
        {
          headers: httpHeaders
        }
    )
  }
  // -----------------------End-----------------------------



  // -------------------- Rehabilitacion Start --------------------

  // Subir documentos
  registroRehabilitacion( datos : any ){
    const url_api = `${this.domainUrl}/api/v1/rehabilitacion/`;
    const httpHeaders = new HttpHeaders({
      Authorization:
        'Token '+localStorage.getItem("accessToken"),
    });
    return this.http.post(url_api, datos, { headers: httpHeaders }).pipe(map(data => data));
  }

  registroRehabilitacionMenor(datos : any){
    const url_api = `${this.domainUrl}/api/v1/rehabilitacion/menor`;
    const httpHeaders = new HttpHeaders({
      Authorization:
        'Token '+localStorage.getItem("accessToken"),
    });
    return this.http.post(url_api, datos, { headers: httpHeaders }).pipe(map(data => data));
  }

  // Login de fisioterapeuta
  consultarFisioterapueta(userId){
    let url_api = `${this.domainUrl}/api/v1/fisio/${userId}`;
    var httpHeaders = {
      Authorization: 
        'Token ' +localStorage.getItem("accessToken"),
    };
    return this.http.get(url_api).pipe(map(data => data))
  }

  // Consultar todos los expedientes de fisioterapia
  consultarExpedientesFisio(){
    let url_api = `${this.domainUrl}/api/v1/registers`;
    var httpHeaders = {
      Authorization: 
        'Token ' +localStorage.getItem("accessToken"),
    };
    return this.http.get(url_api, { headers: httpHeaders }).pipe(map(data => data))
  }

  // Consultar un expediente
  consultarExpedienteFisio(id:any){
    let url_api = `${this.domainUrl}/api/v1/registers/${id}`;
    var httpHeaders = {
      Authorization: 
        'Token ' +localStorage.getItem("accessToken"),
    };
    return this.http.get(url_api, { headers: httpHeaders }).pipe(map(data => data))
  }

  // Cambiar el status del expediente
  editExpediente(id:any, status:string, firmas:string, observaciones:string){
    let url_api = `${this.domainUrl}/api/v1/registers/${id}`;
    let httpHeaders = {
      Authorization: 
        'Token ' +localStorage.getItem("accessToken"),
    };
    return this.http.put(
      url_api,
      {
        'status' : status,
        'numero_firmas' : firmas,
        'observaciones':observaciones
      },
      { 
        headers: httpHeaders 
      }
    ).pipe(map(data => data))
  }

  // Buscar expediente
  searchExp(termino:string){
    let url_api = `${this.domainUrl}/api/v1/search/${termino}`;
    var httpHeaders = {
      Authorization: 
        'Token ' +localStorage.getItem("accessToken"),
    };
    return this.http.get(url_api, { headers: httpHeaders }).pipe(map(data => data))
  }

  //------------------------------ w --------------------------------
  
    /*public IsClientCreditCardExits(companyId: string, token: any) {
      let header = new Headers({ 'Authorization': `Bearer ${token}` });
      const options = new RequestOptions({
         headers: header,
      });
      return this._http.get(this.ApiURL + "api/Subscriptions/IsClientCreditCardExits/" + companyId + "/", options);    
  }*/
}
