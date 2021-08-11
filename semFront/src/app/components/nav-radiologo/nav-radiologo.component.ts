import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { UserInterface } from "../../models/user-interface";

@Component({
  selector: 'app-nav-radiologo',
  templateUrl: './nav-radiologo.component.html',
  styleUrls: ['./nav-radiologo.component.css']
})
export class NavRadiologoComponent implements OnInit {
  constructor(private authService: AuthService,private router: Router) { }

  
  private userAPI: UserInterface = {};

  ngOnInit() {
    this.userAPI = this.authService.getCurrentUser();
    this.validarUsuario();
  }
  
  validarUsuario(){
    if(!(this.userAPI.tipo == 'Imagenologia')){
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
