import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { AuthService } from '../../../services/auth.service' 
import { DataApiService } from '../../../services/data-api.service';
import { RehabilitacionInterface } from '../../../models/rehabilitacion-interface';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

@Component({
	selector: 'app-form-documents',
	templateUrl: './form-documents.component.html',
	styleUrls: ['./form-documents.component.css'],
})
export class FormDocumentsComponent implements OnInit {

	rehabilitacion = new RehabilitacionInterface();

	menor: boolean = false;
	today = new Date(Date.now());
	maxDate = new Date(Date.now());
	minFechaNacimiento = this.today.setMonth(this.today.getMonth() - 1440);
	firstNamePattern: any = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/;
	fecha_nacimiento;
	mensajeError;
	error:boolean;
	enviando:boolean = false;

	constructor(
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private dataApiService: DataApiService,
		private router: Router
	){}

	formGroupData: FormGroup;

	createformGroupData(){
		this.formGroupData = this.formBuilder.group({
			nombre: ['', [Validators.required,Validators.pattern(this.firstNamePattern),Validators.minLength(3),Validators.maxLength(20),],],
			apellido_paterno: ['', [Validators.required,Validators.pattern(this.firstNamePattern),Validators.minLength(3),Validators.maxLength(30),],],
			apellido_materno: ['', [Validators.required,Validators.pattern(this.firstNamePattern),Validators.minLength(3),Validators.maxLength(30),],],
			fecha_nacimiento: ['', Validators.compose([CustomValidators.minDate(this.minFechaNacimiento),CustomValidators.maxDate(this.maxDate),]),],
			sexo: ['', Validators.required],

			sub: ['', Validators.required],
			vig: ['', Validators.required],
			orden: ['', Validators.required],
			ident: ['', Validators.required],
			cita: ['', Validators.required],
			acta: [''],
			curp: [''],
			ident_tutor: [''],
			bitacora:[''],
		})
  	};

	validarFecha(event) {

		let convertDate = new Date(this.fecha_nacimiento);
		let diffDate = Math.abs(Date.now() - convertDate.getTime());
		let age = Math.floor(diffDate / (1000 * 3600 * 24) / 365);
		age < 18 ? (this.menor = true) : (this.menor = false);

	}

	onFileSelected(event: any, name: string) {

		if (event.target.files.length > 0) {
		  	const file = event.target.files[0];
			// esto se puede hacer en una sola linea
			// this.formGroupData.get(name).setValue(file);
			if (name === 'sub') {
				this.formGroupData.get('sub').setValue(file);
			}else if (name === 'vig') {
				this.formGroupData.get('vig').setValue(file);
			}
			else if (name === 'orden') {
				this.formGroupData.get('orden').setValue(file);
			}
			else if (name === 'ident') {
				this.formGroupData.get('ident').setValue(file);
			}
			else if (name === 'cita') {
				this.formGroupData.get('cita').setValue(file);
			}
			else if (name == 'ident_tutor') {
				this.formGroupData.get('ident_tutor').setValue(file);
			}
			else if (name == 'acta') {
				this.formGroupData.get('acta').setValue(file);
			}
			else if (name == 'curp') {
				this.formGroupData.get('curp').setValue(file);
			}
			else if (name == 'bitacora') {
				this.formGroupData.get('bitacora').setValue(file);
			}
		}

	}

	aletSuccess(){
		Swal.fire({
			icon: 'success',
			title: '¡Registro Exitoso!',
			text: '',
		});
	}

	aletError(){
		Swal.fire({
			icon: 'error',
			title: 'Error al incorporar expediente',
			text: 'por favor intente nuevamente',
		});
	}

	clearForm(){
		this.formGroupData.reset();
		this.rehabilitacion.nombre = '';
		this.rehabilitacion.apellido_paterno = '';
		this.rehabilitacion.apellido_materno = '';
		this.rehabilitacion.sexo = '';
		this.fecha_nacimiento = '';
		this.rehabilitacion.img_subrogacion = '';
		this.rehabilitacion.img_vigencia = '';
		this.rehabilitacion.img_orden = '';
		this.rehabilitacion.img_identificacion = '';
		this.rehabilitacion.img_citas = '';
		this.rehabilitacion.img_bitacora = '';
		this.rehabilitacion.img_acta = '';
		this.rehabilitacion.img_curp = '';
		this.rehabilitacion.img_ident_tutor = '';
	}

	subirDatos( form : NgForm ) {

		this.enviando = true;
		let formData = new FormData();

		this.formGroupData.get('nombre').setValue(this.rehabilitacion.nombre);
		this.formGroupData.get('apellido_paterno').setValue(this.rehabilitacion.apellido_paterno);
		this.formGroupData.get('apellido_materno').setValue(this.rehabilitacion.apellido_materno);
		this.formGroupData.get('fecha_nacimiento').setValue(this.rehabilitacion.fecha_nacimiento);
		this.formGroupData.get('sexo').setValue(this.rehabilitacion.sexo);

		formData.append('nombre', this.formGroupData.get('nombre').value);
		formData.append('apellido_paterno', this.formGroupData.get('apellido_paterno').value);
		formData.append('apellido_materno', this.formGroupData.get('apellido_materno').value);
		formData.append('fecha_nacimiento', this.fecha_nacimiento);
		formData.append('sexo', this.formGroupData.get('sexo').value);

		if(!this.menor){
			formData.append('hoja_430', this.formGroupData.get('sub').value);
			formData.append('constancia_vigencia', this.formGroupData.get('vig').value);
			formData.append('orden_trabajo', this.formGroupData.get('orden').value);
			formData.append('identificacion', this.formGroupData.get('ident').value);
			formData.append('carnet', this.formGroupData.get('cita').value);
			formData.append('bitacora', this.formGroupData.get('bitacora').value);

			this.dataApiService.registroRehabilitacion(formData).subscribe(resp => {
				this.aletSuccess();
				this.enviando = false;
				this.clearForm();
			},
			(errorServicio) => {
				// console.log(errorServicio);
				this.aletError();
				this.enviando = false;
			});
		}
		else{
			formData.append('hoja_430', this.formGroupData.get('sub').value);
			formData.append('constancia_vigencia', this.formGroupData.get('vig').value);
			formData.append('orden_trabajo', this.formGroupData.get('orden').value);
			formData.append('identificacion', this.formGroupData.get('ident_tutor').value);
			formData.append('carnet', this.formGroupData.get('cita').value);
			formData.append('bitacora', this.formGroupData.get('bitacora').value);
			formData.append('acta', this.formGroupData.get('acta').value);
			formData.append('curp', this.formGroupData.get('curp').value);

			this.dataApiService.registroRehabilitacionMenor(formData).subscribe(resp => {
				this.aletSuccess();
				this.enviando = false;
				this.clearForm();
			},
			(errorServicio) => {
				this.aletError();
				this.enviando = false;
			});
		}

	}

	ngOnInit() {
		this.createformGroupData();
	}

}
