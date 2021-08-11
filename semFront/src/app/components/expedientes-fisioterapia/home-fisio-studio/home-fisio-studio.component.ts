import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataApiService } from '../../../services/data-api.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-home-fisio-studio',
  templateUrl: './home-fisio-studio.component.html',
  styleUrls: ['./home-fisio-studio.component.css']
})
export class HomeFisioStudioComponent implements OnInit {

  expedienteFisio : any[] = [];
  mensajeError: string;
  loading: boolean;

  constructor(private router: Router, private api:DataApiService) { 

    this.api.consultarExpedientesFisio().subscribe(
      (data:any) => {
        // console.log(data);
        this.expedienteFisio = data;
        this.loading = false;
      },
      (errorServicio) => {
        this.mensajeError = errorServicio.error.message;
      }
    )

  }

  verExpediente(item:any){
    let estudioID;
    estudioID = item.id;
    this.router.navigate(['/fisio/studio/', estudioID]);
  }

  ngOnInit() {
    this.loading = true;
  }

  downloadPDF() {

    const DATA = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`Expedentes-Rehabilitacion-${new Date().toISOString()}.pdf`);
    });

  }

}
