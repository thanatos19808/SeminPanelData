import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";  
import { UserInterface } from "../../models/user-interface";
import { Router } from "@angular/router";

import * as $ from 'jquery';

@Component({
  selector: 'app-nav-dir',
  templateUrl: './nav-dir.component.html',
  styleUrls: ['./nav-dir.component.css']
})
export class NavDirComponent implements OnInit {

  constructor(private authService: AuthService,private router: Router) { }

  
  private userAPI: UserInterface = {};

  ngOnInit() {
    this.userAPI = this.authService.getCurrentUser();
    this.validarUsuario();
  } 

  validarUsuario(){
    if(!(this.userAPI.tipo == "Administrador")){
      this.router.navigate(['/login']);
    }
  }

  myFunction() {
    var element = document.getElementById("body");
    element.classList.toggle("sidebar-is-reduced");
    element.classList.toggle("sidebar-is-expanded");
    var element2 = document.getElementById("hamburger");
    element2.classList.toggle("is-opened");
 }

 onLogout(){   
  this.router.navigate(['/login']);
  return this.authService.logoutuser()
}

}
