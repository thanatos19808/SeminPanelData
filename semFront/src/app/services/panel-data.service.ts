import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})

export class PanelDataService {

  constructor(private http: HttpClient, private AuthService: AuthService) { }

  public domainUrl = "https://semindigital.com:8090"
  public testUrl = "http://semindigital.com:8005"

  //query of petitions
  // "Content-Type": "application/json",
  getQuery(url_api: string) {
    const url = `${this.testUrl}/api/v1/paneldata/${url_api}`;
    const headers: HttpHeaders = new HttpHeaders({
      Authorization:
        'Token ' + localStorage.getItem("accessToken"),
    });
    return this.http.get(url, { headers });
  }

  // query for post
  postQuery(url_api: string, datos: any) {
    const url = `${this.testUrl}/api/v1/paneldata/${url_api}`;
    const headers: HttpHeaders = new HttpHeaders({
      Authorization:
        'Token ' + localStorage.getItem("accessToken"),
    });
    return this.http.post(url, datos, { headers });
  }

  // queri for update data
  putQuery(url_api: string, datos: any) {
    const url = `${this.testUrl}/api/v1/paneldata/${url_api}`;
    const headers: HttpHeaders = new HttpHeaders({
      Authorization:
        'Token ' + localStorage.getItem("accessToken"),
    });
    return this.http.put(url, datos, { headers });
  }




  // login del panel data
  consultAuditorUser = (email: string) => {
    return this.getQuery(`loginAud?email=${email}`).pipe(map(data => data))
  }

  consultAdminUser = (email: string) => {
    return this.getQuery(`loginAdmin?email=${email}`).pipe(map(data => data))
  }





  // get permisos by user
  getPermisos = (email: string) => {
    return this.getQuery(`permisos?email=${email}`);
  }





  // edit permisos
  getAdministrador = (id: string) => {
    return this.getQuery(`userAdmin/${id}`).pipe(map(data => data))
  };

  putPermisos = (id: string, formData: any) => {
    return this.putQuery(`userAdmin/${id}`, formData).pipe(map(data => data))
  };






  // querys for register activities in panel data
  postLogin = (nombre: string, last_name: string, segond_name: string, action: string) => {
    let today = new Date();
    let date = today.toISOString().slice(0, 10);
    const datos: any = {
      'nombre': nombre,
      'apellido_paterno': last_name,
      'apellido_materno': segond_name,
      'date': date,
      'action': action,
    }
    return this.postQuery(`activities/registration_login`, datos).pipe(map(data => data));
  }

  postAllViews = (nombre: string, last_name: string, consulta: string, values: string, segond_name: string = "") => {
    let today = new Date();
    let date = today.toISOString().slice(0, 10);
    const datos: any = {
      'nombre': nombre,
      'apellido_paterno': last_name,
      'apellido_materno': segond_name,
      'consulta': consulta,
      'datos': values,
      'date': date,
    };
    return this.postQuery(`activities/registration_views`, datos).pipe(map(data => data));
  }







  // home
  getUserLocalStorage = () => {
    let user = JSON.parse(localStorage.getItem('currentUser'))
    return user;
  }

  getAdministradores = () => {
    return this.getQuery(`usersAdmin`).pipe(map(data => data))
  }

  getActivitiesLogin = () => {
    return this.getQuery(`activities/registration_login`).pipe(map(data => data))
  }

  getActivitiesViews = () => {
    return this.getQuery(`activities/registration_views`).pipe(map(data => data))
  }







  //ventas
  //query of sale, panel of sales
  getSucursales = () => {
    return this.getQuery('sucursals').pipe(map(data => data))
  }

  getAllVentas = (empresa: string, minDate: string, maxDate: string) => {
    return this.getQuery(`all_ventas?empresa=${empresa}&min_date=${minDate}&max_date=${maxDate}`).pipe(map(data => data))
  }

  getAllVentasEstudios = () => {
    return this.getQuery('ventas_estudios').pipe(map(data => data))
  }

  getFilterVentasEstudios = (
    empresa: string, sucursal: string = '', estudio: string = '', min_date: string = '', max_date: string = ''
  ) => {
    return this.getQuery(`ventas_estudios?empresa=${empresa}&sucursal=${sucursal}&estudio=${estudio}&min_date=${min_date}&max_date=${max_date}`)
      .pipe(map(data => data));
  }

  getFilterVentasDepartament = (
    empresa: string, sucursal: string, departament: string, min_date: string = '', max_date: string = ''
  ) => {
    return this.getQuery(`ventas_departament?empresa=${empresa}&sucursal=${sucursal}&departament=${departament}&min_date=${min_date}&max_date=${max_date}`)
      .pipe(map(data => data));
  }

  // ventas por area generales (retorna area, departamento y numero)
  getVentasAreas = (empresa: string, area: string, min_date: string = '', max_date: string = '') => {
    return this.getQuery(`ventas_all_area?empresa=${empresa}&area=${area}&min_date=${min_date}&max_date=${max_date}`)
      .pipe(map(data => data));
  }

  // sub consulta, solo debe retornar el monto de venta
  // getArea = (empresa:string,area:string,departament:string,min_date:string='',max_date:string='') => {
  //   return this.getQuery(`ventas_area?empresa=${empresa}&area=${area}&departament=${departament}&min_date=${min_date}&max_date=${max_date}`)
  //   .pipe(
  //     map(
  //       (data:any) => {
  //         console.log(data);
  //         // const monto = data.map(total => total.total);
  //         // return monto;
  //       }
  //     )
  //   );
  // }







  // finanzas
  //querys of panel box cut
  getCashierUser = () => {
    return this.getQuery('cashier_user').pipe(map(data => data));
  }

  getFilterBoxCut = (empresa: string, sucursal: string, date: string = '') => {
    return this.getQuery(`box_cut?empresa=${empresa}&sucursal=${sucursal}&date=${date}`)
      .pipe(map(data => data));
  }

  getTypePay = (empresa: string, sucursal: string, min_date: string = '', max_date: string = '') => {
    return this.getQuery(`box_cut?empresa=${empresa}&sucursal=${sucursal}&min_date=${min_date}&max_date=${max_date}`).pipe(
      map((data: any) => {
        const type_pay = data.map(tipo => tipo.tipo_pago);
        return type_pay;
      })
    )
  }

  getDevoluciones = (
    empresa: string,
    sucursal: string,
    min_date: string = '',
    max_date: string = ''
  ) => {
    return this.getQuery(`devoluciones?empresa=${empresa}&sucursal=${sucursal}&min_date=${min_date}&max_date=${max_date}`)
      .pipe(map(data => data))
  }

  getTypeDevol = (
    empresa: string,
    sucursal: string,
    type: string,
    min_date: string = '',
    max_date: string = ''
  ) => {
    return this.getQuery(`devoluciones/type?empresa=${empresa}&sucursal=${sucursal}&type=${type}&min_date=${min_date}&max_date=${max_date}`)
      .pipe(
        map((data: any) => {
          const monto = data.map(total => total.total);
          console.log(monto);
          return monto;
        })
      )
  }




  // product 
  getUsers = (puesto: string) => {
    return this.getQuery(`empleados?puesto=${puesto}`).pipe(map(data => data));
  }


  // get data of cashier
  getNumPacientes = (userID: string) => {
    return this.getQuery(`product_user?id=${userID}`).pipe(map(data => data));
  }






}
