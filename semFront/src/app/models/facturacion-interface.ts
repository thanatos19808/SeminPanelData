export interface FacturacionInterface{
    id?: string;
    factura_estatus?: string;
	nombre?: string;
	apellido_paterno?: string;
	apellido_materno?: string;
	tipo_rfc?: string;
    rfc?: string;
    cantidad_pagada?: any;
	calle?: string;
	colonia?: string;
	num_interior?: string;
	num_exterior?: string;
	cp?: string;
	municipio?: string;
	localidad?: string;
	estado?: string;
	telefono?: string;
	email?: string;
	cfdi_uso?: string;
	forma_pago?: string;
	metodo_pago?: string;
	descripcion?: string;
	analisis_clinicos?: string;
	nombre_estudio?: string;
	nombre_paciente?: string;
	num_expediente?: string;
	num_folio?: string;
    estudios_realizados?: string;
	observaciones?: string;
	descripcion_servicios?: string;
	creador?: string;
	editor?: string;
	creacion?: string;
	ultimaActualizacion?: string;
	impresion?: string;
	empresa?: string;
	sucursal?: string;
	Paciente?: any;
	CitaSucursal?: any;
	count?: any;
    results?: any;
}