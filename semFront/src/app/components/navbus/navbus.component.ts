import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbus',
  templateUrl: './navbus.component.html',
  styleUrls: ['./navbus.component.css']
})
export class NavbusComponent implements OnInit {

  constructor(private router: Router) { }

  onLogin(){   
    this.router.navigate(['/login']);
  }

  myFunction() {
    var element = document.getElementById("body");
    element.classList.toggle("sidebar-is-reduced");
    element.classList.toggle("sidebar-is-expanded");
    var element2 = document.getElementById("hamburger");
    element2.classList.toggle("is-opened");
 }

  ngOnInit() {
  }

}
