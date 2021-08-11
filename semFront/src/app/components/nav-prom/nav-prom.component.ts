import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-nav-prom',
  templateUrl: './nav-prom.component.html',
  styleUrls: ['./nav-prom.component.css']
})
export class NavPromComponent implements OnInit {


  constructor(
    private router: Router
    ) { }

  ngOnInit() {
  }

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

}
