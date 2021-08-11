import { BrowserModule } from '@angular/platform-browser';
import { platformBrowser } from '@angular/platform-browser';
import * as $ from 'jquery';

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { CustomFormsModule } from 'ngx-custom-validators';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';

import { routing, RoutingProviders } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';

import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { HumansComponent } from './components/humans/humans.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Page404Component } from './components/page404/page404.component';
import { MenuCarritoComponent } from './components/menu-carrito/menu-carrito.component';
import { MenuListaComponent } from './components/menu-lista/menu-lista.component';
import { MenuPromocionesComponent } from './components/menu-promociones/menu-promociones.component';
import { MenuEstudiosComponent } from './components/menu-estudios/menu-estudios.component';
import { MenuPerfilComponent } from './components/menu-perfil/menu-perfil.component';
import { ForgotComponent } from './components/user/forgot/forgot.component';
import { MenuAjustesComponent } from './components/ajustes/ajustes.component';

// services
import { DataApiService } from 'src/app/services/data-api.service';
import { PanelDataService } from 'src/app/services/panel-data.service';
import { PanelComponent } from './components/panel/panel.component';
import { NavopComponent } from './components/navop/navop.component';
import { CitasComponent } from './components/citas/citas.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { NavbusComponent } from './components/navbus/navbus.component';
import { PromocionesComponent } from './components/promociones/promociones.component';

// Surveys
import { EncuestasComponent } from './components/encuestas/encuestas.component';
import { EncuestasPacienteComponent } from './components/encuestas-paciente/encuestas-paciente.component';
import { ArchwizardModule } from 'angular-archwizard';

//nOTIFICATION
import { NgxNotificationModule } from 'ngx-notification';
import { NavDirComponent } from './components/nav-dir/nav-dir.component';
import { NavMedComponent } from './components/nav-med/nav-med.component';
import { MedicoComponent } from './components/medico/medico.component';
import { AdministracionComponent } from './components/administracion/administracion.component';
import { TerminosComponent } from './components/terminos/terminos.component';
import { MedicoAjustesComponent } from './components/medico-ajustes/medico-ajustes.component';
import { MedicoPacienteComponent } from './components/medico-paciente/medico-paciente.component';
import { Cie10Component } from './components/cie10/cie10.component';
import { MedicoPerfilComponent } from './components/medico-perfil/medico-perfil.component';
import { BuscadorCie10Component } from './components/buscador-cie10/buscador-cie10.component';
import { PacienteExpedienteComponent } from './components/paciente-expediente/paciente-expediente.component';
import { ExternoExpedienteComponent } from './components/externo-expediente/externo-expediente.component';
import { NavExtComponent } from './components/nav-ext/nav-ext.component';
import { MedicoTerminosComponent } from './components/medico-terminos/medico-terminos.component';
import { MedRegisterComponent } from './components/user/med-register/med-register.component';
import { PromoTicketComponent } from './components/promo-ticket/promo-ticket.component';
import { NavPromComponent } from './components/nav-prom/nav-prom.component';

// Radiologos
import { RadiologoEstudiosComponent } from './components/radiologo-estudios/radiologo-estudios.component';
import { NavRadiologoComponent } from './components/nav-radiologo/nav-radiologo.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TestComponent } from './components/test/test.component';
import { PerfilRadiologoComponent } from './components/perfil-radiologo/perfil-radiologo.component';
import { OperadorImagenologiaComponent } from './components/operador-imagenologia/operador-imagenologia.component';
import { UsuarioImagenologiaComponent } from './components/usuario-imagenologia/usuario-imagenologia.component';
import { HeroDetailComponent } from './components/hero-detail/hero-detail.component';
import { ModalErrorAlertComponent } from './components/modal-error-alert/modal-error-alert.component';

