import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-nav-fisio',
  templateUrl: './nav-fisio.component.html',
  styleUrls: ['./nav-fisio.component.css']
})
export class NavFisioComponent implements OnInit {

  constructor(private authService: AuthService,private router: Router) { }

  ngOnInit() {}

  onLogout(){   
    this.router.navigate(['/login']);
    return this.authService.logoutuser()
  }

}
