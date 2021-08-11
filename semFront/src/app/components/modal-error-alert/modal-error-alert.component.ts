import { Component, OnInit } from '@angular/core';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'; 
import { ViewChild, Input } from '@angular/core';


@Component({
  selector: 'app-modal-error-alert',
  templateUrl: './modal-error-alert.component.html',
  styleUrls: ['./modal-error-alert.component.css']
})
export class ModalErrorAlertComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
  ) { }
  @ViewChild('modalError', { static: false }) private modalExito;
  @Input() error_message: string;

  ngOnInit() {
  }

  closeModals(){
    this.modalService.dismissAll('modalError')
  }
}