// rehabilitacion
import { UploadRehabilitacionComponent } from './components/operador-rehabilitacion/upload-rehabilitacion/upload-rehabilitacion.component';
import { FormDocumentsComponent } from './components/operador-rehabilitacion/form-documents/form-documents.component';
import { FisioterapeutaComponent } from './components/fisioterapeuta/fisioterapeuta.component';
import { NavFisioComponent } from './components/expedientes-fisioterapia/nav-fisio/nav-fisio.component';
import { HomeFisioStudioComponent } from './components/expedientes-fisioterapia/home-fisio-studio/home-fisio-studio.component';
import { BuscadorFisioStudioComponent } from './components/expedientes-fisioterapia/buscador-fisio-studio/buscador-fisio-studio.component';
import { VisualizadorFisioComponent } from './components/expedientes-fisioterapia/visualizador-fisio/visualizador-fisio.component';
import { LoadingComponent } from './components/expedientes-fisioterapia/loading/loading.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';

// panel corporativo
import { ChartsModule, ThemeService } from 'ng2-charts';
import { NavPanelCorporativoComponent } from './components/panel-corporativo/shared/nav-panel-corporativo/nav-panel-corporativo.component';
import { HomePanelCorporativoComponent } from './components/panel-corporativo/home-panel-corporativo/home-panel-corporativo.component';
import { VentasPanelDataComponent } from './components/panel-corporativo/ventas-panel-data/ventas-panel-data.component';
import { FinanzasPanelDataComponent } from './components/panel-corporativo/finanzas-panel-data/finanzas-panel-data.component';
import { ProductividadPanelDataComponent } from './components/panel-corporativo/productividad-panel-data/productividad-panel-data.component';
import { PermisosPanelCorporativoComponent } from './components/panel-corporativo/shared/permisos-panel-corporativo/permisos-panel-corporativo.component';
import { ShowProductUserComponent } from './components/panel-corporativo/shared/show-product-user/show-product-user.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegisterComponent,
		HomeComponent,
		HumansComponent,
		NavbarComponent,
		Page404Component,
		MenuCarritoComponent,
		MenuListaComponent,
		MenuPromocionesComponent,
		MenuEstudiosComponent,
		MenuPerfilComponent,
		ForgotComponent,
		MenuAjustesComponent,
		PanelComponent,
		NavopComponent,
		CitasComponent,
		CatalogoComponent,
		PacientesComponent,
		BuscadorComponent,
		NavbusComponent,
		PromocionesComponent,
		EncuestasComponent,
		NavDirComponent,
		NavMedComponent,
		MedicoComponent,
		AdministracionComponent,
		TerminosComponent,
		EncuestasPacienteComponent,
		MedicoAjustesComponent,
		MedicoPacienteComponent,
		Cie10Component,
		MedicoPerfilComponent,
		BuscadorCie10Component,
		PacienteExpedienteComponent,
		ExternoExpedienteComponent,
		NavExtComponent,
		MedicoTerminosComponent,
		MedRegisterComponent,
		PromoTicketComponent,
		NavPromComponent,
		RadiologoEstudiosComponent,
		NavRadiologoComponent,
		TestComponent,
		PerfilRadiologoComponent,
		OperadorImagenologiaComponent,
		UsuarioImagenologiaComponent,
		HeroDetailComponent,
		ModalErrorAlertComponent,
		UploadRehabilitacionComponent,
		FormDocumentsComponent,
		FisioterapeutaComponent,
		NavFisioComponent,
		HomeFisioStudioComponent,
		BuscadorFisioStudioComponent,
		VisualizadorFisioComponent,
		LoadingComponent,
		NavPanelCorporativoComponent,
		HomePanelCorporativoComponent,
		VentasPanelDataComponent,
		FinanzasPanelDataComponent,
		ProductividadPanelDataComponent,
		PermisosPanelCorporativoComponent,
		ShowProductUserComponent,
	],
	imports: [
		NgxNotificationModule,
		BrowserModule,
		routing,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		CustomFormsModule,
		NgbModule,
		BrowserAnimationsModule,
		FileUploadModule,
		ChartsModule,
		ArchwizardModule,
		NgxSpinnerModule,
		NgxPaginationModule,
		NgxImageZoomModule,
	],
	providers: [DataApiService, PanelDataService, RoutingProviders, ThemeService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	bootstrap: [AppComponent],
})
export class AppModule {}
