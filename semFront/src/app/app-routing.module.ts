import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//componentes
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { MedRegisterComponent } from './components/user/med-register/med-register.component';
import { ForgotComponent } from './components/user/forgot/forgot.component';
import { MenuCarritoComponent } from './components/menu-carrito/menu-carrito.component';
import { MenuEstudiosComponent } from './components/menu-estudios/menu-estudios.component';
import { MenuListaComponent } from './components/menu-lista/menu-lista.component';
import { MenuPerfilComponent } from './components/menu-perfil/menu-perfil.component';
import { MenuPromocionesComponent } from './components/menu-promociones/menu-promociones.component';
import { MenuAjustesComponent } from './components/ajustes/ajustes.component';
import { Page404Component } from './components/page404/page404.component';
import { HumansComponent } from './components/humans/humans.component';
import { PanelComponent } from './components/panel/panel.component';
import { CitasComponent } from './components/citas/citas.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { PacienteExpedienteComponent } from './components/paciente-expediente/paciente-expediente.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { PromocionesComponent } from './components/promociones/promociones.component';
import { MedicoComponent } from './components/medico/medico.component';
import { MedicoAjustesComponent } from './components/medico-ajustes/medico-ajustes.component';
import { MedicoPacienteComponent } from './components/medico-paciente/medico-paciente.component';
import { Cie10Component } from './components/cie10/cie10.component';
import { AdministracionComponent } from './components/administracion/administracion.component';
import { EncuestasComponent } from './components/encuestas/encuestas.component';
import { TerminosComponent } from './components/terminos/terminos.component';
import { MedicoTerminosComponent } from './components/medico-terminos/medico-terminos.component';
import { MedicoPerfilComponent } from './components/medico-perfil/medico-perfil.component';
import { ExternoExpedienteComponent } from './components/externo-expediente/externo-expediente.component';
import { PromoTicketComponent } from './components/promo-ticket/promo-ticket.component';
import { EncuestasPacienteComponent } from './components/encuestas-paciente/encuestas-paciente.component';
import { BuscadorCie10Component } from './components/buscador-cie10/buscador-cie10.component';
import { RadiologoEstudiosComponent } from './components/radiologo-estudios/radiologo-estudios.component';
import { PerfilRadiologoComponent } from './components/perfil-radiologo/perfil-radiologo.component';
import { OperadorImagenologiaComponent } from './components/operador-imagenologia/operador-imagenologia.component';
import { UsuarioImagenologiaComponent } from './components/usuario-imagenologia/usuario-imagenologia.component';
import { UploadRehabilitacionComponent } from './components/operador-rehabilitacion/upload-rehabilitacion/upload-rehabilitacion.component';
import { FisioterapeutaComponent } from './components/fisioterapeuta/fisioterapeuta.component';
import { HomeFisioStudioComponent } from './components/expedientes-fisioterapia/home-fisio-studio/home-fisio-studio.component';
import { BuscadorFisioStudioComponent } from './components/expedientes-fisioterapia/buscador-fisio-studio/buscador-fisio-studio.component';
import { VisualizadorFisioComponent } from './components/expedientes-fisioterapia/visualizador-fisio/visualizador-fisio.component';

import { HomePanelCorporativoComponent } from './components/panel-corporativo/home-panel-corporativo/home-panel-corporativo.component';
import { NavPanelCorporativoComponent } from './components/panel-corporativo/shared/nav-panel-corporativo/nav-panel-corporativo.component';
import { VentasPanelDataComponent } from './components/panel-corporativo/ventas-panel-data/ventas-panel-data.component';
import { FinanzasPanelDataComponent } from './components/panel-corporativo/finanzas-panel-data/finanzas-panel-data.component';
import { ProductividadPanelDataComponent } from './components/panel-corporativo/productividad-panel-data/productividad-panel-data.component';
import { PermisosPanelCorporativoComponent } from './components/panel-corporativo/shared/permisos-panel-corporativo/permisos-panel-corporativo.component';
import { ShowProductUserComponent } from './components/panel-corporativo/shared/show-product-user/show-product-user.component';

import { AuthGuard } from './guards/auth.guard';

//Array de Rutas
const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'registro-medico', component: MedRegisterComponent },
  { path: 'olvidada', component: ForgotComponent },
  { path: 'buscador', component: BuscadorComponent },
  { path: 'buscadorCIE10', component: BuscadorCie10Component },
  { path: 'promo', component: PromocionesComponent },
  { path: 'expediente/:token', component: ExternoExpedienteComponent },
  { path: 'promocion/:nombre', component: PromoTicketComponent },
  { path: 'encuesta', component: EncuestasPacienteComponent },
  { path: 'inicio', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'inicio/carrito', component: MenuCarritoComponent, canActivate: [AuthGuard] },
  { path: 'inicio/estudios', component: MenuEstudiosComponent, canActivate: [AuthGuard] },
  { path: 'inicio/lista', component: MenuListaComponent, canActivate: [AuthGuard] },
  { path: 'inicio/perfil', component: MenuPerfilComponent, canActivate: [AuthGuard] },
  { path: 'inicio/promociones', component: MenuPromocionesComponent, canActivate: [AuthGuard] },
  { path: 'inicio/ajustes', component: MenuAjustesComponent, canActivate: [AuthGuard] },
  { path: 'inicio/expediente', component: PacienteExpedienteComponent, canActivate: [AuthGuard] },
  { path: 'inicio/terminos', component: TerminosComponent, canActivate: [AuthGuard] },
  { path: 'humans', component: HumansComponent },
  { path: 'panel', component: PanelComponent, canActivate: [AuthGuard] },
  { path: 'panel/citas', component: CitasComponent, canActivate: [AuthGuard] },
  { path: 'panel/catalogo', component: CatalogoComponent, canActivate: [AuthGuard] },
  { path: 'panel/pacientes', component: PacientesComponent, canActivate: [AuthGuard] },
  { path: 'panel/imagenologia', component: OperadorImagenologiaComponent, canActivate: [AuthGuard] },
  { path: 'admin/panel', component: AdministracionComponent, canActivate: [AuthGuard] },
  { path: 'admin/encuestas', component: EncuestasComponent, canActivate: [AuthGuard] },
  { path: 'medico/citas', component: MedicoComponent, canActivate: [AuthGuard] },
  { path: 'medico/pacientes', component: MedicoPacienteComponent, canActivate: [AuthGuard] },
  { path: 'medico/ajustes', component: MedicoAjustesComponent, canActivate: [AuthGuard] },
  { path: 'medico/cie10', component: Cie10Component, canActivate: [AuthGuard] },
  { path: 'medico/perfil', component: MedicoPerfilComponent, canActivate: [AuthGuard] },
  { path: 'medico/terminos', component: MedicoTerminosComponent, canActivate: [AuthGuard] },
  { path: 'radiologo/estudios', component: RadiologoEstudiosComponent, canActivate: [AuthGuard] },
  { path: 'radiologo/perfil', component: PerfilRadiologoComponent, canActivate: [AuthGuard] },
  { path: 'inicio/imagenologia', component: UsuarioImagenologiaComponent, canActivate: [AuthGuard] },
  { path: 'rehabilitacion', component: UploadRehabilitacionComponent, canActivate: [AuthGuard] },
  { path: 'fisio/studios', component: HomeFisioStudioComponent, canActivate: [AuthGuard] },
  { path: 'fisio/buscador/studios', component: BuscadorFisioStudioComponent, canActivate: [AuthGuard] },
  { path: 'fisio/studio/:id', component: VisualizadorFisioComponent, canActivate: [AuthGuard] },
  { path: 'paneldata', component: HomePanelCorporativoComponent, canActivate: [AuthGuard] },
  { path: 'paneldata/ventas', component: VentasPanelDataComponent, canActivate: [AuthGuard] },
  { path: 'paneldata/productivity', component: ProductividadPanelDataComponent },
  { path: 'paneldata/finance', component: FinanzasPanelDataComponent, canActivate: [AuthGuard] },
  { path: 'paneldata/permisos/:id', component: PermisosPanelCorporativoComponent, canActivate: [AuthGuard] },
  { path: 'paneldata/user/:id', component: ShowProductUserComponent, canActivate: [AuthGuard] },
  { path: '**', component: Page404Component }
];

// exportar modulo de router
export const RoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);



